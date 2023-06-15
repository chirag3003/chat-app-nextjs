import React from 'react';
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css"

interface LoadingProps {

}


const Loading = ({}:LoadingProps) => {
    return (
        <div className={"w-full flex flex-col gap-3"}>
            <Skeleton className={"mb-4"} height={60} width={500} />
        </div>
    );
};

export default Loading;