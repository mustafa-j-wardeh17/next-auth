import { auth } from "./authOptions";
import { cache } from "react";

export const getSession = cache(async () => {
    const session = await auth();
    return session;
});