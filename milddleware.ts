import {withAuth} from "next-auth/middleware";
import {getToken} from "next-auth/jwt";
import {NextResponse} from "next/server";

export default withAuth(async (req) => {
    const pathName = req.nextUrl.pathname

    const isAuthenticated = await getToken({req});
    const isLoginPage = pathName.startsWith("/login")

    const sensitiveRoutes = ["/dashboard"]
    const isAccessingSensitiveRoute = sensitiveRoutes.some(route => pathName.startsWith(route))
    if (isLoginPage) {
        if (isAuthenticated)
            return NextResponse.redirect(new URL("/dashboard", req.url))

    }

    if(!isAuthenticated && isAccessingSensitiveRoute){
        return NextResponse.redirect(new URL("/login",req.url))
    }

    if (pathName === "/")
        return NextResponse.redirect(new URL("/dashboard", req.url))
    return NextResponse.next()
},{
    callbacks:{
        async authorized(){
            return true
        }
    }
})