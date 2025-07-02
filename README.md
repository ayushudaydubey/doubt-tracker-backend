# 📚 Doubt Tracker App

A full-stack web application that allows **students** to post academic doubts and **mentors** to respond with solutions. Built using **React** for the frontend and **Node.js + Express + MongoDB** for the backend.

---

## 🚀 Tech Stack

### 🔧 Backend (Node.js + Express)

- **Authentication** – JWT (JSON Web Tokens)
- **Database** – MongoDB + Mongoose
- **File Upload** – ImageKit + Multer
- **Validation** – express-validator
- **Security** – bcryptjs (password hashing)
- **Rate Limiting** – express-rate-limit
- **Environment Config** – dotenv
- **CORS** – Configured for frontend & backend communication

### 💻 Frontend (React)

- React with Tailwind CSS
- React Hook Form
- React Toastify
- Axios
- React Router

---

## 📂 Project Structure
📦 project-root
├── frontend/ # React App (student & mentor interfaces)
├── backend/
│ ├── src/
│ │ ├── routes/ # Express routes
│ │ ├── controllers/ # Route logic
│ │ ├── models/ # Mongoose models
│ │ ├── middleware/ # Auth, error handling, rate limiting
│ │ ├── config/ # DB connection, ImageKit setup
│ │ └── utils/ # Helper functions
│ ├── server.js # Entry point
│ └── .env # Environment variables


💻 Frontend Setup

1. Navigate to Frontend Folder
bash
Copy
Edit
cd ../frontend
2. Install Dependencies
bash
Copy
Edit
npm install
3. Configure API Endpoint
In your .env file in the frontend root:

env
Copy
Edit
port = http://localhost:3000

4. Run Frontend
bash
Copy
Edit
npm run dev

🔐 Roles & Features

👨‍🎓 Students

Register/Login

Create doubts (with optional image)

View mentor responses

Edit/Delete doubts (until resolved)

🧑‍🏫 Mentors
Register/Login

View assigned or available doubts

Respond to doubts

View student profiles

📌 Deployment
Backend
Hosted on: Render

Base URL: https://doubt-tracker-backend.onrender.com

Frontend
Hosted on: Vercel

Live App: https://doubt-tracker-frontend.vercel.app

🛡️ Security & Middleware
Passwords hashed using bcryptjs

JWT-based authentication for routes

Rate limiting with express-rate-limit

Input validation via express-validator

Secure file handling with multer and ImageKit CDN

📄 License
This project is licensed under the MIT License.

🙌 Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.


