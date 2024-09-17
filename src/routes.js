const express = require('express');

const Example = require('./modelExample');

const router = new express.Router();

router.get('/', async (req, res) => {
    res.sendFile(__dirname + '/index.html');
})

//Example post
router.post('/example', async (req, res) => {
    const exampleData = req.body.example;

    await Example.create({ attribute1: exampleData })
        .then(result => {
            res.status(201).json({ Result: result.attribute1 })
            return result;
        })
        .catch(error => {console.log(error)})
})

module.exports = router ;