# 🔐 Express Auth Playground

A modern, robust authentication system built with **Node.js (Express)** for the backend and **Next.js** for the frontend. This project demonstrates secure user authentication flows, including **Two-Factor Authentication (2FA)**, secure password hashing, and session management.

## 🚀 Tech Stack

### Backend
- **Runtime**: [Node.js](https://nodejs.org/)
- **Framework**: [Express.js](https://expressjs.com/)
- **Database**: [MongoDB](https://www.mongodb.com/) with [Mongoose](https://mongoosejs.com/)
- **Security**: 
  - `bcrypt` for password hashing
  - `crypto` for UUIDs and random code generation
  - `cors` for Cross-Origin Resource Sharing
- **Tools**: `dotenv` for environment variables, `nodemon` for hot reloading

### Frontend
- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) & [Shadcn UI](https://ui.shadcn.com/) (assumed based on component structure)
- **State Management**: React Hooks (`useState`, `useEffect`)

---

## ✨ Features

- **User Registration**: Secure account creation with hashed passwords.
- **User Login**: Standard email/password authentication.
- **Two-Factor Authentication (2FA)**:
  - Generates a time-sensitive 6-digit code upon valid login.
  - Verifies code before granting full access.
  - Rate limiting (max 3 attempts).
  - Expiration timer (code valid for 60 seconds).
- **Error Handling**: Centralized error management system.
- **Architecture**: Modular structure separating controllers, routers, models, and shared services.

---

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v18+ recommended)
- MongoDB (Local or Atlas URI)
- npm or yarn

### 1. Clone the Repository
```bash
git clone <repository_url>
cd express_auth
```

### 2. Backend Setup
Navigate to the backend directory and install dependencies:
```bash
cd backend
npm install
```

Create a `.env.local` file in the `backend` directory:
```env
PORT=4000
MONGODB_URI=mongodb://localhost:27017/express_auth_db # Or your Atlas URI
# Add any other secrets here
```

Start the backend server:
```bash
npm run dev
# Server should run on http://localhost:4000
```

### 3. Frontend Setup
Navigate to the frontend directory and install dependencies:
```bash
cd ../frontend
npm install
```

Start the frontend development server:
```bash
npm run dev
# App should run on http://localhost:3000
```

---

## 📡 API Endpoints

The backend exposes the following RESTful endpoints under the `/auth` prefix:

| Method | Endpoint | Description | Body Parameters |
| :--- | :--- | :--- | :--- |
| `POST` | `/auth/register` | Register a new user | `{ fullName, email, password }` |
| `POST` | `/auth/login` | Login user & generate 2FA | `{ email, password }` |
| `POST` | `/auth/verify-2fa` | Verify 2FA code | `{ code, twoFactorId }` |

---

## 📂 Project Structure

```
express_auth/
├── backend/                # Express Server
│   ├── modules/            # Domain modules (Auth, etc.)
│   ├── models/             # Mongoose Models
│   ├── shared/             # Shared utilities (Encryption, Errors)
│   └── index.js            # Entry point
│
└── frontend/               # Next.js Application
    ├── app/                # App Router pages
    ├── components/         # React Components
    └── lib/                # Utilities
```

## 🤝 Contributing
Feel free to submit issues and enhancement requests.

## 📄 License
[MIT](https://choosealicense.com/licenses/mit/)
