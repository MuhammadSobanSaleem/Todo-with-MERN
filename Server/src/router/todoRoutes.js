const express = require('express')
const mongoose = require('mongoose')
const router = express.Router()

const { Todo } = require('../model/todoSchema') // Model exported as { Todo }

/**
 * Routes:
 * GET    /api/todos                - list all todos (incomplete first)
 * POST   /api/todos                - create a new todo
 * GET    /api/todos/:id            - get single todo
 * PUT    /api/todos/:id            - update todo fields (text, priority, dueDate, order)
 * PATCH  /api/todos/:id/completed  - set/toggle completed and adjust ordering
 * PUT    /api/todos/reorder        - bulk reorder (accepts array [{ id, order }])
 * DELETE /api/todos/:id            - delete a todo
 */

/* helper */
function isValidId(id) {
    return mongoose.Types.ObjectId.isValid(id)
}

/* GET all todos (incomplete first, then by order/createdAt) */
router.get('/api/todos', async (req, res) => {
    try {
        const todos = await Todo.find({})
            .sort({ completed: 1, order: 1, createdAt: 1 })
            .lean()
        res.json({ success: true, todos })
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server error', error: err.message })
    }
})

/* POST create todo */
router.post('/api/todos', async (req, res) => {
    try {
        const { text, priority, dueDate } = req.body
        if (!text || typeof text !== 'string' || text.trim() === '') {
            return res.status(400).json({ success: false, message: 'Text is required' })
        }

        // compute next order -> place new (incomplete) items after other incompletes
        const maxOrderDoc = await Todo.findOne({}).sort('-order').select('order').lean()
        const nextOrder = maxOrderDoc ? (maxOrderDoc.order || 0) + 1 : 1

        const todo = await Todo.create({
            text: text.trim(),
            completed: false,
            order: nextOrder,
            priority,
            dueDate
        })

        res.status(201).json({ success: true, todo })
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server error', error: err.message })
    }
})

/* GET single todo */
router.get('/api/todos/:id', async (req, res) => {
    try {
        const { id } = req.params
        if (!isValidId(id)) return res.status(400).json({ success: false, message: 'Invalid id' })

        const todo = await Todo.findById(id).lean()
        if (!todo) return res.status(404).json({ success: false, message: 'Todo not found' })

        res.json({ success: true, todo })
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server error', error: err.message })
    }
})

/* PUT update todo fields (text, priority, dueDate, order) */
router.put('/api/todos/:id', async (req, res) => {
    try {
        const { id } = req.params
        if (!isValidId(id)) return res.status(400).json({ success: false, message: 'Invalid id' })

        const { text, priority, dueDate, order } = req.body
        const update = {}
        if (typeof text === 'string') update.text = text.trim()
        if (priority) update.priority = priority
        if (dueDate) update.dueDate = dueDate
        if (typeof order === 'number') update.order = order

        const updated = await Todo.findByIdAndUpdate(id, { $set: update }, { new: true })
        if (!updated) return res.status(404).json({ success: false, message: 'Todo not found' })

        res.json({ success: true, todo: updated })
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server error', error: err.message })
    }
})

/* PATCH toggle/set completed and adjust ordering (move completed to bottom) */
router.patch('/api/todos/:id/completed', async (req, res) => {
    try {
        const { id } = req.params
        if (!isValidId(id)) return res.status(400).json({ success: false, message: 'Invalid id' })

        const { completed } = req.body // optional boolean; if omitted, toggle
        const todo = await Todo.findById(id)
        if (!todo) return res.status(404).json({ success: false, message: 'Todo not found' })

        const newCompleted = typeof completed === 'boolean' ? completed : !todo.completed

        // If marking completed -> move to bottom by giving highest order + 1
        if (newCompleted) {
            const maxOrderDoc = await Todo.findOne({}).sort('-order').select('order').lean()
            const nextOrder = maxOrderDoc ? (maxOrderDoc.order || 0) + 1 : 1
            todo.order = nextOrder
            todo.completed = true
        } else {
            // marking incomplete -> move toward top; set order smaller than current smallest
            const minOrderDoc = await Todo.findOne({}).sort('order').select('order').lean()
            const nextOrder = minOrderDoc ? (minOrderDoc.order || 0) - 1 : 0
            todo.order = nextOrder
            todo.completed = false
        }

        await todo.save()
        // Return full list so client can re-render in order, or return updated todo only
        const todos = await Todo.find({}).sort({ completed: 1, order: 1, createdAt: 1 }).lean()
        res.json({ success: true, todo, todos })
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server error', error: err.message })
    }
})



/* DELETE todo */
router.delete('/api/todos/:id', async (req, res) => {
    try {
        const { id } = req.params
        if (!isValidId(id)) return res.status(400).json({ success: false, message: 'Invalid id' })

        const deleted = await Todo.findByIdAndDelete(id)
        if (!deleted) return res.status(404).json({ success: false, message: 'Todo not found' })

        res.json({ success: true, message: 'Todo deleted', todo: deleted })
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server error', error: err.message })
    }
})

module.exports = router