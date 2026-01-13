import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { GoogleGenerativeAI } from '@google/generative-ai';

export interface RiskInsight {
    id: string;
    type: 'schedule' | 'bcf' | 'weather' | 'general';
    severity: 'high' | 'medium' | 'low';
    title: string;
    description: string;
    recommendation: string;
    affectedItems?: string[];
    createdAt: Date;
}

export interface DailyInsightReport {
    projectId: string;
    projectName: string;
    date: Date;
    insights: RiskInsight[];
    summary: string;
}

@Injectable()
export class RiskInsightsService {
    private readonly logger = new Logger(RiskInsightsService.name);
    private genAI: GoogleGenerativeAI;
    private model: any;

    constructor(private readonly prisma: PrismaService) {
        const apiKey = process.env.GEMINI_API_KEY;
        if (apiKey) {
            this.genAI = new GoogleGenerativeAI(apiKey);
            this.model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
        }
    }

    /**
     * Generate daily risk insights for a project
     */
    async generateDailyInsights(projectId: string): Promise<DailyInsightReport> {
        const project = await this.prisma.project.findUnique({
            where: { id: projectId },
            select: { id: true, name: true },
        });

        if (!project) {
            throw new Error('Project not found');
        }

        // Aggregate data from multiple sources
        const [lateTasks, openBcfIssues, recentIncidents] = await Promise.all([
            this.getLateTasks(projectId),
            this.getOpenHighPriorityBcf(projectId),
            this.getRecentHseIncidents(projectId),
        ]);

        // Build context for AI analysis
        const context = this.buildAnalysisContext(lateTasks, openBcfIssues, recentIncidents);

        // Generate AI insights
        const insights = await this.analyzeRisks(context);

        // Generate summary
        const summary = this.generateSummary(insights);

        return {
            projectId,
            projectName: project.name,
            date: new Date(),
            insights,
            summary,
        };
    }

    /**
     * Get late/overdue tasks
     */
    private async getLateTasks(projectId: string) {
        try {
            return await this.prisma.task.findMany({
                where: {
                    projectId,
                    dueDate: { lt: new Date() },
                    status: { not: 'COMPLETED' },
                },
                take: 20,
                select: { id: true, name: true, dueDate: true, priority: true },
            });
        } catch {
            return [];
        }
    }

    /**
     * Get open high-priority BCF issues
     */
    private async getOpenHighPriorityBcf(projectId: string) {
        try {
            return await this.prisma.bcfTopic.findMany({
                where: {
                    projectId,
                    status: { in: ['OPEN', 'ACTIVE'] },
                    priority: { in: ['HIGH', 'CRITICAL'] },
                },
                take: 20,
                select: { id: true, title: true, priority: true, createdAt: true },
            });
        } catch {
            return [];
        }
    }

    /**
     * Get recent HSE incidents
     */
    private async getRecentHseIncidents(projectId: string) {
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

        try {
            return await this.prisma.hseReport.findMany({
                where: {
                    projectId,
                    createdAt: { gte: oneWeekAgo },
                },
                take: 10,
                select: { id: true, title: true, severity: true, createdAt: true },
            });
        } catch {
            return [];
        }
    }

    /**
     * Build context string for AI analysis
     */
    private buildAnalysisContext(lateTasks: any[], bcfIssues: any[], incidents: any[]): string {
        let context = '';

        if (lateTasks.length > 0) {
            context += `LATE TASKS (${lateTasks.length}):\n`;
            lateTasks.forEach(t => {
                context += `- ${t.name} (Priority: ${t.priority}, Due: ${t.dueDate})\n`;
            });
            context += '\n';
        }

        if (bcfIssues.length > 0) {
            context += `OPEN HIGH-PRIORITY BCF ISSUES (${bcfIssues.length}):\n`;
            bcfIssues.forEach(b => {
                context += `- ${b.title} (Priority: ${b.priority})\n`;
            });
            context += '\n';
        }

        if (incidents.length > 0) {
            context += `RECENT HSE INCIDENTS (${incidents.length}):\n`;
            incidents.forEach(i => {
                context += `- ${i.title} (Severity: ${i.severity})\n`;
            });
        }

        return context || 'No significant data available for analysis.';
    }

    /**
     * Analyze risks using AI
     */
    private async analyzeRisks(context: string): Promise<RiskInsight[]> {
        if (!this.model || context === 'No significant data available for analysis.') {
            return [];
        }

        const prompt = `You are a construction project risk analyst. Analyze the following project data and identify the top 5 risks.

For each risk, provide:
1. Type: schedule, bcf, weather, or general
2. Severity: high, medium, or low
3. Title: Brief risk title
4. Description: What the risk is
5. Recommendation: Actionable next step

PROJECT DATA:
${context}

Return ONLY a JSON array with the structure:
[{"type": "...", "severity": "...", "title": "...", "description": "...", "recommendation": "..."}]`;

        try {
            const result = await this.model.generateContent(prompt);
            const text = result.response.text();

            // Extract JSON from response
            const jsonMatch = text.match(/\[[\s\S]*\]/);
            if (jsonMatch) {
                const parsed = JSON.parse(jsonMatch[0]);
                return parsed.map((r: any, i: number) => ({
                    id: `risk-${Date.now()}-${i}`,
                    type: r.type || 'general',
                    severity: r.severity || 'medium',
                    title: r.title || 'Unnamed Risk',
                    description: r.description || '',
                    recommendation: r.recommendation || '',
                    createdAt: new Date(),
                }));
            }
        } catch (error) {
            this.logger.error('Risk analysis failed:', error);
        }

        return [];
    }

    /**
     * Generate summary from insights
     */
    private generateSummary(insights: RiskInsight[]): string {
        const highCount = insights.filter(i => i.severity === 'high').length;
        const mediumCount = insights.filter(i => i.severity === 'medium').length;

        if (insights.length === 0) {
            return 'No significant risks identified. Project appears to be on track.';
        }

        return `Identified ${insights.length} potential risks: ${highCount} high priority, ${mediumCount} medium priority. Review recommendations and take action on high-priority items.`;
    }
}
