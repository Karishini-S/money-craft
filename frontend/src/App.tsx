import React, { useEffect, useState } from 'react';
import { Navigate, Outlet, Route, Routes } from 'react-router-dom';
import SignIn from './features/auth/sign-in';
import SignUp from './features/auth/sign-up';
import Dashboard from './features/dashboard';
import Settings from './features/settings';
import Profile from './features/profile';
import Transactions from './features/transactions';
import Leaderboard from './features/leaderboard';
import Achievements from './features/achievements';
import Navbar from './components/navbar';
import useStore from './store';
import { setAuthToken } from './libs/apiCall';
import { Toaster } from 'sonner';
import fetchRecentTransactions from './libs/api/fetchRecentTransaction';
import DeleteAccount from './features/deleteAccount';

const RootLayout = () => {
  const { user } = useStore((state) => state);
  setAuthToken(user?.token || "");
  return !user ? (<Navigate to="/sign-in" replace={true} />) : (
    <>
      <Navbar />
      <div className="min-h-[calc(100vh-100px)]">
        <Outlet />
      </div>
    </>
  );
};

function App() {
  const [transactions, setTransactions] = useState([]);
  useEffect(() => {
    const loadRecentTransactions = async () => {
      const recentData = await fetchRecentTransactions();
      setTransactions(recentData);
    };
    loadRecentTransactions();
  }, []);
  return (
    <main>
      <div className="w-full min-h-screen pt-20 px-6 bg-[#f4f4ed] md:px-20 dark:bg-slate-900">
        <Routes>
          <Route element={<RootLayout />}>
            <Route path="/" element={<Navigate to="/dashboard" />} />
            <Route path="/dashboard" element={<Dashboard transactions={transactions} setTransactions={setTransactions} />} />
            <Route path="/transactions" element={<Transactions transactions={transactions} />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/achievements" element={<Achievements />} />
            <Route path="/settings" element={<Settings />}>
              <Route index element={<Navigate to="profile" replace />} />
              <Route path="profile" element={<Profile />} />
              <Route path="delete-account" element={<DeleteAccount />} />
            </Route>
          </Route>
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/sign-up" element={<SignUp />} />
        </Routes>
      </div>
      <Toaster richColors position="top-center" />
    </main>
  );
}

export default App;
