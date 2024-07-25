import { z } from "zod";

export const savePostType = z.object({
    postId: z.string({ message: "No post id provided" }),
    category: z.string({ message: "No category provided" }),
});
