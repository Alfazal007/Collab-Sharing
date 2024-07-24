import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import { ApiError } from "@/utils/ApiError";
import { postCreateSchema } from "@/zodTypes/postCreateType";
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
        const result = postCreateSchema.safeParse(body);
        if (!result.success) {
            const zodErrors: ZodError[] = [];
            result.error.errors.map((err) => {
                const errPath = err.path[0];
                const errMsg = err.message;
                zodErrors.push({ [errPath]: errMsg });
            });
            return Response.json(
                new ApiError(400, "Invalid object", [], zodErrors),
                {
                    status: 400,
                }
            );
        }
        try {
            const newPost = await prisma.post.create({
                data: {
                    title: result.data.title,
                    content: result.data.content,
                    userId: session.user.id,
                },
                select: {
                    content: true,
                    id: true,
                    title: true,
                    creator: {
                        select: {
                            id: true,
                        },
                    },
                },
            });
            if (!newPost) {
                return Response.json(
                    new ApiError(
                        400,
                        "There was an error writing to the database",
                        [],
                        []
                    ),
                    { status: 400 }
                );
            }
            // new post has been created
            return Response.json(
                new ApiResponse(201, "New post created", newPost),
                {
                    status: 201,
                }
            );
        } catch (err: any) {
            return Response.json(
                new ApiError(400, "Issue talking to the database", [], []),
                { status: 400 }
            );
        }
    } catch (err: any) {
        return Response.json(
            new ApiError(400, "Try again later with valid data", [], []),
            { status: 400 }
        );
    }
}
