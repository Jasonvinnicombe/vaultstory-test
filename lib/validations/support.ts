import { z } from "zod";

export const supportRequestSchema = z.object({
  name: z.string().trim().min(2, "Enter your name").max(80, "Keep your name under 80 characters"),
  email: z.string().trim().email("Enter a valid email"),
  subject: z.string().trim().min(3, "Add a short subject").max(120, "Keep the subject under 120 characters"),
  message: z.string().trim().min(20, "Share a few more details so we can help").max(4000, "Keep the message under 4000 characters"),
});

export type SupportRequestValues = z.infer<typeof supportRequestSchema>;
