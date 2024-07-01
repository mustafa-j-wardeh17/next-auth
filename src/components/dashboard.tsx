'use client'
import { signOut, useSession } from 'next-auth/react'
import React from 'react'


const Dashboard = () => {

    // For client side 
    const { data: session } = useSession()

    return (
        <div className='flex  w-full h-screen items-center justify-center'>

            <div className='flex flex-col gap-6 items-center'>
                <h1 className='text-[26px] text-center w-full font-bold '>Welcome back {session?.user?.name}</h1>
                <h1 className='text-[16px] text-center w-full font-semibold '>{session?.user?.email}</h1>
                <img src={session?.user?.image as string} alt='auth image' width={40} height={40} className='rounded-full' />
                <button
                    onClick={() => signOut({ callbackUrl: '' })}
                    className='text-white text-2xl py-2 px-3 bg-red-500'>
                    Sign out
                </button>
            </div>

        </div>
    )
}

export default Dashboard