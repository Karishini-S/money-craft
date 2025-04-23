# 💰 Money-Craft: Gamified Expense Management System

Money-Craft is a gamified expense management system that helps users track income, expenses, transfers, and goals with useful analytics, and fun motivation mechanics. It aims to encourage saving and financial awareness.

---
## 🚀 Features

- 🎯 Expense and income tracking with custom categories and assets  
- 💰 Transfers between assets with real-time balance updates  
- 📊 Visual analytics (pie charts, curves, and summaries)  
- 🎮 Gamified elements like achievements and goal progress tracking  
- 🔐 Secure JWT-based authentication  
- 🌗 Light/Dark mode support  
- 📁 Modular full-stack architecture using React, Tailwind, Node.js, and PostgreSQL
- *(Upcoming)* Compete with friends and track ranks

---

## 🖥️ Tech Stack

- **Frontend**: React, Tailwind CSS
- **Backend**: Node.js, Express.js
- **Database**: PostgreSQL
- **Authentication**: JWT

---

## 📦 Installation

1. Navigate to your preferred directory
2. Clone the repository using

    ```bash
    git clone https://github.com/Karishini-S/money-craft.git
    ```

3. Open the cloned folder in VS Code (likely named money-craft in the directory from Step 1)
4. Open the VS CODE terminal and move into the frontend directory. (Ensure you have [Node.js](https://nodejs.org/) and npm installed)

   ```bash
   cd frontend
   npm install
   ```

5. Update Firebase Configuration  
   Open the file `frontend/src/libs/firebaseConfig.js`  and replace the `firebaseConfig` object with the following:

    ```js
    const firebaseConfig = {
      apiKey: "AIzaSyCctzjInJXsFezn8yPvjdZsj8He5O7y1Gs",
      authDomain: "money-craft-dc62c.firebaseapp.com",
      projectId: "money-craft-dc62c",
      storageBucket: "money-craft-dc62c.firebasestorage.app",
      messagingSenderId: "349273513357",
      appId: "1:349273513357:web:4a83daeb1a5e7f0f93b1c4",
      measurementId: "G-WLPR85BJ43"
    };
    ```
   
6.  Start the frontend server

    ```bash
    npm run dev
    ```

The frontend will run on `http://localhost:5173` (or anyother available port).

7.  Open a **new terminal tab** or **split terminal** and move into the backend directory

    ```bash
    cd ../backend
    npm install
    ```

8. Create a `.env` file in the `backend/` directory with the following content (edit as per your credentials):

    ```env
    DATABASE_URL=postgresql://username:password@localhost:5432/money_craft_db
    JWT_SECRET=your_jwt_secret_key
    PORT=8000
    ```

9. Start the backend server:

    ```bash
    npm start
    ```

The backend will run on `http://localhost:8000`.
