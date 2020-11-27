import {createItem} from './util.js';
import {app, localStorage} from './app.js'
function createNewList() {
    const name = window.prompt('List Name');
    if(name) app.newList(name);
    appendListIcon([name, app.lists[name]])
}
function appendListIcon([listName, list]) {
    console.log('appending list icon for', listName)
    const listIcon = createItem('div', {className: 'list-icon-container', onclick: () => {
            location.href = `/${listName}`;
        }},
        createItem('div', {className: 'bordered list-icon', 'style.backgroundColor': list.color}),
        createItem('div', {className: 'caption'}, listName),
        createItem('div', {className: 'caption light'}, list.location),
    );
    document.getElementById('index').appendChild(listIcon)
}/* 
function getLists() {
    var temp = localStorage.getItem('lists')
    temp ?  app.lists = JSON.parse(temp) : localStorage.setItem('lists', JSON.stringify(app.lists))
    return app.lists
} */
function load() {
    // const lists = getLists();
    document.getElementById('newListButton').addEventListener('click', createNewList)
    Object.entries(app.lists).forEach(list => {
        appendListIcon(list)
    })
}
load();