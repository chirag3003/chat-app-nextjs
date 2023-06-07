"use client"

import React, {useRef, useState} from 'react';
import {Message} from "@/lib/validations/message"
import {cn} from "@/lib/utils";
interface MessageProps{
    initialMessages:Message[],
    sessionId:string
}
const Messages = ({initialMessages,sessionId}:MessageProps) => {
    const [messages,setMessages] = useState<Message[]>(initialMessages)
    const scrollDownRef = useRef<HTMLDivElement>(null)
    return (
        <div
            id={"messages"}
            className={"flex flex-col-reverse flex-1 h-full gap-4 p-4 overflow-y-auto scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrollbar-touch"}
        >
            <div ref={scrollDownRef} />
            {messages.map((message,index) => {
                const isCurrentUser = message.senderId === sessionId
                const hasNextMessageFromSameUser = messages[index +1 ]?.senderId === message.senderId
                return (
                    <div
                        key={`${message.id}-${message.timestamp}`}
                        className={"chat-message"}
                    >
                        <div className={cn("flex items-end",{
                            'justify-end':isCurrentUser,
                        })}>
                            <div className={cn("flex flex-col-2 space-y-4 text-base max-w-xs mx-2",{
                                'order-1 items-end':isCurrentUser,
                                'order-2 items-start':!isCurrentUser,
                            })}>
                                <span className={cn("px-4 py-2 rounded-lg inline-block",{
                                    "bg-indigo-600 text-white":isCurrentUser,
                                    "bg-gray-600 text-gray-900":!isCurrentUser,
                                    "rounded-br-none":!hasNextMessageFromSameUser && isCurrentUser,
                                    "rounded-bl-none":!hasNextMessageFromSameUser && !isCurrentUser,
                                })}>
                                    {message.text}
                                    <span className={"ml-2 text-xs text-gray-400"}>
                                        {message.timestamp}
                                    </span>
                                </span>

                            </div>

                        </div>
                    </div>
                )
            })}
        </div>
    );
};

export default Messages;