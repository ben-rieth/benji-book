import classNames from "classnames";
import { type FC } from "react";

type LogoProps = {
    size?: 'sm' | 'md';
}

const Logo:FC<LogoProps> = ({ size='md' }) => {

    const logoClasses = classNames(
        "text-sky-500 font-bold",
        {
            "text-xl": size === 'sm',
            "text-3xl" : size === 'md',
        }
    )

    return (
        <span className={logoClasses}>
            benjibook
        </span>
    );
}

export default Logo;