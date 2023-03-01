import Logo from "../logo/Logo";
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { AiOutlineMenu } from 'react-icons/ai';
import classNames from "classnames";
import Link from "next/link";
import { signOut } from "next-auth/react";
 
const NavBar = () => {

    const itemClasses = classNames(
        "my-1 hover:text-sky-500",
    )

    return (
        <nav className="flex justify-between bg-white px-5 py-2">
            <Logo size='sm' />
            <DropdownMenu.Root>

                <DropdownMenu.Trigger>
                    <AiOutlineMenu className="w-7 h-7" />
                </DropdownMenu.Trigger>

                <DropdownMenu.Portal>
                    <DropdownMenu.Content sideOffset={10} className="bg-white p-2 w-[50vw] rounded-lg shadow-xl ">
                    <DropdownMenu.Arrow className="fill-white" />
                        <DropdownMenu.Item className={itemClasses}>
                            <Link href="/feed">
                                Feed
                            </Link>
                        </DropdownMenu.Item>

                        <DropdownMenu.Item className={itemClasses}>
                            Account
                        </DropdownMenu.Item>

                        <DropdownMenu.Item className={itemClasses}>
                            Settings
                        </DropdownMenu.Item>

                        <DropdownMenu.Separator className="bg-slate-200 h-px" />

                        <DropdownMenu.Item asChild>
                            <button 
                                className="my-1 text-red-500"
                                onClick={() => signOut()}
                            >
                                Log Out
                            </button>
                        </DropdownMenu.Item>
                    </DropdownMenu.Content>
                </DropdownMenu.Portal>
            </DropdownMenu.Root>
        </nav>
    );
}

export default NavBar;