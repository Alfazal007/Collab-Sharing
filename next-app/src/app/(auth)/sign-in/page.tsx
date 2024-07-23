"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { signinSchema } from "@/zodTypes/loginUserType";
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
import { signIn } from "next-auth/react";

export default function () {
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const router = useRouter();
    // zod implementation
    const form = useForm<z.infer<typeof signinSchema>>({
        resolver: zodResolver(signinSchema),
    });

    // function to send submit request and redirect based on that
    async function onSubmit(values: z.infer<typeof signinSchema>) {
        setIsSubmitting(true);
        const result = await signIn("credentials", {
            email: values.email,
            password: values.password,
            redirect: false,
        });
        console.log({ result });
        if (result?.status != 200) {
            toast({
                title: "Login Failed",
                description: "Incorrect credentials provided",
                variant: "destructive",
            });
        } else {
            toast({
                title: "Login Successful",
            });
            router.replace("/");
        }
        setIsSubmitting(false);
    }

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
                <div className="text-center">
                    <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
                        Sign in
                    </h1>
                    <p className="mb-4">
                        Sign in to enter the main application
                    </p>
                </div>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-8"
                    >
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel> Email</FormLabel>
                                    <FormControl>
                                        <Input placeholder="email" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="password"
                                            type="password"
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
                <div className="text-center mr-4">
                    <p>
                        New to this?{" "}
                        <Link
                            href={"/sign-up"}
                            className="text-blue-600 hover:text-blue-800"
                        >
                            Sign up
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
