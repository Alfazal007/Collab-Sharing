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
        community: searchParams.get("community"),
    };
    const communityName = params.community;
    if (
        !communityName ||
        communityName.length < 3 ||
        communityName.length > 20
    ) {
        return Response.json(new ApiError(400, "Invalid community", [], []), {
            status: 400,
        });
    }
    try {
        try {
            // handle deleting of the community after checking if the request is made by the admin
            // find the community
            const community = await prisma.community.findFirst({
                where: {
                    name: communityName,
                },
            });
            if (!community) {
                return Response.json(new ApiError(400, "Not found", [], []), {
                    status: 400,
                });
            }
            // check admin
            if (community.userId != session.user.id) {
                return Response.json(
                    new ApiError(400, "You are not the admin", [], []),
                    { status: 400 }
                );
            }
            // delete if admin sent the request
            try {
                await prisma.community.delete({
                    where: {
                        id: community.id,
                    },
                });
                return Response.json(
                    new ApiResponse(200, "Deleted the community", {}),
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
