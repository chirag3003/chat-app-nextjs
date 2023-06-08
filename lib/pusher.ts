import PusherServer from "pusher";
import PusherClient from "pusher-js";

export const pusherServer =new PusherServer({
    secret:process.env.PUSHER_SECRET!,
    appId:process.env.PUSHER_APP_ID!,
    key:process.env.PUSHER_KEY!,
    cluster:process.env.PUSHER_CLUSTER!,
    useTLS:true
})

export const pusherClient = new PusherClient(process.env.PUSHER_KEY!,{
    cluster:process.env.PUSHER_CLUSTER!,
})