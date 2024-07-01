
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectToDatabase } from "@/lib/database";
import User from "@/lib/database/models/user.model";
import { NextAuthOptions } from "next-auth";


export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID as string,
      clientSecret: process.env.GITHUB_SECRET as string,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {},
        password: {},
      },
      async authorize(credentials, req) {
        await connectToDatabase();


        const user = await User.findOne({ email: credentials?.email });

        const bcrypt = require("bcrypt");

        const passwordCorrect = await bcrypt.compare(credentials?.password, user?.password);

        if (passwordCorrect) {
          return {
            id: user?._id.toString(),
            email: user?.email,
          };
        }

        console.log("==========>credentials", credentials);
        return null;
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      await connectToDatabase();

      if (account?.provider === 'github' || account?.provider === 'google') {
        const existingUser = await User.findOne({ email: account?.provider === 'google' ? profile?.email : profile?.login });
        if (existingUser) {
          return true;
        } else {
          const newUser = new User({
            firstName: profile?.given_name || profile?.name?.split(' ')[0] || '',
            lastName: profile?.family_name || profile?.name?.split(' ')[1] || '',
            email: profile?.email || profile?.login,
            image: profile?.picture || profile?.avatar_url || '',
            role: account?.provider === 'github' ? 'github' : 'google',
            authProviderId: account.providerAccountId,
          });
          await newUser.save();
          return true;
        }
      }
      return true;
    },
    jwt: async ({ user, token, trigger, session }) => {
      if (trigger === "update") {
        return { ...token, ...session.user };
      }
      return { ...token, ...user };
    },
    async session({ session, token }) {
      session.user = token;
      return session;
    },
  },
};