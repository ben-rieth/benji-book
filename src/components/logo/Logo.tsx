import classNames from "classnames";
import { type FC } from "react";

type LogoProps = {
    size?: 'sm' | 'md';
}

const Logo:FC<LogoProps> = ({ size='md' }) => {

    const logoClasses = classNames(
        "text-sky-500 font-bold text-xl md:text-3xl",
    )

    return (
        <span className={logoClasses}>
            benjibook
        </span>
    );
}

export default Logo;