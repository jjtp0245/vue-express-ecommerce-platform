# 🛒 Vue + Express Ecommerce Platform

A full-stack ecommerce web application built with Vue.js (frontend) and Express.js (backend).

---

## 🚀 Features

- Product listing
- Product detail page
- Shopping cart system
- RESTful API with Express
- Modular project structure
- Development environment with Nodemon

---

## 🛠 Tech Stack

### Frontend
- Vue.js
- Vue Router
- Axios

### Backend
- Node.js
- Express.js
- Nodemon (development)

---

## 📦 Installation

Clone the repository:

```bash
git clone https://github.com/jjtp0245/vue-express-ecommerce-platform.git
cd vue-express-ecommerce-platform
```

---

## 💻 Frontend Setup (Client)

```bash
cd client
npm install
npm run dev
```

Frontend runs on:
```
http://localhost:3000
```
(or the port shown in terminal)

---

## 🔧 Backend Setup (Server)

```bash
cd server
npm install
npm install --save-dev nodemon
npm run local
```

Backend runs on:
```
http://localhost:8000
```
(or the port defined in your server config)

---

## 🌱 Environment Variables

Create a `.env.local` file inside the `server` folder if needed:

```
NODE_ENV="local"
PORT=8000

DATABASE_HOST="your_database_host"
DATABASE_NAME="your_database_name"
DATABASE_USER="your_database_user"
DATABASE_PASSWORD="your_database_password"

JWT_KEY="your_secret_key"
```
