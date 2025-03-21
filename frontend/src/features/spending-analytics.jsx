import React, { useState } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";

const COLORS = ["#FF6384", "#36A2EB", "#FFCE56", "#4CAF50", "#9C27B0", "#FF9800"];

// Function to generate dynamic colors if categories exceed predefined ones
const generateColor = (index) => `hsl(${(index * 137.5) % 360}, 70%, 50%)`;

const SpendingAnalytics = ({ transactions = [] }) => {
    const [selectedChart, setSelectedChart] = useState("income-expense");
    const MIN_PERCENTAGE = 3; // Categories below 3% of total will be grouped under "Others"

    if (!Array.isArray(transactions) || transactions.length === 0) {
        return (
            <div className="p-6 bg-[#f2ebc6] dark:bg-slate-800 rounded-lg shadow-md transition-all duration-300">
                <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
                    Spending Analytics
                </h2>
                <p className="text-gray-500 dark:text-gray-400">No spending data available.</p>
            </div>
        );
    }

    // 🔹 Calculate Total Income & Expense
    const totalIncome = transactions.filter(txn => txn.amount > 0).reduce((sum, txn) => sum + txn.amount, 0);
    const totalExpense = Math.abs(transactions.filter(txn => txn.amount < 0).reduce((sum, txn) => sum + txn.amount, 0));

    const incomeExpenseData = [
        { name: "Income", value: totalIncome },
        { name: "Expense", value: totalExpense }
    ];

    // 🔹 Group Category-wise Income
    const categoryIncomeData = transactions.filter(txn => txn.amount > 0).reduce((acc, txn) => {
        const existing = acc.find(entry => entry.name === txn.category);
        if (existing) existing.value += txn.amount;
        else acc.push({ name: txn.category, value: txn.amount });
        return acc;
    }, []);

    // 🔹 Group Category-wise Expense
    const categoryExpenseData = transactions.filter(txn => txn.amount < 0).reduce((acc, txn) => {
        const existing = acc.find(entry => entry.name === txn.category);
        if (existing) existing.value += Math.abs(txn.amount);
        else acc.push({ name: txn.category, value: Math.abs(txn.amount) });
        return acc;
    }, []);

    // 🔹 Function to group small categories into "Others"
    const groupSmallCategories = (data) => {
        const total = data.reduce((sum, entry) => sum + entry.value, 0);
        let otherSum = 0;

        const filteredData = data.filter((entry) => {
            const percentage = (entry.value / total) * 100;
            if (percentage < MIN_PERCENTAGE) {
                otherSum += entry.value;
                return false;
            }
            return true;
        });

        if (otherSum > 0) {
            filteredData.push({ name: "Others", value: otherSum });
        }

        return filteredData;
    };

    // 🔹 Select the right dataset for the selected chart
    const getChartData = () => {
        switch (selectedChart) {
            case "income-expense":
                return incomeExpenseData;
            case "category-income":
                return groupSmallCategories(categoryIncomeData);
            case "category-expense":
                return groupSmallCategories(categoryExpenseData);
            default:
                return incomeExpenseData;
        }
    };

    const chartData = getChartData();

    return (
        <div className="p-6 bg-[#f2ebc6] dark:bg-slate-800 rounded-lg shadow-md transition-all duration-300"
        >
            <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
                Spending Analytics
            </h2>

            {/* 🔹 Dropdown to Select Chart Type */}
            <div className="mb-6 flex items-center space-x-4">
                <label htmlFor="chartType" className="text-gray-700 dark:text-gray-300 font-medium">
                    Select Pie Chart:
                </label>
                <select
                    id="chartType"
                    value={selectedChart}
                    onChange={(e) => setSelectedChart(e.target.value)}
                    className="p-1 border rounded-lg dark:bg-gray-800 dark:text-white 
                   text-gray-700 font-medium shadow-sm focus:ring-2 focus:ring-blue-400 
                   transition-all duration-200 hover:shadow-md cursor-pointer"
                >
                    <option value="income-expense">Income vs Expense</option>
                    <option value="category-income">Category-wise Income</option>
                    <option value="category-expense">Category-wise Expense</option>
                </select>
            </div>

            {/* 🔹 Render Pie Chart */}
            <div className="bg-gray-100 dark:bg-gray-800 p-5 rounded-lg shadow-sm">
                <ResponsiveContainer width="100%" height={280}>
                    <PieChart>
                        <Pie
                            data={chartData}
                            dataKey="value"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            outerRadius={100}
                            innerRadius={50}
                            label={({ name, value }) => `${name} (${value})`}
                            animationBegin={0}
                            animationDuration={800}
                        >
                            {chartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={index < COLORS.length ? COLORS[index] : generateColor(index)} />
                            ))}
                        </Pie>
                        <Tooltip
                            contentStyle={{ backgroundColor: "#1e293b", color: "#e5e7eb", borderRadius: "8px" }}
                            formatter={(value) => `$${value.toFixed(2)}`}
                        />
                        <Legend verticalAlign="bottom" align="center" />
                    </PieChart>
                </ResponsiveContainer>
            </div>

            {/* 🔹 Expandable Legend */}
            <div className="mt-4">
                <details className="p-3 rounded-lg dark:bg-gray-800 dark:text-white bg-gray-100 cursor-pointer">
                    <summary className="font-medium">View All Categories</summary>
                    <ul className="mt-2 space-y-2 text-sm">
                        {chartData.map((entry, index) => (
                            <li key={index} className="flex items-center space-x-2">
                                <span
                                    className="inline-block w-3 h-3 rounded-full"
                                    style={{ backgroundColor: index < COLORS.length ? COLORS[index] : generateColor(index) }}
                                ></span>
                                <span>{entry.name}: ${entry.value.toFixed(2)}</span>
                            </li>
                        ))}
                    </ul>
                </details>
            </div>
        </div>
    );
};

export default SpendingAnalytics;
