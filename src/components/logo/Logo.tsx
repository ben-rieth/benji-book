import classNames from "classnames";
import Link from "next/link";
import { type FC } from "react";

type LogoProps = {
    size?: 'sm' | 'md';
    link?: boolean
}

const Logo:FC<LogoProps> = ({ size='md', link=false }) => {

    const logoClasses = classNames(
        "text-sky-500 font-bold text-xl md:text-3xl",
    )

    if (link) {
        return (
            <Link className={logoClasses} href="/feed">
                benjibook
            </Link>
        );
    } else {
        return (
            <span className={logoClasses}>
                benjibook
            </span>
        )
    }

    
}

export default Logo;