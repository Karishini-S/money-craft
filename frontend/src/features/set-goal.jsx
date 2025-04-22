import React, { useState } from "react";
import { addGoal } from "../libs/api/addGoal";

const SetGoal = ({ onSetGoal }) => {
    const [goalName, setGoalName] = useState("");
    const [goalAmount, setGoalAmount] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!goalName || !goalAmount) return;

        const newGoal = {
            name: goalName,
            target_amount: parseFloat(goalAmount),
        };

        try {
            const savedGoal = await addGoal(newGoal);
            onSetGoal({ ...savedGoal, name: goalName });
            setGoalName("");
            setGoalAmount("");
        } catch (err) {
            console.error("Error setting goal:", err);
        }
    };

    return (
        <div className="p-6 rounded-2xl shadow-md bg-[#f2ebc6] dark:bg-[#1e293b] transition-all">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">🎯 Set a Savings Goal</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    type="text"
                    value={goalName}
                    onChange={(e) => setGoalName(e.target.value)}
                    placeholder="Goal Name (e.g., Vacation)"
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-slate-800 text-gray-800 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#59957b] transition"
                    required
                />

                <input
                    type="number"
                    value={goalAmount}
                    onChange={(e) => setGoalAmount(e.target.value)}
                    placeholder="Target Amount ($)"
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-slate-800 text-gray-800 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#59957b] transition"
                    required
                />

                <button
                    type="submit"
                    className="w-full py-2 rounded-xl bg-gradient-to-r from-[#59957b] to-[#456f5c] text-white font-semibold hover:brightness-110 transition"
                >
                    Set Goal
                </button>
            </form>
        </div>
    );
};

export default SetGoal;
