import classNames from "classnames";
import type { ChangeEvent, FocusEvent, FC, } from "react";

type TextInputProps = {
    type: 'text' | 'email';
    label: string;
    id: string;
    name: string;
    placeholder?: string;
    required?: boolean;
    value: string;
    error?: string;
    touched?: boolean
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
    onBlur: (e: FocusEvent<HTMLInputElement, Element>) => void;
    leftIcon?: JSX.Element;
    rightIcon?: JSX.Element;
}

const TextInput: FC<TextInputProps> = ({ 
    type, 
    label, 
    id, 
    placeholder='', 
    required,
    onChange,
    onBlur,
    value,
    error,
    touched,
    leftIcon,
    rightIcon
}) => {

    const inputClasses = classNames(
        "outline-none",
    )

    const containerClasses = classNames(
        "flex flex-row items-center gap-2",
        "border-2 px-2 py-1 outline-none",
        "w-fit text-lg rounded-lg",
        {
            "focus:border-sky-500" : !error || !touched,
            "border-red-500": error && touched
        }
    )

    return (
        <div className="flex flex-col">
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
                />
                {!!rightIcon && rightIcon}
            </div>
            {error && touched && <p className="ml-2 text-red-500 text-sm">{error}</p>}
        </div>
    )

}

export default TextInput;