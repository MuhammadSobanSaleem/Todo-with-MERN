const mongoose = require('mongoose')

/**
 * Todo schema adapted for the client-side TodoApp.
 * - `text` stores the todo text.
 * - `completed` indicates completion state (default: false).
 * - `order` can be used to keep manual ordering (optional).
 * - `priority` / `dueDate` are optional helpful fields.
 * - timestamps adds createdAt / updatedAt.
 */
const todoSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true,
        trim: true
    },
    completed: {
        type: Boolean,
        default: false
    },
    order: {
        type: Number,
        default: 0
    },
    priority: {
        type: String,
        enum: ['low', 'medium', 'high'],
        default: 'medium'
    },
    dueDate: {
        type: Date
    },
    // Keep seller reference optional — update/remove as needed in your app
    seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Seller',
        required: false
    }
}, {
    timestamps: true,
    collection: 'todos'
})

const Todo = mongoose.model('Todo', todoSchema)

module.exports = {
    Todo
}