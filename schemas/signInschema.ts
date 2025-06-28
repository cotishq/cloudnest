import { z } from "zod";



export const signInSchema = z.object({
  identifier: z
    .string()
    .trim()
    .max(50)
    .min(1, { message: "Email or username is required" })
    .refine((val) => {
      const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
      const isUsername = /^[a-zA-Z0-9_]{3,20}$/.test(val);
      return isEmail || isUsername;
    }, {
      message: "Enter a valid email or username",
    }),
    

  password: z
    .string()
    .trim()
    .min(1, { message: "Please enter the password" })
    .min(8, { message: "Password should be at least 8 characters" })
    .max(100),
});
