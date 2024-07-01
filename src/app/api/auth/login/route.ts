// pages/api/auth/login.js
import { NextApiRequest, NextApiResponse } from "next";
import { getSession, signIn } from "next-auth/react";

export default async (req: NextApiRequest, res: NextApiResponse) => {
    const session = await getSession({ req });

    if (session) {
        // If the user is already logged in, redirect them
        res.redirect("/");
        return;
    }

    if (req.method === "POST") {
        const { email, password } = req.body;

        const result = await signIn("credentials", {
            redirect: false,
            email,
            password,
        });

        if (result?.error) {
            res.status(401).json({ message: result.error });
        } else {
            res.status(200).json({ message: "Logged in successfully" });
        }
    } else {
        res.status(405).json({ message: "Method not allowed" });
    }
};
