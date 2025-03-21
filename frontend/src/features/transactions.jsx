import React, { useState } from "react";
import { Link } from "react-router-dom";

const Transactions = ({ transactions = [] }) => {
    const [filter, setFilter] = useState("all");

    // Filter transactions based on transaction type (Income/Expense)
    const filteredTransactions = transactions.filter((txn) => {
        if (filter === "income") return txn.type === "income";
        if (filter === "expense") return txn.type === "expense";
        return true; // Show all transactions
    });

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">All Transactions</h1>

            {/* Filter Buttons */}
            <div className="flex space-x-4 my-4">
                <button
                    className={`px-4 py-2 rounded ${filter === "all" ? "bg-blue-500 text-white" : "bg-gray-300 dark:bg-gray-700"}`}
                    onClick={() => setFilter("all")}
                >
                    All
                </button>
                <button
                    className={`px-4 py-2 rounded ${filter === "income" ? "bg-green-500 text-white" : "bg-gray-300 dark:bg-gray-700"}`}
                    onClick={() => setFilter("income")}
                >
                    Income
                </button>
                <button
                    className={`px-4 py-2 rounded ${filter === "expense" ? "bg-red-500 text-white" : "bg-gray-300 dark:bg-gray-700"}`}
                    onClick={() => setFilter("expense")}
                >
                    Expense
                </button>
            </div>

            {/* Transactions List */}
            <ul className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-900 p-4 rounded-lg shadow-md">
                {filteredTransactions.length > 0 ? (
                    filteredTransactions.map((txn, index) => (
                        <li key={txn.id || index} className="flex justify-between py-2 text-gray-700 dark:text-gray-300">
                            <span>
                                <strong className={txn.type === "income" ? "text-green-600" : "text-red-500"}>
                                    {txn.type.charAt(0).toUpperCase() + txn.type.slice(1)}
                                </strong>{" "}
                                - {txn.category}
                            </span>
                            <span className={txn.amount < 0 ? "text-red-500" : "text-green-500"}>
                                {txn.amount < 0 ? `- $${Math.abs(txn.amount).toFixed(2)}` : `+ $${txn.amount.toFixed(2)}`}
                            </span>
                        </li>
                    ))
                ) : (
                    <p className="text-center text-gray-500">No transactions found.</p>
                )}
            </ul>

            {/* Back to Dashboard */}
            <Link to="/" className="mt-4 inline-block px-4 py-2 bg-blue-500 text-white rounded">
                Back to Dashboard
            </Link>
        </div>
    );
};

export default Transactions;
