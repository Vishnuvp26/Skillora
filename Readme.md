# Skillora 🧑‍💻💼

Skillora is a modern freelance marketplace and project management platform built with the MERN stack. It connects **Freelancers**, **Clients**, and **Admin** with seamless project collaboration, secure payments (escrow-based), and real-time messaging.

---

## 🚀 Features

- 🔒 JWT-based Role Authentication (Freelancer, Client, Admin)
- 💰 Escrow Wallet System with Refund & Release Logic
- 📦 Project & Contract Management
- 📨 Real-time Chat between Client & Freelancer
- 📄 Proposal & Offer Workflow
- 📈 Admin Dashboard: Revenue, Escrow Tracking, User Management

---

## 🛠 Tech Stack

- **Frontend**: React + Vite + TypeScript + TailwindCSS
- **Backend**: Node.js + Express + TypeScript + MongoDB
- **State Management**: Redux Toolkit
- **Styling**: Tailwind CSS + Shadcn
- **Authentication**: JWT (JSON Web Tokens)
- **Architecture**: Repository Pattern + MVC
- **Others**: Nodemailer, Socket.io, Redis (for OTP)

---

## ⚙️ Getting Started

### 1. Clone the repository and run both servers

```bash
git clone https://github.com/Vishnuvp26/Skillora.git

# Backend Setup
cd Backend
npm install
npm run dev

# Frontend Setup
cd ../Frontend
npm install
npm run dev