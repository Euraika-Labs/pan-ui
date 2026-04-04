import { chatSessionSummarySchema, chatStreamEventSchema } from '@/lib/schemas/chat';
import { extensionCapabilitySchema, extensionSchema } from '@/lib/schemas/extension';
import { auditEventSchema } from '@/lib/schemas/audit';
import { contextInspectorSchema, memoryEntrySchema } from '@/lib/schemas/memory';
import { profileSchema } from '@/lib/schemas/profile';
import { sessionSummarySchema } from '@/lib/schemas/session';
import { skillSchema } from '@/lib/schemas/skill';

export const normalizeChatSessionSummary = (input: unknown) => chatSessionSummarySchema.parse(input);
export const normalizeChatStreamEvent = (input: unknown) => chatStreamEventSchema.parse(input);
export const normalizeSessionSummary = (input: unknown) => sessionSummarySchema.parse(input);
export const normalizeSkill = (input: unknown) => skillSchema.parse(input);
export const normalizeExtension = (input: unknown) => extensionSchema.parse(input);
export const normalizeExtensionCapability = (input: unknown) => extensionCapabilitySchema.parse(input);
export const normalizeMemoryEntry = (input: unknown) => memoryEntrySchema.parse(input);
export const normalizeContextInspector = (input: unknown) => contextInspectorSchema.parse(input);
export const normalizeProfile = (input: unknown) => profileSchema.parse(input);
export const normalizeAuditEvent = (input: unknown) => auditEventSchema.parse(input);
