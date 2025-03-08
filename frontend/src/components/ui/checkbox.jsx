import React, { forwardRef, useState } from 'react';

const Checkbox = forwardRef(({ className, id, disabled, onChange, ...props }, ref) => {
    const [checked, setChecked] = useState(props.defaultChecked || false);

    const handleChange = (e) => {
        setChecked(e.target.checked);
        if (onChange) {
            onChange(e);
        }
    };

    const classNames = [
        "h-4 w-4 rounded border-gray-300 text-violet-600 focus:ring-violet-500 dark:border-gray-700 dark:bg-gray-800",
        disabled ? "cursor-not-allowed opacity-50" : "",
        className || ""
    ].filter(Boolean).join(" ");

    return (
        <input
            type="checkbox"
            ref={ref}
            id={id}
            disabled={disabled}
            checked={props.checked !== undefined ? props.checked : checked}
            onChange={handleChange}
            className={classNames}
            {...props}
        />
    );
});

Checkbox.displayName = "Checkbox";

export { Checkbox };