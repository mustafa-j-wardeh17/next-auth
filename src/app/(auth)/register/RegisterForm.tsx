"use client"

import React from 'react'
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { z } from "zod"
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import { toast } from 'sonner'
import { register } from '@/lib/database/actions/user'
import { redirect } from 'next/navigation'
import { signIn, useSession } from 'next-auth/react'

const formSchema = z.object({
    firstName: z.string().min(2).max(15),
    lastName: z.string().min(2).max(15),
    email: z.
        string().
        email("This is not a valid email.").
        min(2, {
            message: "Username must be at least 2 charachters logn."
        }).
        max(50, { message: "Username can't be longer than 50 charachters." }),
    password: z.
        string().
        min(4, {
            message: "Password must be at least 4 charachters logn."
        }).
        max(30),
    confirmPassword: z.
        string().
        min(4, {
            message: "Confirm Password must be at least 4 charachters logn."
        }).
        max(30)
})
    .superRefine(({ confirmPassword, password }, ctx) => {
        if (confirmPassword !== password) {
            ctx.addIssue({
                code: "custom",
                message: "The passwords does not matched",
                path: ["confirmPassword"]
            });
        }
    })


const RegisterForm = () => {

    // 1. Define your form.
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {},
    })

    // 2. Define a submit handler.
    async function onSubmit(values: z.infer<typeof formSchema>) {

        const response = await fetch("/api/auth/register", {
            method: "POST",
            body: JSON.stringify(values)
        })
        const data = await response.json()
        if (data.error) {
            toast.error(data.error)
        }

        toast.success("Account created successfully")
        console.log(values)
    }
    const { data: session } = useSession();
    const user = session?.user;
    if (user) redirect("/");
    return (
        <Form {...form}>
            <form
                action={register}
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4 border px-6 py-8 rounded-xl shadow-sm shadow-slate-500"
            >
                <h1 className="text-2xl font-bold">Register</h1>
                <p className="text-white/50 font-bold">Create a new account.</p>

                <div className='flex flex-row gap-2'>
                    <FormField
                        control={form.control}
                        name="firstName"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>First Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="First Name" {...field} />
                                </FormControl>

                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="lastName"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Last Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="Last Name" {...field} />
                                </FormControl>

                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input placeholder="m@example.com" {...field} />
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
                                    type='password'
                                    placeholder="*******"
                                    {...field}
                                />
                            </FormControl>

                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Confirm Password</FormLabel>
                            <FormControl>
                                <Input type='password'
                                    placeholder="*******"
                                    {...field}
                                />
                            </FormControl>

                            <FormMessage />
                        </FormItem>
                    )}
                />
                <div className='flex justify-center'>
                    <Button type="submit" className='w-full'>Sign up</Button>
                </div>

                <div className='flex justify-center'>
                    <Button onClick={() => signIn('github')} type='button' className='w-full bg-transparent border hover:bg-neutral-900 text-white'>Sign Up with Github</Button>
                </div>
                <div className='flex justify-center'>
                    <Button onClick={() => signIn('google')} type='button' className='w-full bg-transparent border hover:bg-neutral-900 text-white'>Sign Up with Google</Button>
                </div>
                <div className="mt-4 text-center text-sm">
                    Already have an account?{" "}
                    <Link href="/login" className="underline">
                        Login
                    </Link>
                </div>
            </form>

        </Form>
    )
}

export default RegisterForm