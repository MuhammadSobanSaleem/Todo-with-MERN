require('dotenv').config()
const express = require('express')
const cors = require('cors')
const { connectDB } = require('./config/database.js')
const todoRoutes = require('./router/todoRoutes.js')
const app = express()
const PORT = process.env.PORT || 5000   

// Connect to Database
connectDB()
// Middleware
app.use(cors())
app.use(express.json())
// Routes
app.use(todoRoutes)
// Start Server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})

module.exports = app
