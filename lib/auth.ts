import {NextAuthOptions} from "next-auth";
import {UpstashRedisAdapter} from "@next-auth/upstash-redis-adapter";
import {db} from "@/lib/db";
import GoogleProvider from "next-auth/providers/google";
import {fetchRedis} from "@/helpers/redis";

function getGoogleCredentials() {
    const clientID = process.env.GOOGLE_CLIENT_ID
    if(!clientID || clientID.length === 0) throw new Error("Missing Google Client ID")
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET
    if(!clientSecret || clientSecret.length === 0) throw new Error("Missing Google Client SECRET")

    return {
        clientID,
        clientSecret
    }
}

export const authOptions:NextAuthOptions = {
    adapter:UpstashRedisAdapter(db),
    providers:[GoogleProvider({
        clientId:getGoogleCredentials().clientID,
        clientSecret:getGoogleCredentials().clientSecret
    })],
    session:{
        strategy:"jwt"
    },
    pages:{
        signIn:"/login",
    },
    callbacks:{
        async jwt({token,user}){
            const dbUserResult =  (await fetchRedis("get",`user:${token.id}`)) as string|null
            if(!dbUserResult){
                token.id =user!.id
                return token
            }
            const dbUser = JSON.parse(dbUserResult) as User
            return {
                id:dbUser.id,
                name:dbUser.name,
                email:dbUser.email,
                picture:dbUser.image
            }
        },
        async session({session,token}){
            if(token){
                session.user.id = token.id
                session.user.name = token.name;
                session.user.email = token.email
                session.user.image = token.picture
            }
            return session
        },
        redirect(){
            return "/dashboard"
        }
    }

}