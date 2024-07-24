import { ApiError } from "@/utils/ApiError";
import { communityCreateSchema } from "@/zodTypes/communityCreateType";
import { ZodError } from "@/zodTypes/registerUserType";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import prisma from "@/db/db";
import { ApiResponse } from "@/utils/ApiResponse";

export async function DELETE(request: Request) {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !session.user.id) {
        return Response.json(
            new ApiError(400, "No user found try logging in again", [], []),
            { status: 400 }
        );
    }
    const { searchParams } = new URL(request.url);
    const params = {
        postId: searchParams.get("postId"),
    };
    const postId = params.postId;
    if (!postId) {
        return Response.json(new ApiError(400, "Invalid post id", [], []), {
            status: 400,
        });
    }
    try {
        try {
            // handle deleting of the community after checking if the request is made by the admin
            // find the community
            const post = await prisma.post.findFirst({
                where: {
                    id: postId,
                },
            });
            if (!post) {
                return Response.json(new ApiError(400, "Not found", [], []), {
                    status: 400,
                });
            }
            // check admin
            if (post.userId != session.user.id) {
                return Response.json(
                    new ApiError(
                        400,
                        "You are not the creator of this post",
                        [],
                        []
                    ),
                    { status: 400 }
                );
            }
            // delete if admin sent the request
            try {
                await prisma.post.delete({
                    where: {
                        id: post.id,
                    },
                });
                return Response.json(
                    new ApiResponse(200, "Deleted the post", {}),
                    { status: 200 }
                );
            } catch (err) {
                return Response.json(
                    new ApiError(400, "Issues talking to the database", [], []),
                    { status: 400 }
                );
            }
        } catch (err) {
            return Response.json(
                new ApiError(400, "Issues talking to the database", [], []),
                { status: 400 }
            );
        }
    } catch (err: any) {
        console.log(`There was an unknown error ${err.message}`);
        return Response.json(
            new ApiError(400, "Issues talking to the database", [], []),
            { status: 400 }
        );
    }
}
