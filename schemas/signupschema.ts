import { z } from "zod";

export const signUpSchema = z.object({
    identifier : z

    .string()
    .trim()
    .min(1 , {message: "Please enter a Valid Email or Username"})
    .max(50)
    .refine((val) => {
      const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
      const isUsername = /^[a-zA-Z0-9_]{3,20}$/.test(val);
      return isEmail || isUsername;
    }, {
      message: "Enter a valid email or username",
    }),

    password : z
    .string()
    .trim()
    .max(50)
    .min(1 , {message : "Password is Required"})
    .min(8 , {message : "The password should be of minimum 8 characters"}),

    passwordConfirmation : z
    .string()
    .min(1 , {message : "Enter Your password again"})

})
.refine((data) => data.password === data.passwordConfirmation,{
    message : "Password do not match",
    path : ["passwordConfirmation"]
});