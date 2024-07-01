import { getServerSession } from 'next-auth'
import React from 'react'
import { authOptions } from '../../../lib/authOptions'
import { redirect } from 'next/navigation'

const layout = async ({ children }: { children: React.ReactNode }) => {
    const session = await getServerSession(authOptions)
    console.log(JSON.stringify(session))
    if (session) {
        redirect('/')
    }
    return (
        <div>
            {children}
        </div>
    )
}

export default layout