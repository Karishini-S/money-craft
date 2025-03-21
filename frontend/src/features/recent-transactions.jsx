import React from "react";
import { useNavigate } from "react-router-dom";

const RecentTransactions = ({ transactions = [] }) => {
    const navigate = useNavigate();
    const recentTxns = transactions.slice(0, 5);

    return (
        <div className="p-4 bg-white dark:bg-gray-900 rounded-lg shadow-md mb-6">
            {/* Header Section with Button */}
            <div className="flex justify-between items-center mb-3">
                <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
                    Recent Transactions
                </h2>
                <button
                    onClick={() => navigate("/transactions")}
                    className="px-5 py-2 text-white bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg 
                               shadow-md hover:from-indigo-600 hover:to-blue-500 transition-transform 
                               transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-300"
                >
                    View All
                </button>
            </div>

            {/* Transactions List */}
            {recentTxns.length > 0 ? (
                <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                    {recentTxns.map((txn, index) => (
                        <li key={txn.id || index} className="flex justify-between py-2 text-gray-700 dark:text-gray-300">
                            <span>
                                <strong>{txn.type === "income" ? "Income" : "Expense"}</strong> - {txn.category || "Uncategorized"}
                            </span>
                            <span className={txn.amount < 0 ? "text-red-500" : "text-green-500"}>
                                {txn.amount < 0 ? `- $${Math.abs(txn.amount).toFixed(2)}` : `+ $${txn.amount.toFixed(2)}`}
                            </span>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="text-center text-gray-500">No recent transactions.</p>
            )}
        </div>
    );
};

export default RecentTransactions;
