"use strict";

const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
    res.send("Queue service is running!");
});

module.exports = router;
