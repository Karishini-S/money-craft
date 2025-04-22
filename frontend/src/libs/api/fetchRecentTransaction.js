// src/libs/api/fetchRecentTransactions.js
const fetchRecentTransactions = async () => {
    try {
        const response = await fetch("http://localhost:5000/api/transactions/recent", {
            method: "GET",
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        });

        const data = await response.json();
        return data.transactions || [];
    } catch (error) {
        console.error("Failed to fetch recent transactions:", error);
        return [];
    }
};

export default fetchRecentTransactions;