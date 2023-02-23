/* eslint-disable @typescript-eslint/no-misused-promises */
import type { FC, Ref, RefObject } from "react";
import type { ChangeHandler } from "react-hook-form";

type TextInputProps = {
    type: 'text' | 'email';
    label: string;
    id: string;
    placeholder?: string;
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
    ref 
}) => {

    return (
        <div>
            <label htmlFor={id}>{label}</label>
            <input 
                type={type} 
                id={id} 
                placeholder={placeholder}
                onChange={onChange}
                onBlur={onBlur}
                name={name}
                ref={ref as RefObject<HTMLInputElement>}
            />
        </div>
    )

}

export default TextInput;