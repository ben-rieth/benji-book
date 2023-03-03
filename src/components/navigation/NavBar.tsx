import Logo from "../logo/Logo";
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import * as NavigationMenu from '@radix-ui/react-navigation-menu';
import { AiOutlineMenu } from 'react-icons/ai';
import classNames from "classnames";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import Button from "../general/Button";
 
const NavBar = () => {

    const itemClasses = classNames(
        "my-1 hover:text-sky-500",
    );

    const { data } = useSession();

    return (
        <nav className="flex justify-between items-center bg-white px-5 py-2">
            <Logo />

            {/* trigger is only visible between md screen size */}
            <DropdownMenu.Root>
                <DropdownMenu.Trigger>
                    <AiOutlineMenu className="w-7 h-7 md:hidden" />
                </DropdownMenu.Trigger>

                <DropdownMenu.Portal>
                    <DropdownMenu.Content sideOffset={10} className="bg-white py-2 px-5 w-[50vw] rounded-lg shadow-xl flex flex-col">
                    <DropdownMenu.Arrow className="fill-white" />
                        <DropdownMenu.Item className={itemClasses} asChild>
                            <Link href="/feed">
                                Feed
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
                                onClick={() => signOut()}
                            >
                                Log Out
                            </button>
                        </DropdownMenu.Item>
                    </DropdownMenu.Content>
                </DropdownMenu.Portal>
            </DropdownMenu.Root>

            {/* visible on md size screens and above */}
            <NavigationMenu.Root className="hidden md:flex md:flex-row">
                <NavigationMenu.List className="flex items-center gap-8">

                    <NavigationMenu.Item>
                        <NavigationMenu.Link asChild>
                            <Link href="/feed">
                                <Button variant="minimal">Feed</Button>
                            </Link>
                        </NavigationMenu.Link>
                    </NavigationMenu.Item>

                    <NavigationMenu.Item>
                        <NavigationMenu.Link asChild>
                            <Link href={`/users/`}>
                                <Button variant="minimal">Search Users</Button>
                            </Link>
                        </NavigationMenu.Link>
                    </NavigationMenu.Item>

                    <NavigationMenu.Item>
                        <NavigationMenu.Link asChild>
                            <Link href={`/users/${data?.user?.id ?? ''}`}>
                                <Button variant="minimal">Account</Button>
                            </Link>
                        </NavigationMenu.Link>
                    </NavigationMenu.Item>

                    <NavigationMenu.Item>
                        <NavigationMenu.Link asChild>
                            <Link href={`/users/${data?.user?.id ?? ''}/settings`}>
                                <Button variant="minimal">Settings</Button>
                            </Link>
                        </NavigationMenu.Link>
                    </NavigationMenu.Item>

                </NavigationMenu.List>
            </NavigationMenu.Root>
        </nav>
    );
}

export default NavBar;