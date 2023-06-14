"use client"

import React, {useEffect, useRef, useState} from 'react';
import {Message} from "@/lib/validations/message"
import {cn, toPusherKey} from "@/lib/utils";
import {format} from "date-fns";
import Image from "next/image";
import {pusherClient} from "@/lib/pusher";

interface MessageProps {
    initialMessages: Message[],
    sessionId: string,
    sessionImage: string,
    chatPartner: User,
    chatId:string,
}

const formatTimestamp = (timestamp: number) => {
    return format(timestamp, "HH:mm")
}

const Messages = ({initialMessages, sessionId, sessionImage, chatPartner,chatId}: MessageProps) => {
    const [messages, setMessages] = useState<Message[]>(initialMessages)
    const scrollDownRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        pusherClient.subscribe(toPusherKey(`chat:${chatId}`))
        pusherClient.bind("incoming_message", (data:Message) => {
            console.log(typeof data)
            setMessages(prev => {
                return [data,...prev]
            })
        })
    },[])

    return (
        <div
            id={"messages"}
            className={"flex flex-col-reverse flex-1 h-full gap-4 p-4 overflow-y-auto scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrollbar-touch"}
        >
            <div ref={scrollDownRef}/>
            {messages.map((message, index) => {
                const isCurrentUser = message.senderId === sessionId
                const hasNextMessageFromSameUser = messages[index - 1]?.senderId === message.senderId
                return (
                    <div
                        key={`${message.id}-${message.timestamp}`}
                        className={"chat-message"}
                    >
                        <div className={cn("flex items-end", {
                            'justify-end': isCurrentUser,
                        })}>
                            <div className={cn("flex flex-col-2 gap-3 space-y-4 text-base max-w-xs mx-2", {
                                'order-1 items-end': isCurrentUser,
                                'order-2 items-start flex-row-reverse': !isCurrentUser,
                            })}>
                                <span className={cn("px-4 py-2 rounded-lg inline-block flex-1 overflow-hidden " , {
                                    "bg-indigo-600 text-white": isCurrentUser,
                                    " bg-gray-300 text-gray-900": !isCurrentUser,
                                    "rounded-br-none": !hasNextMessageFromSameUser && isCurrentUser,
                                    "rounded-bl-none": !hasNextMessageFromSameUser && !isCurrentUser,
                                })}>
                                    {message.text}
                                    <span className={"ml-2 text-xs text-gray-400"}>
                                        {formatTimestamp(message.timestamp)}
                                    </span>
                                </span>
                                <div className={cn("relative h-6 w-6 rounded-full overflow-hidden", {
                                    "order-2": isCurrentUser,
                                    "order-1": !isCurrentUser,
                                    "invisible": hasNextMessageFromSameUser
                                })}>
                                    <Image
                                        fill
                                        referrerPolicy={"no-referrer"}
                                        src={isCurrentUser ? (sessionImage) : chatPartner.image}
                                        alt={"Profile"}
                                    />
                                </div>
                            </div>

                        </div>
                    </div>
                )
            })}
        </div>
    );
};

export default Messages;