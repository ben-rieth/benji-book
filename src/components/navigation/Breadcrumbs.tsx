import Link from "next/link";
import type { Key } from "react";
import { type FC, Fragment } from "react";

type BreadcrumbLinkProps = {
    title: string;
    href?: string;
}

const BreadcrumbsLink:FC<BreadcrumbLinkProps> = ({ title, href }) => {
    return (
        <li className="dark:text-slate-400 text-slate-600 text-lg" key={title.toLowerCase()}>
            {href ? (
                <Link 
                    href={href} 
                    className="hover:underline"
                >
                    {title}
                </Link>
            ) : (
                <span>{title}</span>
            )}
        </li>
    )
}

type BreadcrumbProps = {
    children: JSX.Element[];
}

const Breadcrumbs:FC<BreadcrumbProps> = ({ children }) => {

    return (
        <ul className="flex gap-2">
            {children.map((link, index) => {
                if (index === 0) return link;

                return (
                    <Fragment key={`id-${link.key as Key}`}>
                        <span>&gt;</span>
                        {link}
                    </Fragment>
                )

            })}
        </ul>   
    )
}

export {
    Breadcrumbs as Root,
    BreadcrumbsLink as Link
}