# 📝 Todo-with-MERN

A modern full-stack Todo application built with **React**, **Express**, and **MongoDB**, styled using **Tailwind CSS** for a sleek, responsive UI.

---

## 🚀 Why this project

* ✅ Demonstrates end-to-end MERN stack architecture: database, server, API, and client.
* ✅ Built with best-practices: RESTful API endpoints, stateful frontend logic, and utility-first styling.
* ✅ Easy to extend or adapt as a personal portfolio project or base for larger apps.

---

## 🛠 Features

* Add, edit, delete, and mark tasks as complete.
* User: one-page intuitive UI with React hooks.
* Backend: Express API with MongoDB + Mongoose for persistence.
* Styled with Tailwind CSS for rapid, clean layout and responsiveness.
* Ready for deployment or local development in minutes.

---

## 🔧 Tech Stack

| Layer       | Tech                          |
| ----------- | ----------------------------- |
| Frontend    | React ⚛️ + Tailwind CSS       |
| Backend     | Node.js + Express             |
| Database    | MongoDB + Mongoose            |
| APIs & Auth | RESTful endpoints (todo CRUD) |

---

## 🏁 Quickstart

Clone the repo, install dependencies, and launch both backend and frontend:

```bash
git clone https://github.com/MuhammadSobanSaleem/Todo-with-MERN.git
cd Todo-with-MERN

# backend
cd server
npm install
npm run dev        # starts Express server (e.g. http://localhost:5000)

# frontend
cd ../client
npm install
npm run dev        # starts React app (e.g. http://localhost:5173)
```

> **Note:** Update `VITE_BACKEND_URL` in `.env` to match your backend URL before running the client.

---

## 📦 Folder Structure

```
/server        # Express backend
  ├── routes
  ├── models
  └── ...
/client        # React frontend
  ├── src
  ├── components
  └── ...
```

Everything is grouped logically to follow separation of concerns and clarity.

---

## ✨ What’s next / Possible enhancements

* Add user authentication (JWT, sessions) for multi-user support.
* Implement drag-and-drop task reordering.
* Add categories, deadlines, priorities for tasks.
* Improve UI with animations, dark mode, mobile improvements.
* Deploy to production (e.g. Vercel/Netlify + Mongo Atlas) with CI/CD.

---

## 🙌 Contributing

Contributions are welcome! Fork the repo, make your tweaks or improvements, and open a pull request.
Feel free to raise issues for features or bug fixes.

---

## 📄 License

This project is open source — adapt it, learn from it, and build upon it 💡

---

**Thank you for checking out Todo-with-MERN!**
Clean code. Modern stack. Fast UI.
