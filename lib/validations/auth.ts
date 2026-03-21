import { z } from "zod";

export const signInSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const signUpSchema = signInSchema.extend({
  fullName: z.string().min(2, "Tell us your name"),
  acceptTerms: z.literal(true, {
    errorMap: () => ({ message: "You need to accept the Terms & Conditions to create an account" }),
  }),
});

export const onboardingSchema = z.object({
  fullName: z.string().min(2, "Tell us your name"),
  birthday: z.string().optional(),
  timezone: z.string().min(2, "Pick a timezone"),
});

export const userSettingsSchema = z.object({
  fullName: z.string().min(2, "Tell us your name"),
  birthday: z.string().optional(),
  timezone: z.string().min(2, "Pick a timezone"),
  emailReminders: z.boolean().default(true),
  unlockDigest: z.boolean().default(true),
});
