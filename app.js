const localStorage = window.localStorage;
const color = {
    none: '',
    low: '#3465a4',
    medium: '#f57900',
    high: '#cc0000'
};
class Task {
    constructor({id, title, notes, priority, deadline, isComplete}) {
        this.id = id
        this.title = title
        this.notes = notes || ''
        this.priority = priority || 'low'
        this.deadline = deadline || ''
        this.isComplete = isComplete || false
    }
    updateTask(task) {
        return Object.assign(this, task);
    }
}

class ToDoApp {
    constructor() {
        this.lists = {
            personal: {
                color: 'white',
                tasks: []
            }
        };
        this.nextId = 1;
    }
    getList(listName = 'personal') {
        return JSON.parse(localStorage.getItem(lists[listName]));
    }
    setList(listName = 'personal') {
        localStorage.setItem(lists[listName], JSON.stringify(this.lists[listName]));
        console.log('list set.', localStorage)
    }
    addTask(task, listName = 'personal') {
        task.id = this.nextId;
        task = new Task(task)
        this.nextId++;
        if(!this.lists[listName]) this.lists[listName] = {tasks: []};
        this.lists[listName].tasks.push(task);
        this.setList(listName)
        return task;
    }
    deleteTask({id}, listName) {
        console.log(id, 'inside remove')
        var list = this.lists[listName].tasks;
        for (var i = 0; i < list.length; i++) {
            if (list[i].id == id) {
                list.splice(i, 1);
                break;
            }
        }
        this.setList(listName);
        removeTask(`task${id}`, listName)
    }/* 
    renderList(listName = 'personal') {
        load(listName)
    } */
}

function createItem (type, props, ...children) {
    let item = document.createElement(type);
    if (props) Object.assign(item, props);
    for (let child of children) {
      if (typeof child != "string") item.appendChild(child);
      else item.appendChild(document.createTextNode(child));
    }
    return item;
}
function expandPanel() {
    this.classList.toggle("active");
    var panel = this.nextElementSibling;
    if (panel.style.display === "grid")
        panel.style.display = "none";
    else
        panel.style.display = "grid";
}

function appendTask (viewtasks, task, listName = 'personal') {
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
            createItem('input', {type: 'date', 'style.width': '100px', value: task.deadline})))
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
        onclick: (e) => app.deleteTask(e.target, listName)
    }, 'Delete')

    const container = createItem('div', {id: `task${task.id}`, className: 'spaced bordered task-container'},
        createItem('div', {className: 'title-bar', onclick: expandPanel}, menu, checkbox, title, date, expand),
        createItem('form', {className: 'panel'}, notes, deadline, priority, deleteButton))
    container.style.borderLeft = `5px solid ${color[task.priority]}`;
   viewtasks.appendChild(document.createElement('li').appendChild(container))
}
function removeTask(id, listName = 'personal') {
    const item = document.getElementById(id);
    item.parentNode.removeChild(item);
}
function newInput () {
  console.log('Inside new Item')
  const input = document.getElementById('input-text')
  console.log(input)
    if (input.value) appendTask(app.addTask({title: input.value}))
  input.value = ''
}

function loadList(listName = 'personal') {
    document.getElementsByTagName('title')[0].appendChild(document.createTextNode(listName));
    const temp = JSON.parse(localStorage.getItem(listName));
    console.log('loading', temp)
    const viewtasks =  document.getElementById('list')
    if(temp) {
        temp.forEach(element => {
            appendTask(viewtasks, element, listName)
        });
    }
};

function appendListIcon(viewlists, list) {
    const listIcon = createItem('div', {onclick: () => {
        location.href = `/${list[0]}`;
    }} ,
        createItem('div', {className: 'bordered list-icon', color: list[1].color}),
        createItem('div', {className: 'caption'}, list[0]),
        createItem('div', {className: 'caption light'}, list.location || 'On This Computer'),
    );
    viewlists.appendChild(listIcon)
}

function getLists() {
    var temp = localStorage.getItem('lists')
    if(!temp) localStorage.setItem('lists', JSON.stringify(app.lists))
    console.log(temp);
    return JSON.parse(temp) || app.lists
}
function load() {
    const lists = getLists();
    const viewlists = document.getElementById('index');
    // console.log(Object.entries(lists))
    Object.entries(lists).forEach(list => {
        console.log(list)
        appendListIcon(viewlists, list)
    })
}

document.body.onkeyup = function (e) {
    if (e.keyCode === 13) {
      console.log('enter clicked!')
      newInput()
    }
}

var app = new ToDoApp();
load();