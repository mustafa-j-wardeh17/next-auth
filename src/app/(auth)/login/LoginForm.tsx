"use client";
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { connectToDatabase } from '@/lib/database';
import { zodResolver } from '@hookform/resolvers/zod';
import { error } from 'console';
import { signIn, useSession } from 'next-auth/react';
import Link from 'next/link'
import { redirect, useRouter } from 'next/navigation';
import React, { useState } from 'react'
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from "zod"

const formSchema = z.object({
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
})
const LoginForm = () => {
    const route = useRouter()
    const [error, setError] = useState<string>("")

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
        },
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        const result = await signIn("credentials", {
            redirect: false,
            email:values.email,
            password:values.password,
          });
      
          if (result?.error) {
            setError(result?.error);
          } else {
            window.location.href = "/";
          }
    }


    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4 border px-6 py-8 rounded-xl shadow-sm shadow-slate-500"
            >
                <h1 className="text-2xl font-bold">Login</h1>
                <p className="text-white/50 font-bold">Enter your email below to login to your account</p>

                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input placeholder="m@example.com" {...field} />
                            </FormControl>
                            <FormDescription>
                                This is your email to register in this app
                            </FormDescription>
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
                {
                    error && (
                        <p className='text-red-500'>{error}</p>
                    )
                }
                <div className='flex justify-center'>
                    <Button type="submit" className='w-full'>Submit</Button>
                </div>

                <div className='flex justify-center'>
                    <Button onClick={() => signIn('github')} type='button' className='w-full bg-transparent border hover:bg-neutral-900 text-white'>Sign Up with Github</Button>
                </div>
                <div className='flex justify-center'>
                    <Button onClick={() => signIn('google')} type='button' className='w-full bg-transparent border hover:bg-neutral-900 text-white'>Sign Up with Google</Button>
                </div>
                <div className="mt-4 text-center text-sm">
                    Already have an account?{" "}
                    <Link href="/register" className="underline">
                        Sign up
                    </Link>
                </div>
            </form>

        </Form>
    )
}

export default LoginForm