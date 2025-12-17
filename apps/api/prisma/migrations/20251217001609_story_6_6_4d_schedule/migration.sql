-- CreateEnum
CREATE TYPE "ProjectStatus" AS ENUM ('ACTIVE', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "GlobalRole" AS ENUM ('SUPER_ADMIN', 'USER');

-- CreateEnum
CREATE TYPE "OrgRole" AS ENUM ('OWNER', 'ADMIN', 'MEMBER', 'GUEST');

-- CreateEnum
CREATE TYPE "AuditAction" AS ENUM ('LOGIN', 'LOGOUT', 'PASSWORD_RESET', 'FILE_UPLOAD', 'FILE_DOWNLOAD', 'FILE_MOVE', 'FILE_PROMOTE', 'FILE_PUBLISH', 'FILE_ARCHIVE', 'FILE_DELETE', 'PROJECT_CREATE', 'PROJECT_UPDATE', 'PROJECT_ARCHIVE', 'FOLDER_CREATE', 'FOLDER_DELETE', 'INVITATION_SEND', 'INVITATION_ACCEPT');

-- CreateEnum
CREATE TYPE "TemplateType" AS ENUM ('OIR', 'PIR', 'AIR', 'EIR', 'BEP', 'TIDP', 'MIDP');

-- CreateEnum
CREATE TYPE "DocumentStatus" AS ENUM ('DRAFT', 'REVIEW', 'APPROVED', 'PUBLISHED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "WorkflowStatus" AS ENUM ('PENDING', 'IN_PROGRESS', 'COMPLETED', 'REJECTED');

-- CreateEnum
CREATE TYPE "ActionStatus" AS ENUM ('OPEN', 'IN_PROGRESS', 'COMPLETED', 'VERIFIED');

-- CreateEnum
CREATE TYPE "IncidentType" AS ENUM ('FIRST_AID', 'MTI', 'RWI', 'LTI', 'FATALITY', 'ILLNESS', 'VEHICLE_INCIDENT', 'SPILL', 'NEAR_MISS', 'UNSAFE_ACT');

-- CreateEnum
CREATE TYPE "Severity" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL');

-- CreateEnum
CREATE TYPE "IncidentStatus" AS ENUM ('OPEN', 'INVESTIGATING', 'CLOSED');

-- CreateEnum
CREATE TYPE "PTWType" AS ENUM ('HOT_WORK', 'CONFINED_SPACE', 'WORK_AT_HEIGHT', 'EXCAVATION', 'ELECTRICAL');

-- CreateEnum
CREATE TYPE "PTWStatus" AS ENUM ('DRAFT', 'PENDING_APPROVAL', 'APPROVED', 'ACTIVE', 'COMPLETED', 'EXPIRED', 'REJECTED');

-- CreateEnum
CREATE TYPE "InspectionType" AS ENUM ('EXCAVATOR', 'CRANE', 'SCAFFOLDING', 'FIRE_EXTINGUISHER', 'ELECTRICAL_TOOLS', 'GENERAL_SITE');

-- CreateEnum
CREATE TYPE "InspectionResult" AS ENUM ('PASS', 'FAIL', 'NA');

-- CreateEnum
CREATE TYPE "MeetingType" AS ENUM ('TBM', 'INDUCTION', 'EMERGENCY_DRILL');

-- CreateEnum
CREATE TYPE "AuditSeverity" AS ENUM ('MAJOR', 'MINOR', 'OBSERVATION');

-- CreateEnum
CREATE TYPE "AuditStatus" AS ENUM ('OPEN', 'RESPONDED', 'VERIFIED', 'CLOSED');

-- CreateEnum
CREATE TYPE "Discipline" AS ENUM ('STRUCT', 'ARCH', 'MEP');

-- CreateEnum
CREATE TYPE "SubmittalType" AS ENUM ('SHOP_DRAWING', 'METHOD_STATEMENT', 'MATERIAL_APPROVAL');

-- CreateEnum
CREATE TYPE "SubmittalStatus" AS ENUM ('DRAFT', 'SUBMITTED', 'UNDER_REVIEW', 'APPROVED', 'APPROVED_WITH_NOTES', 'REJECTED', 'RESUBMITTED');

-- CreateEnum
CREATE TYPE "ProcurementStatus" AS ENUM ('ORDERED', 'MANUFACTURED', 'SHIPPING', 'ON_SITE', 'INSTALLED');

-- CreateEnum
CREATE TYPE "ClaimStatus" AS ENUM ('DRAFT', 'SUBMITTED', 'CERTIFIED', 'INVOICED', 'PAID');

-- CreateEnum
CREATE TYPE "BcfTopicStatus" AS ENUM ('OPEN', 'IN_PROGRESS', 'SOLVED', 'CLOSED');

-- CreateEnum
CREATE TYPE "BcfTopicPriority" AS ENUM ('LOW', 'NORMAL', 'HIGH', 'CRITICAL');

-- CreateEnum
CREATE TYPE "BcfTopicType" AS ENUM ('ERROR', 'WARNING', 'INFO', 'REQUEST');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT,
    "role" "GlobalRole" NOT NULL DEFAULT 'USER',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "lastLoginAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "organizations" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "organizations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "organization_users" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "role" "OrgRole" NOT NULL DEFAULT 'MEMBER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "organization_users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "projects" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "status" "ProjectStatus" NOT NULL DEFAULT 'ACTIVE',

    CONSTRAINT "projects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "folders" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "parentId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "discipline" TEXT,
    "isSystem" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "folders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "invitations" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "role" "OrgRole" NOT NULL DEFAULT 'MEMBER',
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "used" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "invitedBy" TEXT,

    CONSTRAINT "invitations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InspectionTemplate" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "InspectionType" NOT NULL,
    "items" JSONB NOT NULL,
    "projectId" TEXT,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "InspectionTemplate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EmergencyDrill" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "duration" INTEGER NOT NULL,
    "participants" TEXT[],
    "findings" TEXT,
    "photos" TEXT[],
    "conductedBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EmergencyDrill_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "files" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "originalName" TEXT NOT NULL,
    "uniqueId" TEXT NOT NULL,
    "s3Key" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "mimeType" TEXT NOT NULL,
    "folderId" TEXT NOT NULL,
    "uploadedBy" TEXT NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 1,
    "currentVersion" INTEGER NOT NULL DEFAULT 1,
    "cdeState" TEXT NOT NULL DEFAULT 'WIP',
    "linkSourceId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "files_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "file_versions" (
    "id" TEXT NOT NULL,
    "fileId" TEXT NOT NULL,
    "version" INTEGER NOT NULL,
    "s3Key" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "uploadedBy" TEXT NOT NULL,
    "cdeState" TEXT NOT NULL DEFAULT 'WIP',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "file_versions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notifications" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "data" JSONB,
    "read" BOOLEAN NOT NULL DEFAULT false,
    "channel" TEXT NOT NULL DEFAULT 'IN_APP',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "password_resets" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "used" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "password_resets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "refresh_tokens" (
    "id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ipAddress" TEXT,
    "userAgent" TEXT,

    CONSTRAINT "refresh_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_logs" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "action" "AuditAction" NOT NULL,
    "resourceId" TEXT,
    "resourceType" TEXT,
    "details" JSONB,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "document_templates" (
    "id" TEXT NOT NULL,
    "type" "TemplateType" NOT NULL,
    "language" TEXT NOT NULL DEFAULT 'id',
    "name" TEXT NOT NULL,
    "content" JSONB NOT NULL,
    "description" TEXT,
    "isSystem" BOOLEAN NOT NULL DEFAULT false,
    "organizationId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "document_templates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "planning_documents" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "type" "TemplateType" NOT NULL,
    "content" JSONB NOT NULL,
    "status" "DocumentStatus" NOT NULL DEFAULT 'DRAFT',
    "version" TEXT NOT NULL DEFAULT '1.0',
    "projectId" TEXT,
    "organizationId" TEXT NOT NULL,
    "createdBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "planning_documents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "task_delivery_plans" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "teamId" TEXT,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "task_delivery_plans_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "task_deliverables" (
    "id" TEXT NOT NULL,
    "planId" TEXT NOT NULL,
    "originator" TEXT NOT NULL,
    "volume" TEXT NOT NULL,
    "level" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "number" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "startDate" TIMESTAMP(3),
    "endDate" TIMESTAMP(3),
    "durationDays" INTEGER,
    "assignedTo" TEXT,
    "status" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "task_deliverables_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "approval_workflows" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "stages" JSONB NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "approval_workflows_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "drawing_markups" (
    "id" TEXT NOT NULL,
    "fileId" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "layerData" JSONB NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'OPEN',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "drawing_markups_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "incidents" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "type" "IncidentType" NOT NULL,
    "severity" "Severity" NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "location" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "reportedBy" TEXT NOT NULL,
    "witnesses" TEXT[],
    "photos" TEXT[],
    "rootCause" TEXT,
    "correctiveActions" JSONB,
    "status" "IncidentStatus" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "incidents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "incident_actions" (
    "id" TEXT NOT NULL,
    "incidentId" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "assigneeId" TEXT,
    "dueDate" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "status" "ActionStatus" NOT NULL DEFAULT 'OPEN',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "incident_actions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "permit_to_works" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "type" "PTWType" NOT NULL,
    "workDescription" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "approvals" JSONB NOT NULL,
    "status" "PTWStatus" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "permit_to_works_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "hse_daily_reports" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "manhours" INTEGER NOT NULL DEFAULT 0,
    "workersCount" INTEGER NOT NULL DEFAULT 0,
    "weather" TEXT,
    "notes" TEXT,
    "recordedBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "hse_daily_reports_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inspection_forms" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "type" "InspectionType" NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "inspectorId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "inspection_forms_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inspection_items" (
    "id" TEXT NOT NULL,
    "formId" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "result" "InspectionResult" NOT NULL,
    "photo" TEXT,
    "comment" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "inspection_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "safety_meetings" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "type" "MeetingType" NOT NULL,
    "topic" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "attendees" JSONB NOT NULL,
    "photo" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "safety_meetings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "hse_personnel" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "company" TEXT NOT NULL,
    "role" TEXT,
    "documents" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "hse_personnel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "hse_emergency_contacts" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "isPrimary" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "hse_emergency_contacts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "hse_audits" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "auditDate" TIMESTAMP(3) NOT NULL,
    "auditor" TEXT NOT NULL,
    "scope" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "hse_audits_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "hse_audit_findings" (
    "id" TEXT NOT NULL,
    "auditId" TEXT NOT NULL,
    "clause" TEXT NOT NULL,
    "severity" "AuditSeverity" NOT NULL,
    "description" TEXT NOT NULL,
    "evidence" TEXT,
    "status" "AuditStatus" NOT NULL DEFAULT 'OPEN',
    "responseDate" TIMESTAMP(3),
    "closureEvidence" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "hse_audit_findings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "work_packages" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "discipline" "Discipline" NOT NULL,
    "weight" DOUBLE PRECISION NOT NULL DEFAULT 1.0,
    "scheduleTaskId" TEXT,
    "bqItemId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "work_packages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "progress_updates" (
    "id" TEXT NOT NULL,
    "workPackageId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "percentage" DOUBLE PRECISION NOT NULL,
    "notes" TEXT,
    "photos" TEXT[],
    "submittedBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "progress_updates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "submittals" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "type" "SubmittalType" NOT NULL,
    "referenceNumber" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "fileId" TEXT NOT NULL,
    "workflowId" TEXT,
    "status" "SubmittalStatus" NOT NULL DEFAULT 'DRAFT',
    "submittedBy" TEXT NOT NULL,
    "reviewComments" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "submittals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "procurement_items" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "quantity" DOUBLE PRECISION NOT NULL,
    "unit" TEXT NOT NULL,
    "status" "ProcurementStatus" NOT NULL DEFAULT 'ORDERED',
    "supplier" TEXT,
    "orderDate" TIMESTAMP(3),
    "deliveryDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "procurement_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bill_of_quantities" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "currency" TEXT NOT NULL DEFAULT 'IDR',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "bill_of_quantities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "boq_items" (
    "id" TEXT NOT NULL,
    "boqId" TEXT NOT NULL,
    "itemCode" TEXT,
    "description" TEXT NOT NULL,
    "unit" TEXT NOT NULL,
    "quantity" DOUBLE PRECISION NOT NULL,
    "unitRate" DOUBLE PRECISION NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "actualQty" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "workPackageId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "boq_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cost_mappings" (
    "id" TEXT NOT NULL,
    "boqItemId" TEXT NOT NULL,
    "elementGuid" TEXT NOT NULL,
    "modelId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "cost_mappings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "progress_claims" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "claimNumber" INTEGER NOT NULL,
    "period" TEXT NOT NULL,
    "baseAmount" DOUBLE PRECISION NOT NULL,
    "voAmount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "totalAmount" DOUBLE PRECISION NOT NULL,
    "status" "ClaimStatus" NOT NULL DEFAULT 'DRAFT',
    "submittedBy" TEXT NOT NULL,
    "certifiedAmount" DOUBLE PRECISION,
    "certifiedDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "progress_claims_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "variation_orders" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "voNumber" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "costImpact" DOUBLE PRECISION NOT NULL,
    "timeImpact" INTEGER,
    "status" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "variation_orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cobie_validations" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "fileId" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "totalElements" INTEGER NOT NULL,
    "compliantElements" INTEGER NOT NULL,
    "complianceScore" DOUBLE PRECISION NOT NULL,
    "missingFields" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "cobie_validations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "correspondences" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "referenceNumber" TEXT NOT NULL,
    "from" TEXT NOT NULL,
    "to" TEXT[],
    "subject" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "attachments" TEXT[],
    "status" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "correspondences_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bcf_topics" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "guid" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "priority" "BcfTopicPriority" NOT NULL DEFAULT 'NORMAL',
    "status" "BcfTopicStatus" NOT NULL DEFAULT 'OPEN',
    "type" "BcfTopicType" NOT NULL DEFAULT 'WARNING',
    "assignedTo" TEXT,
    "creationAuthor" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "bcf_topics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bcf_comments" (
    "id" TEXT NOT NULL,
    "topicId" TEXT NOT NULL,
    "guid" TEXT NOT NULL,
    "comment" TEXT NOT NULL,
    "author" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "viewpointId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "bcf_comments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bcf_viewpoints" (
    "id" TEXT NOT NULL,
    "topicId" TEXT NOT NULL,
    "guid" TEXT NOT NULL,
    "index" INTEGER NOT NULL DEFAULT 0,
    "eyePosition" JSONB NOT NULL,
    "direction" JSONB NOT NULL,
    "upVector" JSONB NOT NULL,
    "selection" JSONB,
    "visibility" JSONB,
    "snapshot" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "bcf_viewpoints_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "validation_rules" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "category" TEXT NOT NULL,
    "ruleType" TEXT NOT NULL,
    "config" JSONB NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "validation_rules_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "validation_reports" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "modelId" TEXT NOT NULL,
    "result" JSONB NOT NULL,
    "score" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "validation_reports_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "schedules" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "schedules_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "schedule_tasks" (
    "id" TEXT NOT NULL,
    "scheduleId" TEXT NOT NULL,
    "taskId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "parentId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "schedule_tasks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "simulation_links" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "scheduleTaskId" TEXT NOT NULL,
    "elementId" TEXT NOT NULL,
    "modelId" TEXT NOT NULL,
    "config" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "simulation_links_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_isActive_idx" ON "users"("isActive");

-- CreateIndex
CREATE UNIQUE INDEX "organizations_slug_key" ON "organizations"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "organization_users_userId_organizationId_key" ON "organization_users"("userId", "organizationId");

-- CreateIndex
CREATE INDEX "projects_status_idx" ON "projects"("status");

-- CreateIndex
CREATE UNIQUE INDEX "invitations_token_key" ON "invitations"("token");

-- CreateIndex
CREATE INDEX "invitations_organizationId_idx" ON "invitations"("organizationId");

-- CreateIndex
CREATE INDEX "invitations_token_idx" ON "invitations"("token");

-- CreateIndex
CREATE INDEX "files_folderId_idx" ON "files"("folderId");

-- CreateIndex
CREATE INDEX "files_s3Key_idx" ON "files"("s3Key");

-- CreateIndex
CREATE INDEX "files_uniqueId_idx" ON "files"("uniqueId");

-- CreateIndex
CREATE UNIQUE INDEX "files_folderId_uniqueId_key" ON "files"("folderId", "uniqueId");

-- CreateIndex
CREATE INDEX "file_versions_fileId_idx" ON "file_versions"("fileId");

-- CreateIndex
CREATE INDEX "file_versions_s3Key_idx" ON "file_versions"("s3Key");

-- CreateIndex
CREATE UNIQUE INDEX "file_versions_fileId_version_key" ON "file_versions"("fileId", "version");

-- CreateIndex
CREATE INDEX "notifications_userId_read_idx" ON "notifications"("userId", "read");

-- CreateIndex
CREATE INDEX "notifications_createdAt_idx" ON "notifications"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "password_resets_token_key" ON "password_resets"("token");

-- CreateIndex
CREATE INDEX "password_resets_userId_idx" ON "password_resets"("userId");

-- CreateIndex
CREATE INDEX "password_resets_token_idx" ON "password_resets"("token");

-- CreateIndex
CREATE UNIQUE INDEX "refresh_tokens_token_key" ON "refresh_tokens"("token");

-- CreateIndex
CREATE INDEX "refresh_tokens_userId_idx" ON "refresh_tokens"("userId");

-- CreateIndex
CREATE INDEX "refresh_tokens_token_idx" ON "refresh_tokens"("token");

-- CreateIndex
CREATE INDEX "audit_logs_userId_idx" ON "audit_logs"("userId");

-- CreateIndex
CREATE INDEX "audit_logs_action_idx" ON "audit_logs"("action");

-- CreateIndex
CREATE INDEX "audit_logs_resourceId_idx" ON "audit_logs"("resourceId");

-- CreateIndex
CREATE INDEX "audit_logs_createdAt_idx" ON "audit_logs"("createdAt");

-- CreateIndex
CREATE INDEX "planning_documents_projectId_idx" ON "planning_documents"("projectId");

-- CreateIndex
CREATE INDEX "planning_documents_organizationId_idx" ON "planning_documents"("organizationId");

-- CreateIndex
CREATE INDEX "incidents_projectId_idx" ON "incidents"("projectId");

-- CreateIndex
CREATE INDEX "incidents_date_idx" ON "incidents"("date");

-- CreateIndex
CREATE INDEX "incident_actions_incidentId_idx" ON "incident_actions"("incidentId");

-- CreateIndex
CREATE INDEX "permit_to_works_projectId_idx" ON "permit_to_works"("projectId");

-- CreateIndex
CREATE UNIQUE INDEX "hse_daily_reports_projectId_date_key" ON "hse_daily_reports"("projectId", "date");

-- CreateIndex
CREATE INDEX "inspection_forms_projectId_idx" ON "inspection_forms"("projectId");

-- CreateIndex
CREATE INDEX "inspection_items_formId_idx" ON "inspection_items"("formId");

-- CreateIndex
CREATE INDEX "safety_meetings_projectId_idx" ON "safety_meetings"("projectId");

-- CreateIndex
CREATE INDEX "safety_meetings_date_idx" ON "safety_meetings"("date");

-- CreateIndex
CREATE INDEX "hse_personnel_projectId_idx" ON "hse_personnel"("projectId");

-- CreateIndex
CREATE INDEX "hse_emergency_contacts_projectId_idx" ON "hse_emergency_contacts"("projectId");

-- CreateIndex
CREATE INDEX "hse_audits_projectId_idx" ON "hse_audits"("projectId");

-- CreateIndex
CREATE INDEX "hse_audit_findings_auditId_idx" ON "hse_audit_findings"("auditId");

-- CreateIndex
CREATE INDEX "work_packages_projectId_idx" ON "work_packages"("projectId");

-- CreateIndex
CREATE INDEX "work_packages_discipline_idx" ON "work_packages"("discipline");

-- CreateIndex
CREATE INDEX "progress_updates_workPackageId_idx" ON "progress_updates"("workPackageId");

-- CreateIndex
CREATE INDEX "progress_updates_date_idx" ON "progress_updates"("date");

-- CreateIndex
CREATE UNIQUE INDEX "submittals_referenceNumber_key" ON "submittals"("referenceNumber");

-- CreateIndex
CREATE INDEX "submittals_projectId_idx" ON "submittals"("projectId");

-- CreateIndex
CREATE INDEX "submittals_status_idx" ON "submittals"("status");

-- CreateIndex
CREATE INDEX "procurement_items_projectId_idx" ON "procurement_items"("projectId");

-- CreateIndex
CREATE INDEX "bill_of_quantities_projectId_idx" ON "bill_of_quantities"("projectId");

-- CreateIndex
CREATE INDEX "boq_items_boqId_idx" ON "boq_items"("boqId");

-- CreateIndex
CREATE INDEX "cost_mappings_boqItemId_idx" ON "cost_mappings"("boqItemId");

-- CreateIndex
CREATE INDEX "cost_mappings_elementGuid_idx" ON "cost_mappings"("elementGuid");

-- CreateIndex
CREATE INDEX "progress_claims_projectId_idx" ON "progress_claims"("projectId");

-- CreateIndex
CREATE INDEX "variation_orders_projectId_idx" ON "variation_orders"("projectId");

-- CreateIndex
CREATE INDEX "cobie_validations_projectId_idx" ON "cobie_validations"("projectId");

-- CreateIndex
CREATE UNIQUE INDEX "correspondences_referenceNumber_key" ON "correspondences"("referenceNumber");

-- CreateIndex
CREATE INDEX "correspondences_projectId_idx" ON "correspondences"("projectId");

-- CreateIndex
CREATE UNIQUE INDEX "bcf_topics_guid_key" ON "bcf_topics"("guid");

-- CreateIndex
CREATE INDEX "bcf_topics_projectId_idx" ON "bcf_topics"("projectId");

-- CreateIndex
CREATE INDEX "bcf_topics_guid_idx" ON "bcf_topics"("guid");

-- CreateIndex
CREATE UNIQUE INDEX "bcf_comments_guid_key" ON "bcf_comments"("guid");

-- CreateIndex
CREATE INDEX "bcf_comments_topicId_idx" ON "bcf_comments"("topicId");

-- CreateIndex
CREATE UNIQUE INDEX "bcf_viewpoints_guid_key" ON "bcf_viewpoints"("guid");

-- CreateIndex
CREATE INDEX "bcf_viewpoints_topicId_idx" ON "bcf_viewpoints"("topicId");

-- CreateIndex
CREATE INDEX "validation_reports_projectId_idx" ON "validation_reports"("projectId");

-- CreateIndex
CREATE INDEX "validation_reports_modelId_idx" ON "validation_reports"("modelId");

-- CreateIndex
CREATE INDEX "schedules_projectId_idx" ON "schedules"("projectId");

-- CreateIndex
CREATE UNIQUE INDEX "schedule_tasks_scheduleId_taskId_key" ON "schedule_tasks"("scheduleId", "taskId");

-- CreateIndex
CREATE INDEX "simulation_links_projectId_idx" ON "simulation_links"("projectId");

-- CreateIndex
CREATE INDEX "simulation_links_scheduleTaskId_idx" ON "simulation_links"("scheduleTaskId");

-- AddForeignKey
ALTER TABLE "organization_users" ADD CONSTRAINT "organization_users_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "organization_users" ADD CONSTRAINT "organization_users_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "projects" ADD CONSTRAINT "projects_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "folders" ADD CONSTRAINT "folders_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "folders" ADD CONSTRAINT "folders_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "folders"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invitations" ADD CONSTRAINT "invitations_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InspectionTemplate" ADD CONSTRAINT "InspectionTemplate_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmergencyDrill" ADD CONSTRAINT "EmergencyDrill_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "files" ADD CONSTRAINT "files_folderId_fkey" FOREIGN KEY ("folderId") REFERENCES "folders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "files" ADD CONSTRAINT "files_linkSourceId_fkey" FOREIGN KEY ("linkSourceId") REFERENCES "files"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "file_versions" ADD CONSTRAINT "file_versions_fileId_fkey" FOREIGN KEY ("fileId") REFERENCES "files"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "password_resets" ADD CONSTRAINT "password_resets_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "refresh_tokens" ADD CONSTRAINT "refresh_tokens_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "planning_documents" ADD CONSTRAINT "planning_documents_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "planning_documents" ADD CONSTRAINT "planning_documents_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "task_delivery_plans" ADD CONSTRAINT "task_delivery_plans_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "task_deliverables" ADD CONSTRAINT "task_deliverables_planId_fkey" FOREIGN KEY ("planId") REFERENCES "task_delivery_plans"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "approval_workflows" ADD CONSTRAINT "approval_workflows_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "drawing_markups" ADD CONSTRAINT "drawing_markups_fileId_fkey" FOREIGN KEY ("fileId") REFERENCES "files"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "incidents" ADD CONSTRAINT "incidents_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "incidents" ADD CONSTRAINT "incidents_reportedBy_fkey" FOREIGN KEY ("reportedBy") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "incident_actions" ADD CONSTRAINT "incident_actions_incidentId_fkey" FOREIGN KEY ("incidentId") REFERENCES "incidents"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "incident_actions" ADD CONSTRAINT "incident_actions_assigneeId_fkey" FOREIGN KEY ("assigneeId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "permit_to_works" ADD CONSTRAINT "permit_to_works_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "hse_daily_reports" ADD CONSTRAINT "hse_daily_reports_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "hse_daily_reports" ADD CONSTRAINT "hse_daily_reports_recordedBy_fkey" FOREIGN KEY ("recordedBy") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inspection_forms" ADD CONSTRAINT "inspection_forms_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inspection_forms" ADD CONSTRAINT "inspection_forms_inspectorId_fkey" FOREIGN KEY ("inspectorId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inspection_items" ADD CONSTRAINT "inspection_items_formId_fkey" FOREIGN KEY ("formId") REFERENCES "inspection_forms"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "safety_meetings" ADD CONSTRAINT "safety_meetings_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "hse_personnel" ADD CONSTRAINT "hse_personnel_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "hse_emergency_contacts" ADD CONSTRAINT "hse_emergency_contacts_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "hse_audits" ADD CONSTRAINT "hse_audits_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "hse_audit_findings" ADD CONSTRAINT "hse_audit_findings_auditId_fkey" FOREIGN KEY ("auditId") REFERENCES "hse_audits"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_packages" ADD CONSTRAINT "work_packages_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "progress_updates" ADD CONSTRAINT "progress_updates_workPackageId_fkey" FOREIGN KEY ("workPackageId") REFERENCES "work_packages"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "progress_updates" ADD CONSTRAINT "progress_updates_submittedBy_fkey" FOREIGN KEY ("submittedBy") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "submittals" ADD CONSTRAINT "submittals_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "submittals" ADD CONSTRAINT "submittals_fileId_fkey" FOREIGN KEY ("fileId") REFERENCES "files"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "submittals" ADD CONSTRAINT "submittals_workflowId_fkey" FOREIGN KEY ("workflowId") REFERENCES "approval_workflows"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "submittals" ADD CONSTRAINT "submittals_submittedBy_fkey" FOREIGN KEY ("submittedBy") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "procurement_items" ADD CONSTRAINT "procurement_items_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bill_of_quantities" ADD CONSTRAINT "bill_of_quantities_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "boq_items" ADD CONSTRAINT "boq_items_boqId_fkey" FOREIGN KEY ("boqId") REFERENCES "bill_of_quantities"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cost_mappings" ADD CONSTRAINT "cost_mappings_boqItemId_fkey" FOREIGN KEY ("boqItemId") REFERENCES "boq_items"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "progress_claims" ADD CONSTRAINT "progress_claims_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "variation_orders" ADD CONSTRAINT "variation_orders_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cobie_validations" ADD CONSTRAINT "cobie_validations_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "correspondences" ADD CONSTRAINT "correspondences_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bcf_topics" ADD CONSTRAINT "bcf_topics_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bcf_comments" ADD CONSTRAINT "bcf_comments_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "bcf_topics"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bcf_viewpoints" ADD CONSTRAINT "bcf_viewpoints_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "bcf_topics"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "validation_reports" ADD CONSTRAINT "validation_reports_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "validation_reports" ADD CONSTRAINT "validation_reports_modelId_fkey" FOREIGN KEY ("modelId") REFERENCES "files"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "schedules" ADD CONSTRAINT "schedules_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "schedule_tasks" ADD CONSTRAINT "schedule_tasks_scheduleId_fkey" FOREIGN KEY ("scheduleId") REFERENCES "schedules"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "simulation_links" ADD CONSTRAINT "simulation_links_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "simulation_links" ADD CONSTRAINT "simulation_links_scheduleTaskId_fkey" FOREIGN KEY ("scheduleTaskId") REFERENCES "schedule_tasks"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "simulation_links" ADD CONSTRAINT "simulation_links_modelId_fkey" FOREIGN KEY ("modelId") REFERENCES "files"("id") ON DELETE CASCADE ON UPDATE CASCADE;
