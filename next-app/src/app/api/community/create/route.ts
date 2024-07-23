import { ApiError } from "@/utils/ApiError";
import { communityCreateSchema } from "@/zodTypes/communityCreateType";
import { ZodError } from "@/zodTypes/registerUserType";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import prisma from "@/db/db";
import { ApiResponse } from "@/utils/ApiResponse";
import { existsSync } from "fs";

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
        const result = communityCreateSchema.safeParse(body);
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
        // check for uniqueness of community name
        try {
            const isUniqueName = await prisma.community.findFirst({
                where: {
                    name: result.data.name,
                },
            });
            if (isUniqueName) {
                return Response.json(
                    new ApiError(
                        400,
                        "Community name already taken pick different name",
                        [],
                        []
                    ),
                    {
                        status: 400,
                    }
                );
            }
        } catch (err) {
            return Response.json(
                new ApiError(400, "Issues talking to the database", [], []),
                { status: 400 }
            );
        }
        try {
            // create this community and add this guy into the admin list
            const newCommunity = await prisma.community.create({
                data: {
                    userId: session.user.id,
                    name: result.data.name,
                },
                select: {
                    name: true,
                    id: true,
                    admin: {
                        select: {
                            id: true,
                            username: true,
                        },
                    },
                },
            });
            if (!newCommunity) {
                return Response.json(
                    new ApiError(400, "Issues writing to the database", [], []),
                    { status: 400 }
                );
            }
            return Response.json(new ApiResponse(201, "", newCommunity), {
                status: 201,
            });
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
