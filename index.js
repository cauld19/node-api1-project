const express = require('express');

const db = require('./data/db');

const server = express();

server.listen(5000, () => {
    console.log('listening on port 5000');
})

// global middleware

server.use(express.json());

//

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

server.get('/api/users/:id', (req, res) => {
    const {id} = req.params;

    db.findById(id)
        .then(user => {
            if (user) {
                res.status(200).json(user);
            } else {
                res.status(404).json({ message: "The user with the specified ID does not exist." });
            }
        })
        .catch(err => {
            res.status(500).json({ error: "The user information could not be retrieved." });
        })
})


server.delete('/api/users/:id', (req, res) => {
    const {id} = req.params;

    db.remove(id)
        .then(user => {
            if(user) {
                res.status(204).end();
            } else {
                res.status(404).json({ message: "The user with the specified ID does not exist." });
            }
        })
        .catch(err => {
            res.status(500).json({ error: "The user could not be removed" });
        })
})


server.put('/api/users/:id', (req, res) => {
    const {id} = req.params;
    const changes = req.body;

    db.update(id, changes)
        .then(updated => {
            if(!changes.name || !changes.bio) {
                res.status(400).json({ errorMessage: "Please provide name and bio for the user." });
            } else if(updated) {
                res.status(200).json(updated)
            } else {
                res.status(404).json({ message: "The user with the specified ID does not exist." })
            }
        })
        .catch(err => {
            res.status(500).json({ error: "The user information could not be modified." });
        })
})