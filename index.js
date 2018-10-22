// init project
const express = require('express')
const app = express()
const Note = require('./models/note')
const _ = require('underscore')

app.use(express.json())

app.post('/todos', (req, resp) => {
  var done = undefined
  if (req.query.done !== undefined) { done = JSON.parse(req.query.done) }

  var tags = JSON.parse(req.query.tags || "[]")

  const notes = JSON.parse(req.body.notes)
    .map(data => {
      return new Note(data)
    })
    .filter(note => {
      const noteTags = note.tags
      return tags.length === 0 || _.intersection(tags, noteTags).length > 0
    })

  const todos = notes
    .reduce((all, note) => {
      return all.concat(note.todos)
    }, [])
    .filter(todo => {
      return done === undefined || todo.isDone == done
    })

  console.log(todos)
  resp.json(todos)
})

app.get('/parse', (req, resp) => {
  resp.json(JSON.parse(req.query.q))
})

var listener = app.listen(process.env.PORT, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})

const bear = new (require('./models/bear'))('294E9E-789987-6F3A18')
bear.note('DCEE9574-877A-46E4-A1A2-F1CF2EC16DB4-4211-00000216A1C1484D')
  .then(data => console.log(data))
