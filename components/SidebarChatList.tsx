"use client"

import React, {useEffect, useState} from 'react';
import {usePathname, useRouter} from "next/navigation";
import {chatHrefConstructor, toPusherKey} from "@/lib/utils";
import {User2, UserCircle} from "lucide-react";
import {pusherClient} from "@/lib/pusher";
import toast from "react-hot-toast";
import UnseenChatToast from "@/components/UnseenChatToast";
import messages from "@/components/Messages";

interface SidebarChatListProps {
    friends: User[]
    sessionId: string;
}

interface ExtendedMessage extends Message{
    senderImg:string;
    senderName:string;
}

const SidebarChatList: React.FC<SidebarChatListProps> = ({friends, sessionId}) => {
    const router = useRouter()
    const pathname = usePathname()
    const [unseenMessages, setUnseenMessages] = useState<Message[]>([])
    const chatHandler = (message:ExtendedMessage) => {
        const shouldNotify = pathname !== `/dashboard/chat/${chatHrefConstructor(sessionId,message.senderId)}`
        if(!shouldNotify) return;

        //should be notified
        toast.custom((t) => {
            return <UnseenChatToast senderId={message.senderId} senderImg={message.senderImg} sessionId={sessionId}  t={t} senderName={message.senderName} message={message.text}/>
        })
        setUnseenMessages(prev => [...prev,message])
    }
    const newFriendHandler = () => {
        router.refresh()
    }
    useEffect(() => {
        pusherClient.subscribe(toPusherKey(`user:${sessionId}:chats`))
        pusherClient.subscribe(toPusherKey(`user:${sessionId}:friends`))
        pusherClient.bind('new_message', chatHandler)
        pusherClient.bind('new_friend', newFriendHandler)
        return () => {
            pusherClient.unbind("new_message", chatHandler)
            pusherClient.unbind("new_friend", newFriendHandler)
            pusherClient.unsubscribe(toPusherKey(`user:${sessionId}:chats`))
            pusherClient.unsubscribe(toPusherKey(`user:${sessionId}:friends`))
        }
    }, [chatHandler, newFriendHandler, sessionId,pathname])
    useEffect(() => {
        if (pathname?.includes("chat")) {
            setUnseenMessages(prev => {
                return prev.filter(msg => !pathname.includes(msg.senderId))
            })
        }
    }, [pathname])
    return (
        <ul role={"list"} className={"max-h-[25rem] overflow-y-auto -mx-2 space-y-auto my-2"}>
            {friends.sort().map(friend => {
                const unseenMessageCount = unseenMessages.filter(msg => {
                    return msg.senderId === friend.id
                }).length
                return <li key={friend.id}
                           className={"p-3 hover:bg-gray-100 rounded hover:text-indigo-600 flex items-center gap-3"}>
                    <UserCircle/>
                    <a href={`/dashboard/chat/${chatHrefConstructor(sessionId, friend.id)}`}>{friend.name}</a>
                </li>
            })}
        </ul>
    );
};

export default SidebarChatList;