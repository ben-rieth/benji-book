import classNames from "classnames";
import { type ReactNode, type FC } from "react";
import * as AlertDialog from '@radix-ui/react-alert-dialog';

type AlertProps = {
    title: string;
    description: string;
    actionLabel: string;
    handleAction: () => void;
    children: ReactNode;
}

const Alert: FC<AlertProps> = ({ title, description, actionLabel, children, handleAction }) => {
    return (
        <AlertDialog.Root>
            <AlertDialog.Trigger asChild>
                {children}
            </AlertDialog.Trigger>
            <AlertDialog.Portal>
                <AlertDialog.Overlay className="bg-black/50 data-[state=open]:animate-overlayShow fixed inset-0" />
                
                <AlertDialog.Content className={classNames(
                        "data-[state=open]:animate-contentShow fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[550px] translate-x-[-50%] translate-y-[-50%]",
                        "bg-white rounded-lg shadow-lg focus:outline-none p-7"
                    )}
                >
                    <AlertDialog.Title className="font-semibold text-xl text-black mb-2">{title}</AlertDialog.Title>
                    <AlertDialog.Description className="text-sm mb-5">{description}</AlertDialog.Description>

                    <div className="flex justify-end gap-2 sm:gap-10">
                        <AlertDialog.Cancel asChild>
                            <button className="text-sm sm:text-base text-slate-600 bg-slate-300 hover:text-slate-700 hover:scale-105 rounded-lg px-6 py-2 outline-none focus:shadow-lg">
                                Cancel
                            </button>
                        </AlertDialog.Cancel>
                        <AlertDialog.Action asChild>
                            <button 
                                className="text-sm sm:text-base text-red-600 bg-red-300 hover:scale-105 hover:text-red-700 py-2 rounded-lg px-6 outline-none focus:shadow-lg"
                                onClick={handleAction}
                            >
                                {actionLabel}
                            </button>
                        </AlertDialog.Action>
                    </div>
                </AlertDialog.Content>
            </AlertDialog.Portal>
        </AlertDialog.Root>
    )
}

export default Alert;