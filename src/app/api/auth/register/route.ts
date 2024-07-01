// pages/api/auth/register.js
import { connectToDatabase } from '@/lib/database';
import bcrypt from 'bcrypt';
import User from '@/lib/database/models/user.model';
import { NextResponse } from 'next/server';
import { signIn } from 'next-auth/react';

export async function POST(request: Request) {
    try {
        console.log('Connecting to database...');
        await connectToDatabase();  // Ensure connection to the database

        console.log('Parsing request body...');
        const { firstName, lastName, email, password } = await request.json();

        console.log('Checking if user already exists...');
        const findUser = await User.findOne({ email });
        if (findUser) {
            console.log('User already exists.');
            return NextResponse.json(
                { message: "Oops: Email already taken!" },
                { status: 400 }
            );
        }

        console.log('Hashing password...');
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        console.log('Creating new user...');
        const newUser = await User.create({
            firstName,
            lastName,
            email,
            password: hashedPassword
        });

        return NextResponse.json(
            {
                message: "User created successfully",
                data: {
                    id: newUser._id,
                    email: newUser.email
                }
            },
            { status: 201 }
        );

    } catch (error: any) {
        console.error('Error during user registration:', error);  // Log the error for debugging
        return NextResponse.json(
            { message: error.message },
            { status: 500 }
        );
    }
}
