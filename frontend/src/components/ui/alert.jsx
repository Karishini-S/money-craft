import React from "react";

// Utility function to combine class names
const cn = (...classes) => {
    return classes.filter(Boolean).join(" ");
};

const Alert = React.forwardRef(({ className, variant = "default", ...props }, ref) => {
    const variantClasses = {
        default: "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200",
        destructive: "border-red-500/50 text-red-600 dark:border-red-400 bg-red-50 dark:bg-red-900/10",
        success: "border-green-500/50 text-green-600 dark:border-green-400 bg-green-50 dark:bg-green-900/10",
        warning: "border-yellow-500/50 text-yellow-600 dark:border-yellow-400 bg-yellow-50 dark:bg-yellow-900/10",
        info: "border-blue-500/50 text-blue-600 dark:border-blue-400 bg-blue-50 dark:bg-blue-900/10"
    };

    return (
        <div
            ref={ref}
            role="alert"
            className={cn(
                "relative w-full rounded-lg border p-4 flex items-start gap-3",
                variantClasses[variant] || variantClasses.default,
                className
            )}
            {...props}
        />
    );
});
Alert.displayName = "Alert";

const AlertTitle = React.forwardRef(({ className, ...props }, ref) => (
    <h5
        ref={ref}
        className={cn("mb-1 font-medium leading-none tracking-tight", className)}
        {...props}
    />
));
AlertTitle.displayName = "AlertTitle";

const AlertDescription = React.forwardRef(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn("text-sm", className)}
        {...props}
    />
));
AlertDescription.displayName = "AlertDescription";

export { Alert, AlertTitle, AlertDescription };