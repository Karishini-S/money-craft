import { Link, Outlet, useLocation } from "react-router-dom";

const tabs = [
    { label: "Profile", path: "/settings/profile" },
    { label: "Delete Account", path: "/settings/delete-account" },
];

const Settings = () => {
    const { pathname } = useLocation();

    return (
        <div className="p-6 space-y-6">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Settings</h2>

            {/* Navigation Tabs */}
            <nav className="flex flex-wrap gap-3 border-b border-gray-300 dark:border-gray-600 pb-2">
                {tabs.map((tab) => (
                    <Link
                        key={tab.path}
                        to={tab.path}
                        className={`text-sm font-semibold px-4 py-2 rounded-xl transition-all duration-200
                            ${pathname === tab.path
                                ? "bg-gradient-to-r from-[#59957b] to-[#456f5c] text-white shadow"
                                : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700"
                            }`}
                    >
                        {tab.label}
                    </Link>
                ))}
            </nav>

            {/* Tab Content */}
            <div className="bg-[#f2ebc6] dark:bg-[#1e293b] p-6 rounded-2xl shadow-lg transition-all animate-fade-in">
                <Outlet />
            </div>
        </div>
    );
};

export default Settings;
