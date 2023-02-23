import type { FC, ReactNode } from "react";

type ButtonProps = {
    onClick?: () => void;
    children: ReactNode;
    type?: 'button' | 'submit'
}

const Button: FC<ButtonProps> = ({ onClick , children, type }) => {
    return (
        <button 
            onClick={onClick}
            type={type}
        >
            {children}
        </button>
    )
}

export default Button;