'use strict';
const express = require('express');
const bodyParser = require('body-parser');
const index = require('../queue-lib/routes/index');
const config = require('./config/config.json')
const app = express();
const queue = require('../queue-lib/queue')

// init config
let port = config.queue.port

app.use(bodyParser.json());
// app.use(bodyParser.urlencoded);

// Create routes
app.get('/', function (req, res) {
  if(!queue.isEmpty())
    {
        let result = queue.dequeue()
        res.status(200).send(result)
    }
    else
        res.sendStatus(404)
})

// POST method route
app.post('/', function (req, res) {
  let body = req.body
    queue.enqueue(body)
  res.send('added object')
})

app.use('/checkHealth', index);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(/*err*/);
});

// run server
app.set('port', port || 3001); 

const server = app.listen(app.get('port'), function () {
    console.log(`The queue server is running (-_^) - listening on port ` + server.address().port);
});