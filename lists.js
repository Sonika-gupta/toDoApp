import {createItem, removeItem} from './util.js';
import {app, localStorage} from './app.js'
// import {appendTask} from './tasks.js' // MAKES THE PAGE RELOAD CONSTANTLY.

function createScheduledTab() {
    const scheduled = document.getElementById('scheduled')
    Object.entries(app.lists).forEach(([listName, list]) => {
        list.tasks.forEach(task => {
            if(task.deadline) scheduled.appendChild(appendTask(task, listName, scheduled))
        })
    })
}
function createNewList() {
    const name = window.prompt('List Name');
    if(name) var listId = app.newList(name);
    appendListIcon([listId, app.lists[listId]])
}
export function renameList() {
    const target = document.querySelector('.tick:not(.hidden)').parentNode;
    const newName = window.prompt('New List Name: ');
    app.renameList(target.id.slice(4), newName);
    document.querySelector(`#${target.id} > .caption`).innerHTML = newName;
    escapeEdit();
}
export function deleteLists() {
    const lists = document.querySelectorAll('.tick:not(.hidden)')
    lists.forEach(list => removeItem(list.parentNode.id));
    app.deleteLists([...lists].map(node => node.parentElement.id.slice(4)));
}
function minimap(list) {
    return list.tasks.length ?
        list.tasks.reduce((text, e) => text += `${e.title}\n`, '') :
        createItem('div', {className: 'emptylist'}, 'No tasks')
}
function selectList(icon, listId) {
    if(!editMode) enterEdit();
    const container = icon.parentNode;
    container.selected = !container.selected;
    document.querySelector(`#list${listId}>.tick`).classList.toggle('hidden');

    selectedCount += container.selected ? 1 : -1;
    renameListButton.disabled = selectedCount != 1;
    deleteListButton.disabled = personalList.selected || !selectedCount;
    deleteListButton.disabled ? deleteListButton.classList.remove('deleteButton') : deleteListButton.classList.add('deleteButton')
}
export function enterEdit() {
    editMode = true;
    document.querySelector('#main').classList.add('hidden')
    document.querySelector('#edit.menu').classList.remove('hidden')
    document.querySelector('#context.menu').classList.remove('hidden')
}
export function escapeEdit() {
    editMode = false;
    document.querySelector('#main').classList.remove('hidden')
    document.querySelectorAll('.tick').forEach(node => node.classList.add('hidden'));
    document.querySelector('#edit.menu').classList.add('hidden')
    document.querySelector('#context.menu').classList.add('hidden')
}
function appendListIcon([listId, list]) {
    const listIcon = createItem('div', {
        id: 'list'+listId,
        className: 'list-icon-container',
        selected: false,
        onclick: (event) => {
            editMode ? selectList(event.target, listId) : location.href = `/${listId}`;
        },
        oncontextmenu: (event) => {
            event.preventDefault();
            selectList(event.target, listId);
        }},
        createItem('div', {
                className: 'bordered list-icon',
                style: `background-color: ${list.color}`
            }, minimap(list)),
        createItem('img', {className: 'tick hidden', src: './images/tick.png'}),
        createItem('div', {className: 'caption'}, list.name),
        createItem('div', {className: 'caption light'}, list.location)
    );
    // listIcon.addEventListener('contextmenu', (e) => {
    // })
    document.getElementById('index').appendChild(listIcon)
}
document.body.onkeyup = function (e) {
    if (e.key == "Escape") {
      console.log('escape clicked!')
      escapeEdit();
    }
}

var renameListButton, deleteListButton, personalList, selectedCount = 0, editMode = false;

(function load() {
    document.getElementById('newListButton').addEventListener('click', createNewList)
    renameListButton = document.getElementById('renameListButton');
    renameListButton.addEventListener('click', renameList)
    deleteListButton = document.getElementById('deleteListButton');
    deleteListButton.addEventListener('click', deleteLists)

    Object.entries(app.lists).forEach(list => {
        appendListIcon(list)
    })
    personalList = document.getElementById('list0');

    Object.assign(window, {enterEdit, escapeEdit})
    // createScheduledTab();
    // createTodayTab();
}())