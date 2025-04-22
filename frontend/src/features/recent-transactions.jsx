import React from "react";
import { useNavigate } from "react-router-dom";

const RecentTransactions = ({ transactions = [] }) => {
    const navigate = useNavigate();
    const recentTxns = transactions.slice(0, 5);

    return (
        <div className="p-4 bg-[#f2ebc6] dark:bg-slate-800 rounded-lg shadow-md mb-6 transition-all duration-300">
            {/* Header Section with Button */}
            <div className="flex justify-between items-center mb-3">
                <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
                    Recent Transactions
                </h2>
                <button
                    onClick={() => navigate("/transactions")}
                    className="px-5 py-2 text-white bg-gradient-to-r from-[#59957b] to-[#456f5c] rounded-lg 
                               shadow-md hover:from-[#456f5c] hover:to-[#59957b] transition-transform 
                               transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#59957b]"
                >
                    View All
                </button>
            </div>

            {/* Transactions List */}
            {recentTxns.length > 0 ? (
                <ul className="divide-y divide-gray-300 dark:divide-gray-600">
                    {recentTxns.map((txn, index) => (
                        <li key={txn.id || index} className="flex justify-between py-2 text-gray-700 dark:text-gray-300">
                            <div>
                                <strong>{txn.type === "income" ? "Income" : "Expense"}</strong> - {txn.category || "Uncategorized"}
                                <div className="text-sm text-gray-500 dark:text-gray-400">via {txn.asset_name || "Unknown Asset"}</div>
                            </div>
                            <span className={txn.type === 'expense' ? "text-[#d65a5a]" : "text-[#59957b]"}>
                                {txn.type === 'expense'
                                    ? `- $${Math.abs(Number(txn.amount)).toFixed(2)}`
                                    : `+ $${Number(txn.amount).toFixed(2)}`}
                            </span>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="text-center text-gray-600 dark:text-gray-400">No recent transactions.</p>
            )}
        </div>
    );
};

export default RecentTransactions;
