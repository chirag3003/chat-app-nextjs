import React from 'react';
import {authOptions} from "@/lib/auth";
import {getServerSession} from "next-auth";
import {redirect} from "next/navigation";
import {RedirectType} from "next/dist/client/components/redirect";

async function Page() {
    const session = await getServerSession(authOptions)
    if (!session) redirect("/login", RedirectType.replace)
    return (
        <div className={"w-full"}>
            {JSON.stringify(session)}
        </div>
    );
}

export default Page;