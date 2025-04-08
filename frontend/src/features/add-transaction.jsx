import React, { useState, useEffect } from "react";
import { LuPencil } from "react-icons/lu";
import EditCategoriesAssets from "../components/editCategoryAssets";
import EditSample from "../components/editSample";
import fetchUserCategories from "../libs/api/fetchUserCategories"; // ✅ correct path to frontend API helper

const AddTransaction = ({ onAddTransaction }) => {
    const [transactionType, setTransactionType] = useState("");
    const [amount, setAmount] = useState("");
    const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
    const [asset, setAsset] = useState("");
    const [category, setCategory] = useState("");
    const [userCategories, setUserCategories] = useState({ income: [], expense: [], assets: [] });
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [formError, setFormError] = useState("");

    // Default categories
    const incomeCategories = [];
    const expenseCategories = [];
    const assetsCategories = [];

    const getCategories = () => {
        return transactionType === "income"
            ? [...incomeCategories, ...userCategories.income]
            : transactionType === "expense"
                ? [...expenseCategories, ...userCategories.expense]
                : [];
    };

    const getAssets = () => {
        return [...assetsCategories, ...userCategories.assets];
    };

    useEffect(() => {
        const storedCategories = JSON.parse(localStorage.getItem("userCategories")) || { income: [], expense: [], assets: [] };
        setUserCategories(storedCategories);
        setCategory("");
        setAsset("");
    }, [transactionType]);

    const fetchAllCategories = async () => {
        try {
            const response = await fetch("http://localhost:5000/api/categories/category", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });

            const data = await response.json();

            // Normalize the data structure to handle both array of strings and array of objects
            const normalizeCategories = (categories) => {
                if (!categories) return [];
                return categories.map(cat => typeof cat === 'string' ? cat : cat.cat_name || cat.name || cat);
            };

            return {
                income: normalizeCategories(data.income),
                expense: normalizeCategories(data.expense),
                assets: normalizeCategories(data.assets),
            };

        } catch (error) {
            console.error("Error fetching categories:", error);
            // Return default empty categories in case of error
            return {
                income: [],
                expense: [],
                assets: [],
            };
        }
    };

    const fetchAllAssets = async () => {
        try {
            const response = await fetch("http://localhost:5000/api/assets/asset", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
            const data = await response.json();

            const normalizeAssets = (assets) => {
                if (!assets) return [];
                return assets.map(asset => {
                    return {
                        id: asset.id || asset.asset_id || generateUniqueId(),
                        name: asset.name || asset.asset_name,
                        minBal: asset.minimum_balance || 0
                    };
                });
            };
            return normalizeAssets(data.assets || []);
        } catch (error) {
            console.error("Error fetching assets:", error);
            return [];
        }
    }

    useEffect(() => {
        const loadCategories = async () => {
            const fetchedCategories = await fetchAllCategories();
            const fetchedAssets = await fetchAllAssets();
            setUserCategories({
                income: fetchedCategories.income,
                expense: fetchedCategories.expense,
                assets: fetchedAssets
            });
        };

        loadCategories();
    }, [transactionType]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!transactionType) return setFormError("Please select a transaction type.");
        if (!category) return setFormError("Please select a category.");
        if (!amount) return setFormError("Please enter an amount.");
        if (!date) return setFormError("Please select a date.");
        setFormError(""); // Clear errors when valid

        const numericAmount = parseFloat(amount);
        const finalAmount = transactionType === "income" ? Math.abs(numericAmount) : -Math.abs(numericAmount);

        const newTransaction = {
            id: Date.now(),
            type: transactionType,
            amount: finalAmount,
            date,
            category,
            asset
        };

        onAddTransaction(newTransaction);
        setTransactionType("");
        setAmount("");
        setCategory("");
    };

    return (
        <div className="p-6 bg-[#f2ebc6] dark:bg-slate-800 rounded-lg shadow-md transition-all duration-300 relative">
            <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Add Transaction</h2>

            <button
                onClick={() => setIsEditModalOpen(true)}
                className="absolute top-7 right-6 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white"
            >
                <LuPencil size={20} />
            </button>

            {isEditModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <EditSample
                        closeModal={() => setIsEditModalOpen(false)}
                        userCategories={userCategories}
                        setUserCategories={setUserCategories}
                    />
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">

                {formError && (
                    <div className="text-white text-sm font-medium bg-[#d65a5a] dark:bg-[#924141] p-2 rounded-lg shadow-md animate-fade-in">
                        {formError}
                    </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="text-gray-700 dark:text-gray-300 block mb-1">Transaction Type</label>
                        <select
                            value={transactionType}
                            onChange={(e) => setTransactionType(e.target.value)}
                            className="w-full p-2 rounded text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700"
                        >
                            <option value="" disabled>--Select Transaction Type--</option>
                            <option value="income">Income</option>
                            <option value="expense">Expense</option>
                        </select>
                    </div>

                    <div>
                        <label className="text-gray-700 dark:text-gray-300 block mb-1">Category</label>
                        <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="w-full p-2 rounded text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700"
                            disabled={!transactionType} // Disable if no transaction type is selected
                        >
                            <option value="" disabled>--Select Category--</option>
                            {getCategories().map((cat, index) => (
                                <option key={index} value={cat}>{cat}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div>
                    <label className="text-gray-700 dark:text-gray-300 block mb-1">Asset</label>
                    <select
                        value={asset}
                        onChange={(e) => setAsset(e.target.value)}
                        className="w-full p-2 rounded text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700"
                    >
                        <option value="">--Select Asset--</option>
                        {getAssets().map((assetName, index) => (
                            <option key={assetName.id} value={assetName.name}>{assetName.name}</option>
                        ))}
                    </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="text-gray-700 dark:text-gray-300 block mb-1">Amount</label>
                        <input
                            type="number"
                            placeholder="Enter amount"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            className="w-full text-gray-700 dark:text-gray-300 p-2 rounded bg-white dark:bg-gray-700"
                        />
                    </div>

                    <div>
                        <label className="text-gray-700 dark:text-gray-300 block mb-1">Transaction Date</label>
                        <input
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className="w-full text-gray-700 dark:text-gray-300 p-2 rounded bg-white dark:bg-gray-700"
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    className="w-full px-5 py-2 text-white bg-gradient-to-r from-[#59957b] to-[#456f5c] rounded-lg 
                shadow-md hover:from-[#456f5c] hover:to-[#59957b] transition-transform transform"
                >
                    Add Transaction
                </button>
            </form>
        </div>
    );
};

export default AddTransaction;
