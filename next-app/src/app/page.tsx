"use client";

import { Skeleton } from "@/components/ui/skeleton";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Home() {
    const { data: session, status } = useSession();
    const [user, setUser] = useState<any>();

    useEffect(() => {
        async function getter() {
            if (status === "authenticated") {
                const user = await axios.get("/api/user/getCurrentUser");
                setUser(user.data.data);
            }
        }
        getter();
    }, [status]);
    const router = useRouter();
    if (status === "loading") {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gray-100">
                <div className="w-full max-w-screen-md p-8 space-y-8 bg-white rounded-lg shadow-md">
                    <div className="space-y-4">
                        <Skeleton className="h-24 w-full" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-24 w-full" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-8 w-32" />
                    </div>
                </div>
            </div>
        );
    }
    if (status === "unauthenticated") {
        router.push("/sign-in");
    }
    console.log(session?.user);
    return (
        <div>
            This is the init project by the user {session?.user.name}{" "}
            {JSON.stringify(user)}{" "}
        </div>
    );
}
