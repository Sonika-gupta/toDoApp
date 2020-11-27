import {createItem} from './util.js';
import {app, localStorage} from './app.js';

const priorityColor = {
    none: '',
    low: '#3465a4',
    medium: '#f57900',
    high: '#cc0000'
};

function expandPanel() {
    var panel = this.nextElementSibling;
    if (panel.style.display === "grid")
        panel.style.display = "none";
    else
        panel.style.display = "grid";
}
function appendTask (task, listName) {
    const menu = createItem('div', {className: 'icon'}, createItem('img', {className: 'small', src: './images/menu.png'}));
    const checkbox = createItem('input', {type: 'checkbox', className: 'icon', id: task.id, value: false});
    const title = createItem('input', {className: 'text', value: task.title});
    const date = createItem('div', {className: 'date'}, task.deadline)
    const expand = createItem('div', {className: 'icon expand'}, createItem('img', {src: './images/down.png'}));
    
    const notes = createItem('fieldset',  {className: 'notes'}, 
        createItem('legend',{}, 'Notes'),
        createItem('textarea', {className: 'spaced bordered', name: 'notes', value: task.notes}))
    const deadline = createItem('div',  {className: 'deadline'},
        createItem('legend', {}, 'Due Date'),
        createItem('fieldset', {name: 'deadline', className: 'date-menu bordered'},
            createItem('button', {}, 'Today'),
            createItem('button', {}, 'Tomorrow'),
            createItem('input', {type: 'date', style: 'width: 100px', value: task.deadline})))
    const priority = createItem('fieldset',  {className: 'priority'},
        createItem('legend', {}, 'Priority'),
        createItem('select', {className: 'bordered', value: task.priority},
            createItem('option', {value: 'none'}, 'None'),
            createItem('option', {value: 'low'}, 'Low'),
            createItem('option', {value: 'medium'}, 'Medium'),
            createItem('option', {value: 'high'}, 'High')))
    const deleteButton = createItem('button', {
        id: task.id,
        className: 'spaced bordered deleteButton',
        onclick: (e) => {
            app.deleteTask(e.target, listName);
            removeTask(`task${e.target.id}`);
        }
    }, 'Delete')

    const container = createItem('div', {id: `task${task.id}`, className: 'spaced bordered task-container'},
        createItem('div', {className: 'title-bar', onclick: expandPanel}, menu, checkbox, title, date, expand),
        createItem('form', {className: 'panel'}, notes, deadline, priority, deleteButton))
    container.style.borderLeft = `5px solid ${priorityColor[task.priority]}`;
    document.getElementById('list').appendChild(document.createElement('li').appendChild(container))
}
function removeTask(id) {
    const item = document.getElementById(id);
    item.parentNode.removeChild(item);
}
function newInput() {
    const input = document.getElementById('input-text')
    if (input.value) appendTask(app.addTask({title: input.value}, currentLocation), currentLocation)
    console.log(input.value)
    input.value = ''
}
function loadList(listName) {
    document.getElementsByTagName('title')[0].appendChild(document.createTextNode(listName));
    const temp = JSON.parse(localStorage.getItem('lists'))[listName];
    console.log('loading list', temp)
    if(temp) {
        temp.tasks.forEach(task => {
            appendTask(task, listName)
        });
    }
}
document.body.onkeyup = function (e) {
    if (e.keyCode === 13) {
      console.log('enter clicked!')
      newInput()
    }
}

var currentLocation = window.location.href.split('/')[3];
app.lists[currentLocation] ? loadList(currentLocation) : location.href = '/';


/* const urlParams = new URLSearchParams(window.location.search);
const myParam = urlParams.get('myParam');
console.log(myParam) */