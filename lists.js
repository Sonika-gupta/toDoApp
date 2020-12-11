import { createItem, removeItem } from './util.js'
import { app } from './app.js'
import {loadScheduled} from './scheduled.js'
// import {createTodayTab} from './today.js'

function createNewList () {
  const name = window.prompt('List Name')
  if (name) var listId = app.newList(name)
  appendListIcon([listId, app.lists[listId]])
}
function renameList () {
  const target = document.querySelector('.tick:not(.hidden)').parentNode
  const newName = window.prompt('New List Name: ')
  app.renameList(target.id.slice(4), newName)
  document.querySelector(`#${target.id} > .caption`).innerHTML = newName
  escapeEditMode()
}
function deleteLists () {
  const lists = document.querySelectorAll('.tick:not(.hidden)')
  lists.forEach(list => removeItem(list.parentNode.id))
  app.deleteLists([...lists].map(node => node.parentElement.id.slice(4)))
}
function minimap (list) {
  return list.tasks.length
    ? createItem('span', {}, list.tasks.reduce((text, e) => text += `${e.title}\n`, ''))
    : createItem('span', { className: 'emptylist' }, 'No tasks')
}
function selectList (icon, listId) {
  if (!editMode) enterEditMode()
  const container = icon.parentNode
  container.selected = !container.selected
  document.querySelector(`#list${listId}>.tick`).classList.toggle('hidden')

  selectedCount += container.selected ? 1 : -1
  renameListButton.disabled = selectedCount != 1
  deleteListButton.disabled = personalList.selected || !selectedCount
  deleteListButton.disabled ? deleteListButton.classList.remove('deleteButton') : deleteListButton.classList.add('deleteButton')
}
function enterEditMode () {
  editMode = true
  document.querySelector('#main').classList.add('hidden')
  document.querySelector('#edit.menu').classList.remove('hidden')
  document.querySelector('#context.menu').classList.remove('hidden')
}
function escapeEditMode () {
  editMode = false
  document.querySelector('#main').classList.remove('hidden')
  document.querySelectorAll('.tick').forEach(node => node.classList.add('hidden'))
  document.querySelector('#edit.menu').classList.add('hidden')
  document.querySelector('#context.menu').classList.add('hidden')
}
function appendListIcon ([listId, list]) {
  const listIcon = createItem('div', {
    id: 'list' + listId,
    className: 'list-icon-container',
    selected: false,
    onclick: (event) => {
      editMode ? selectList(event.target, listId) : location.href = `/${listId}`
    },
    oncontextmenu: (event) => {
      event.preventDefault()
      selectList(event.target, listId)
    }
  },
  createItem('div', {
    className: 'bordered list-icon',
    style: `background-color: ${list.color}`
  }, minimap(list)),
  createItem('img', { className: 'tick hidden', src: './images/tick.png' }),
  createItem('div', { className: 'caption' }, list.name),
  createItem('div', { className: 'caption light' }, list.location)
  )
  // listIcon.addEventListener('contextmenu', (e) => {
  // })
  document.getElementById('index').appendChild(listIcon)
}
document.body.onkeyup = function (e) {
  if (e.key == 'Escape') {
    console.log('escape clicked!')
    escapeEditMode()
  }
}

let renameListButton; let deleteListButton; let personalList; let selectedCount = 0; let editMode = false; let scheduledCount = 0; let todayCount = 0;

(function load () {
  document.getElementById('newListButton').addEventListener('click', createNewList)
  renameListButton = document.getElementById('renameListButton')
  renameListButton.addEventListener('click', renameList)
  deleteListButton = document.getElementById('deleteListButton')
  deleteListButton.addEventListener('click', deleteLists)

  Object.entries(app.lists).forEach(list => {
    list[1].tasks.forEach(task => {
      if (task.deadline) {
        scheduledCount++
        let today = new Date().toLocaleString().slice(0, 10)
        today = today.split('/').reduce((deadline, term) => deadline = term + '-' + deadline)

        if (today == task.deadline) todayCount++
      }
    })
    appendListIcon(list)
  })
  personalList = document.getElementById('list0')

  if (scheduledCount) document.getElementById('scheduledCount').innerHTML = `(${scheduledCount})`
  if (todayCount) document.getElementById('todayCount').innerHTML = `(${todayCount})`
  Object.assign(window, { enterEditMode, escapeEditMode })
  loadScheduled();
  // createTodayTab();
}())
