import type { FC, Ref, RefObject } from "react";
import type { ChangeHandler } from "react-hook-form";

type TextInputProps = {
    type: 'text' | 'email';
    label: string;
    id: string;
    placeholder?: string;
    required?: boolean;
    error: string | undefined;
    onChange: ChangeHandler | (() => void);
    onBlur: ChangeHandler | (() => void);
    name: string;
    ref?: Ref<HTMLElement>
}

const TextInput: FC<TextInputProps> = ({ 
    type, 
    label, 
    id, 
    placeholder='', 
    onChange, 
    onBlur, 
    name, 
    ref,
    error,
    required
}) => {

    return (
        <div className="flex flex-col">
            <label htmlFor={id}>
                {label}
                {!required && <span className="text-red-500 text-lg">*</span>}
            </label>
            <input 
                className="border-2 w-fit px-2 py-1 text-lg rounded outline-none focus:ring focus:ring-sky-500"
                type={type} 
                id={id} 
                placeholder={placeholder}
                onChange={onChange}
                onBlur={onBlur}
                name={name}
                ref={ref as RefObject<HTMLInputElement>}
            />
            <p>{error}</p>
        </div>
    )

}

export default TextInput;