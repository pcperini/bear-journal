// init project
const express = require('express')
const app = express()
const Note = require('./models/note')

app.use(express.json())

app.post('/todos', function(req, resp) {
  var done = undefined
  if (req.query.done !== undefined) { done = JSON.parse(req.query.done) }

  var tags = JSON.parse(req.query.tags || "[]")

  const notes = JSON.parse(req.body.notes)
    .map(function(data) {
      return new Note(data)
    })

  const todos = notes
    .reduce(function(all, note) {
      return all.concat(note.todos)
    }, [])
    .filter(function(todo) {
      return done === undefined || todo.isDone == done
    })

  console.log(todos)
  resp.json(todos)
})

app.get('/parse', function(req, resp) {
  resp.json(JSON.parse(req.query.q))
})

var listener = app.listen(process.env.PORT, function() {
  console.log('Your app is listening on port ' + listener.address().port)
})
