import { z } from "zod";

import { MEMBER_ROLES, VAULT_TYPES } from "@/lib/constants";

export const createVaultSchema = z.object({
  vaultType: z.enum(VAULT_TYPES.map((item) => item.value) as [string, ...string[]]),
  vaultName: z.string().min(2, "Add a vault name"),
  subjectName: z.string().min(2, "Add the subject name"),
  subjectBirthdate: z.string().optional(),
  description: z.string().max(500, "Keep the description under 500 characters").optional().or(z.literal("")),
});

export const inviteMemberSchema = z.object({
  email: z.string().email("Enter a valid email"),
  role: z.enum(MEMBER_ROLES.map((item) => item.value) as [string, ...string[]]).refine((value) => value !== "owner", "Use editor or viewer for invitations"),
});
