const express = require('express')
const app = express()
const path = require('path')

app.use(express.static(__dirname))

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/lists.html'))
})
app.get('/:location', (req, res) => {
  res.sendFile(path.join(__dirname, '/tasks.html'))
})
/*
app.post('/', (req, res) => {
    res.send("POST");
}); */

// app.use('/', index)
app.listen(8000, () => {
  console.log('Server Listening on 8000')
})
