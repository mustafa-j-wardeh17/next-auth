import { getServerSession } from 'next-auth'
import React from 'react'
import { authOptions } from '../../../../lib/authOptions'
import LoginForm from './LoginForm'

const page = async () => {
    const session = await getServerSession(authOptions)
    return (
        <div className='flex items-center justify-center h-screen'>
            <LoginForm />
        </div>
    )
}

export default page