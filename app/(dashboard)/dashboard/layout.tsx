import {ReactNode} from "react";
import {getServerSession} from "next-auth";
import {authOptions} from "@/lib/auth";
import {redirect} from "next/navigation";
import Link from "next/link";
import {Icon, Icons} from "@/components/Icons";
import SignOutButton from "@/components/SignOutButton";
import Image from "next/image";
import {RedirectType} from "next/dist/client/components/redirect";
import FriendRequestSidebarOption from "@/components/FriendRequestSidebarOption";
import {fetchRedis} from "@/helpers/redis";
import {UserId} from "@/types/next-auth";
import {getFriendsByUserId} from "@/helpers/getFriendsByUserId";
import SidebarChatList from "@/components/SidebarChatList";
import MobileChatLayout from "@/components/MobileChatLayout";
import {Github} from "lucide-react";

interface LayoutProps {
    children: ReactNode,
}

interface SidebarOptions {
    id: number
    name: string
    href: string
    Icon: Icon
}

const sidebarOptions: SidebarOptions[] = [{
    id: 1,
    name: "Add Friend",
    href: "/dashboard/add",
    Icon: "UserPlus"
}]


const Layout = async ({children}: LayoutProps) => {
    const session = await getServerSession(authOptions)
    if (!session) {
        redirect("/login", RedirectType.replace)
    }
    const friends = await getFriendsByUserId(session.user.id)
    const unseenRequestCount = ((await fetchRedis("smembers", `user:${session.user.id}:incoming_friend_requests`)) as UserId[]).length

    return (
        <div className={'w-full flex h-screen'}>
            <div className="md:hidden">
                <MobileChatLayout friends={friends} session={session} sidebarOptions={sidebarOptions}
                                  unseenRequestCount={unseenRequestCount}/>
            </div>
            <div
                className="hidden md:flex relative  h-full w-full max-w-xs grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white leading-6 p-6">
                <div className="flex gap-4 items-center">
                    <Link href={"/dashboard"} className={'flex h-16 shrink-0 items-center'}>
                        <Icons.Logo className={"h-8 w-auto text-indigo-600"}/>
                    </Link>
                    <Link href={"https://github.com/chirag3003"} target={"_blank"} referrerPolicy={"no-referrer"}
                          className={'flex h-16 shrink-0 items-center'}>
                        <Github className={"h-8 w-auto "}/>
                    </Link>
                </div>
                {friends.length > 0 ? <div className="text-xs font-semibold leading-6 text-gray-400">
                    Your Chats
                </div> : null}
                <nav className="flex flex-1 flex-col">
                    <ul role={"list"} className="flex flex-col flex-1">
                        <li>
                            <SidebarChatList friends={friends} sessionId={session.user.id}/>
                        </li>
                        <li>
                            <div className={"text-xs font-semibold leading-6 text-gray-600"}>Overview</div>
                            <ul role={"list"} className={"-mx-2 mt-2 space-y-1"}>
                                {sidebarOptions.map((option, key) => {
                                    const Icon = Icons[option.Icon]
                                    return (
                                        <li key={option.id}>
                                            <Link href={option.href}
                                                  className={"text-gray-700 hover:text-indigo-600 hover:bg-gray-50 group flex gap-3 rounded-md p-2 leading-6 text-sm font-semibold"}>
                                                <span
                                                    className="text-gray-400 border-gray-200 group-hover:border-indigo-600 group-hover:text-indigo-600 h-6 w-6 flex shrink-0 items-center justify-center rounded-lg border text-{0.625rem} bg-white">
                                                    <Icon className={'h-4 w-4'}/>
                                                </span>
                                                <span className={"truncate"}>
                                                    {option.name}
                                                </span>
                                            </Link>
                                        </li>
                                    )
                                })}
                                <li>
                                    <FriendRequestSidebarOption sessionId={session.user.id}
                                                                initialUnseenRequestCount={unseenRequestCount}/>
                                </li>
                            </ul>
                        </li>
                        <li className='absolute overflow-hidden left-0 right-0 bottom-0 max-w-sm mt-auto flex items-center py-3 px-6'>
                            <div
                                className='flex flex-1 items-center gap-x-4  text-sm font-semibold leading-6 text-gray-900'>
                                <div className='relative h-8 w-8 bg-gray-50'>
                                    <Image
                                        fill
                                        referrerPolicy='no-referrer'
                                        className='rounded-full'
                                        src={session.user.image || ''}
                                        alt='Your profile picture'
                                    />
                                </div>

                                <span className='sr-only'>Your profile</span>
                                <div className='flex flex-col  w-11/12'>
                                    <span aria-hidden='true'>{session.user.name}</span>
                                    <span className='text-xs text-zinc-400 w-11/12 truncate' aria-hidden='true'>
                                        {session.user.email}
                                    </span>
                                </div>
                            </div>

                            <SignOutButton className='h-full aspect-square'/>
                        </li>
                    </ul>

                </nav>
            </div>
            <div className="flex-1 p-4">
                {children}
            </div>
        </div>
    )
}

export default Layout