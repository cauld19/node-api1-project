const express = require('express');

const db = require('./data/db');

const server = express();

server.listen(5000, () => {
    console.log('listening on port 5000');
})

// global middleware

server.use(express.json());

server.get('/api/users', (req, res) => {
    db.find()
    .then(users => {
        res.status(200).json(users);
    })
    .catch(err => {
        err.status(500).json({ error: "The users information could not be retrieved." })
    })
})

server.post('/api/users', (req, res) => {
    const user = req.body;
    
    if (!user.name || !user.bio ) {
        res.status(400).json({ errorMessage: "Please provide name and bio for the user." })
    } else {
        db.insert(user)
            .then(user => {
                res.status(201).json(user);
            })
            .catch(err => {
                res.status(500).json({ error: "There was an error while saving the user to the database" })
            })
    }
})
