import classNames from "classnames";
import type { ChangeEventHandler, FC} from "react";
import { useId} from "react";
import { useEffect} from "react";
import { useState } from "react";
import { getDate, getMonth, getYear, isThisYear,  set } from 'date-fns';

type DateInputProps = {
    onChange: (newDate: Date) => void;
    dateValue: Date;
}

const DateInput:FC<DateInputProps> = ({ onChange, dateValue }) => {

    const [day, setDay] = useState<string>('');
    const [month, setMonth] = useState<string>('');
    const [year, setYear] = useState<string>('');

    const id = useId();

    const [touched, setTouched] = useState<boolean>(false);

    const inputClasses = classNames(
        "border-2 px-2 py-1 outline-none",
        "text-lg rounded-lg bg-white",
        "w-full",
        "focus:border-sky-500"
    );

    const labelClasses = classNames(
        "text-sm ml-2"
    );

    useEffect(() => {
        if (isThisYear(dateValue) || touched) {
            return;
        }

        setDay(getDate(dateValue).toString());
        setMonth((getMonth(dateValue) - 1).toString());
        setYear(getYear(dateValue).toString());

    }, [dateValue, touched])

    const handleChange : ChangeEventHandler<HTMLInputElement> = (e) => {
        if (!touched) setTouched(true);
        
        const value = e.currentTarget.value;
        
        if (!/[0-9]+/.test(value) && value !== '') {
            return;
        }

        if (e.currentTarget.id === `month-${id}`) {
            setMonth(value);
            onChange(set(dateValue, {month: Number(value) - 1}))
        } else if (e.currentTarget.id === `day-${id}`) {
            setDay(e.currentTarget.value);
            onChange(set(dateValue, {date: Number(value)}))
        } else if (e.currentTarget.id === `year-${id}`) {
            setYear(e.currentTarget.value);
            onChange(set(dateValue, {year: Number(value)}))
        }

        if (e.currentTarget.id === `month-${id}` && e.currentTarget.value.length === 2) {
            document.getElementById(`day-${id}`)?.focus();
        } else if (e.currentTarget.id === `day-${id}` && e.currentTarget.value.length === 2) {
            document.getElementById(`year-${id}`)?.focus();
        }
    }

    return (
        <div className="flex flex-col w-full p-1 relative rounded-lg">
            <p className="ml-1">Birthday</p>
            <div className="flex flex-row gap-2">
                <div className="flex flex-col flex-1">
                    <label htmlFor={`month-${id}`} className={labelClasses}>Month</label>
                    <input 
                        id={`month-${id}`}
                        type="text" 
                        className={inputClasses} 
                        placeholder="MM"
                        value={month}
                        onChange={handleChange}
                        maxLength={2}
                    />
                </div>
                <div className="flex flex-col flex-1">
                    <label htmlFor={`day-${id}`} className={labelClasses}>Day</label>
                    <input 
                        id={`day-${id}`}
                        type="text" 
                        className={inputClasses} 
                        placeholder="DD"
                        value={day}
                        onChange={handleChange}
                        maxLength={2}
                    />
                </div>
                <div className="flex flex-col flex-1">
                    <label htmlFor={`year-${id}`} className={labelClasses}>Year</label>
                    <input 
                        id={`year-${id}`}
                        type="text" 
                        className={inputClasses} 
                        placeholder="YYYY"
                        value={year}
                        onChange={handleChange}
                        maxLength={4}
                    />
                </div>
            </div>
        </div>
    )
}

export default DateInput;