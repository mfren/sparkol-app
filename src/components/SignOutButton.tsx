"use client";

import { signOut } from "next-auth/react";

export default function SignOutButton() {
    return (
        <button onClick={() => signOut()} className="btn-primary">Sign Out</button> 
    )
}