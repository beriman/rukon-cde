import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as sgMail from '@sendgrid/mail';

export interface IncidentNotification {
    incidentId: string;
    type: string;
    severity: string;
    location: string;
    reporterName: string;
    reporterEmail: string;
}

export interface CapaNotification {
    actionId: string;
    incidentId: string;
    description: string;
    assigneeName: string;
    assigneeEmail: string;
    dueDate: Date;
}

@Injectable()
export class NotificationService {
    private readonly logger = new Logger(NotificationService.name);
    private readonly from: string;
    private readonly hseAdminEmail: string;

    constructor(private configService: ConfigService) {
        const apiKey = this.configService.get('SENDGRID_API_KEY');
        if (apiKey) {
            sgMail.setApiKey(apiKey);
        }
        this.from = this.configService.get('SENDGRID_FROM_EMAIL') || 'noreply@rukon.app';
        this.hseAdminEmail = this.configService.get('HSE_ADMIN_EMAIL') || 'hse@rukon.app';
    }

    /**
     * Send notification when new incident is reported
     */
    async sendIncidentNotification(incident: IncidentNotification): Promise<void> {
        try {
            const msg = {
                to: this.hseAdminEmail,
                from: this.from,
                subject: `[HSE Alert] New ${incident.severity} Incident: ${incident.type}`,
                html: `
                    <h2>New Incident Reported</h2>
                    <p><strong>Type:</strong> ${incident.type}</p>
                    <p><strong>Severity:</strong> ${incident.severity}</p>
                    <p><strong>Location:</strong> ${incident.location}</p>
                    <p><strong>Reported by:</strong> ${incident.reporterName} (${incident.reporterEmail})</p>
                    <p><strong>Incident ID:</strong> ${incident.incidentId}</p>
                    <br/>
                    <p>Please review and investigate this incident as soon as possible.</p>
                    <p><a href="${this.configService.get('APP_URL')}/dashboard/hse/incidents/${incident.incidentId}">View Incident</a></p>
                `,
            };

            await sgMail.send(msg);
            this.logger.log(`Incident notification sent for ${incident.incidentId}`);
        } catch (error) {
            this.logger.error(`Failed to send incident notification: ${error.message}`);
            // Don't throw - we don't want to fail the incident creation
        }
    }

    /**
     * Send notification when CAPA action is assigned
     */
    async sendCapaAssignmentNotification(capa: CapaNotification): Promise<void> {
        try {
            const msg = {
                to: capa.assigneeEmail,
                from: this.from,
                subject: `[Action Required] Corrective Action Assigned`,
                html: `
                    <h2>New Corrective Action Assigned to You</h2>
                    <p><strong>Action:</strong> ${capa.description}</p>
                    <p><strong>Due Date:</strong> ${capa.dueDate.toLocaleDateString()}</p>
                    <p><strong>Related Incident:</strong> ${capa.incidentId}</p>
                    <br/>
                    <p>Please complete this action before the due date.</p>
                    <p><a href="${this.configService.get('APP_URL')}/dashboard/hse/incidents/${capa.incidentId}">View Details</a></p>
                `,
            };

            await sgMail.send(msg);
            this.logger.log(`CAPA assignment notification sent to ${capa.assigneeEmail}`);
        } catch (error) {
            this.logger.error(`Failed to send CAPA notification: ${error.message}`);
        }
    }

    /**
     * Send reminder for overdue CAPA actions
     */
    async sendCapaReminderNotification(capa: CapaNotification): Promise<void> {
        try {
            const msg = {
                to: capa.assigneeEmail,
                from: this.from,
                subject: `[Reminder] Corrective Action Due Soon`,
                html: `
                    <h2>Reminder: Corrective Action Due</h2>
                    <p><strong>Action:</strong> ${capa.description}</p>
                    <p><strong>Due Date:</strong> ${capa.dueDate.toLocaleDateString()}</p>
                    <p><strong>Related Incident:</strong> ${capa.incidentId}</p>
                    <br/>
                    <p style="color: red;"><strong>This action is due soon or overdue. Please complete it immediately.</strong></p>
                    <p><a href="${this.configService.get('APP_URL')}/dashboard/hse/incidents/${capa.incidentId}">Complete Action</a></p>
                `,
            };

            await sgMail.send(msg);
            this.logger.log(`CAPA reminder sent to ${capa.assigneeEmail}`);
        } catch (error) {
            this.logger.error(`Failed to send CAPA reminder: ${error.message}`);
        }
    }
}
