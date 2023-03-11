import * as Dialog from '@radix-ui/react-dialog';
import classNames from 'classnames';
import type { FC, ReactNode } from 'react';
import { AiOutlineClose } from 'react-icons/ai';

type ModalProps = {
    children: ReactNode;
    trigger: ReactNode;
    title: string;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

const Modal: FC<ModalProps> = ({ children, trigger, title, open, onOpenChange }) => {
    return (
        <Dialog.Root
            open={open} 
            onOpenChange={onOpenChange}
        >
            <Dialog.Trigger asChild>
                {trigger}
            </Dialog.Trigger>
            <Dialog.Portal>
                <Dialog.Overlay className="bg-black/50 data-[state=open]:animate-overlayShow fixed inset-0" />
                <Dialog.Content 
                    className={classNames(
                        "data-[state=open]:animate-contentShow fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[550px] translate-x-[-50%] translate-y-[-50%]",
                        "bg-white rounded-lg shadow-lg focus:outline-none p-7"
                    )
                }>
                    <Dialog.Title className="font-semibold text-xl text-sky-500">{title}</Dialog.Title>

                    {children}

                    <Dialog.Close asChild>
                        <AiOutlineClose
                            className="fill-red-500 absolute top-5 right-5 w-7 h-7 cursor-pointer hover:fill-red-600 active:bg-red-300 rounded-full p-1"
                        />
                    </Dialog.Close>

                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
    
}

export default Modal;