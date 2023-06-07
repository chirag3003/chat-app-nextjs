"use client"

import React, {useEffect, useState} from 'react';
import {usePathname, useRouter} from "next/navigation";
import {chatHrefConstructor} from "@/lib/utils";
import {User2, UserCircle} from "lucide-react";
interface SidebarChatListProps{
    friends:User[]
    sessionId:string;
}
const SidebarChatList:React.FC<SidebarChatListProps> = ({friends,sessionId}) => {
    const router = useRouter()
    const pathname = usePathname()
    const [unseenMessages,setUnseenMessages] = useState<Message[]>([])
    useEffect(() => {
        if(pathname?.includes("chat")){
            setUnseenMessages(prev => {
                return prev.filter(msg => !pathname.includes(msg.senderId))
            })
        }
    },[pathname])
    return (
        <ul role={"list"} className={"max-h-[25rem] overflow-y-auto -mx-2 space-y-auto my-2"}>
            {friends.sort().map(friend => {
                const unseenMessageCount = unseenMessages.filter(msg => {
                    return msg.senderId === friend.id
                }).length
                return <li key={friend.id} className={"p-3 hover:bg-gray-100 rounded hover:text-indigo-600 flex items-center gap-3"}>
                    <UserCircle />
                    <a href={`/dashboard/chat/${chatHrefConstructor(sessionId,friend.id)}`}>{friend.name}</a>
                </li>
            })}
        </ul>
    );
};

export default SidebarChatList;