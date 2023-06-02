interface User {
    name: string
    email: string
    image: string
    id: string
}

interface Message {
    id: string;
    senderId: string;
    receiverId: string;
    text: string;
    time: number;
}

interface FriendRequest{
    id:string;
    senderId:string;
    receiverId:string;
}