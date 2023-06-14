import PusherServer from "pusher";
import PusherClient from "pusher-js";

export const pusherServer =new PusherServer({
    secret:process.env.PUSHER_APP_SECRET!,
    appId:process.env.PUSHER_APP_ID!,
    key:process.env.NEXT_PUBLIC_PUSHER_APP_KEY!,
    cluster:process.env.NEXT_PUBLIC_PUSHER_APP_CLUSTER!,
    useTLS:true
})

export const pusherClient = new PusherClient(process.env.NEXT_PUBLIC_PUSHER_APP_KEY!,{
    cluster:process.env.NEXT_PUBLIC_PUSHER_APP_CLUSTER!,
})