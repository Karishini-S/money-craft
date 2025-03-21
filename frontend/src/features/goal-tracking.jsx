import React from "react";

const goals = [
    { id: 1, goal: "Save $5000 for Vacation", progress: 60 },
    { id: 2, goal: "Emergency Fund ($2000)", progress: 40 },
];

const GoalsTracking = () => {
    return (
        <div className="p-4 bg-white dark:bg-gray-900 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold mb-2 text-gray-800 dark:text-white">
                Savings & Goals
            </h2>
            <ul>
                {goals.map((goal) => (
                    <li key={goal.id} className="mb-4">
                        <p className="text-sm text-gray-700 dark:text-gray-300">{goal.goal}</p>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                            <div
                                className="bg-blue-500 h-2.5 rounded-full"
                                style={{ width: `${goal.progress}%` }}
                            ></div>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default GoalsTracking;
