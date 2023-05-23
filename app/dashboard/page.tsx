import React from 'react';
import {authOptions} from "@/lib/auth";
import {getServerSession} from "next-auth";

async function Page() {
    const session =await getServerSession(authOptions)
    return (
        <pre>
            {JSON.stringify(session)}
        </pre>
    );
}

export default Page;