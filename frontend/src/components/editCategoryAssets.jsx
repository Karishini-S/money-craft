import React, { useState, useEffect } from "react";

const EditCategoriesAssets = ({
    closeModal,
    userCategories,
    setUserCategories,
    incomeCategories,
    expenseCategories,
    assetCategories,
    setAssetCategories,
}) => {
    const [activeTab, setActiveTab] = useState("categories");
    const [newCategory, setNewCategory] = useState("");
    const [newAsset, setNewAsset] = useState("");
    const [selectedType, setSelectedType] = useState("income");
    const [removedCategories, setRemovedCategories] = useState(() => {
        return JSON.parse(localStorage.getItem("removedCategories")) || { income: [], expense: [], assets: [] };
    });

    // Default categories
    const defaultIncomeCategories = ["Salary", "Freelance", "Investments", "Bonus", "Other"];
    const defaultExpenseCategories = ["Food", "Transport", "Rent", "Entertainment", "Shopping", "Other"];
    const defaultAssetCategories = ["Cash", "Card", "Other"];

    useEffect(() => {
        localStorage.setItem("removedCategories", JSON.stringify(removedCategories));
    }, [removedCategories]);

    // Ensure userCategories is always an object with predefined keys
    const defaultUserCategories = { income: [], expense: [], assets: [] };
    userCategories = userCategories || defaultUserCategories;

    // Function to add income/expense category
    const handleAddCategory = async () => {
        if (!newCategory.trim()) return;

        try {
            const response = await fetch("/api/categories/add", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify({
                    name: newCategory.trim(),
                    type: selectedType,
                }),
            });
            if (response.ok) {
                const data = await response.json();
                setUserCategories((prev) => ({
                    ...prev,
                    [selectedType]: [...(prev[selectedType] || []), data.name],
                }));
                setNewCategory("");
            }
        } catch (error) {
            console.error("Error adding category:", error);
        }
        {/*setUserCategories((prev) => {
            const updatedCategories = {
                ...prev,
                [selectedType]: [...(prev[selectedType] || []), newCategory.trim()],
            };
            localStorage.setItem("userCategories", JSON.stringify(updatedCategories));
            return updatedCategories;
        });

        setNewCategory("");*/}
    };

    // Function to add asset category
    const handleAddAsset = () => {
        if (!newAsset.trim()) return;

        setUserCategories((prev) => {
            const updatedCategories = {
                ...prev,
                assets: [...(prev.assets || []), newAsset.trim()],
            };
            localStorage.setItem("userCategories", JSON.stringify(updatedCategories));
            return updatedCategories;
        });

        setNewAsset("");
    };

    // Function to delete a category (income/expense)
    const handleDeleteCategory = (categoryToDelete) => {
        setUserCategories((prev) => {
            const updatedCategories = {
                ...prev,
                [selectedType]: prev[selectedType].filter((cat) => cat !== categoryToDelete),
            };
            localStorage.setItem("userCategories", JSON.stringify(updatedCategories));
            return updatedCategories;
        });

        const isDefaultCategory =
            (selectedType === "income" && defaultIncomeCategories.includes(categoryToDelete)) ||
            (selectedType === "expense" && defaultExpenseCategories.includes(categoryToDelete));

        if (isDefaultCategory) {
            setRemovedCategories((prev) => {
                const updatedRemoved = {
                    ...prev,
                    [selectedType]: [...prev[selectedType], categoryToDelete],
                };
                localStorage.setItem("removedCategories", JSON.stringify(updatedRemoved));
                return updatedRemoved;
            });
        }
    };

    // Function to delete an asset category
    const handleDeleteAsset = (assetToDelete) => {
        setUserCategories((prev) => {
            const updatedCategories = {
                ...prev,
                assets: prev.assets.filter((cat) => cat !== assetToDelete),
            };
            localStorage.setItem("userCategories", JSON.stringify(updatedCategories));
            return updatedCategories;
        });

        if (defaultAssetCategories.includes(assetToDelete)) {
            setRemovedCategories((prev) => {
                const updatedRemoved = {
                    ...prev,
                    assets: [...prev.assets, assetToDelete],
                };
                localStorage.setItem("removedCategories", JSON.stringify(updatedRemoved));
                return updatedRemoved;
            });
        }
    };

    // Get combined income and expense categories
    const defaultCategories = selectedType === "income" ? defaultIncomeCategories : defaultExpenseCategories;

    const allCategories = [
        ...defaultCategories.filter((cat) => !removedCategories[selectedType]?.includes(cat)),
        ...(userCategories[selectedType] || []),
    ];

    const allAssets = [
        ...defaultAssetCategories.filter((cat) => !(removedCategories.assets || []).includes(cat)),
        ...(userCategories.assets || []),
    ];

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Edit</h2>

            {/* Tab Buttons */}
            <div className="flex gap-4 mb-4">
                <button
                    className={`px-3 py-2 rounded-lg ${activeTab === "categories" ? "bg-blue-600 text-white" : "bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-gray-300"
                        }`}
                    onClick={() => setActiveTab("categories")}
                >
                    Edit Categories
                </button>
                <button
                    className={`px-3 py-2 rounded-lg ${activeTab === "assets" ? "bg-blue-600 text-white" : "bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-gray-300"
                        }`}
                    onClick={() => setActiveTab("assets")}
                >
                    Edit Assets
                </button>
            </div>

            {/* Edit Categories Section */}
            {activeTab === "categories" && (
                <div>
                    <label className="text-gray-700 dark:text-gray-300 block mb-1">Select Type</label>
                    <select
                        value={selectedType}
                        onChange={(e) => setSelectedType(e.target.value)}
                        className="w-full p-2 rounded text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 mb-4"
                    >
                        <option value="income">Income</option>
                        <option value="expense">Expense</option>
                    </select>

                    <label className="text-gray-700 dark:text-gray-300 block mb-1">Add {selectedType} Category</label>
                    <div className="flex items-center gap-2">
                        <input
                            type="text"
                            placeholder={`Enter ${selectedType} name`}
                            value={newCategory}
                            onChange={(e) => setNewCategory(e.target.value)}
                            className="w-full p-2 rounded bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-300"
                        />
                        <button
                            onClick={() => {
                                handleAddCategory();
                            }}
                            className="px-3 py-2 text-white bg-green-600 hover:bg-green-700 rounded-lg"
                        >
                            Add
                        </button>
                    </div>

                    <div className="mt-4">
                        {allCategories.length > 0 ? (
                            allCategories.map((cat, index) => (
                                <div key={index} className="flex justify-between items-center bg-gray-200 dark:bg-gray-700 p-2 rounded-md mb-2">
                                    <span className="text-gray-800 dark:text-gray-300">{cat}</span>
                                    <button onClick={() => handleDeleteCategory(cat)} className="text-red-600 hover:text-red-800">
                                        ✖
                                    </button>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-500 dark:text-gray-400">No categories added.</p>
                        )}
                    </div>
                </div>
            )}

            {/* Edit Assets Section */}
            {activeTab === "assets" && (
                <div>
                    <h3 className="text-gray-700 dark:text-gray-300 mb-2">Asset Categories</h3>

                    <div className="flex items-center gap-2">
                        <input
                            type="text"
                            placeholder="Enter asset name"
                            value={newAsset}
                            onChange={(e) => setNewAsset(e.target.value)}
                            className="w-full p-2 rounded bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-300"
                        />
                        <button onClick={handleAddAsset} className="px-3 py-2 text-white bg-green-600 hover:bg-green-700 rounded-lg">
                            Add
                        </button>
                    </div>

                    <div className="mt-4">{allAssets.map((asset, index) => (
                        <div key={index} className="flex justify-between items-center bg-gray-200 dark:bg-gray-700 p-2 rounded-md mb-2">
                            <span className="text-gray-800 dark:text-gray-300">{asset}</span>
                            <button onClick={() => handleDeleteAsset(asset)} className="text-red-600 hover:text-red-800">✖</button>
                        </div>
                    ))}</div>
                </div>
            )}

            <button onClick={closeModal} className="w-full mt-4 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg">Close</button>
        </div>
    );
};

export default EditCategoriesAssets;
