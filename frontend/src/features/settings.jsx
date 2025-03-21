import { Link, Outlet } from "react-router-dom";

const Settings = () => {
    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Settings</h2>
            <nav className="flex space-x-4">
                <Link to="/settings/profile" className="text-blue-500">Profile</Link>
                {/* Add other settings tabs here */}
            </nav>

        </div>
    );
};

export default Settings;
