import React from "react";

const ExpenseSummary = ({ transactions = [] }) => {
    if (!Array.isArray(transactions)) {
        console.error("ExpenseSummary: transactions is not an array", transactions);
        return <p className="text-red-500">Error: Transactions data is invalid.</p>;
    }

    const totalIncome = transactions
        .filter((txn) => txn.amount > 0)
        .reduce((sum, txn) => sum + txn.amount, 0);

    const totalExpenses = transactions
        .filter((txn) => txn.amount < 0)
        .reduce((sum, txn) => sum + txn.amount, 0);

    return (
        <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="p-4 rounded-lg shadow-md bg-[#e5f7ec] text-[#166534] dark:bg-[#1a3c32] dark:text-[#a3e4c0] transition-all duration-300">
                <h3 className="text-m font-medium">Total Income</h3>
                <p className="text-xl font-bold">${totalIncome}</p>
            </div>
            <div className="p-4 rounded-lg shadow-md bg-[#fde8e8] text-[#9b1c1c] dark:bg-[#3c1a1a] dark:text-[#f4a3a3] transition-all duration-300">
                <h3 className="text-m font-medium">Total Expenses</h3>
                <p className="text-xl font-bold">${Math.abs(totalExpenses)}</p>
            </div>
            <div className="p-4 rounded-lg shadow-md bg-[#e0ebf8] text-[#1d4ed8] dark:bg-[#1a2d4c] dark:text-[#a3c4f4] transition-all duration-300">
                <h3 className="text-m font-medium">Balance</h3>
                <p className="text-xl font-bold">${totalIncome + totalExpenses}</p>
            </div>
        </div>
    );
};

export default ExpenseSummary;
