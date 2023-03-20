import Logo from "../logo/Logo";
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import * as NavigationMenu from '@radix-ui/react-navigation-menu';
import {  AiOutlineMenu, AiFillNotification } from 'react-icons/ai';
import { BsChevronDown } from "react-icons/bs";
import classNames from "classnames";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import Button from "../general/Button";
import { useRouter } from "next/router";

const NavBar = () => {

    const itemClasses = classNames(
        "my-1 hover:text-sky-500",
    );

    const { data } = useSession();
    const router = useRouter();

    const logOut = async () => {
        const data = await signOut({ redirect: false, callbackUrl: '/' });
        await router.push(data.url)
    }

    return (
        <nav className="flex justify-between items-center bg-white px-5 py-2">
            <Logo />

            {/* trigger is only visible between md screen size */}
            <div className="flex gap-5 md:hidden">

                <Link href="/activity">
                    <AiFillNotification className="w-7 h-7" />
                </Link>

                <DropdownMenu.Root>
                    <DropdownMenu.Trigger>
                        <AiOutlineMenu className="w-7 h-7" />
                    </DropdownMenu.Trigger>

                    <DropdownMenu.Portal>
                        <DropdownMenu.Content sideOffset={10} className="bg-white py-2 px-5 w-[50vw] sm:w-[30vw] rounded-lg shadow-2xl flex flex-col">
                        <DropdownMenu.Arrow className="fill-white" />
                            <DropdownMenu.Item className={itemClasses} asChild>
                                <Link href="/feed">
                                    Feed
                                </Link>
                            </DropdownMenu.Item>

                            <DropdownMenu.Item className={itemClasses} asChild>
                                <Link href="/posts/create">
                                    Create Post
                                </Link>
                            </DropdownMenu.Item>

                            <DropdownMenu.Item className={itemClasses} asChild>
                                <Link href='/users'>
                                    Search Users
                                </Link>
                            </DropdownMenu.Item>

                            <DropdownMenu.Item className={itemClasses} asChild>
                                <Link href={`/users/${data?.user?.id ?? ''}`}>
                                    Account
                                </Link>
                            </DropdownMenu.Item>

                            <DropdownMenu.Item className={itemClasses} asChild>
                                <Link href={`/users/${data?.user?.id ?? ''}/settings`}>
                                    Settings
                                </Link>
                            </DropdownMenu.Item>

                            <DropdownMenu.Separator className="bg-slate-200 h-px" />

                            <DropdownMenu.Item asChild>
                                <button 
                                    className="my-1 text-red-500 self-start"
                                    onClick={logOut}
                                >
                                    Log Out
                                </button>
                            </DropdownMenu.Item>
                        </DropdownMenu.Content>
                    </DropdownMenu.Portal>
                </DropdownMenu.Root>
            </div>

            {/* visible on md size screens and above */}
            <NavigationMenu.Root className="hidden md:flex md:flex-row">
                <NavigationMenu.List className="flex items-center gap-8">

                    <NavigationMenu.Item>
                        <NavigationMenu.Link asChild>
                            <Link href={`/activity`}>
                                <Button variant="minimal" >Recent Activity</Button>
                            </Link>
                        </NavigationMenu.Link>
                    </NavigationMenu.Item>

                    <NavigationMenu.Item>
                        <NavigationMenu.Link asChild>
                            <Link href={`/posts/create`}>
                                <Button variant="minimal" >Create Post</Button>
                            </Link>
                        </NavigationMenu.Link>
                    </NavigationMenu.Item>

                    <NavigationMenu.Item>
                        <NavigationMenu.Link asChild>
                            <Link href={`/users/`}>
                                <Button variant="minimal" >Search Users</Button>
                            </Link>
                        </NavigationMenu.Link>
                    </NavigationMenu.Item>

                    <NavigationMenu.Item>
                        <NavigationMenu.Trigger asChild>
                            <button className="text-sky-500 hover:text-sky-600 flex flex-row items-center gap-2">
                                Account
                                <BsChevronDown />
                            </button>
                        </NavigationMenu.Trigger>
                        <NavigationMenu.Content className="absolute z-20 bg-white shadow-2xl rounded-lg px-5 py-3 w-1/2 top-14 right-0">
                            <ul className="flex flex-col gap-2">

                                <li>
                                    <NavigationMenu.Link asChild>
                                        <Link href="/feed" className={itemClasses}>
                                            Your Feed
                                        </Link>
                                    </NavigationMenu.Link>
                                </li>

                                <li>
                                    <NavigationMenu.Link asChild>
                                        <Link href={`/users/${data?.user?.id ?? ''}`} className={itemClasses}>
                                            Account Page
                                        </Link>
                                    </NavigationMenu.Link>
                                </li>
                                <li>
                                    <NavigationMenu.Link asChild>
                                        <Link href={`/users/${data?.user?.id ?? ''}/settings`} className={itemClasses}>
                                            Settings
                                        </Link>
                                    </NavigationMenu.Link>
                                </li>
                                <li>
                                    <hr />
                                </li>
                                <li>
                                    <NavigationMenu.Link asChild>
                                        <button 
                                            className="text-red-500 self-start hover:text-red-600 hover:underline"
                                            onClick={logOut}
                                        >
                                            Log Out
                                        </button>
                                    </NavigationMenu.Link>
                                </li>
                            </ul>
                        </NavigationMenu.Content>
                    </NavigationMenu.Item>

                </NavigationMenu.List>
            </NavigationMenu.Root>
        </nav>
    );
}

export default NavBar;