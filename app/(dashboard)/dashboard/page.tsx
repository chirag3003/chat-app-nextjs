import React from 'react';
import {authOptions} from "@/lib/auth";
import {getServerSession} from "next-auth";

async function Page() {
    const session =await getServerSession(authOptions)
    return (
        <div className={"w-full"}>
            {JSON.stringify(session)}
        </div>
    );
}

export default Page;