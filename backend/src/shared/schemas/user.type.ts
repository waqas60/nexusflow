import z from "zod";

export const userSignUpZodSchema = z.object({
  username: z.string().trim(),
  email: z.email().trim().toLowerCase(),
  password: z
    .string()
    .min(8, "Atleast 8 character long")
    .max(30, "Too long, make it less than 100")
    .regex(/[A-Z]/, "Add atleast one uppercase letter")
    .regex(/[a-z]/, "Add atleast one lowercase letter")
    .regex(/[0-9]/, "Add atleast one number")
    .regex(/[^a-zA-Z0-9]/, "Add atleast one special character (like @, !)"),
});
export const userSignInZodSchema = userSignUpZodSchema.omit({ username: true });

export type SignUpInput = z.infer<typeof userSignUpZodSchema>;
export type SignInput = z.infer<typeof userSignInZodSchema>;
