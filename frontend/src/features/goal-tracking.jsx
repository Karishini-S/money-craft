import React, { useState, useEffect } from "react";
import fetchGoals from "../libs/api/fetchUserGoal";

const GoalsTracking = () => {
    const [goals, setGoals] = useState([]);

    useEffect(() => {
        const loadGoals = async () => {
            try {
                const data = await fetchGoals();
                setGoals(data);
            } catch (err) {
                console.error("Error loading goals:", err);
            }
        };

        loadGoals();
    }, []);

    return (
        <div className="p-6 bg-[#f2ebc6] dark:bg-[#1e293b] rounded-2xl shadow-md transition-all">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">🎯 Savings & Goals</h2>

            <ul className="space-y-4">
                {goals.length > 0 ? (
                    goals.map((goal) => (
                        <li key={goal.id}>
                            <div className="flex justify-between mb-1">
                                <span className="text-gray-700 dark:text-gray-200 font-medium">{goal.goal}</span>
                                <span className="text-sm text-gray-600 dark:text-gray-400">{goal.progress}%</span>
                            </div>
                            <div className="w-full h-3 bg-gray-300 dark:bg-slate-700 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-[#59957b] to-[#456f5c] transition-all duration-500"
                                    style={{ width: `${goal.progress}%` }}
                                ></div>
                            </div>
                        </li>
                    ))
                ) : (
                    <p className="text-gray-600 dark:text-gray-400 text-sm">No goals set yet.</p>
                )}
            </ul>
        </div>
    );
};

export default GoalsTracking;
