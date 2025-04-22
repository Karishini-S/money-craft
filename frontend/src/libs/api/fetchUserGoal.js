const fetchGoals = async () => {
    const token = localStorage.getItem("token");

    const res = await fetch("http://localhost:5000/api/goals/user-goals", {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (!res.ok) throw new Error("Failed to fetch goals");
    const data = await res.json();
    return data.goals;
};

export default fetchGoals;
