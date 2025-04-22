import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useStore from '.././store';
import ExpenseSummary from "./expense-summary";
import RecentTransactions from "./recent-transactions";
import SpendingAnalytics from "./spending-analytics";
import GoalsTracking from "./goal-tracking";
import AddTransaction from "./add-transaction";
import SetGoal from "./set-goal";
import AssetDistributionChart from "./asset-analytics";
import AssetSummary from "./asset-summary";
import fetchUserAssets from "../libs/api/fetchUserAssets";
import fetchRecentTransactions from "../libs/api/fetchRecentTransaction";
import fetchGoals from "../libs/api/fetchUserGoal";
import TransferForm from "./transfer";

const Dashboard = ({ transactions, setTransactions }) => {
    const { user } = useStore((state) => state);
    const [goals, setGoals] = React.useState([]);
    const [assets, setAssets] = useState([]);
    const [categories, setCategories] = React.useState(["Food", "Rent", "Shopping", "Savings"]);
    const navigate = useNavigate();

    const handleAddTransaction = async (transaction) => {
        setTransactions((prev) => [transaction, ...prev]);
        const [updatedAssets, updatedGoals, updatedTransactions] = await Promise.all([
            fetchUserAssets(),
            fetchGoals(),
            fetchRecentTransactions()
        ]);
        setAssets(updatedAssets);
        setGoals(updatedGoals);
        setTransactions(updatedTransactions);
    };

    const handleAddCategory = (newCategory) => {
        if (!categories.includes(newCategory)) {
            setCategories((prev) => [...prev, newCategory]);
        }
    };

    useEffect(() => {
        const loadAssets = async () => {
            try {
                const fetchedAssets = await fetchUserAssets();
                setAssets(fetchedAssets);
            } catch (err) {
                console.error("Error loading assets:", err.message);
            }
        };
        loadAssets();
    }, []);

    useEffect(() => {
        const loadAssetsAndTransactions = async () => {
            if (user) {
                // Fetch user-specific data after login
                const fetchedAssets = await fetchUserAssets();
                const updatedTransactions = await fetchRecentTransactions();
                setAssets(fetchedAssets);
                setTransactions(updatedTransactions);
            }
        };

        loadAssetsAndTransactions();
    }, [user]); // Refetch data whenever the user changes      

    return (
        <div className="p-6 grid gap-6">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Home</h1>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-6">
                    <AddTransaction
                        onAddTransaction={handleAddTransaction}
                        categories={categories}
                        onAddCategory={handleAddCategory}
                    />
                    <ExpenseSummary transactions={transactions} />

                    {/* Recent Transactions with "View All" Button */}
                    <div>
                        <RecentTransactions transactions={transactions} />
                    </div>
                    <TransferForm assets={assets} />
                    <SetGoal onSetGoal={setGoals} />
                    <GoalsTracking goals={goals} />
                </div>

                <div className="space-y-6">
                    <AssetSummary assets={assets} />
                    <SpendingAnalytics transactions={transactions} />
                    {assets.length >= 0 && <AssetDistributionChart assets={assets} />}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
