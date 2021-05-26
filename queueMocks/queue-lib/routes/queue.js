"use strict";
const express = require("express");
const router = express.Router();
const queue = require('../queue')

router.get("/", async (req, res) => {
    if(!queue.isEmpty())
    {
        let result = queue.dequeue()
        res.status(200).json(result)
    }
    res.status(204).json({})
})

router.post("/", async (req, res) => {
    let body = req.body
    // let partitionKey = req.body.partitionKey // no need here, only on production 
    queue.enqueue(body)
    res.status(201);
  })

module.exports = router;
