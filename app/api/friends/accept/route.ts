import {z} from "zod";
import {getServerSession} from "next-auth";
import {authOptions} from "@/lib/auth";
import {NextResponse} from "next/server";
import {fetchRedis} from "@/helpers/redis";
import {db} from "@/lib/db";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const {id: idToAdd} = z.object({id: z.string()}).parse(body)
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json("Not Authorised", {status: 401})
        }
        const isAlreadyFriends = (await fetchRedis("sismember", `user:${session.user.id}:friends`, idToAdd)) as 0 | 1
        if (isAlreadyFriends) {
            return NextResponse.json("Already Friends", {status: 400})
        }
        const hasFriendRequest = (await fetchRedis("sismember", `user:${session.user.id}:incoming_friend_requests`, idToAdd)) as 0 | 1
        if (!hasFriendRequest) {
            return NextResponse.json("No Friends Request", {status: 400})
        }
        await Promise.all([db.srem(`user:${session.user.id}:incoming_friend_requests`, idToAdd),
            db.sadd(`user:${session.user.id}:friends`, idToAdd),
            db.sadd(`user:${idToAdd}:friends`, session.user.id)])
        return new NextResponse("ok")
    } catch (e) {
        console.log(e)
        if (e instanceof z.ZodError) {
            return NextResponse.json("Unprocessable request payload", {status: 422})
        }
    }
}