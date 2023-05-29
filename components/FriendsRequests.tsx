"use client"

import React, {useState} from 'react';
import {Check, Cross, Crosshair, UserPlus, X} from "lucide-react";
import axios from "axios";
import {useRouter} from "next/navigation";
import toast from "react-hot-toast";

interface FriendsRequestsProps{
    incomingFriendRequests:IncomingFriendRequest[];
    sessionId:string
}

const FriendsRequests = ({incomingFriendRequests,sessionId}:FriendsRequestsProps) => {
    const [friendsRequests,setFriendsRequests] = useState<IncomingFriendRequest[]>(incomingFriendRequests)
    const router = useRouter()
    const acceptFriend =async (senderId:string) => {
        try{
            await axios.post("/api/friends/accept", {id: senderId})
            setFriendsRequests(prev => {
                return prev.filter(({senderId: userId}) => {
                    return senderId !== userId
                })
            })
            router.refresh()
        }catch {
            toast.error("Error accepting friend request")
        }
    }
    const denyFriend =async (senderId:string) => {
        try{
            await axios.post("/api/friends/deny", {id: senderId})
            setFriendsRequests(prev => {
                return prev.filter(({senderId: userId}) => {
                    return senderId !== userId
                })
            })
            router.refresh()
        }catch{
            toast.error("Error denying friend request")
        }
    }
    return (
        <>
            {incomingFriendRequests.length === 0 ? <p>Nothing to Show here</p>:incomingFriendRequests.map((req) => {
                return <div
                    key={req.senderId}
                    className={"flex gap-4 items-center"}
                >
                    <UserPlus className={"text-black"} />
                    <p className="font-medium text-lg">{req.senderEmail}</p>
                    <button onClick={() => acceptFriend(req.senderId)} aria-label={"accept friend"} className={"w-8 h-8 bg-indigo-600 hover:bg-indigo-700 grid place-items-center rounded-full transition hover:shadow-md"}><Check className={"font-semibold text-white w-3/4 h-3/4"} /></button>
                    <button onClick={() => denyFriend(req.senderId)} aria-label={"deny friend"} className={"w-8 h-8 bg-indigo-600 hover:bg-indigo-700 grid place-items-center rounded-full transition hover:shadow-md"}><X className={"font-semibold text-white w-3/4 h-3/4"} /></button>

                </div>
            })}
        </>
    );
};

export default FriendsRequests;