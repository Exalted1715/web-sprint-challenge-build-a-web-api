// Write your "actions" router here!
const express = require('express');
const router = express.Router();
const actionsMiddleware = require('./actions-middlware')
const Post = require('./actions-model');



router.use(actionsMiddleware.limiter)

router.get('/', async (req, res, next) => {
    try {
        // Fetch all actions from the database
        const actions = await Post.get();
        res.json(actions);
    } catch (err) {
       next(err)
    }
});

router.get('/:id', async (req, res, next) => {
    try {
        // Fetch the action with the specified ID from the database
        const action = await Post.get(req.params.id);
        if (!action) {
            // If no action with the specified ID is found, respond with a 404 status code
            res.status(404).json({
                message: 'The action with the specified ID does not exist'
            });
        } else {
            // Respond with the fetched action
            res.json(action);
        }
    } catch (err) {
      next(err)
    }
});

router.post('/', async (req, res) => {
    const { project_id, description, notes, completed } = req.body;

    // Check if any required field is missing
    if (!project_id || !description || !notes || completed === undefined) {
        return res.status(400).json({
            message: "Please provide project_id, description, notes, and completed status for the action"
        });
    }

    try {
        // Check if the project with the provided project_id exists
        const project = await Post.get(project_id);
        if (!project) {
            return res.status(400).json({
                message: "The project_id provided does not belong to an existing project"
            });
        }

        // Insert the action into the database
        const newAction = await Post.insert({ project_id, description, notes, completed });
        
        // Respond with the newly created action
        res.status(201).json(newAction);
    } catch (err) {
        
        res.status(500).json({
            message: "There was an error while saving the action to the database",
            err: err.message,
            stack: err.stack,
        });
    }
});

router.put('/:id', async (req, res) => {
    const { description, notes, completed } = req.body;
    const actionId = req.params.id;

   
    if (!description || !notes || completed === undefined) {
        return res.status(400).json({
            message: "Please provide description, notes, and completed status for the action"
        });
    }

    try {
        
        const existingAction = await Post.get(actionId);
        if (!existingAction) {
            return res.status(404).json({
                message: "The action with the specified ID does not exist"
            });
        }
        
        const updatedAction = await Post.update(actionId, { description, notes, completed });
        
        // Respond with the updated action
        res.status(200).json(updatedAction);
    } catch (err) {
        // If an error occurs during the database operation, respond with a 500 status code along with the error details
        res.status(500).json({
            message: "The action information could not be updated",
            err: err.message,
            stack: err.stack,
        });
    }
});
router.delete('/:id', async (req, res) => {
    try {
        // Check if the action with the specified ID exists
        const existingAction = await Post.get(req.params.id);
        if (!existingAction) {
            // If the action doesn't exist, respond with 404
            return res.status(404).json({
                message: "The action with the specified ID does not exist"
            });
        } else {
            // Remove the action from the database
            await Post.remove(req.params.id);
            // Respond with no response body
            res.status(204).end();
        }
    } catch (err) {
        // If an error occurs, respond with a 500 status code along with the error details
        res.status(500).json({
            message: "The action could not be removed",
            err: err.message,
            stack: err.stack,
        });
    }
});


module.exports = router;