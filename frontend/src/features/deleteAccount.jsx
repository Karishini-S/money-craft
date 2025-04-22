import { useNavigate } from "react-router-dom";

const DeleteAccount = () => {
    const navigate = useNavigate();

    const handleDelete = async () => {
        try {
            const res = await fetch("http://localhost:5000/api/user/delete", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });

            if (res.ok) {
                localStorage.removeItem("token");
                navigate("/sign-up");
            } else {
                console.error("Failed to delete account");
            }
        } catch (error) {
            console.error("Error deleting account:", error);
        }
    };

    return (
        <div className="space-y-5">
            <h3 className="text-xl font-bold text-red-700 dark:text-red-400">⚠️ Delete Your Account</h3>
            <p className="text-gray-700 dark:text-gray-300 text-sm">
                This action is <strong>irreversible</strong>. All your data will be permanently lost. Please confirm only if you’re sure.
            </p>
            <button
                onClick={handleDelete}
                className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold px-4 py-2 rounded-md transition-all duration-200 shadow"
            >
                Confirm Delete
            </button>
        </div>
    );
};

export default DeleteAccount;
