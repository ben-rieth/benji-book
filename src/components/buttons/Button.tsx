import type { FC, ReactNode } from "react";

type ButtonProps = {
    onClick: () => void;
    children: ReactNode;
}

const Button: FC<ButtonProps> = ({ onClick , children}) => {
    return (
        <button onClick={onClick}>
            {children}
        </button>
    )
}

export default Button;