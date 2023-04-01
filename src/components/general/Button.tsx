import classNames from "classnames";
import type { FC, ReactNode, MouseEventHandler } from "react";

type ButtonProps = {
    onClick?: () => void;
    children: ReactNode;
    type?: 'button' | 'submit' | 'reset'
    disabled?: boolean
    variant?: "filled" | "outline" | "minimal"
    as?: "div"
}

const Button: FC<ButtonProps> = ({ onClick, children, type, disabled, variant="filled", as="div"}) => {
    
    const handleClick: MouseEventHandler<HTMLButtonElement> = () => { 
        if (onClick && !disabled) onClick();
    }

    const buttonClasses = classNames(
        "py-2 px-2 w-full mx-auto max-w-md",
        "flex flex-row items-center justify-center gap-2",
        "rounded-lg whitespace-nowrap",
        {
            "bg-sky-500 text-white font-semibold": variant === 'filled',
            'text-sky-500 border-2 border-sky-500': variant === 'outline',
            'text-sky-500' : variant === 'minimal',
            'opacity-50': disabled,
            'hover:bg-sky-600 active:ring active:ring-sky-600': variant === 'filled' && !disabled,
            'hover:border-sky-600 hover:text-sky-600' : variant === 'outline' && !disabled,
            'hover:text-sky-600': variant === 'minimal' && !disabled,
        },
    )

    if (as && as === 'div') {
        return (
            <div
                className={buttonClasses}
                onClick={() => {
                    if (onClick && !disabled) onClick();
                }}
                aria-disabled={!!disabled}
                role="button"
            >
                {children}
            </div>
        )
    }

    return (
        <button 
            className={buttonClasses}
            onClick={handleClick}
            type={type}
            disabled={!!disabled}
        >
            {children}
        </button>
    )
}

export default Button;