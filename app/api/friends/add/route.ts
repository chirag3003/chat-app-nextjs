import {NextResponse} from "next/server";
import {addFriendValidator} from "@/lib/validations/addFriend";
import {z} from "zod";
import {getServerSession} from "next-auth";
import {authOptions} from "@/lib/auth";
import {db} from "@/lib/db";
import {fetchRedis} from "@/helpers/redis";
import {pusherServer} from "@/lib/pusher";
import {toPusherKey} from "@/lib/utils";

export async function POST(req: Request) {
    try {
        const body = await req.json()
        //authentication
        const session = await getServerSession(authOptions)
        if (!session) {
            return NextResponse.json("Unauthorized", {status: 401})
        }

        //getting the user that has to be added
        const {email: emailToAdd} = addFriendValidator.parse(body)
        const idToAdd = (await fetchRedis("get",`user:email:${emailToAdd}`)) as string
        //validating the user that has to be added
        if (idToAdd === session.user.id)
            return NextResponse.json("You are trying to add yourself", {status: 400})
        if (!idToAdd)
            return NextResponse.json("This person does not exist", {status: 400})

        const isAlreadyAdded = (await fetchRedis("sismember",`user:${idToAdd}:incoming_friend_requests`,session.user.id)) as 0|1
        if(isAlreadyAdded) return NextResponse.json("User already added",{status:400})
        const isAlreadyFriends = (await fetchRedis("sismember",`user:${session.user.id}:friends`,idToAdd)) as 0|1
        if(isAlreadyFriends) return NextResponse.json("Already Friends with this user",{status:400})

        await pusherServer.trigger(toPusherKey(`user:${idToAdd}:incoming_friend_requests`), "incoming_friend_requests", {
            senderId: session.user.id,
            senderEmail:session.user.email,
        })

        await db.sadd(`user:${idToAdd}:incoming_friend_requests`,session.user.id)

        return NextResponse.json("ok")
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json("Invalid Request Payload",{status:422})
        }
        return NextResponse.json("Invalid Request",{status:400})
    }
}