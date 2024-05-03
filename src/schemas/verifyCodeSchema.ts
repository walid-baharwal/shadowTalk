import { z } from "zod";

export const verifyCodeSchema = z.object({
  verificationCode: z
    .string()
    .length(6, {
      message: "verification code must be at least 6 digits  long",
    }),
});
