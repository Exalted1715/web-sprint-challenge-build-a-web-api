// Write your "projects" router here!
const express = require('express')
const Post = require('./projects-model')

const router = express.Router()

router.get('/', (req, res) => {
    Post.get()
        .then (found => {
         // Check if found array is empty
         if (found.length === 0) {
            // Respond with an empty array
            res.json([]);
        } else {
            // Respond with the found projects
            res.json(found);
        }
        }) 
        .catch(err => {
            res.status(500).json({
                message:"The posts information could not be retrieved",
                err:err.message,
                stack: err.stack,
            })
        })
})






















module.exports = router