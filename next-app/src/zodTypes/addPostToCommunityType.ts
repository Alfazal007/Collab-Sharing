import { z } from "zod";

export const postToCommunityType = z.object({
    postId: z.string({ message: "Post id not provided" }),
    communityId: z.string({ message: "Community id not provided" }),
});
