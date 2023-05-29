import React from 'react';
import {getServerSession} from "next-auth";
import {authOptions} from "@/lib/auth";
import {notFound} from "next/navigation";
import {fetchRedis} from "@/helpers/redis";
import {UserId} from "@/types/next-auth";
import FriendsRequests from "@/components/FriendsRequests";



const Page = async () => {
    const session = await getServerSession(authOptions)
    if(!session) notFound()


    const incomingSenderIds = (await fetchRedis("smembers",`user:${session!.user.id}:incoming_friend_requests`)) as UserId[]
    const incomingFriendRequests:IncomingFriendRequest[] =await Promise.all(incomingSenderIds.map(async (senderId) => {
        const user =JSON.parse( (await fetchRedis("get",`user:${senderId}`))) as User
        return {
            senderEmail:user.email,
            senderId
        }
    }))

    return (
        <main className={"pt-8"}>
            <h1 className="font-bold text text-5xl mb-8"></h1>
            <div className="flex flex-col gap-4">
                <FriendsRequests incomingFriendRequests={incomingFriendRequests} sessionId={session.user.id}/>
            </div>
        </main>
    );
};

export default Page;