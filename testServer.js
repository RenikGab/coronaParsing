const path = require("path")
const express = require('express')
const app = express()
const http = require('http').createServer(app)

http.listen(2020);

app.use('/', express.static(__dirname + '/docs'))
app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'docs', 'index.html'))
})

