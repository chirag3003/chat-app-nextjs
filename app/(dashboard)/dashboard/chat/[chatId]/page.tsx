import React from 'react';
import {getServerSession} from "next-auth";
import {authOptions} from "@/lib/auth";
import {notFound, redirect} from "next/navigation";
import {RedirectType} from "next/dist/client/components/redirect";
import {fetchRedis} from "@/helpers/redis";
import {messageArrayValidator} from "@/lib/validations/message";
import Image from "next/image";
import Messages from "@/components/Messages";
import ChatInput from "@/components/ChatInput";

interface PageProps {
    params: {
        chatId: string;
    }
}

async function getChatMessages(chatId: string) {
    try {
        const result: string[] = await fetchRedis("zrange", `chat:${chatId}`, 0, -1)
        const dbMessages = result.map((msg) => JSON.parse(msg))
        const reversedDbMessages = dbMessages.reverse()
        return messageArrayValidator.parse(reversedDbMessages)
    } catch {
        notFound()
    }
}

const Page = async ({params: {chatId}}: PageProps) => {
    const session = await getServerSession(authOptions)
    if (!session) {
        redirect("/login", RedirectType.replace)
    }
    const {user} = session
    const [userId1, userId2] = chatId.split('--')
    if (userId1 !== user.id && userId2 !== userId2) notFound()
    const chatPartnerId = userId1 === user.id ? userId2 : userId1
    const chatPartner = JSON.parse((await fetchRedis("get", `user:${chatPartnerId}`))) as User
    const messages = await getChatMessages(chatId)
    return (
        <div className={"flex flex-col justify-between flex-1 h-full max-h-[calc(100vh-6rem)]"}>
            <div className="flex sm:items-center justify-between py-3 border-b-2 border-gray-200">
                <div className="relative flex items-center space-x-4">
                    <div className="relative">
                        <div className="relative w-8 sm:w-12 h-8 sm:h-12 rounded-full overflow-hidden">
                            <Image fill referrerPolicy={"no-referrer"} src={chatPartner.image}
                                   alt={`${chatPartner.name} profile`}/>
                        </div>
                    </div>
                    <div className="flex flex-col leading-tight">
                        <div className={"text-xl flex items-center"}>
                            <span className={"text-gray-600 mr-3 font-semibold"}>{chatPartner.name}</span>
                        </div>
                        <span className="text-sm text-gray-300">{chatPartner.email}</span>
                    </div>
                </div>
            </div>
            <Messages chatId={chatId} initialMessages={messages} sessionId={session.user.id}
                      sessionImage={(session.user.image) as string} chatPartner={chatPartner}/>
            <ChatInput chatPartner={chatPartner} chatId={chatId}/>
        </div>
    );
};

export default Page;