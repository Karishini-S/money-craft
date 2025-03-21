import React, { useState, useEffect } from "react";

const AddTransaction = ({ onAddTransaction }) => {
    const [transactionType, setTransactionType] = useState("");
    const [amount, setAmount] = useState("");
    const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
    const [category, setCategory] = useState("");
    const [newCategory, setNewCategory] = useState("");
    const [userCategories, setUserCategories] = useState({ income: [], expense: [] });
    const [formError, setFormError] = useState("");

    // Define categories
    const incomeCategories = ["Salary", "Freelance", "Investments", "Bonus", "Other Income"];
    const expenseCategories = ["Food", "Transport", "Rent", "Entertainment", "Shopping", "Other Expense"];

    const getCategories = () => {
        return transactionType === "income"
            ? [...incomeCategories, ...userCategories.income]
            : transactionType === "expense"
                ? [...expenseCategories, ...userCategories.expense]
                : [];
    };

    useEffect(() => {
        const storedCategories = JSON.parse(localStorage.getItem("userCategories")) || { income: [], expense: [] };
        setCategory(""); // Reset category when type changes
    }, [transactionType]);

    const handleAddCategory = () => {
        if (!newCategory.trim()) return;

        setUserCategories((prev) => {
            const updatedCategories = {
                ...prev,
                [transactionType]: [...prev[transactionType], newCategory.trim()],
            };
            localStorage.setItem("userCategories", JSON.stringify(updatedCategories)); // Save to localStorage
            return updatedCategories;
        });

        setNewCategory(""); // Reset input field
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!transactionType) {
            setFormError("Please select a transaction type.");
            return;
        }
        if (!category) {
            setFormError("Please select a category.");
            return;
        }
        if (!amount) {
            setFormError("Please enter an amount.");
            return;
        }
        if (!date) {
            setFormError("Please select a date.");
            return;
        }

        setFormError(""); // Clear error when all fields are valid        

        const numericAmount = parseFloat(amount);
        const finalAmount = transactionType === "income" ? Math.abs(numericAmount) : -Math.abs(numericAmount);

        const newTransaction = {
            id: Date.now(),
            type: transactionType,
            amount: finalAmount,
            date,
            category
        };

        onAddTransaction(newTransaction);

        // Reset form fields
        setTransactionType("");
        setAmount("");
        setCategory("");
    };

    return (
        <div className="p-6 bg-[#f2ebc6] dark:bg-slate-800 rounded-lg shadow-md transition-all duration-300">
            <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Add Transaction</h2>
            <form onSubmit={handleSubmit} className="space-y-4">

                {formError && (
                    <div className="text-white text-sm font-medium bg-[#d65a5a] dark:bg-[#924141] p-2 rounded-lg shadow-md animate-fade-in">
                        {formError}
                    </div>
                )}

                {/* Transaction Type & Category */}
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

                {transactionType && (
                    <div className="flex items-center gap-2">
                        <input
                            type="text"
                            placeholder={`Add new ${transactionType} category`}
                            value={newCategory}
                            onChange={(e) => setNewCategory(e.target.value)}
                            className="w-full text-gray-700 dark:text-gray-300 p-2 rounded bg-white dark:bg-gray-700"
                        />
                        <button
                            type="button"
                            onClick={handleAddCategory}
                            className="px-4 py-2 text-white bg-gradient-to-r from-[#59957b] to-[#456f5c] rounded-lg 
                        shadow-md hover:from-[#456f5c] hover:to-[#59957b] transition-transform transform 
                        focus:outline-none focus:ring-2 focus:ring-[#59957b]"
                        >
                            Add
                        </button>
                    </div>

                )}

                {/* Amount & Date Inputs */}
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
                shadow-md hover:from-[#456f5c] hover:to-[#59957b] transition-transform transform 
                focus:outline-none focus:ring-2 focus:ring-[#59957b]"
                >
                    Add Transaction
                </button>
            </form>
        </div>
    );
};

export default AddTransaction;
