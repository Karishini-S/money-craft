import React, { useState } from "react";
import {
    Menu,
    MenuButton,
    MenuItem,
    MenuItems,
} from "@headlessui/react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../libs/firebaseConfig";
import useStore from "../store";
import { IoIosMenu } from "react-icons/io";
import { MdNotifications, MdOutlineKeyboardArrowDown } from "react-icons/md";
import ThemeSwitch from "./switch";
import TransitionWrapper from "./wrappers/transition-wrapper";

const links = [
    { label: "Dashboard", link: "/dashboard" },
    { label: "Transactions", link: "/transactions" },
    { label: "Leaderboard", link: "/leaderboard" },
    { label: "Achievements", link: "/achievements" },
    { label: "Settings", link: "/settings" }
];

const UserMenu = () => {
    const { user, setCredentials } = useStore((state) => state);
    const navigate = useNavigate();

    const handleSignOut = async () => {
        try {
            await signOut(auth);
            localStorage.removeItem("user");
            setCredentials(null);
            navigate("/sign-in");
        } catch (error) {
            console.error("Error signing out", error);
        }
    };

    const profileInitial = user?.firstName || user?.email.charAt(0);

    return (
        <Menu as="div" className="relative">
            <MenuButton className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 dark:hover:bg-opacity-70">
                <div className="flex items-center justify-center w-10 h-10 text-black dark:text-white font-bold uppercase rounded-full bg-[#59957b]">
                    {profileInitial}
                </div>
                <MdOutlineKeyboardArrowDown className="text-xl text-gray-600 dark:text-gray-300" />
            </MenuButton>
            <TransitionWrapper>
                <MenuItems className="absolute right-0 w-56 mt-2 bg-white dark:bg-gray-900 rounded-lg shadow-md divide-y divide-gray-200 dark:divide-gray-700">
                    <div className="p-4">
                        <p className="text-sm text-gray-700 dark:text-gray-300 font-medium">{user?.firstName}</p>
                        <span className="text-xs text-gray-500 dark:text-gray-400">{user?.email}</span>
                    </div>
                    <MenuItem>
                        {() => (
                            <Link to="/settings/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:bg-opacity-70">
                                Profile
                            </Link>
                        )}
                    </MenuItem>
                    <MenuItem>
                        {() => (
                            <button
                                onClick={handleSignOut}
                                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-100 dark:text-red-400 dark:hover:bg-red-700 dark:hover:bg-opacity-70"
                            >
                                Sign Out
                            </button>
                        )}
                    </MenuItem>
                </MenuItems>
            </TransitionWrapper>
        </Menu>
    );
};

const Navbar = () => {
    const { user, setCredentials } = useStore((state) => state);
    const location = useLocation();
    const navigate = useNavigate();
    const [openSidebar, setOpenSidebar] = useState(false);

    const handleSignOut = async () => {
        try {
            await signOut(auth);
            localStorage.removeItem("user");
            setCredentials(null);
            navigate("/sign-in");
        } catch (error) {
            console.error("Error signing out", error);
        }
    };

    return (
        <header className="w-full flex items-center justify-between py-4 px-6 bg-[#f2ebc6] dark:bg-slate-800 shadow-md">
            <Link to="/" className="flex items-center gap-2">
                <img src="logo.jpeg" alt="App Logo" className="w-10 h-10 rounded-xl object-cover scale-150 hover:scale-150" />
                <span className="text-sm font-bold text-black dark:text-white">.</span>
                <span className="text-xl font-bold text-black dark:text-white">Money-Craft</span>
            </Link>

            <nav className="hidden md:flex items-center gap-6">
                {links.map(({ label, link }) => (
                    <Link
                        key={link}
                        to={link}
                        className={`px-4 py-2 rounded-full transition-all duration-200 ${location.pathname === link ?
                            "bg-[#59957b] text-black dark:bg-gray-700 dark:text-white" :
                            "text-gray-700 dark:text-gray-400"} hover:bg-[#59957b] hover:bg-opacity-70 hover:text-black dark:hover:bg-gray-700 dark:hover:bg-opacity-70 dark:hover:text-white`}
                    >
                        {label}
                    </Link>
                ))}
            </nav>

            <div className="hidden md:flex items-center gap-4">
                <MdNotifications size={28} className="text-2xl text-gray-600 dark:text-gray-300 cursor-pointer hover:text-black dark:hover:text-white transition-all duration-200" />
                <ThemeSwitch />
                <UserMenu />
            </div>

            <button className="md:hidden" onClick={() => setOpenSidebar(!openSidebar)}>
                <IoIosMenu className="text-3xl text-gray-700 dark:text-gray-400 hover:text-black dark:hover:text-white transition-all duration-200" />
            </button>
        </header>
    );
};

export default Navbar;
