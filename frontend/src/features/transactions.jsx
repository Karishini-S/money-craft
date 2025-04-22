import React, { useState } from "react";
import { Button } from "../components/ui/Button"; // update path if needed

const Transactions = ({ transactions = [] }) => {
    const [filter, setFilter] = useState("all");
    const [transactionList, setTransactions] = useState(transactions);

    const filteredTransactions = transactionList.filter((txn) => {
        if (filter === "income") return txn.type === "income";
        if (filter === "expense") return txn.type === "expense";
        return true;
    });

    const handleDelete = async (txnId, type) => {
        try {
            const endpoint = type === "income" ? "delete-income" : "delete-expense";

            const response = await fetch(`http://localhost:5000/api/transaction/${endpoint}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify({ transac_id: txnId }),
            });

            if (response.ok) {
                setTransactions((prev) => prev.filter((txn) => txn.id !== txnId));
            } else {
                console.error("Failed to delete transaction");
            }
        } catch (error) {
            console.error("Delete error:", error);
        }
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">All Transactions</h1>

            {/* Filter Buttons */}
            <div className="flex space-x-4 mb-6">
                {["all", "income", "expense"].map((type) => (
                    <button
                        key={type}
                        className={`px-4 py-2 rounded-full transition-all duration-200 shadow-sm ${filter === type
                                ? "bg-[#59957b] text-white"
                                : "bg-gray-200 text-gray-700 dark:bg-slate-700 dark:text-gray-300 hover:bg-[#59957b] hover:text-white"
                            }`}
                        onClick={() => setFilter(type)}
                    >
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                    </button>
                ))}
            </div>

            {/* Table Style Transactions */}
            <div className="overflow-x-auto rounded-2xl shadow-md">
                <table className="min-w-full table-auto bg-[#f2ebc6] dark:bg-slate-800 text-gray-700 dark:text-gray-300">
                    <thead>
                        <tr className="text-left bg-gray-200 dark:bg-slate-700 text-sm uppercase tracking-wider">
                            <th className="px-4 py-3">Type</th>
                            <th className="px-4 py-3">Category</th>
                            <th className="px-4 py-3">Asset</th>
                            <th className="px-4 py-3 text-right">Amount</th>
                            <th className="px-4 py-3 text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredTransactions.length > 0 ? (
                            filteredTransactions.map((txn) => (
                                <tr key={txn.id} className="border-t border-gray-300 dark:border-slate-600 hover:bg-gray-100 dark:hover:bg-slate-700 transition">
                                    <td className="px-4 py-3 font-semibold">
                                        <span className={txn.type === "income" ? "text-green-600" : "text-red-500"}>
                                            {txn.type.charAt(0).toUpperCase() + txn.type.slice(1)}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">{txn.category}</td>
                                    <td className="px-4 py-3 italic">{txn.asset_name || "Unknown"}</td>
                                    <td className="px-4 py-3 text-right font-semibold">
                                        <span className={txn.type === "expense" ? "text-red-500" : "text-green-500"}>
                                            {txn.type === "expense"
                                                ? `- $${Math.abs(Number(txn.amount)).toFixed(2)}`
                                                : `+ $${Number(txn.amount).toFixed(2)}`}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        <Button
                                            variant="link"
                                            size="sm"
                                            onClick={() => handleDelete(txn.id, txn.type)}
                                            className="text-red-500 hover:text-red-600"
                                        >
                                            Delete
                                        </Button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className="px-4 py-6 text-center text-gray-500 dark:text-gray-400">
                                    No transactions found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Transactions;
