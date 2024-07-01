"use client"
import { signIn, signOut, useSession } from 'next-auth/react'
import React from 'react'

const Dashboard = () => {
    const { data: session } = useSession()
    return (
        <div className='flex  w-full h-screen items-center justify-center'>
            {
                session ? (
                    <div className='flex flex-col gap-6 items-center'>
                        <h1 className='text-[26px] text-center w-full font-bold '>Welcome back {session.user?.name}</h1>
                        <h1 className='text-[16px] text-center w-full font-semibold '>{session.user?.email}</h1>
                        <img src={session.user?.image as string} alt='auth image' width={40} height={40} className='rounded-full' />
                        <button
                            onClick={() => signOut({ callbackUrl: '' })}
                            className='text-white text-2xl py-2 px-3 bg-red-500'>
                            Sign out
                        </button>
                    </div>
                ) : (
                    <div className='flex flex-col gap-6'>
                        <h1 className='text-3xl text-red-500 font-bold'>You're not logged in!</h1>
                        <div className='flex w-full gap-4 justify-center'>
                            <button
                                onClick={() => signIn('google')}
                                className='text-white text-2xl py-2 px-3 bg-orange-500'
                            >
                                Sign in with Google
                            </button>
                            <button
                                onClick={() => signIn('github')}
                                className='text-white text-2xl py-2 px-3 bg-black'>
                                Sign in with Github
                            </button>
                        </div>
                    </div>
                )
            }
        </div>
    )
}

export default Dashboard