import React from 'react'
import RegisterForm from './RegisterForm'

const page = async () => {
    return (
        <div className='flex items-center justify-center h-screen'>
            <div className='w-[400px] xs:w-full'>
                <RegisterForm />
            </div>
        </div>
    )
}

export default page