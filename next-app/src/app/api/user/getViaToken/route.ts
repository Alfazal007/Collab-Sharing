import prisma from "@/db/db";
import { decode } from "next-auth/jwt";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { token, email } = body;
        if (!token || !email) {
            return Response.json(false);
        }
        const decodedToken: any = await decode({
            secret: process.env.NEXT_AUTH_SECRET || "",
            token: token,
        });
        if (decodedToken.email != email) {
            return Response.json(false);
        }
        // validate in prisma database
        try {
            const userFromDB = await prisma.user.findFirst({
                where: {
                    email: email,
                },
            });
            if (!userFromDB) {
                return Response.json(false);
            }
            if (userFromDB.email != email) {
                return Response.json(false);
            }
            return Response.json(true);
        } catch (err: any) {
            return Response.json(false);
        }
    } catch (err: any) {
        return Response.json(false);
    }
}
