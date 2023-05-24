"use client"

import React, {ButtonHTMLAttributes, useState} from "react";
import Button from "@/components/ui/Buttton";
import {signOut} from "next-auth/react";
import toast from "react-hot-toast";
import {Loader2, LogOut} from "lucide-react";

interface SignOutButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>{

}

export default function SignOutButton({...props}:SignOutButtonProps){
    const [isSigningOut,setIsSigningOut] = useState(false)
    async function onClick() {
        setIsSigningOut(true)
        try{
            await signOut()
        }catch (e) {
            toast.error("There was an error signing out")
        }finally {
            setIsSigningOut(false)
        }
    }
    return <Button
        {...props}
        variant={"ghost"}
        onClick={onClick}
    >
        {isSigningOut?<Loader2 className={"animate-spin h-4 w-4"}/>:<LogOut className={"h-4 w-4"} /> }
    </Button>
}