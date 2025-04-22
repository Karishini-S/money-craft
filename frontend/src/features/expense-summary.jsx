import React from "react";

const ExpenseSummary = ({ transactions = [] }) => {
    if (!Array.isArray(transactions)) {
        console.error("ExpenseSummary: transactions is not an array", transactions);
        return <p className="text-red-500">Error: Transactions data is invalid.</p>;
    }

    const totalIncome = transactions
        .filter((txn) => txn.type === 'income')
        .reduce((sum, txn) => sum + Number(txn.amount), 0);

    const totalExpenses = transactions
        .filter((txn) => txn.type === 'expense')
        .reduce((sum, txn) => sum + Math.abs(Number(txn.amount)), 0);

    return (
        <div className="grid grid-cols-3 gap-4 mb-6">
            {/* Income Box */}
            <div className="p-4 rounded-lg shadow-md bg-green-100 text-green-800 border-l-4 border-green-600 dark:bg-slate-800 dark:text-green-300 dark:border-green-400 transition-all duration-300">
                <h3 className="text-m font-medium">Total Income</h3>
                <p className="text-xl font-bold">${totalIncome}</p>
            </div>

            {/* Expense Box */}
            <div className="p-4 rounded-lg shadow-md bg-red-100 text-red-800 border-l-4 border-red-600 dark:bg-slate-800 dark:text-red-300 dark:border-red-400 transition-all duration-300">
                <h3 className="text-m font-medium">Total Expenses</h3>
                <p className="text-xl font-bold">${Math.abs(totalExpenses)}</p>
            </div>

            {/* Balance Box */}
            <div className="p-4 rounded-lg shadow-md bg-blue-100 text-blue-800 border-l-4 border-blue-600 dark:bg-slate-800 dark:text-blue-300 dark:border-blue-400 transition-all duration-300">
                <h3 className="text-m font-medium">Balance</h3>
                <p className="text-xl font-bold">${totalIncome - Math.abs(totalExpenses)}</p>
            </div>
        </div>
    );
};

export default ExpenseSummary;
