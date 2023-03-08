import classNames from "classnames";
import type { ReactNode, FC } from "react";
import * as AlertDialog from '@radix-ui/react-alert-dialog';

type DangerButtonProps = {
    onClick?: () => void;
    children: ReactNode;
    type?: 'button' | 'submit' | 'reset'
    disabled?: boolean
    variant?: "filled" | "outline" | "minimal"
}

const DangerButton:FC<DangerButtonProps> = ({ onClick , children, type, disabled, variant="filled"}) => {
    const buttonClasses = classNames(
        "py-2 px-2 w-full mx-auto",
        "flex flex-row items-center justify-center gap-2",
        "rounded-lg",
        {
            "bg-red-500 text-white font-semibold": variant === 'filled',
            'text-red-500 border-2 border-red-500': variant === 'outline',
            'text-red-500' : variant === 'minimal',
            'opacity-50': disabled,
            'hover:bg-red-600 active:ring active:ring-sky-600': variant === 'filled' && !disabled,
            'hover:border-red-600 hover:text-red-600' : variant === 'outline' && !disabled,
            'hover:text-red-600': variant === 'minimal' && !disabled,
        },
    );
    
    return (
        <AlertDialog.Root>
            <AlertDialog.Trigger asChild>
                <button 
                    className={buttonClasses}
                    type={type}
                    disabled={!!disabled}
                >
                    {children}
                </button>
            </AlertDialog.Trigger>
            <AlertDialog.Portal>
                <AlertDialog.Overlay className="bg-black/50 data-[state=open]:animate-overlayShow fixed inset-0" />
                
                <AlertDialog.Content>
                    <AlertDialog.Title className="font-semibold text-xl text-black">Are you sure?</AlertDialog.Title>
                    <AlertDialog.Description className="text-sm">This action cannot be undone.</AlertDialog.Description>

                    <div className="flex justify-end gap-10">
                        <AlertDialog.Cancel asChild>
                            <button className="text-slate-300 bg-slate-600 hover:bg-slate-500 px-4 outline-none focus:shadow-lg">

                            </button>
                        </AlertDialog.Cancel>
                        <AlertDialog.Action className={buttonClasses} onClick={onClick}>
                            {children}
                        </AlertDialog.Action>
                    </div>
                </AlertDialog.Content>
            </AlertDialog.Portal>
        </AlertDialog.Root>
    )
};  

export default DangerButton;