import {z} from "zod";
import {getServerSession} from "next-auth";
import {authOptions} from "@/lib/auth";
import {NextResponse} from "next/server";
import {fetchRedis} from "@/helpers/redis";
import {db} from "@/lib/db";

export async function POST(req:Request){
    try{
        const body = await  req.json();
        const {id:idToDeny} = z.object({id:z.string()}).parse(body)
        const session = await getServerSession(authOptions);
        if(!session){
            return NextResponse.json("Not Authorised",{status:401})
        }

        await db.srem(`user:${session.user.id}:incoming_friend_requests`,idToDeny)
        return new NextResponse("ok")
    } catch (e) {
        console.log(e)
        if(e instanceof z.ZodError){
            return NextResponse.json("Unprocessable request payload",{status:422})
        }
    }
}