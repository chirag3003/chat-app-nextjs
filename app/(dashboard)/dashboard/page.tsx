import React from 'react';
import {authOptions} from "@/lib/auth";
import {getServerSession} from "next-auth";
import {notFound} from "next/navigation";

async function Page() {
    const session = await getServerSession(authOptions)
    if (!session) notFound()
    return (
        <div className={"w-full"}>
            {JSON.stringify(session)}
        </div>
    );
}

export default Page;