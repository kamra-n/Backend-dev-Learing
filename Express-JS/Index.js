const express = require('express');
const app = express();
const port = 3000;
const users = require('./userData.json');
const fs = require('fs');
const e = require('express');

app.use(express.json());

app.get('/api/users', (req, res) => {
    res.send({
        result: users
    });
});

app.get('/api/users/:id', (req, res) => {
    const userId = parseInt(req.params.id)
    console.log('userId', userId)
    const user = users.find(u => u.id === userId);
    if (user) {
        res.send({ result: user });
    }
    else {
        res.status(404).send({ message: 'user not found' })
    }
});



app.post('/api/users', (req, res) => {
    try {
        if (!req.body.first_name || !req.body.email) {
            return res.status(400).send({ error: "Name and Email are required" });
        }
        const userId = users.length + 1;
        const newUser = { id: userId, ...req.body };

        users.push(newUser);

        fs.writeFile('./userData.json', JSON.stringify(users), (err) => console.log('error', err));

        return res.status(201).send({ message: "User created successfully", user: newUser });
    }
    catch (err) {
        res.status(500).send({
            message:
                'Internal Server Error',
            error: err.message
        })
    }

});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});