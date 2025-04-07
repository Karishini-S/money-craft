import React, { useState, useEffect } from "react";
import { LuPencil } from "react-icons/lu";
import EditCategoriesAssets from "../components/editCategoryAssets";
import EditSample from "../components/editSample";

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
    const incomeCategories = ["Salary", "Freelance", "Investments", "Bonus", "Other"];
    const expenseCategories = ["Food", "Transport", "Rent", "Entertainment", "Other"];
    const assetsCategories = ["Cash", "Card", "Other"];

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
                            <option key={index} value={assetName}>{assetName}</option>
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
