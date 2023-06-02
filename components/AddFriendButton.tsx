"use client"

import React, {useState} from 'react';
import Button from "@/components/ui/Buttton";
import {addFriendValidator} from "@/lib/validations/addFriend";
import axios, {AxiosError} from "axios";
import {z} from "zod"
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";

interface AddFriendButtonProps {

}

type FormData = z.infer<typeof addFriendValidator>

const AddFriendButton: React.FC<AddFriendButtonProps> = function () {
    const [showSuccessState,setShowSuccessState] = useState(false )


    const {
        register,
        handleSubmit,
        setError,
        formState:{
            errors
        }
    } = useForm<FormData>({
        resolver:zodResolver(addFriendValidator)
    })



    async function addFriend(email:string){
        try{
            const validatedEmail = addFriendValidator.parse({email})
            await axios.post('/api/friends/add',{
                email:validatedEmail.email,
            })
            setShowSuccessState(true)
        }catch (e) {
            setShowSuccessState(false)
            if(e instanceof z.ZodError){
                setError("email",{message:e.message})
                return;
            }
            if(e instanceof AxiosError){
                setError('email', {message:e.response?.data})
                return;
            }
            setError("email", {message:"some error occured"})
        }
    }

    const onSubmit = (data:FormData) => {
        addFriend(data.email)
    }

    return (
        <form className={'max-w-sm'} onSubmit={handleSubmit(onSubmit)}>
            <label htmlFor="email" className={'block text-sm font-medium leading-6 text-gray-900'}>
                Add Friend
            </label>
            <div className="mt-2 flex gap-4">
                <input
                    {...register("email")}
                    id={"email"}
                    type="text"
                    className={"block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-300 focus:ring-2  focus:ring-indigo-600 sm:text-sm sm:leading-6"}
                    placeholder={"you@example.com"}
                />
                <Button>Add</Button>
            </div>
            {showSuccessState?<p className={'mt-1 text-sm text-green-600'}>Friend request send!</p>:<p className={'mt-1 text-sm text-green-600'}>{errors.email?.message}</p>}

        </form>
    );
}

export default AddFriendButton;