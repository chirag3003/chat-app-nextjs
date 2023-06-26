import {getServerSession} from "next-auth";
import {authOptions} from "@/lib/auth";
import {redirect} from "next/navigation";
import {RedirectType} from "next/dist/client/components/redirect";

export default async function Home() {

    const session = await getServerSession(authOptions)
    if (session) return redirect("/dashboard", RedirectType.replace)
    return redirect("/login", RedirectType.replace)
}
