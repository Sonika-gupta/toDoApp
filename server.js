const express = require('express')
const app = express()

const { Client } = require('pg')
const client = new Client({
  user: 'postgres',
  host: 'localhost',
  database: 'TODO',
  port: 5432
})
client.connect()

client.query('SELECT $1::text as message', ['Hello world!'], (err, res) => {
  console.log(err ? err.stack : res.rows[0].message) // Hello World!
  client.end()
})

app.use(express.static(__dirname))

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/lists.html')
})
app.get('/:location', (req, res) => {
  res.sendFile(__dirname + '/tasks.html')
})
/*
app.post('/', (req, res) => {
    res.send("POST");
}); */

// app.use('/', index)
app.listen(8000, () => {
  console.log('Server Listening on 8000')
})
