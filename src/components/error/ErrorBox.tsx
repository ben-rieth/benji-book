import { type FC } from "react";

type ErrorBoxProps = {
    message: string;
}

const ErrorBox:FC<ErrorBoxProps> = ({ message }) => {
    return (
        <div className="w-full bg-red-200 flex items-center justify-center h-fit rounded-lg py-2">
            <p className="text-red-600 text-lg">{message}</p>
        </div>
    )
};

export default ErrorBox;