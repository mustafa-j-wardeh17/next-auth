import React from 'react'
import { authOptions } from '../../../../lib/authOptions'
import RegisterForm from './RegisterForm'
import { getServerSession } from 'next-auth'

const page = async () => {
    const session = await getServerSession(authOptions)
    return (
        <div className='flex items-center justify-center h-screen'>
            <div className='w-[400px] xs:w-full'>
                <RegisterForm />
            </div>
        </div>
    )
}

export default page