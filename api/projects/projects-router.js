const express = require('express');
const Post = require('./projects-model');

const router = express.Router();

router.get('/', (req, res) => {
    Post.get()
        .then(found => {
            res.json(found);
        })
        .catch(err => {
            res.status(500).json({
                message: "The projects information could not be retrieved",
                err: err.message,
                stack: err.stack,
            });
        });
});

router.get('/:id', async (req, res) => {
    try {
        const project = await Post.get(req.params.id);
        if (!project) {
            res.status(404).json({
                message: 'The project with the specified ID does not exist'
            });
        } else {
            res.json(project);
        }
    } catch (err) {
        res.status(500).json({
            message: "The project information could not be retrieved",
            err: err.message,
            stack: err.stack,
        });
    }
});

router.post('/', (req, res) => {
    const { name, description, completed } = req.body;

    if (!name || !description) {
        res.status(400).json({
            message: "Please provide name and description for the project"
        });
    } else {
        // Insert the project into the database
        Post.insert({ name, description, completed })
            .then(newProject => {
                // Respond with the newly created project
                res.status(201).json(newProject);
            })
            .catch(err => {
                res.status(500).json({
                    message: "There was an error while saving the project to the database",
                    err: err.message,
                    stack: err.stack,
                });
            });
    }
});







module.exports = router;
