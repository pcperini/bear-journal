const Note = require('./note')
const xcall = require('xcall')
const client = new xcall('bear')

class Bear {
  constructor(token) {
    this.token = token
  }

  // MARK: Private
  async _request(func, body, key) {
    const resp = JSON.parse(await client.call(func, body))
    if (key) { return JSON.parse(resp[key]) }
    return resp
  }

  async _batchRequest(func, body, key, followOn) {
    const resps = await this._request(func, body, key)
    return Promise.all(resps.map(r => followOn(r)))
  }

  // MARK: Single Getters
  async note(id) {
    return await this._request('open-note', {
      id: id,
      new_window: false,
      show_window: false
    })
  }

  async tagList() {
    return await this._request('tags', { token: this.token }, 'tags')
  }

  // MARK: Batch Getters
  async todoList() {
    const x = (await this._batchRequest(
      'todo',
      { token: this.token},
      'notes',
      note => this.note(note.identifier)))
    console.log(JSON.stringify(x))
      // .map(data => new Note(data))
  }

  async notesForTag(tag) {
    return (await this._batchRequest(
      'open-tag',
      { token: this.token},
      'notes',
      note => this.note(note.identifier)))
      .map(data => new Note(data))
  }
}

module.exports = Bear
