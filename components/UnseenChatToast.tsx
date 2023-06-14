import React from 'react';
import toast, {Toast} from "react-hot-toast";
import {chatHrefConstructor, cn} from "@/lib/utils";
import Image from "next/image";

interface UnseenChatToastProps {
    t: Toast
    sessionId: string;
    senderId: string
    senderImg: string;
    senderName: string
    message: string
}

const UnseenChatToast = ({t, senderId, sessionId, senderImg, senderName, message}: UnseenChatToastProps) => {
    return (
        <div
            className={cn("max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5", {
                "animate-enter": t.visible,
                "animate-leave": ~t.visible
            })}>
            <a
                onClick={() => toast.dismiss(t.id)}
                className={"flex-1 w-0 p-4"}
                href={`/dashboard/chat/${chatHrefConstructor(sessionId, senderId)}`}
            >
                <div className="flex items-start">
                    <div className="flex-shrink-0 pt-0 5">
                        <div className="relative h-10 w-10">
                            <Image src={senderImg} alt={"sender"} referrerPolicy={"no-referrer"}
                                   className={"rounded-full"} fill/>
                        </div>
                    </div>
                    <div className="ml-3 flex-1">
                        <div className="text-sm font-medium text-gray-900">
                            {senderName}
                        </div>
                        <div className="mt-1 text-sm text-gray-500">{message}</div>
                    </div>
                </div>
            </a>
            <div className="flex border-l border-gray-200">
                <button onClick={() => {
                    toast.dismiss(t.id)
                }}
                        className={"w-full border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-md text-indigo-600 hover:text-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-900"}
                >Dismiss</button>
            </div>
        </div>
    );
};

export default UnseenChatToast;