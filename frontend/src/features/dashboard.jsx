import React from "react";
import { useNavigate } from "react-router-dom";
import ExpenseSummary from "./expense-summary";
import RecentTransactions from "./recent-transactions";
import SpendingAnalytics from "./spending-analytics";
import GoalsTracking from "./goal-tracking";
import AddTransaction from "./add-transaction";
import SetGoal from "./set-goal";

const Dashboard = ({ transactions, setTransactions }) => {
    const [goals, setGoals] = React.useState([]);
    const [categories, setCategories] = React.useState(["Food", "Rent", "Shopping", "Savings"]);
    const navigate = useNavigate();

    const handleAddTransaction = (transaction) => {
        setTransactions((prev) => [transaction, ...prev]);
    };

    const handleAddCategory = (newCategory) => {
        if (!categories.includes(newCategory)) {
            setCategories((prev) => [...prev, newCategory]);
        }
    };

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
                </div>

                <div className="space-y-6">
                    <SpendingAnalytics transactions={transactions} />
                    <SetGoal onSetGoal={setGoals} />
                    <GoalsTracking goals={goals} />
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
