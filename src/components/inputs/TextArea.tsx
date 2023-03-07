import classNames from "classnames";
import type { ChangeEvent, FocusEvent, FC } from "react";

type TextAreaProps = {
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
    onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
    onBlur?: (e: FocusEvent<HTMLTextAreaElement, Element>) => void;
}

const TextArea: FC<TextAreaProps> = ({
    showLabel=true,
    id,
    label,
    required=false,
    placeholder,
    onChange,
    onBlur,
    value,
    disabled=false,
    error,
    touched,
}) => {
    return (
        <div className="flex flex-col mx-auto w-full">
            {showLabel && (
                <label htmlFor={id} className="ml-2">
                    {label}
                    {required && <span className="text-red-500 text-lg">*</span>}
                </label>
            )}
            <textarea
                id={id} 
                placeholder={placeholder}
                onChange={onChange}
                onBlur={onBlur}
                value={value}
                disabled={disabled}
                className={classNames(
                    "border-2 px-2 py-1 outline-none text-base rounded-lg bg-white resize-none",
                    {
                        "focus:border-sky-500": !error && !disabled,
                        "border-red-500": error && touched && !disabled,
                        "bg-slate-300": disabled
                    }
                )}
            />
            {error && touched && !disabled && <p className="ml-2 text-red-500 text-sm">{error}</p>}
        </div>
    )
};

export default TextArea;