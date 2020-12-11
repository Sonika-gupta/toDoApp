import { createItem, removeItem } from './util.js'
import { app } from './app.js'

const priorityColor = {
  none: ' 1px #e0e0e0',
  low: '5px #3465a4',
  medium: '5px #f57900',
  high: '5px #cc0000'
}
const properties = {
  isComplete: 'checked',
  title: 'value',
  notes: 'value',
  deadline: 'value',
  priority: 'value'
}
// const PRIORITY = ['none', 'low', 'medium', 'high']

function expandPanel () {
  const panel = this.nextElementSibling
  if (panel.classList.contains('active')) {
    panel.classList.remove('active')
    this.querySelector('.expand').style.removeProperty('transform')
  } else {
    document.querySelectorAll('.panel.active').forEach(node => node.classList.remove('active'))
    document.querySelectorAll('.expand').forEach(node => node.style.removeProperty('transform'))
    panel.classList.add('active')
    this.querySelector('.expand').style = 'transform: rotate(180deg)'
  }
}
function formatDate (date) {
  // DD/MM/YYYY
  return date = date.split('-').reduce((deadline, term) => deadline = term + '/' + deadline)
}
function setDeadline (day, task, listId) {
  let date = new Date()
  if (day.value == 'tomorrow') date.setDate(date.getDate() + 1)
  date = date.toLocaleString().slice(0, 10)
  date = date.split('/').reduce((deadline, term) => deadline = term + '-' + deadline)
  day.form.deadline.value = task.deadline = date
  console.log(date)
  updateTask(day.form.deadline, task, listId)
}
function fillData (form, task) {
  Object.entries(properties).forEach(([key, value]) => form[key][value] = task[key])
  if (task.isComplete) {
    form.isComplete.checked = true
    form.classList.add('complete')
    if (!completedVisible) form.classList.add('hidden')
    form.title.style = 'text-decoration: line-through'
  } else {
    form.classList.remove('complete')
    form.title.style.removeProperty('text-decoration')
  }
  form.style = `border-left: solid ${priorityColor[task.priority]}`
  form.querySelector('.date').innerHTML = formatDate(task.deadline)
}
function updateTask (changedItem, task, listId) {
  task[changedItem.name] = changedItem[properties[changedItem.name]]
  fillData(changedItem.form, task)
  app.updateTask(task, listId)
}
function removeTask (id, listId) {
  app.deleteTask(id, listId)
  removeItem(`task${id}`)
}
function createTask (task, listId) {
  const menu = createItem('div', { className: 'icon' }, createItem('img', { className: 'small', src: './images/menu.png' }))
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
  const date = createItem('span', { className: 'date', name: 'date' })
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
    id: task.id,
    className: 'deleteButton bordered',
    onclick: (e) => removeTask(e.target.id, listId)
  }, 'Delete')
  const form = createItem('form', {
    id: `task${task.id}`,
    className: 'spaced bordered task-container',
    onchange: (e) => updateTask(e.target, task, listId),
    onsubmit: (e) => e.preventDefault()
  },
  createItem('div', { className: 'title-bar spaced', onclick: expandPanel }, menu, checkbox, title, date, expand),
  createItem('div', { className: 'panel' }, notes, deadline, priority, deleteButton))

  fillData(form, task)
  return form
}
function toggleFooterVisibility () {
  completedCount ? footer.classList.remove('hidden') : footer.classList.add('hidden')
  document.getElementById('completedCount').innerHTML = completedCount
}
function clearCompleted (list, listId) {
  console.log(list, 'clearing')
  list.tasks.forEach(task => {
    if (task.isComplete) {
      removeTask(task.id, listId)
    }
  })
  completedCount = 0
  completedVisible = false
  toggleFooterVisibility()
}

const footer = document.querySelector('footer')
let completedCount = 0; let completedVisible = false

function loadList (listId) {
  const list = JSON.parse(localStorage.getItem('lists'))[listId]
  document.getElementsByTagName('title')[0].appendChild(document.createTextNode(list.name))
  document.getElementById('list-name').appendChild(document.createTextNode(list.name))
  document.getElementById('location').appendChild(document.createTextNode(list.location))
  document.getElementById('clearCompletedButton').addEventListener('click', () => clearCompleted(list, listId))

  const colorPicker = document.querySelector('nav>input[type=color]')
  colorPicker.addEventListener('change', (e) => {
    document.body.style.backgroundColor = e.target.value
    app.updateList(listId, { color: e.target.value })
  })
  colorPicker.value = document.body.style.backgroundColor = list.color

  const ul = document.getElementById('list')
  list.tasks.forEach(task => {
    if (task.isComplete) completedCount++
    ul.appendChild(document.createElement('li').appendChild(createTask(task, listId)))
  })
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

var currentList = decodeURI(window.location.href.split('/')[3])
// To Avoid Infinite loading in case of 'Scheduled' and 'Today'
if (currentList) app.lists[currentList] ? loadList(currentList) : location.href = '/'

export { expandPanel, properties, priorityColor, setDeadline, updateTask, removeTask, toggleFooterVisibility }
