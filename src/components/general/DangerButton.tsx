import classNames from "classnames";
import type { ReactNode, FC } from "react";
import Alert from "./Alert";

type DangerButtonProps = {
    onClick?: () => void;
    children: ReactNode;
    type?: 'button' | 'submit' | 'reset'
    disabled?: boolean
    variant?: "filled" | "outline" | "minimal"
}

// eslint-disable-next-line @typescript-eslint/no-empty-function
const DangerButton:FC<DangerButtonProps> = ({ onClick=() => {}, children, type, disabled, variant="filled" }) => {
    const buttonClasses = classNames(
        "py-2 px-2 w-full mx-auto",
        "flex flex-row items-center justify-center gap-2",
        "rounded-lg",
        {
            "bg-red-500 text-white font-semibold": variant === 'filled',
            'text-red-500 border-2 border-red-500': variant === 'outline',
            'text-red-500' : variant === 'minimal',
            'opacity-50': disabled,
            'hover:bg-red-600 active:ring active:ring-sky-600': variant === 'filled' && !disabled,
            'hover:border-red-600 hover:text-red-600' : variant === 'outline' && !disabled,
            'hover:text-red-600': variant === 'minimal' && !disabled,
        },
    );

    return (
        <Alert 
            title="Are you sure?"
            description="This action cannot be undone."
            actionLabel="Deny Request"
            handleAction={onClick}
            trigger={
                <button
                    className={buttonClasses}
                    disabled={disabled}
                    type={type}
                >
                    {children}
                </button>
            }
        />
    )
};  

export default DangerButton;