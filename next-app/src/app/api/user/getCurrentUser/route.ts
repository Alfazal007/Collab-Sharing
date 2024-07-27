import prisma from "@/db/db";
import { ApiError } from "@/utils/ApiError";
import { ApiResponse } from "@/utils/ApiResponse";
import { hashPassword } from "@/utils/HashPassword";
import { registerUserType, ZodError } from "@/zodTypes/registerUserType";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import { getCsrfToken } from "next-auth/react";
import { decode, getToken } from "next-auth/jwt";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !session.user.id) {
        return Response.json(
            new ApiError(400, "No user relogin maybe", [], []),
            { status: 400 }
        );
    }
    const token = await getToken({
        req: request,
        secret: process.env.NEXT_AUTH_SECRET,
        raw: true,
    });
    const data = await decode({
        token: token,
        secret: process.env.NEXT_AUTH_SECRET || "",
    });
    try {
        const user = await prisma.user.findFirst({
            where: {
                id: session.user.id,
            },
            select: {
                username: true,
                id: true,
                email: true,
            },
        });
        if (!user) {
            return Response.json(
                new ApiError(400, "No user relogin maybe", [], []),
                { status: 400 }
            );
        }
        return Response.json(new ApiResponse(200, "User is valid", user), {
            status: 200,
        });
    } catch (err: any) {
        return Response.json(
            new ApiError(400, "Database connection issue, maybe...", [], []),
            { status: 400 }
        );
    }
}
