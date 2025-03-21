import React, { useState } from "react";

const SetGoal = ({ onSetGoal }) => {
    const [goalName, setGoalName] = useState("");
    const [goalAmount, setGoalAmount] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!goalName || !goalAmount) return;

        const newGoal = {
            id: Date.now(),
            name: goalName,
            amount: parseFloat(goalAmount),
            progress: 0, // Start at 0%
        };

        onSetGoal(newGoal);
        setGoalName("");
        setGoalAmount("");
    };

    return (
        <div className="p-4 bg-white dark:bg-gray-900 rounded-lg shadow-md mb-6">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Set a Savings Goal</h2>
            <form onSubmit={handleSubmit} className="space-y-3 mt-3">
                <input
                    type="text"
                    value={goalName}
                    onChange={(e) => setGoalName(e.target.value)}
                    placeholder="Enter Goal (e.g., Buy a Car)"
                    className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-md"
                    required
                />

                <input
                    type="number"
                    value={goalAmount}
                    onChange={(e) => setGoalAmount(e.target.value)}
                    placeholder="Target Amount ($)"
                    className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-md"
                    required
                />

                <button type="submit" className="w-full py-2 bg-blue-500 text-white rounded-md">Set Goal</button>
            </form>
        </div>
    );
};

export default SetGoal;
