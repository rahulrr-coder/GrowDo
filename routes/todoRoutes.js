const express = require('express');
const Todo = require('../models/Todo');
const router = express.Router();

// Create a new todo
router.post('/todos', async (req, res) => {
    try {
        const todo = new Todo(req.body);
        await todo.save();
        res.status(201).send(todo);
    } catch (error) {
        res.status(400).send(error);
    }
});

// Get all todos
router.get('/todos', async (req, res) => {
    try {
        const todos = await Todo.find();
        res.send(todos);
    } catch (error) {
        res.status(500).send(error);
    }
});

// Update a todo
router.patch('/todos/:id', async (req, res) => {
    try {
        const todo = await Todo.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!todo) return res.status(404).send();
        res.send(todo);
    } catch (error) {
        res.status(400).send(error);
    }
});

// Delete a todo
router.delete('/todos/:id', async (req, res) => {
    try {
        const todo = await Todo.findByIdAndDelete(req.params.id);
        if (!todo) return res.status(404).send();
        res.send(todo);
    } catch (error) {
        res.status(500).send(error);
    }
});

module.exports = router;
