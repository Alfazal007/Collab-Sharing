import { z } from "zod";

export const communityCreateSchema = z.object({
    name: z
        .string({ message: "No community name provided" })
        .min(3, "The minimum length should be 3")
        .max(20, "The minimum length should be 20"),
});
