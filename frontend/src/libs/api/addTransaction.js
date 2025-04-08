const addTransaction = async (transaction) => {
    try {
        const response = await fetch("/api/transactions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify(transaction),
        });

        if (!response.ok) throw new Error("Failed to add transaction");

        return { success: true };
    } catch (error) {
        console.error(error);
        return { success: false };
    }
};

export default addTransaction;
