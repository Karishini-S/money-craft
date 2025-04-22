import React, { useEffect, useState } from "react";

const Profile = () => {
    const [form, setForm] = useState({
        is_private: false,
        ph_no: "",
        age: "",
        country: "",
        time_zone: "",
        language: "",
        currency_type: "",
        avatar: "",
        theme: localStorage.getItem("theme") || "light",
        income_level: "",
    });

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await fetch("http://localhost:5000/api/user/profile", {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                });
                const data = await res.json();
                if (res.ok) {
                    setForm(data.profile);
                    if (data.profile.theme) {
                        localStorage.setItem("theme", data.profile.theme);
                        document.documentElement.classList.toggle("dark", data.profile.theme === "dark");
                    }
                } else throw new Error(data.message || "Failed to load profile");
            } catch (error) {
                setMessage(error.message);
            }
        };
        fetchProfile();
    }, []);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        const newForm = {
            ...form,
            [name]: type === "checkbox" ? checked : value,
        };

        if (name === "theme") {
            localStorage.setItem("theme", value);
            document.documentElement.classList.toggle("dark", value === "dark");
        }

        setForm(newForm);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");

        try {
            const res = await fetch("http://localhost:5000/api/user/profile", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify(form),
            });

            const data = await res.json();
            if (res.ok) {
                setMessage("✅ Profile updated successfully!");
            } else {
                throw new Error(data.message || "Failed to update profile.");
            }
        } catch (error) {
            setMessage(error.message);
        }

        setLoading(false);
    };

    return (
        <div className="bg-[#f2ebc6] dark:bg-[#1e293b] p-8 rounded-2xl shadow-xl max-w-3xl mx-auto space-y-6 transition-all">
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">⚙️ Profile Settings</h2>

            {message && (
                <div className={`text-sm font-medium px-4 py-2 rounded-md ${message.includes("✅") ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                    : "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
                    }`}>
                    {message}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Toggle */}
                <div className="flex justify-between items-center border-b pb-4">
                    <span className="text-gray-800 dark:text-gray-300 font-medium text-sm">Private Profile</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input
                            type="checkbox"
                            className="sr-only peer"
                            name="is_private"
                            checked={form.is_private}
                            onChange={handleChange}
                        />
                        <div className="w-11 h-6 bg-gray-300 dark:bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-green-500 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                    </label>
                </div>

                {/* Grid Input Fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                        { name: "ph_no", label: "Phone Number", type: "text", placeholder: "+91..." },
                        { name: "age", label: "Age", type: "number" },
                        { name: "country", label: "Country", type: "text" },
                        { name: "time_zone", label: "Time Zone", type: "text", placeholder: "UTC+5:30" },
                        { name: "language", label: "Language", type: "text", placeholder: "English" },
                        { name: "currency_type", label: "Currency", type: "text", placeholder: "INR / USD" },
                        { name: "income_level", label: "Income Level", type: "number" },
                    ].map((field) => (
                        <div key={field.name}>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                {field.label}
                            </label>
                            <input
                                name={field.name}
                                type={field.type}
                                value={form[field.name]}
                                onChange={handleChange}
                                placeholder={field.placeholder}
                                className="input-field mt-1 w-full p-2 rounded-md bg-white dark:bg-slate-700 dark:text-white placeholder-gray-400"
                            />
                        </div>
                    ))}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Theme</label>
                        <select
                            name="theme"
                            value={form.theme}
                            onChange={handleChange}
                            className="input-field mt-1 w-full p-2 rounded-md bg-white dark:bg-slate-700 dark:text-white"
                        >
                            <option value="light">Light</option>
                            <option value="dark">Dark</option>
                        </select>
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 bg-gradient-to-r from-[#59957b] to-[#456f5c] text-white text-base font-semibold rounded-xl shadow-lg hover:opacity-90 transition-all"
                >
                    {loading ? "Saving..." : "💾 Save Changes"}
                </button>
            </form>
        </div>
    );
};

export default Profile;
