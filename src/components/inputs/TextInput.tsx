import classNames from "classnames";
import type { ChangeEvent, FocusEvent, FC, } from "react";

type TextInputProps = {
    type?: 'text' | 'email';
    label: string;
    id: string;
    name: string;
    placeholder?: string;
    required?: boolean;
    value: string;
    error: string | undefined;
    touched: boolean | undefined;
    disabled?: boolean;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
    onBlur: (e: FocusEvent<HTMLInputElement, Element>) => void;
    leftIcon?: JSX.Element;
    rightIcon?: JSX.Element;
}

const TextInput: FC<TextInputProps> = ({ 
    type="text", 
    label, 
    id, 
    placeholder='', 
    required,
    disabled,
    onChange,
    onBlur,
    value,
    error,
    touched,
    leftIcon,
    rightIcon
}) => {

    const inputClasses = classNames(
        "outline-none w-full",
        {
            "bg-slate-300": disabled
        }
    )

    const containerClasses = classNames(
        "flex flex-row items-center gap-2",
        "border-2 px-2 py-1 outline-none",
        "text-lg rounded-lg bg-white",
        {
            "focus:border-sky-500" : !error || !touched && !disabled,
            "border-red-500": error && touched && !disabled,
            "bg-slate-300": disabled
        }
    )

    return (
        <div className="flex flex-col mx-auto w-full">
            <label htmlFor={id} className="ml-2">
                {label}
                {required && <span className="text-red-500 text-lg">*</span>}
            </label>
            <div className={containerClasses}>
                {!!leftIcon && leftIcon}
                <input 
                    className={inputClasses}
                    type={type} 
                    id={id} 
                    placeholder={placeholder}
                    onChange={onChange}
                    onBlur={onBlur}
                    value={value}
                    disabled={disabled}
                />
                {!!rightIcon && rightIcon}
            </div>
            {error && touched && !disabled && <p className="ml-2 text-red-500 text-sm">{error}</p>}
        </div>
    )

}

export default TextInput;