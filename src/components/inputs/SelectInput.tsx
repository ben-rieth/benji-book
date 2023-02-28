import * as Select from '@radix-ui/react-select';
import classNames from 'classnames';
import { type FC } from 'react';
import { BsChevronDown, BsCheck } from 'react-icons/bs';

type SelectInputProps = {
    label?: string;
    placeholder: string;
    items: { value: string, text: string}[]
    name: string;
    value: string | undefined;
    onChange: (text: string) => void;
}

const SelectInput:FC<SelectInputProps> = ({ label, placeholder, items, name, value, onChange }) => {

    const triggerClasses = classNames(
        "inline-flex flex-row items-center gap-3 justify-between",
        "border-2 px-2 py-1 outline-none text-lg rounded-lg bg-white",
        "w-full",
    );

    const contentClasses = classNames(
        "overflow-hidden shadow-lg rounded-lg bg-white w-[var(--radix-select-trigger-width)]"
    );

    const itemClasses = classNames(
        "text-md leading-none rounded flex items-center h-7 pr-9 pl-7 relative select-none"
    )

    return (
        <div className="flex flex-col mx-auto w-full">
            {label && (
                <label className="ml-2">{label}</label>
            )}
            <Select.Root
                name={name}
                value={value}
                onValueChange={onChange}
            >
                <Select.Trigger className={triggerClasses} aria-label={placeholder}>
                    <Select.Value placeholder={placeholder} />
                    <Select.Icon>
                        <BsChevronDown />
                    </Select.Icon>
                </Select.Trigger>

                <Select.Portal>
                    <Select.Content
                        className={contentClasses}
                        position="popper"
                    >

                        <Select.Viewport>
                            {items.map((item) => (
                                <Select.Item value={item.value} className={itemClasses} key={item.value}>
                                    <Select.ItemText>{item.text}</Select.ItemText>
                                    <Select.ItemIndicator className="absolute left-0 w-7 inline-flex items-center justify-center">
                                        <BsCheck />
                                    </Select.ItemIndicator>
                                </Select.Item>
                            ))}
                        </Select.Viewport>

                    </Select.Content>
                </Select.Portal>
            </Select.Root>
        </div>
    )
}

export default SelectInput;
