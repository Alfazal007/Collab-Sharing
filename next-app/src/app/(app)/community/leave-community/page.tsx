"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { communityCreateSchema } from "@/zodTypes/communityCreateType";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import { useSession } from "next-auth/react";
import axios from "axios";

export default function () {
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    // zod implementation
    const form = useForm<z.infer<typeof communityCreateSchema>>({
        resolver: zodResolver(communityCreateSchema),
    });

    // TODO:: UPDATE THIS PART
    async function onSubmit(values: z.infer<typeof communityCreateSchema>) {
        setIsSubmitting(true);
        try {
            const joinCommunity = await axios.post(
                "/api/community/leave-community?community=" + values.name
            );
            if (joinCommunity.status != 200) {
                toast({
                    title: "Try again later",
                    variant: "destructive",
                });
            } else {
                toast({
                    title: "Successfully left",
                });
                router.push("/");
            }
        } catch (err: any) {
            console.log(err.message);
            toast({
                title: "Try again later",
                variant: "destructive",
            });
        } finally {
            setIsSubmitting(false);
        }
    }
    const { data: session, status } = useSession();
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
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
                <div className="text-center">
                    <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
                        Leave Community
                    </h1>
                </div>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-8"
                    >
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Community Name</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="community name"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" disabled={isSubmitting}>
                            Submit
                        </Button>
                    </form>
                </Form>
            </div>
        </div>
    );
}
