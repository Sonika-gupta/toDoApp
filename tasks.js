import {createItem, removeItem} from './util.js';
import {app} from './app.js';

const priorityColor = {
    none: '#ffffff',
    low: '#3465a4',
    medium: '#f57900',
    high: '#cc0000'
};
// const PRIORITY = ['none', 'low', 'medium', 'high']
function expandPanel() {
    const panel = this.nextElementSibling;
    if(panel.classList.contains('active'))
        panel.classList.remove('active');
    else {
        document.querySelectorAll('.panel.active').forEach(node => node.classList.remove('active'));
        panel.classList.add('active');
    }
}
function formatDate(date) {
    // DD/MM/YYYY 
    return date = date.split('-').reduce((deadline, term) => deadline = term + '/' + deadline);
}
function setDeadline (day, task, listId) {
    let date = new Date();
    if(day.value == 'tomorrow') date.setDate(date.getDate() + 1);
    date = date.toLocaleString().slice(0, 10);
    date = date.split('/').reduce((deadline, term) => deadline = term + '-' + deadline);
    day.form.deadline.value = task.deadline = date;
    console.log(date)
    updateTask(day.form.deadline, task, listId);
}
function fillData(form, task) {
    const updatedValues = {
        isComplete: 'checked',
        title: 'value',
        notes: 'value',
        deadline: 'value',
        priority: 'value',
    }
    Object.entries(updatedValues).forEach(([key, value]) => form[key][value] = task[key]);
    form.style = `border-left: 5px solid ${priorityColor[task.priority]}`;
    form.querySelector('.date').innerHTML = formatDate(task.deadline);
}
function updateTask (changedItem, task, listId) {
    task[changedItem.name] = changedItem.value;
    fillData(changedItem.form, task);
    app.updateTask(task, listId);
}
function removeTask ({id}, listId) {
    app.deleteTask(id, listId);
    removeItem(`task${id}`);
}
function createTask (task, listId) {
    const menu = createItem('div', {className: 'icon'}, createItem('img', {className: 'small', src: './images/menu.png'}));
    const checkbox = createItem('input', {className: 'icon', type: 'checkbox', name: "isComplete"});
    const title = createItem('input', {className: 'text', name: "title"});
    const date = createItem('div', {className: 'date', name: "date"});
    const expand = createItem('div', {className: 'icon expand'}, createItem('img', {src: './images/down.png'}));
    
    const notes = createItem('fieldset',  {className: 'notes'},
        createItem('legend',{}, 'Notes'),
        createItem('textarea', {className: 'spaced bordered', name: 'notes'}));
    const deadline = createItem('fieldset',  {className: 'deadline'},
        createItem('legend', {}, 'Due Date'),
        createItem('div', {className: 'date-menu bordered'},
            createItem('input', {
                type: "button",
                style:"border-radius: 4px 0 0 4px;",
                value: 'today',
                onclick: (e) => setDeadline(e.target, task, listId)
            }),
            createItem('input', {type: "button", value: 'tomorrow', onclick: (e) => setDeadline(e.target, task, listId)}),
            createItem('input', {type: 'date', style: "border-radius: 0 4px 4px 0", name: "deadline"})));
    const priority = createItem('fieldset',  {className: 'priority'},
        createItem('legend', {}, 'Priority'),
        createItem('select', {className: 'bordered spaced', name: "priority"},
            createItem('option', {value: 'none'}, 'None'),
            createItem('option', {value: 'low'}, 'Low'),
            createItem('option', {value: 'medium'}, 'Medium'),
            createItem('option', {value: 'high'}, 'High')));
    const deleteButton = createItem('button', {
        type: 'button',
        id: task.id,
        className: 'deleteButton bordered',
        onclick: (e) => removeTask(e.target, listId)
    }, 'Delete');
    const form = createItem('form', {
            id: `task${task.id}`,
            className: 'spaced bordered task-container',
            onchange: (e) => updateTask(e.target, task, listId),
            onsubmit: (e) => e.preventDefault(),
        },
        createItem('div', {className: 'title-bar spaced', onclick: expandPanel}, menu, checkbox, title, date, expand),
        createItem('div', {className: 'hidden panel'}, notes, deadline, priority, deleteButton));

    fillData(form, task);
    return form;
}
function newInput() {
    const input = document.getElementById('input-text')
    if (input.value) {
        const task = createTask(app.addTask({title: input.value}, currentList), currentList);
        document.getElementById('list').appendChild(document.createElement('li').appendChild(task));
    }
    console.log(input.value)
    input.value = ''
}
function loadList(listId) {
    const list = JSON.parse(localStorage.getItem('lists'))[listId]
    document.getElementsByTagName('title')[0].appendChild(document.createTextNode(list.name))
    document.getElementById('list-name').appendChild(document.createTextNode(list.name))
    document.getElementById('location').appendChild(document.createTextNode(list.location))

    const colorPicker = document.querySelector('nav>input[type=color]')
    colorPicker.addEventListener('change', (e) => {
        document.body.style.backgroundColor = e.target.value
        app.updateList(listId, {color: e.target.value})
    })
    colorPicker.value = document.body.style.backgroundColor = list.color

    const ul = document.getElementById('list')
    list.tasks.forEach(task => {
        ul.appendChild(document.createElement('li').appendChild(createTask(task, listId)))
    });
}
document.body.onkeyup = function (e) {
    if (e.key == 'Enter') {
      console.log('enter clicked!')
      newInput()
    }
}

var currentList = decodeURI(window.location.href.split('/')[3]);
app.lists[currentList] ? loadList(currentList) : location.href = '/';