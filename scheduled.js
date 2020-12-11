import { createItem, removeItem } from './util.js'
import { app } from './app.js'
import { expandPanel, properties, priorityColor, setDeadline } from './tasks.js'

function removeTask (id, listId) {
  app.deleteTask(id, listId)
  removeItem(`list${listId}task${id}`)
}
function updateTask (changedItem, task, listId) {
  task[changedItem.name] = changedItem[properties[changedItem.name]]
  fillData(changedItem.form, task)
  app.updateTask(task, listId)
}
function fillData (form, task) {
  Object.entries(properties).forEach(([key, value]) => (form[key][value] = task[key]))
  if (task.isComplete) {
    form.isComplete.checked = true
    form.classList.add('complete')
    if (!completedVisible) form.classList.add('hidden')
    form.title.style = 'text-decoration: line-through'
  } else {
    form.classList.remove('complete')
    form.title.style.removeProperty('text-decoration')
  }
  form.style = `border-left: 5px solid ${priorityColor[task.priority]}`
}
function createTask (task, listId, listName) {
  const checkbox = createItem('input', {
    className: 'icon',
    type: 'checkbox',
    name: 'isComplete',
    onchange: (e) => {
      completedCount += e.target.checked ? 1 : -1
      toggleFooterVisibility()
    },
    onclick: (e) => e.stopPropagation()
  })
  const title = createItem('input', { className: 'text', name: 'title' })
  const list = createItem('div', { className: 'list', name: 'list' }, listName)
  const expand = createItem('div', { className: 'icon expand', name: 'expand' }, createItem('img', { src: './images/down.png' }))

  const notes = createItem('fieldset', { className: 'notes' },
    createItem('legend', {}, 'Notes'),
    createItem('textarea', { className: 'spaced bordered', name: 'notes' }))
  const deadline = createItem('fieldset', { className: 'deadline' },
    createItem('legend', {}, 'Due Date'),
    createItem('div', { className: 'date-menu bordered' },
      createItem('input', {
        type: 'button',
        style: 'border-radius: 4px 0 0 4px;',
        value: 'today',
        onclick: (e) => setDeadline(e.target, task, listId)
      }),
      createItem('input', { type: 'button', value: 'tomorrow', onclick: (e) => setDeadline(e.target, task, listId) }),
      createItem('input', { type: 'date', style: 'border-radius: 0 4px 4px 0', name: 'deadline' })))
  const priority = createItem('fieldset', { className: 'priority' },
    createItem('legend', {}, 'Priority'),
    createItem('select', { className: 'bordered spaced', name: 'priority' },
      createItem('option', { value: 'none' }, 'None'),
      createItem('option', { value: 'low' }, 'Low'),
      createItem('option', { value: 'medium' }, 'Medium'),
      createItem('option', { value: 'high' }, 'High')))
  const deleteButton = createItem('button', {
    type: 'button',
    className: 'deleteButton bordered',
    onclick: (e) => removeTask(task.id, listId)
  }, 'Delete')
  const form = createItem('form', {
    id: `list${listId}task${task.id}`,
    className: 'spaced bordered task-container',
    onchange: (e) => updateTask(e.target, task, listId),
    onsubmit: (e) => e.preventDefault()
  },
  createItem('div', { className: 'title-bar spaced', onclick: expandPanel }, checkbox, title, list, expand),
  createItem('div', { className: 'panel' }, notes, deadline, priority, deleteButton))

  fillData(form, task)
  return form
}
function clearCompleted (lists) {
  Object.entries(lists).forEach(([listId, list]) => {
    list.tasks.forEach(task => {
      if (task.isComplete) {
        removeTask(task.id, listId)
      }
    })
  })
  completedCount = 0
  completedVisible = false
  toggleFooterVisibility()
}
function toggleFooterVisibility () {
  completedCount ? footer.classList.remove('hidden') : footer.classList.add('hidden')
  document.getElementById('completedCount').innerHTML = completedCount
}

let completedCount = 0; let completedVisible = false;
const footer = document.getElementById('doneFooter')

function listOptions(lists) {
  return Object.entries(lists).map(([listId, list]) => createItem('option',{style: `background-color: ${list.color}`, value: listId}, list.name))
        /* createItem('label', {for: list.name}, 
          createItem('div', {style: `border-radius: 50%; background-color: ${list.color}`}),
          createItem('div', {}, list.name),
          createItem('div', {className: "light", style: "text-align: right"}, list.location)
        ))
  }) */
}

function loadScheduled () {
  console.log('Loading Scheduled')
  const lists = JSON.parse(localStorage.getItem('lists'))
  document.getElementById('clearCompletedButton').addEventListener('click', () => clearCompleted(lists))

  const ul = document.getElementById('scheduled')
  Object.entries(lists).forEach(([listId, list]) => {
    list.tasks.forEach(task => {
      if (task.isComplete) completedCount++;
      if (task.deadline) { ul.appendChild(document.createElement('li').appendChild(createTask(task, listId, list.name))) }
    })
  })
  const newTask = createItem('div', {className:"bordered", id:"new-task"},
    createItem('div', {className: "icon"},
      createItem('img', {src:"./images/plus.svg"})),
    createItem('input', {id: "input-text", className: "text", placeholder:"New Task..."}),
    createItem('select', {className: "list"}, ...listOptions(lists)))

  ul.appendChild(newTask)
  document.getElementById('doneButton').addEventListener('click', () => {
    document.querySelectorAll('form.complete').forEach(form => form.classList.toggle('hidden'))
    completedVisible = true
  })
  toggleFooterVisibility()
}
document.body.onkeyup = function (e) {
  if (e.key == 'Enter') {
    const input = document.getElementById('input-text')
    if (input.value) {
      const task = createTask(app.addTask({ title: input.value }, currentList), currentList)
      document.getElementById('list').appendChild(document.createElement('li').appendChild(task))
    }
    input.value = ''
  }
}

// Object.assign(window, { loadScheduled })
export {loadScheduled}