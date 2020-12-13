/* eslint eqeqeq: "off" */
const localStorage = window.localStorage
class Task {
  constructor ({ id, title, notes, priority, deadline, isComplete }) {
    this.id = id
    this.title = title
    this.notes = notes || ''
    this.priority = priority || 'none'
    this.deadline = deadline || ''
    this.isComplete = isComplete || false
  }
}
class ToDoApp {
  constructor () {
    const temp = localStorage.getItem('lists')
    if (temp) this.lists = JSON.parse(temp)
    else {
      this.lists = {
        0: {
          name: 'personal',
          color: '#ffffff',
          location: 'On This Computer',
          tasks: [],
          nextId: 1
        }
      }
      localStorage.setItem('lists', JSON.stringify(this.lists))
    }
    this.default = {
      color: '#becedd',
      location: 'On This Computer'
    }
    this.nextId = localStorage.getItem('nextId') || 1
  }

  getList (id) {
    return JSON.parse(localStorage.getItem('lists'))[id]
  }

  setList () {
    localStorage.setItem('lists', JSON.stringify(this.lists))
    console.log('Local Storage Updated.')
  }

  newList (name) {
    const id = this.nextId // TO DO: Use an ID Generator.
    this.lists[id] = {
      name: name,
      color: this.default.color,
      location: this.default.location,
      tasks: [],
      nextId: 1
    }
    this.nextId++
    localStorage.setItem('nextId', this.nextId)
    this.setList()
    return id
  }

  deleteLists (ids) {
    ids.forEach(id => {
      delete this.lists[id]
      console.log('deleted', this.lists[id])
    })
    this.setList()
  }

  renameList (id, newName) {
    this.lists[id].name = newName
    this.setList()
  }

  updateList (id, newValue) {
    this.lists[id] = Object.assign(this.lists[id], newValue)
    this.setList()
  }

  addTask (task, listId) {
    task.id = this.lists[listId].nextId
    task = new Task(task)
    this.lists[listId].nextId++
    this.lists[listId].tasks.push(task)
    this.setList()
    return task
  }

  deleteTask (id, listId) {
    const list = this.lists[listId].tasks
    for (let i = 0; i < list.length; i++) {
      if (list[i].id == id) {
        list.splice(i, 1)
        break
      }
    }
    this.setList()
    console.log('deleted task', id, 'in list', listId)
  }

  updateTask (task, listId) {
    const list = this.lists[listId].tasks
    for (let i = 0; i < list.length; i++) {
      if (list[i].id == task.id) {
        list[i] = task
        break
      }
    }
    console.log('Updated Task "', task.title, '" in list', this.lists[listId].name)
    this.setList()
  }
}
const app = new ToDoApp()
export { app }
