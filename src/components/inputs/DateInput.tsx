import classNames from "classnames";
import type { ChangeEventHandler } from "react";
import { useState } from "react";

const DateInput = () => {

    const [day, setDay] = useState<string>('');
    const [month, setMonth] = useState<string>('');
    const [year, setYear] = useState<string>('');

    const inputClasses = classNames(
        "border-2 px-2 py-1 outline-none",
        "text-lg rounded-lg bg-white",
        "w-full",
        "focus:border-sky-500"
    );

    const labelClasses = classNames(
        "text-sm ml-2"
    );

    const handleChange : ChangeEventHandler<HTMLInputElement>= (e) => {
        if (!/[0-9]+/.test(e.currentTarget.value) && e.currentTarget.value !== '') {
            return;
        }
        
        if (e.currentTarget.id === 'month') {
            setMonth(e.currentTarget.value);
        } else if (e.currentTarget.id === 'day') {
            setDay(e.currentTarget.value);
        } else if (e.currentTarget.id === 'year') {
            setYear(e.currentTarget.value);
        }

        if (e.currentTarget.id === 'month' && e.currentTarget.value.length === 2) {
            document.getElementById('day')?.focus();
        } else if (e.currentTarget.id === 'day' && e.currentTarget.value.length === 2) {
            document.getElementById('year')?.focus();
        }
    }

    return (
        <div className="flex flex-col w-full border-2 p-1 relative rounded-lg">
            <p className="ml-2">Birthday</p>
            <div className="flex flex-row gap-2">
                <div className="flex flex-col shrink">
                    <label htmlFor="month" className={labelClasses}>Month</label>
                    <input 
                        id="month"
                        type="text" 
                        className={inputClasses} 
                        placeholder="MM"
                        value={month}
                        onChange={handleChange}
                        maxLength={2}
                    />
                </div>
                <div className="flex flex-col shrink">
                    <label htmlFor="day" className={labelClasses}>Day</label>
                    <input 
                        id="day"
                        type="text" 
                        className={inputClasses} 
                        placeholder="DD"
                        value={day}
                        onChange={handleChange}
                        maxLength={2}
                    />
                </div>
                <div className="flex flex-col shrink">
                    <label htmlFor="year" className={labelClasses}>Year</label>
                    <input 
                        id="year"
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