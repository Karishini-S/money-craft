import React from "react";

const Label = React.forwardRef(({ className, htmlFor, error, children, ...props }, ref) => {
    const classNames = [
        "block text-sm font-medium",
        error ? "text-red-500 dark:text-red-400" : "text-gray-700 dark:text-gray-300",
        className || ""
    ].filter(Boolean).join(" ");

    return (
        <label
            ref={ref}
            htmlFor={htmlFor}
            className={classNames}
            {...props}
        >
            {children}
        </label>
    );
});

Label.displayName = "Label";

export { Label };