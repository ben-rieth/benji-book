import classNames from "classnames";
import type { ChangeEvent, FocusEvent, FC} from "react";

type TextInputProps = {
    type?: 'text' | 'email' | 'search' | 'password';
    label: string;
    showLabel?: boolean
    id: string;
    name: string;
    placeholder?: string;
    required?: boolean;
    value: string;
    error: string | undefined;
    touched: boolean | undefined;
    disabled?: boolean;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
    onBlur?: (e: FocusEvent<HTMLInputElement, Element>) => void;
    leftIcon?: JSX.Element;
    rightIcon?: JSX.Element;
}

const TextInput: FC<TextInputProps> = ({ 
    type="text", 
    label,
    showLabel=true, 
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
        "outline-none w-full text-sm sm:text-base",
        {
            "bg-slate-300": disabled
        }
    )

    const containerClasses = classNames(
        "flex flex-row items-center gap-2",
        "border-2 px-2 py-1 outline-none",
        "text-lg rounded-lg bg-white group",
        {
            "focus-within:border-sky-500": !error && !disabled,
            "border-red-500": error && touched && !disabled,
            "bg-slate-300": disabled
        }
    )

    return (
        <div className="flex flex-col mx-auto w-full">
            {showLabel && (
                <label htmlFor={id} className="ml-2 text-sm sm:text-base">
                    {label}
                    {required && <span className="text-red-500 text-lg">*</span>}
                </label>
            )}
            <div className={containerClasses} id={`${id}-container`}>
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