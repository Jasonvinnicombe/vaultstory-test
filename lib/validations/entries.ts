import { z } from "zod";

import { MOODS, RELATIVE_UNITS, UNLOCK_TYPES } from "@/lib/constants";

const optionalNumberField = z.preprocess(
  (value) => (value === "" || value === null || typeof value === "undefined" ? undefined : value),
  z.coerce.number().min(1).max(120).optional(),
);

const unlockTypeValues = UNLOCK_TYPES.map((item) => item.value) as [string, ...string[]];
const sealableUnlockTypeValues = UNLOCK_TYPES.filter((item) => item.value !== "draft").map((item) => item.value) as [string, ...string[]];
const relativeUnitValues = RELATIVE_UNITS.map((item) => item.value) as [string, ...string[]];

function refineUnlockChoice(
  value: {
    unlockType: string;
    unlockAt?: string;
    ageMilestone?: number;
    relativeAmount?: number;
    relativeUnit?: string;
    milestoneLabel?: string;
  },
  ctx: z.RefinementCtx,
) {
  if (value.unlockType === "date" && !value.unlockAt) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["unlockAt"], message: "Choose an unlock date" });
  }

  if (value.unlockType === "age_milestone" && !value.ageMilestone) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["ageMilestone"], message: "Choose an age milestone" });
  }

  if (value.unlockType === "relative_duration" && (!value.relativeAmount || !value.relativeUnit)) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["relativeAmount"], message: "Add a relative duration" });
  }

  if (value.unlockType === "manual_milestone" && !value.milestoneLabel?.trim()) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["milestoneLabel"], message: "Describe the milestone" });
  }
}

export const createEntryWorkflowSchema = z
  .object({
    title: z.string().min(2, "Add a title"),
    message: z.string().min(2, "Add a message"),
    unlockType: z.enum(unlockTypeValues),
    unlockAt: z.string().optional(),
    ageMilestone: optionalNumberField,
    relativeAmount: optionalNumberField,
    relativeUnit: z.enum(relativeUnitValues).optional(),
    milestoneLabel: z.string().optional(),
    mood: z.enum(MOODS).optional().or(z.literal("")),
    tags: z.string().optional(),
    predictionText: z.string().max(1000, "Keep the prediction under 1000 characters").optional().or(z.literal("")),
  })
  .superRefine((value, ctx) => {
    if (value.unlockType === "draft") {
      return;
    }

    refineUnlockChoice(value, ctx);
  });

export const sealEntrySchema = z
  .object({
    unlockType: z.enum(sealableUnlockTypeValues),
    unlockAt: z.string().optional(),
    ageMilestone: optionalNumberField,
    relativeAmount: optionalNumberField,
    relativeUnit: z.enum(relativeUnitValues).optional(),
    milestoneLabel: z.string().optional(),
  })
  .superRefine(refineUnlockChoice);
