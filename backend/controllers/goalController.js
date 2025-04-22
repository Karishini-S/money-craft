import { createUserGoal, getUserGoal } from "../models/goalModel.js";

export const createGoal = async (req, res) => {
    const userId = req.user.userId;
    const { name, target_amount } = req.body;
    try {
        const result = await createUserGoal(userId, name, target_amount);
        res.status(200).json({ message: "Goal added successfully" });
    } catch (error) {
        console.error("Error creating goal:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const getGoals = async (req, res) => {
    const userId = req.user.userId;
    try {
        const { rows } = await getUserGoal(userId);

        const formattedGoals = rows.map(g => ({
            id: g.id,
            goal: g.goal,
            progress: Math.min(Math.round((g.current_amount / g.target_amount) * 100), 100),
        }));

        res.status(200).json({ goals: formattedGoals });
    } catch (err) {
        console.error("Get goals error:", err);
        res.status(500).json({ error: "Failed to fetch goals" });
    }
};
