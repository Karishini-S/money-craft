import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const EditSample = ({ closeModal, userCategories, setUserCategories }) => {
    const [activeTab, setActiveTab] = useState("categories");
    const [categoryErrorMessage, setCategoryErrorMessage] = useState("");
    const [assetErrorMessage, setAssetErrorMessage] = useState("");
    const [newCategory, setNewCategory] = useState("");
    const [newAsset, setNewAsset] = useState("");
    const [minBalance, setMinBalance] = useState("");
    const [selectedType, setSelectedType] = useState("income");
    const [removedCategories, setRemovedCategories] = useState(() => {
        return JSON.parse(localStorage.getItem("removedCategories")) || {
            income: [],
            expense: [],
            assets: [],
        };
    });

    //const defaultIncomeCategories = ["Salary", "Freelance", "Investments", "Bonus", "Other"];
    //const defaultExpenseCategories = ["Food", "Transport", "Rent", "Entertainment", "Other"];
    //const defaultAssetCategories = ["Cash", "Card", "Other"];

    /*useEffect(() => {
        const stored = JSON.parse(localStorage.getItem("removedCategories"));
        if (!stored || !stored.income || !stored.expense || !stored.assets) {
            localStorage.setItem(
                "removedCategories",
                JSON.stringify({ income: [], expense: [], assets: [] })
            );
        }
    }, []);*/

    useEffect(() => {
        if (categoryErrorMessage) {
            const timer = setTimeout(() => {
                setCategoryErrorMessage("");
            }, 3000); // Hide after 3 seconds

            return () => clearTimeout(timer); // Cleanup
        }
    }, [categoryErrorMessage]);

    useEffect(() => {
        if (assetErrorMessage) {
            const timer = setTimeout(() => {
                setAssetErrorMessage("");
            }, 3000); // Hide after 3 seconds

            return () => clearTimeout(timer); // Cleanup
        }
    }, [assetErrorMessage]);

    const fetchAllCategories = async () => {
        try {
            const response = await fetch("http://localhost:5000/api/categories/category", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });

            const data = await response.json();

            // Normalize the data structure to handle both array of strings and array of objects
            const normalizeCategories = (categories) => {
                if (!categories) return [];
                return categories.map(cat => typeof cat === 'string' ? cat : cat.cat_name || cat.name || cat);
            };

            return {
                income: normalizeCategories(data.income),
                expense: normalizeCategories(data.expense),
                assets: normalizeCategories(data.assets),
            };

        } catch (error) {
            console.error("Error fetching categories:", error);
            // Return default empty categories in case of error
            return {
                income: [],
                expense: [],
                assets: [],
            };
        }
    };

    const fetchAllAssets = async () => {
        try {
            const response = await fetch("http://localhost:5000/api/assets/asset", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
            const data = await response.json();

            const normalizeAssets = (assets) => {
                if (!assets) return [];
                return assets.map(asset => {
                    return {
                        id: asset.id || asset.asset_id || generateUniqueId(),
                        name: asset.name || asset.asset_name,
                        minBal: asset.minimum_balance || 0
                    };
                });
            };
            return normalizeAssets(data.assets || []);
        } catch (error) {
            console.error("Error fetching assets:", error);
            return [];
        }
    }

    useEffect(() => {
        const loadCategories = async () => {
            const categories = await fetchAllCategories();
            setUserCategories(categories);
        };

        loadCategories();
    }, []);

    useEffect(() => {
        const loadAssets = async () => {
            const assets = await fetchAllAssets();
            setUserCategories(prev => ({
                ...prev,
                assets: assets,
            }));
        };

        loadAssets();
    }, []);

    const defaultUserCategories = { income: [], expense: [], assets: [] };
    userCategories = userCategories || defaultUserCategories;

    const handleAddCategory = async () => {
        if (!newCategory.trim()) return;
        try {
            const response = await fetch("http://localhost:5000/api/categories/add", {
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
                    [selectedType]: [...(prev[selectedType] || []), data.cat_name],
                }));
                setNewCategory("");
            }
            const updatedCategories = await fetchAllCategories();
            setUserCategories(updatedCategories);
        } catch (error) {
            console.error("Error adding category:", error);
        }
        /*setUserCategories((prev) => {
            const updated = {
                ...prev,
                [selectedType]: [...(prev[selectedType] || []), newCategory.trim()],
            };
            localStorage.setItem("userCategories", JSON.stringify(updated));
            return updated;
        });
        setNewCategory("");*/
    };

    const handleAddAsset = async () => {
        if (!newAsset.trim()) return;
        const minBalToSend = minBalance || 0;
        try {
            const response = await fetch("http://localhost:5000/api/assets/add", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify({
                    name: newAsset.trim(),
                    minBal: minBalToSend,
                }),
            });
            if (response.ok) {
                /*const data = await response.json();
                setUserCategories((prev) => ({
                    ...prev,
                    assets: [...(prev.assets || []), data.name],
                }));*/
                const updatedAssets = await fetchAllAssets();
                setUserCategories(prev => ({
                    ...prev,
                    assets: updatedAssets,
                }));
                setNewAsset("");
                setMinBalance("");
            }
        } catch (error) {
            console.error("Error adding asset:", error);
        }
        /*setUserCategories((prev) => {
            const updated = {
                ...prev,
                assets: [...(prev.assets || []), newAsset.trim()],
            };
            localStorage.setItem("userCategories", JSON.stringify(updated));
            return updated;
        });
        setNewAsset("");*/
    };

    const handleDeleteCategory = async (categoryToDelete) => {
        try {
            const response = await fetch("http://localhost:5000/api/categories/delete", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify({
                    name: categoryToDelete,
                    type: selectedType,
                }),
            });
            if (response.ok) {
                setUserCategories((prev) => ({
                    ...prev,
                    [selectedType]: prev[selectedType].filter((cat) => cat !== categoryToDelete),
                }));
            }
            const updatedCategories = await fetchAllCategories();
            setUserCategories(updatedCategories);
        } catch (error) {
            console.error("Error deleting category:", error);
        }
        /*const isDefault =
            (selectedType === "income" && defaultIncomeCategories.includes(categoryToDelete)) ||
            (selectedType === "expense" && defaultExpenseCategories.includes(categoryToDelete)); // if needed

        if (isDefault) {
            setCategoryErrorMessage(`"${categoryToDelete}" is a default category and cannot be deleted.`);
            return;
        }

        setUserCategories((prev) => {
            const updated = {
                ...prev,
                [selectedType]: prev[selectedType].filter((cat) => cat !== categoryToDelete),
            };
            localStorage.setItem("userCategories", JSON.stringify(updated));
            return updated;
        });*/
    };

    const handleDeleteAsset = async (assetToDelete) => {
        try {
            const result = await fetch("http://localhost:5000/api/assets/delete", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify({
                    name: assetToDelete,
                }),
            });
            if (result.ok) {
                const updatedAssets = await fetchAllAssets();
                setUserCategories((prev) => ({
                    ...prev,
                    assets: updatedAssets,
                }));
            }
        } catch (error) {
            console.error("Error deleting asset:", error);
        }
        /*const isDefault = defaultAssetCategories.includes(assetToDelete);

        if (isDefault) {
            setAssetErrorMessage(`"${assetToDelete}" is a default category and cannot be deleted.`);
            return;
        }
        setUserCategories((prev) => {
            const updated = {
                ...prev,
                assets: prev.assets.filter((cat) => cat !== assetToDelete),
            };
            localStorage.setItem("userCategories", JSON.stringify(updated));
            return updated;
        });

        if (defaultAssetCategories.includes(assetToDelete)) {
            setRemovedCategories((prev) => {
                const updated = {
                    ...prev,
                    assets: [...prev.assets, assetToDelete],
                };
                localStorage.setItem("removedCategories", JSON.stringify(updated));
                return updated;
            });
        }*/
    };

    /*const defaultCategories =
        selectedType === "income" ? defaultIncomeCategories : defaultExpenseCategories;*/

    /*const allCategories = [
        ...(defaultCategories.filter((cat) =>
            Array.isArray(removedCategories[selectedType])
                ? !removedCategories[selectedType].includes(cat)
                : true
        )),
        ...(userCategories[selectedType] || []),
    ];*/
    const allCategories = [
        ...(userCategories[selectedType] || []),
    ];

    const allAssets = [
        //...defaultAssetCategories.filter((cat) => !(removedCategories.assets || []).includes(cat)),
        ...(userCategories.assets || []),
    ];

    console.log("User categories:", userCategories);
    console.log("allCategories", allCategories);
    console.log("allAssets:", allAssets);

    return (
        <AnimatePresence mode="wait">
            <motion.div
                key="edit-modal"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className="bg-[#f2ebc6] dark:bg-gray-800 p-6 rounded-lg shadow-lg w-[30rem] h-[80vh] flex flex-col"
            >
                <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Edit</h2>

                {/* Tabs */}
                <div className="flex gap-4 mb-4">
                    {["categories", "assets"].map((tab) => (
                        <motion.button
                            key={tab}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className={`px-4 py-2 rounded-full transition-all duration-200 
                            ${activeTab === tab ? "bg-[#59957b] text-black dark:bg-gray-700 dark:text-white" :
                                    "text-gray-700 dark:text-gray-400"}
                            hover:bg-[#59957b] hover:bg-opacity-70 hover:text-black dark:hover:bg-gray-700 dark:hover:bg-opacity-70 dark:hover:text-white`}
                            onClick={() => setActiveTab(tab)}
                        >
                            {tab.charAt(0).toUpperCase() + tab.slice(1)}
                        </motion.button>
                    ))}
                </div>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto pr-1">
                    {activeTab === "categories" && (
                        <motion.div
                            key="categories"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            transition={{ duration: 0.4 }}
                            className="flex flex-col gap-2"
                        >
                            <label className="text-gray-700 dark:text-gray-300">Select Type</label>
                            <select
                                value={selectedType}
                                onChange={(e) => setSelectedType(e.target.value)}
                                className="w-full p-2 rounded text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700"
                            >
                                <option value="income">Income</option>
                                <option value="expense">Expense</option>
                            </select>

                            <label className="text-gray-700 dark:text-gray-300">Add {selectedType} Category</label>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    placeholder={`Enter ${selectedType} name`}
                                    value={newCategory}
                                    onChange={(e) => setNewCategory(e.target.value)}
                                    className="flex-1 p-2 rounded bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-300"
                                />
                                <motion.button
                                    whileTap={{ scale: 0.95 }}
                                    onClick={handleAddCategory}
                                    className="px-3 py-2 text-white bg-gradient-to-r from-[#59957b] to-[#456f5c] rounded-lg 
                                        shadow-md hover:from-[#456f5c] hover:to-[#59957b]"
                                >
                                    Add
                                </motion.button>
                            </div>

                            <div className="grid grid-cols-2 gap-2 mt-4 overflow-y-auto max-h-40 pr-1">
                                <AnimatePresence>
                                    {allCategories.length > 0 ? (
                                        allCategories.map((cat) => (
                                            <motion.div
                                                key={`${selectedType}-${cat.cat_id}`}
                                                initial={{ opacity: 0, scale: 0.95 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                exit={{ opacity: 0, scale: 0.95 }}
                                                className="flex justify-between items-center bg-[#e6a395] dark:bg-gray-700 p-2 rounded-md"
                                            >
                                                <span className="truncate text-gray-800 dark:text-gray-300">{cat}</span>
                                                <X
                                                    size={20}
                                                    color="#cd5e48"
                                                    className="cursor-pointer hover:opacity-80"
                                                    onClick={() => handleDeleteCategory(cat)}
                                                />
                                            </motion.div>
                                        ))
                                    ) : (
                                        <p className="text-gray-500 dark:text-gray-400">No categories added.</p>
                                    )}
                                </AnimatePresence>
                            </div>
                            {categoryErrorMessage && (
                                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-2">
                                    {categoryErrorMessage}
                                </div>
                            )}
                        </motion.div>
                    )}

                    {activeTab === "assets" && (
                        <motion.div
                            key="assets"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.4 }}
                            className="flex flex-col gap-2"
                        >
                            <div className="flex gap-4">
                                <div className="flex-1">
                                    <label className="text-gray-700 dark:text-gray-300">Add Asset</label>
                                    <input
                                        type="text"
                                        placeholder="Enter asset name"
                                        value={newAsset}
                                        onChange={(e) => setNewAsset(e.target.value)}
                                        className="p-2 rounded bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-300"
                                    />
                                </div>

                                <div className="flex-1">
                                    <label className="text-gray-700 dark:text-gray-300">Minimum Balance</label>
                                    <input
                                        type="number"
                                        placeholder="Enter minimum balance"
                                        value={minBalance}
                                        onChange={(e) => setMinBalance(e.target.value)}
                                        className="p-2 rounded bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-300"
                                    />
                                </div>
                            </div>

                            <motion.button
                                whileTap={{ scale: 0.95 }}
                                onClick={handleAddAsset}
                                className="mt-2 px-3 py-2 text-white bg-gradient-to-r from-[#59957b] to-[#456f5c] rounded-lg 
                                    shadow-md hover:from-[#456f5c] hover:to-[#59957b]"
                            >
                                Add Asset
                            </motion.button>

                            <div className="grid grid-cols-2 gap-2 mt-4 overflow-y-auto max-h-64 pr-1">
                                <AnimatePresence>
                                    {allAssets.length > 0 ? (
                                        allAssets.map((asset) => (
                                            <motion.div
                                                key={asset.id} // Fallback to name if no id exists
                                                initial={{ opacity: 0, scale: 0.95 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                exit={{ opacity: 0, scale: 0.95 }}
                                                className="flex justify-between items-center bg-[#e6a395] dark:bg-gray-700 p-2 rounded-md"
                                            >
                                                <span className="truncate text-gray-800 dark:text-gray-300">
                                                    {asset.name}
                                                </span>
                                                <X
                                                    size={20}
                                                    color="#cd5e48"
                                                    className="cursor-pointer hover:opacity-80"
                                                    onClick={() => handleDeleteAsset(asset.name)}
                                                />
                                            </motion.div>
                                        ))
                                    ) : (
                                        <p className="text-gray-500 dark:text-gray-400">No assets added.</p>
                                    )}
                                </AnimatePresence>
                            </div>

                            {assetErrorMessage && (
                                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-2">
                                    {assetErrorMessage}
                                </div>
                            )}
                        </motion.div>
                    )}
                </div>

                {/* Close Button */}
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={closeModal}
                    className="mt-4 px-4 py-2 w-full text-white bg-gradient-to-r from-[#59957b] to-[#456f5c] rounded-lg 
                        shadow-md hover:from-[#456f5c] hover:to-[#59957b]"
                >
                    Close
                </motion.button>
            </motion.div>
        </AnimatePresence>
    );
};

export default EditSample;
