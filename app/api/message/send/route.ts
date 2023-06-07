import {getServerSession} from "next-auth";
import {authOptions} from "@/lib/auth";
import {fetchRedis} from "@/helpers/redis";
import {db} from "@/lib/db";
import {Message, messageValidator} from "@/lib/validations/message";
import {nanoid} from "nanoid";

export async function POST(req:Request){
    try{
        const {text,chatId} = await req.json()
        const session = await getServerSession(authOptions)
        if(!session) return new Response("Unauthorized", {status: 401})
        const {user} = session
        const [userId1,userId2] = chatId.split("--")


        if(session.user.id !== userId1 && session.user.id !== userId2) return new Response("Unauthorized", {status: 401})
        const friendId = session.user.id===userId1?userId2:userId1
        const friendList:string[] = await fetchRedis("smembers",`user:${user.id}:friends`)
        const isFriend = friendList.includes(friendId)

        if(!isFriend) return new Response("Unauthorized", {status: 401})
        const sender:User = JSON.parse(await fetchRedis("get",`user:${user.id}`))

        const timestamp = Date.now()
        const messageData :Message = {
            id:nanoid(),
            senderId:user.id,
            text,
            timestamp,
        }
        const message = messageValidator.parse(messageData)
        await db.zadd(`chat:${chatId}`,{
            score:timestamp,
            member:JSON.stringify(message)
        })

        return new Response("OK")
    }catch (e){
        if(e instanceof Error){
            return new Response(e.message, {status: 500})
        }
        return new Response("Internal Server Error", {status: 500})
    }
}