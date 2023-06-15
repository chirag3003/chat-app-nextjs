import React from 'react';
import AddFriendButton from "@/components/AddFriendButton";

const Page= async () => {
    await new Promise((resolve) => {
        setTimeout(resolve, 5000)
    })
    return (
        <main className={'p-8'}>
            <h1 className={"font-bold mb-8 text-5xl"}>
                Add a friend
            </h1>
            <AddFriendButton/>
        </main>
    );
}

export default Page;