export const addGoal = async (goalData) => {
    try {
        const token = localStorage.getItem("token");

        const response = await fetch("http://localhost:5000/api/goals/add", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(goalData),
        });

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Add goal error:", error.message);
        throw error;
    }
};
