import React from "react";
import { Link } from "react-router-dom";

const LogoBrand = () => {
    return (
        <Link to="/" className="flex items-center gap-2">
            <img
                src="/logo.jpeg"
                alt="App Logo"
                className="w-10 h-10 rounded-xl object-cover scale-150 hover:scale-150 transition-transform"
            />
            <span className="text-sm font-bold text-black dark:text-white">.</span>
            <span className="text-xl font-bold text-black dark:text-white">Money-Craft</span>
        </Link>
    );
};

export default LogoBrand;