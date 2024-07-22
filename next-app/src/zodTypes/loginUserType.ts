import { z } from "zod";

export const signinSchema = z.object({
    email: z.string({ message: "No username or email provided" }),
    password: z
        .string({ message: "No password provided" })
        .min(6, "The minimum length of the password should be 6"),
});
