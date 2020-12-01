import {createItem, removeItem} from './util.js';
import {app, localStorage} from './app.js';

const priorityColor = {
    none: '',
    low: '#3465a4',
    medium: '#f57900',
    high: '#cc0000'
};

function expandPanel() {
    var panel = this.nextElementSibling;
    panel.classList.toggle('active');
}
function appendTask (task, listId, ul) {
    const menu = createItem('div', {className: 'icon'}, createItem('img', {className: 'small', src: './images/menu.png'}));
    const checkbox = createItem('input', {className: 'icon', id: task.id, type: 'checkbox', name: "isComplete", value: task.isComplete});
    const title = createItem('input', {className: 'text', name: "title", value: task.title});
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
            createItem('input', {type: 'date', value: task.deadline})))
    const priority = createItem('fieldset',  {className: 'priority'},
        createItem('legend', {}, 'Priority'),
        createItem('select', {className: 'bordered', name: "priority", value: task.priority, onblur: (e) => app.updateTask(e.target, listId)},
            createItem('option', {value: 'none'}, 'None'),
            createItem('option', {value: 'low'}, 'Low'),
            createItem('option', {value: 'medium'}, 'Medium'),
            createItem('option', {value: 'high'}, 'High')))
    const deleteButton = createItem('button', {
        id: task.id,
        className: 'deleteButton bordered',
        onclick: (e) => {
            app.deleteTask(e.target, listId);
            removeItem(`task${e.target.id}`);
        }
    }, 'Delete')

    const container = createItem('div', {id: `task${task.id}`, className: 'spaced bordered task-container'},
        createItem('div', {className: 'title-bar', onclick: expandPanel}, menu, checkbox, title, date, expand),
        createItem('form', {className: 'panel'}, notes, deadline, priority, deleteButton))
    container.style.borderLeft = `5px solid ${priorityColor[task.priority]}`;
    document.getElementById('list').appendChild(document.createElement('li').appendChild(container))
}
function newInput() {
    const input = document.getElementById('input-text')
    if (input.value) appendTask(app.addTask({title: input.value}, currentLocation), currentLocation)
    console.log(input.value)
    input.value = ''
}
function loadList(listId) {
    const list = JSON.parse(localStorage.getItem('lists'))[listId];
    document.getElementsByTagName('title')[0].appendChild(document.createTextNode(list.name));
    document.getElementById('list-name').appendChild(document.createTextNode(list.name))
    document.getElementById('location').appendChild(document.createTextNode(list.location))
    const colorPicker = document.querySelector('nav>input[type=color]');
    colorPicker.addEventListener('change', (e) => {
        document.body.style.backgroundColor = e.target.value;
        app.updateList(listId, {color: e.target.value})
        // app.lists[listId].color = e.target.value;
        // console.log(app.lists[listId].color)
    })
    console.log('loading list', list)
    colorPicker.value = document.body.style.backgroundColor = list.color;
    list.tasks.forEach(task => {
        appendTask(task, listId, document.getElementById('list'))
    });
}
document.body.onkeyup = function (e) {
    if (e.keyCode == 'Enter') {
      console.log('enter clicked!')
      newInput()
    }
}

var currentLocation = decodeURI(window.location.href.split('/')[3]);
app.lists[currentLocation] ? loadList(currentLocation) : location.href = '/';

export {appendTask}

/* const urlParams = new URLSearchParams(window.location.search);
const myParam = urlParams.get('myParam');
console.log(myParam) */