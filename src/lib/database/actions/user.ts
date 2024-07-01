"use server";

import User from "./../models/user.model";
import { redirect } from "next/navigation";
import { hash } from "bcrypt";
import { CredentialsSignin } from "next-auth";
import { connectToDatabase } from "..";
import { signIn } from "../../../../lib/authOptions";


const login = async (formData: FormData) => {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
        await signIn("credentials", {
            redirect: false,
            callbackUrl: "/",
            email,
            password,
        });
    } catch (error) {
        const someError = error as CredentialsSignin;
        return someError.cause;
    }
    redirect("/");
};

const register = async (formData: FormData) => {
    const firstName = formData.get("firstname") as string;
    const lastName = formData.get("lastname") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (!firstName || !lastName || !email || !password) {
        throw new Error("Please fill all fields");
    }

    await connectToDatabase();

    // existing user
    const existingUser = await User.findOne({ email });
    if (existingUser) throw new Error("User already exists");

    const hashedPassword = await hash(password, 12);

    await User.create({ firstName, lastName, email, password: hashedPassword });
    console.log(`User created successfully 🥂`);
    redirect("/login");
};

const fetchAllUsers = async () => {
    await connectToDatabase();
    const users = await User.find({});
    return users;
};

export { register, login, fetchAllUsers };
