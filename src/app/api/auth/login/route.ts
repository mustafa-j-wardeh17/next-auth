import { connectToDatabase } from '@/lib/database';
import bcrypt from 'bcrypt';
import User from '@/lib/database/models/user.model';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        console.log('Connecting to database...');
        await connectToDatabase();  // Ensure connection to the database

        console.log('Parsing request body...');
        const { email, password } = await request.json();

        console.log('Checking if user already exists...');
        const findUser = await User.findOne({ email });
        if (!findUser) {
            return NextResponse.json(
                { message: "Oops: Email or Password did't match" },
                { status: 400 }
            );
        }


        const isMatched = await bcrypt.compare(findUser.password,password );

        if(isMatched){
            return NextResponse.json(
                {
                    message: "User created successfully",
                    data: {
                        id: findUser._id,
                        email: findUser.email
                    }
                },
                { status: 201 }
            );
        }else{
            return NextResponse.json(
                { message: "Oops: Email or Password did't match" },
                { status: 400 }
            );
        }


    } catch (error: any) {
        console.error('Error during user signing in:', error);  // Log the error for debugging
        return NextResponse.json(
            { message: error.message },
            { status: 500 }
        );
    }
}
