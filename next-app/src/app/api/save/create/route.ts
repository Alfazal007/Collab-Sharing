import { ApiError } from "@/utils/ApiError";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import { savePostType } from "@/zodTypes/saveType";
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
        const result = savePostType.safeParse(body);
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

        // add to the save section
        try {
            const savedPost = await prisma.save.findFirst({
                where: {
                    AND: [
                        {
                            userId: session.user.id,
                        },
                        {
                            postId: result.data.postId,
                        },
                    ],
                },
            });
            if (savedPost) {
                return Response.json(
                    new ApiResponse(200, "Already saved the post", {}),
                    {
                        status: 200,
                    }
                );
            }
            const newSave = await prisma.save.create({
                data: {
                    category: result.data.category,
                    postId: result.data.postId,
                    userId: session.user.id,
                },
            });
            if (!newSave) {
                return Response.json(
                    new ApiError(
                        400,
                        "Issue saving to the database, try with better data inputs",
                        [],
                        []
                    ),
                    {
                        status: 400,
                    }
                );
            }
            return Response.json(
                new ApiError(200, "Saved the post successfully", [], []),
                { status: 200 }
            );
        } catch (err: any) {
            return Response.json(
                new ApiError(
                    400,
                    "Issue talking to the database" + err.message,
                    [],
                    []
                ),
                {
                    status: 400,
                }
            );
        }
    } catch (err: any) {
        return Response.json(
            new ApiError(400, "Ran into some issue" + err.message, [], []),
            {
                status: 400,
            }
        );
    }
}
