const express = require('express');
require('dotenv').config()
const cors = require('cors')

const server = express();

server.use(express.json())
server.use(cors())

//const {logger} = require('./actions/actions-middlware')
//server.use(logger)

// Configure your server here
// Build your actions router in /api/actions/actions-router.js
// Build your projects router in /api/projects/projects-router.js
// Do NOT `server.listen()` inside this file!





server.get('/api/hello', (req, res)=> {
    res.json({
        message: 'api is working'
    })
})



server.use('*',(req, res) => {
    res.send(`<h1>Hello, there!</h1>`)
})

server.use((err, req,res, next)=>{ //eslint-disable-line
    res.status(500).json({
        message: err.message,
        stack: err.stack,
    })
})





module.exports = server;
