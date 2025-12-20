import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export interface WatermarkConfig {
    enabled: boolean;
    text: string;
    includeUsername: boolean;
    includeTimestamp: boolean;
    position: 'CENTER' | 'CORNER' | 'TILED';
    opacity: number;
    fontSize: number;
}

@Injectable()
export class WatermarkService {
    constructor(private readonly prisma: PrismaService) { }

    /**
     * Get watermark config for organization
     */
    async getConfig(organizationId: string): Promise<WatermarkConfig> {
        const org = await this.prisma.organization.findUnique({
            where: { id: organizationId },
            select: { watermarkConfig: true },
        });

        if (!org?.watermarkConfig) {
            // Default config
            return {
                enabled: true,
                text: 'CONFIDENTIAL',
                includeUsername: true,
                includeTimestamp: true,
                position: 'TILED',
                opacity: 0.15,
                fontSize: 24,
            };
        }

        return org.watermarkConfig as WatermarkConfig;
    }

    /**
     * Update watermark config
     */
    async updateConfig(organizationId: string, config: Partial<WatermarkConfig>) {
        const current = await this.getConfig(organizationId);
        const updated = { ...current, ...config };

        await this.prisma.organization.update({
            where: { id: organizationId },
            data: { watermarkConfig: updated },
        });

        return updated;
    }

    /**
     * Generate watermark overlay for viewer
     */
    async generateWatermarkOverlay(
        organizationId: string,
        userName: string,
    ): Promise<{
        visible: boolean;
        lines: string[];
        style: {
            opacity: number;
            position: string;
            fontSize: number;
        };
    }> {
        const config = await this.getConfig(organizationId);

        if (!config.enabled) {
            return { visible: false, lines: [], style: { opacity: 0, position: 'CENTER', fontSize: 16 } };
        }

        const lines: string[] = [];

        if (config.text) {
            lines.push(config.text);
        }

        if (config.includeUsername && userName) {
            lines.push(userName);
        }

        if (config.includeTimestamp) {
            lines.push(new Date().toLocaleString());
        }

        return {
            visible: true,
            lines,
            style: {
                opacity: config.opacity,
                position: config.position,
                fontSize: config.fontSize,
            },
        };
    }

    /**
     * Generate SVG watermark for PDF exports
     */
    async generateSvgWatermark(
        organizationId: string,
        userName: string,
        width: number,
        height: number,
    ): Promise<string> {
        const config = await this.getConfig(organizationId);

        if (!config.enabled) return '';

        const lines: string[] = [];
        if (config.text) lines.push(config.text);
        if (config.includeUsername) lines.push(userName);
        if (config.includeTimestamp) lines.push(new Date().toLocaleDateString());

        const text = lines.join(' | ');
        const opacity = config.opacity;
        const fontSize = config.fontSize;

        if (config.position === 'TILED') {
            // Generate tiled pattern
            return `
        <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="watermark" width="300" height="200" patternUnits="userSpaceOnUse">
              <text x="150" y="100" 
                font-family="Arial" 
                font-size="${fontSize}" 
                fill="rgba(128,128,128,${opacity})"
                text-anchor="middle"
                transform="rotate(-30, 150, 100)">
                ${text}
              </text>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#watermark)"/>
        </svg>
      `;
        }

        // Center watermark
        return `
      <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
        <text x="50%" y="50%" 
          font-family="Arial" 
          font-size="${fontSize * 2}" 
          fill="rgba(128,128,128,${opacity})"
          text-anchor="middle"
          dominant-baseline="middle">
          ${text}
        </text>
      </svg>
    `;
    }
}
