import { createItem, removeItem, expandPanel, getDate, formatDate, properties, priorityColor } from './util.js'
import { app } from './app.js'

function moveTask(form, task) {
  form.parentNode.removeChild(form)
  if (isDeadlineToday(task)) {
    today.appendChild(document.createElement('li').appendChild(form))
  }
  else if(task.deadline) {
    scheduled.appendChild(document.createElement('li').appendChild(form))
  }
}
function isDeadlineToday(task) {
  return formatDate(task.deadline) == 'today'
}
function setDeadline (day, task, listId) {
  const date = getDate(day)
  day.form.deadline.value = task.deadline = date
  updateTask(day.form.deadline, task, listId)
}

function removeTask (id, listId) {
  app.deleteTask(id, listId)
  removeItem(`list${listId}task${id}`)
}
function updateTask (changedItem, task, listId) {
  task[changedItem.name] = changedItem[properties[changedItem.name]]
  fillData(changedItem.form, task)
  moveTask(changedItem.form, task)
  app.updateTask(task, listId)
  toggleFooterVisibility()
  updateCount()
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
  form.style = `border-left: solid ${priorityColor[task.priority]}`
}
function createTask (task, listId, listName) {
  const checkbox = createItem('input', {
    className: 'icon',
    type: 'checkbox',
    name: 'isComplete',
    onclick: (e) => e.stopPropagation()
  })
  const title = createItem('input', { className: 'text', name: 'title' })
  const list = createItem('div', { className: 'detail light', name: 'list' }, listName)
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
    onclick: (e) => {
      removeTask(task.id, listId)
      alert(`Task "${task.title}" from "${listName}" Deleted`)
    }
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
  if(confirm('Clear All Completed Tasks?')) {
    Object.entries(lists).forEach(([listId, list]) => {
      list.tasks.forEach(task => {
        if (task.isComplete) removeTask(task.id, listId)
      })
    })
    completedVisible = false
    toggleFooterVisibility()
    updateCount()
    alert("All Completed Tasks deleted!")
  }
}
function toggleFooterVisibility () {
  completedCountToday = document.querySelectorAll('#today form.complete').length
  completedCountScheduled = completedCountToday + document.querySelectorAll('#scheduled form.complete').length
  completedCountScheduled ? scheduledFooter.classList.remove('hidden') : scheduledFooter.classList.add('hidden')
  completedCountToday ? todayFooter.classList.remove('hidden') : todayFooter.classList.add('hidden')
  document.getElementById('completedCountScheduled').innerHTML = completedCountScheduled
  document.getElementById('completedCountToday').innerHTML = completedCountToday
}
function listOptions(lists) {
  return Object.entries(lists).map(([listId, list]) => {
    return createItem('option',{style: `background-color: ${list.color}`, value: listId}, list.name);
  })
}
function updateCount() {
  todayCount = document.querySelectorAll('#today form').length
  scheduledCount = todayCount + document.querySelectorAll('#scheduled form').length;
  if (scheduledCount) document.getElementById('scheduledCount').innerHTML = `(${scheduledCount})`
  if (todayCount) document.getElementById('todayCount').innerHTML = `(${todayCount})`
}
const scheduled = document.getElementById('scheduled')
const today = document.getElementById('today')
const scheduledFooter = document.getElementById('scheduledFooter')
const todayFooter = document.getElementById('todayFooter')
let scheduledCount=0, todayCount=0, completedCountScheduled = 0, completedCountToday = 0, completedVisible = false;

function loadOtherTabs () {
  const lists = JSON.parse(localStorage.getItem('lists'))
  document.getElementById('clearCompletedButton').addEventListener('click', () => clearCompleted(lists))  

  Object.entries(lists).forEach(([listId, list]) => {
    list.tasks.forEach(task => {
      if (task.isComplete) {
        completedCountScheduled++;
        if (isDeadlineToday(task)) completedCountToday++;
      }
      if (isDeadlineToday(task)) {
        today.appendChild(document.createElement('li').appendChild(createTask(task, listId, list.name)))
      }
      else if(task.deadline) {
        scheduled.appendChild(document.createElement('li').appendChild(createTask(task, listId, list.name)))
      }
    })
  })
  const newTask = createItem('div', {className:"bordered", id:"new-task"},
    createItem('div', {className: "icon"},
      createItem('img', {src:"./images/plus.svg"})),
    createItem('input', {id: "input-text", className: "text", placeholder:"New Task..."}),
    createItem('select', {id: "listId", className: "detail"}, ...listOptions(lists)))
  document.querySelector("#otherTab > main").appendChild(newTask)
  
  document.querySelectorAll('.doneButton')
    .forEach(button => button.addEventListener('click', () => {
      document.querySelectorAll('form.complete').forEach(form => form.classList.toggle('hidden'))
      completedVisible = true
    }))
  updateCount()
  toggleFooterVisibility()

  document.body.onkeyup = function (e) {
    if (e.key == 'Enter') {
      const input = document.getElementById('input-text')
      const listId = document.getElementById('listId').value
      if (input.value) {
        const task = createTask(app.addTask({ title: input.value, deadline: getDate('today') }, listId), listId, lists[listId].name)
        scheduled.appendChild(document.createElement('li').appendChild(task))
        today.appendChild(document.createElement('li').appendChild(task))
        updateCount();
      }
      input.value = ''
    }
  }
}

export {loadOtherTabs}