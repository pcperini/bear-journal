const moment = require('moment')
const _ = require('underscore')

class Note {
  constructor(data) {
    this.title = data.title
    this.text = data.note
    this.creationDate = new moment(data.creationDate)
    this.modificationDate = new moment(data.modificationDate)
    this.isTrashed = data.is_trashed === 'yes'
    this.id = data.identifier
  }

  get tags() {
    return _.uniq(this.text.match(/(#(\w+)#?)|(#([^#\n]+)#)/g) || [], true)
  }

  get todos() {
    const todoRegex = /- \[([x ])\] (.+)\n?/g
    var matches = []
    var res
    while ((res = todoRegex.exec(this.text)) != null) {
      matches.push({ todo: res[2], isDone: res[1] === 'x' })
    }

    return matches
  }
}

module.exports = Note
