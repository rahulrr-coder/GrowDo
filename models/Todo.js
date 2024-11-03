const mongoose = require('mongoose');

// Define Todo schema
const TodoSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    completed: {
        type: Boolean,
        default: false,
    },
}, { timestamps: true }); // Automatically manage createdAt and updatedAt fields

// Create a model from the schema
const Todo = mongoose.model('Todo', TodoSchema);

module.exports = Todo;
