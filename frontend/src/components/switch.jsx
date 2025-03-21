import React, { useState, useEffect } from "react";
import { IoMoonOutline, IoSunnyOutline } from "react-icons/io5";
import useStore from "../store";

const ThemeSwitch = () => {
    const { theme, setTheme } = useStore((state) => state);
    const [isDarkMode, setIsDarkMode] = useState(theme === "dark");
    useEffect(() => {
        if (theme === "dark") {
            document.documentElement.classList.add("dark");
        }
        else {
            document.documentElement.classList.remove("dark");
        }
    }, [theme]);
    const toggleTheme = () => {
        const newTheme = isDarkMode ? "light" : "dark";
        setIsDarkMode(!isDarkMode);
        setTheme(newTheme);
        localStorage.setItem("theme", newTheme);
        if (theme === "dark") {
            document.documentElement.classList.add("dark");
        }
        else {
            document.documentElement.classList.remove("dark");
        }
    };
    return (
        <button onClick={toggleTheme} className="outline-none">
            {isDarkMode ? (
                <IoSunnyOutline size={26} className="text-gray-500" />
            ) : (
                <IoMoonOutline size={26} className="" />
            )}
        </button>
    )
}

export default ThemeSwitch;