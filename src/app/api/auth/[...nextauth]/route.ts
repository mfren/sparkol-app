import NextAuth from 'next-auth'
import CredentialsProvider from "next-auth/providers/credentials"

const handler = NextAuth({
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                username: { label: "Username", type: "text" },
                password: { label: "Password", type: "text" }
            },
            async authorize(credentials, req) {

                // Post user credentials to authentication server, and wait for response
                const res = await fetch(`${process.env.AUTHSERVER_URL}/login`, {
                    method: "POST",
                    body: JSON.stringify(credentials),
                    headers: { "Content-Type": "application/json" }
                });

                // If the auth server didnt approve our credentials
                if (res.status === 401) {
                    return null;
                }

                // Typically if there was an issue with the external server
                if (res.status !== 200) {
                    throw new Error("Error authenticating with external server!");
                } 

                const user = await res.json();

                if (res.ok && user) {
                    // Provide a NextAuth user object based on returned data
                    return {
                        id: user.user.id,
                        name: user.user.name,
                    };
                }
                
                throw new Error();
            },
        })
    ],
    secret: process.env.NEXTAUTH_SECRET,
    debug: false,
});

export { handler as GET, handler as POST };
