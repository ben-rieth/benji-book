import { type FC } from "react";

type ErrorBoxProps = {
    message: string;
}

const ErrorBox:FC<ErrorBoxProps> = ({ message }) => {
    return (
        <div className="w-fit bg-red-200 flex items-center justify-center h-fit rounded-lg py-2 px-16 mx-auto">
            <p className="text-red-600 text-lg text-center">{message}</p>
        </div>
    )
};

export default ErrorBox;