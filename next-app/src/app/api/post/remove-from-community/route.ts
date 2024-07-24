import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import { ApiError } from "@/utils/ApiError";
import { postToCommunityType } from "@/zodTypes/addPostToCommunityType";
import { ZodError } from "@/zodTypes/registerUserType";
import prisma from "@/db/db";
import { ApiResponse } from "@/utils/ApiResponse";

export async function POST(request: Request) {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !session.user.id) {
        return Response.json(
            new ApiError(400, "No user found try logging in again", [], []),
            { status: 400 }
        );
    }
    try {
        const body = await request.json();
        if (!body) {
            return Response.json(
                new ApiError(400, "Request body not provided", [], []),
                { status: 400 }
            );
        }
        const result = postToCommunityType.safeParse(body);
        if (!result.success) {
            const zodErrors: ZodError[] = [];
            result.error.errors.map((err) => {
                const errPath = err.path[0];
                const errMsg = err.message;
                zodErrors.push({ [errPath]: errMsg });
            });
            console.log({ zodErrors });
            return Response.json(
                new ApiError(400, "Invalid object", [], zodErrors),
                {
                    status: 400,
                }
            );
        }
        try {
            // check if comm exists
            const community = await prisma.community.findFirst({
                where: {
                    id: result.data.communityId,
                },
            });
            if (!community) {
                return Response.json(
                    new ApiError(400, "Invalid community", [], []),
                    { status: 400 }
                );
            }
            const post = await prisma.post.findFirst({
                where: {
                    id: result.data.postId,
                },
            });
            if (!post) {
                return Response.json(
                    new ApiError(400, "Invalid post", [], []),
                    { status: 400 }
                );
            }
            // can add admin logic here as well
            if (
                post.userId != session.user.id &&
                community.userId != session.user.id
            ) {
                return Response.json(
                    new ApiError(
                        400,
                        "You are not the author of the post",
                        [],
                        []
                    ),
                    { status: 400 }
                );
            }
            const postInCommunity = await prisma.community.findFirst({
                where: {
                    AND: [
                        {
                            posts: {
                                some: {
                                    id: result.data.postId,
                                },
                            },
                        },
                        {
                            id: result.data.communityId,
                        },
                    ],
                },
            });
            if (!postInCommunity) {
                return Response.json(
                    new ApiError(400, "Post not part of community", [], []),
                    { status: 400 }
                );
            }
            try {
                await prisma.community.update({
                    where: {
                        id: result.data.communityId,
                    },
                    data: {
                        posts: {
                            disconnect: {
                                id: result.data.postId,
                            },
                        },
                    },
                });
                return Response.json(
                    new ApiResponse(200, "Post removed to community", {}),
                    {
                        status: 200,
                    }
                );
            } catch (err) {
                return Response.json(
                    new ApiError(400, "Issue talking to the database", [], []),
                    { status: 400 }
                );
            }
        } catch (err) {
            return Response.json(
                new ApiError(400, "Issue talking to the database", [], []),
                { status: 400 }
            );
        }
    } catch (err) {
        return Response.json(
            new ApiError(
                400,
                "There was some issue check request body or try again",
                [],
                []
            ),
            { status: 400 }
        );
    }
}
