import { useState } from "react";

export default function TransferForm({ assets = [] }) {
    const [formData, setFormData] = useState({
        sourceAssetId: "",
        destinationAssetId: "",
        amount: "",
        description: "",
    });

    const [message, setMessage] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch("http://localhost:5000/api/transfers", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (response.ok) {
                setMessage("✅ Transfer successful!");
                setFormData({
                    sourceAssetId: "",
                    destinationAssetId: "",
                    amount: "",
                    description: "",
                });
            } else {
                setMessage(data?.error || "❌ Transfer failed.");
            }
        } catch (error) {
            console.error("Transfer error:", error);
            setMessage("❌ Transfer failed due to network error.");
        }
    };

    return (
        <div className="w-full p-4 bg-[#f2ebc6] dark:bg-[#1e293b] rounded-lg shadow-md transition-all">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Transfer Funds</h2>

            {message && (
                <div className="mb-4 px-4 py-2 rounded-md text-sm font-medium bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300">
                    {message}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-gray-700 dark:text-gray-300 mb-1">Source Asset</label>
                    <select
                        value={formData.sourceAssetId}
                        onChange={(e) =>
                            setFormData({ ...formData, sourceAssetId: e.target.value })
                        }
                        required
                        className="w-full p-2 rounded-md bg-white dark:bg-slate-700 dark:text-white"
                    >
                        <option value="">Select source</option>
                        {assets.map((a) => (
                            <option key={a.asset_id} value={a.asset_id}>
                                {a.asset_name}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-gray-700 dark:text-gray-300 mb-1">Destination Asset</label>
                    <select
                        value={formData.destinationAssetId}
                        onChange={(e) =>
                            setFormData({ ...formData, destinationAssetId: e.target.value })
                        }
                        required
                        className="w-full p-2 rounded-md bg-white dark:bg-slate-700 dark:text-white"
                    >
                        <option value="">Select destination</option>
                        {assets.map((a) => (
                            <option key={a.asset_id} value={a.asset_id}>
                                {a.asset_name}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-gray-700 dark:text-gray-300 mb-1">Amount</label>
                    <input
                        type="number"
                        value={formData.amount}
                        onChange={(e) =>
                            setFormData({ ...formData, amount: e.target.value })
                        }
                        required
                        className="w-full p-2 rounded-md bg-white dark:bg-slate-700 dark:text-white"
                    />
                </div>

                <div>
                    <label className="block text-gray-700 dark:text-gray-300 mb-1">Description</label>
                    <input
                        type="text"
                        value={formData.description}
                        onChange={(e) =>
                            setFormData({ ...formData, description: e.target.value })
                        }
                        className="w-full p-2 rounded-md bg-white dark:bg-slate-700 dark:text-white"
                    />
                </div>

                <button
                    type="submit"
                    className="w-full py-2 text-white font-medium bg-gradient-to-r from-[#59957b] to-[#456f5c] hover:opacity-90 rounded-lg shadow transition"
                >
                    Transfer
                </button>
            </form>
        </div>
    );
}
