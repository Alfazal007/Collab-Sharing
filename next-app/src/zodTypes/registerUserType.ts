import { z } from "zod";

export const registerUserType = z.object({
    username: z
        .string({ message: "No username provided" })
        .min(6, "The minimum length of the username should be 6")
        .max(20, "The maximum length of the username should be 20"),
    email: z
        .string({ message: "No email provided" })
        .email("Invalid email address"),
    password: z
        .string({ message: "No password provided" })
        .min(6, "The minimum length of the password should be 6"),
});

export type ZodError = {
    [key: string]: string;
};
