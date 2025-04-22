import React from "react";
import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    ResponsiveContainer,
    Legend,
} from "recharts";

const COLORS = ["#FF6384", "#36A2EB", "#FFCE56", "#4CAF50", "#9C27B0", "#FF9800"];
const generateColor = (index) =>
    `hsl(${(index * 137.5) % 360}, 70%, 50%)`;

const AssetDistributionChart = ({ assets = [] }) => {
    const isDarkMode = localStorage.getItem("theme") === "dark";
    const allZeroBalance = assets.every(asset => Number(asset.current_balance) === 0);

    if (!Array.isArray(assets) || assets.length === 0 || allZeroBalance) {
        return (
            <div className="p-6 bg-[#f2ebc6] dark:bg-slate-800 rounded-lg shadow-md transition-all duration-300">
                <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
                    Asset Distribution
                </h2>
                <p className="text-gray-500 dark:text-gray-400">
                    No asset data available. Add a transaction to get started!
                </p>
            </div>
        );
    }

    const chartData = assets.map((asset) => ({
        name: asset.asset_name || asset.name || "Unnamed Asset",
        value: Number(asset.current_balance || 0),
    }));

    return (
        <div className="p-6 bg-[#f2ebc6] dark:bg-slate-800 rounded-lg shadow-md transition-all duration-300">
            <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
                Asset Distribution
            </h2>

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
                            label={({ name, value }) => `${name} (${value.toFixed(2)})`}
                            animationBegin={0}
                            animationDuration={800}
                        >
                            {chartData.map((entry, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={
                                        index < COLORS.length
                                            ? COLORS[index]
                                            : generateColor(index)
                                    }
                                />
                            ))}
                        </Pie>
                        <Tooltip
                            contentStyle={{
                                backgroundColor: isDarkMode ? "#1e293b" : "#ffffff",
                                color: isDarkMode ? "#e5e7eb" : "#1e293b",
                                borderRadius: "8px",
                                border: "1px solid #ccc",
                            }}
                            formatter={(value) => `$${value.toFixed(2)}`}
                        />
                        <Legend verticalAlign="bottom" align="center" />
                    </PieChart>
                </ResponsiveContainer>
            </div>

            <div className="mt-4">
                <details className="p-3 rounded-lg dark:bg-gray-800 dark:text-white bg-gray-100 cursor-pointer">
                    <summary className="font-medium">View All Assets</summary>
                    <ul className="mt-2 space-y-2 text-sm">
                        {chartData.map((entry, index) => (
                            <li key={index} className="flex items-center space-x-2">
                                <span
                                    className="inline-block w-3 h-3 rounded-full"
                                    style={{
                                        backgroundColor:
                                            index < COLORS.length
                                                ? COLORS[index]
                                                : generateColor(index),
                                    }}
                                ></span>
                                <span>
                                    {entry.name}: ${Number(entry.value).toFixed(2)}
                                </span>
                            </li>
                        ))}
                    </ul>
                </details>
            </div>
        </div>
    );
};

export default AssetDistributionChart;
