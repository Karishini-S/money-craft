import React from "react";

const achievements = [
    {
        id: 1,
        name: "First Goal Achieved",
        description: "Completed your very first savings goal.",
        points: 50,
        type: "goal",
        difficulty: "beginner",
        unlocked: true,
    },
    {
        id: 2,
        name: "Streak Starter",
        description: "Logged in 7 days in a row.",
        points: 100,
        type: "streak",
        difficulty: "intermediate",
        unlocked: false,
    },
    {
        id: 3,
        name: "Money Master",
        description: "Saved ₹10,000 overall.",
        points: 150,
        type: "milestone",
        difficulty: "advanced",
        unlocked: false,
    },
];

const Achievements = () => {
    return (
        <div className="p-6 max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold mb-6">🎖️ Your Achievements</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {achievements.map((ach) => (
                    <div
                        key={ach.id}
                        className={`p-4 rounded-2xl shadow-md transition-all duration-300 ${ach.unlocked
                                ? "bg-white border-l-4 border-green-500"
                                : "bg-gray-100 opacity-60"
                            }`}
                    >
                        <div className="flex justify-between items-center mb-2">
                            <h3 className="text-lg font-semibold">{ach.name}</h3>
                            <span
                                className={`text-xs px-2 py-0.5 rounded-full ${ach.unlocked ? "bg-green-200 text-green-800" : "bg-gray-300 text-gray-600"
                                    }`}
                            >
                                {ach.unlocked ? "Unlocked" : "Locked"}
                            </span>
                        </div>
                        <p className="text-sm text-gray-700">{ach.description}</p>
                        <div className="mt-4 flex justify-between text-sm">
                            <span className="font-medium">Type: {ach.type}</span>
                            <span className="font-medium">⭐ {ach.points} pts</span>
                        </div>
                        <div className="mt-2 text-xs text-right italic text-gray-500">
                            Difficulty: {ach.difficulty}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Achievements;
