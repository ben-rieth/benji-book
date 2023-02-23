import classNames from "classnames";
import type { FC, ReactNode } from "react";

type ButtonProps = {
    onClick?: () => void;
    children: ReactNode;
    type?: 'button' | 'submit'
    disabled?: boolean
    variant?: "filled" | "outline" | "minimal"
}

const Button: FC<ButtonProps> = ({ onClick , children, type, disabled, variant="filled" }) => {
    
    const buttonClasses = classNames(
        "py-2 px-3 w-fit mx-auto",
        {
            "bg-sky-500": variant === 'filled',
            'text-sky-500 border-sky-500': variant === 'outline',
            'text-sky-500' : variant === 'minimal',
        }
    );
    
    return (
        <button 
            className={buttonClasses}
            onClick={onClick}
            type={type}
            disabled={!!disabled}
        >
            {children}
        </button>
    )
}

export default Button;