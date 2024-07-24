import { z } from "zod";

export const postCreateSchema = z.object({
    title: z
        .string({ message: "Title not provided" })
        .min(1, "Give proper title")
        .max(200, "Length should be under 200"),
    content: z
        .string({ message: "Content not provided" })
        .min(1, "Give proper content")
        .max(1000, "Length should be under 1000"),
});
