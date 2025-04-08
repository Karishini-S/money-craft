const fetchUserAssets = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
        throw new Error("No token found");
    }

    try {
        const res = await fetch("http://localhost:5000/api/assets/asset", {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
        });

        if (!res.ok) {
        if (res.status === 401) throw new Error("Authentication failed");
        else throw new Error("Route not found");
        }
  
        const data = await res.json();
        return data.assets;
    } catch (error) {
        console.error("Error fetching categories:", error.message);
        throw error;
    }
};
  
export default fetchUserAssets;
  