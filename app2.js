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
        this.deadline = deadline || 'Today'
        this.isComplete = isComplete || false
    }
    updateTask(task) {
        return Object.assign(this, task);
    }
}

class ToDoApp {
    constructor() {
        this.list = [];
        this.nextId = 1;
        
    }
    getList(listName) {
        return JSON.parse(localStorage.getItem(listName)) || [];
    }
    setList(list) {
        localStorage.setItem("list", JSON.stringify(list));
    }
    addTask(task) {
        task.id = this.nextId;
        task = new Task(task)
        this.nextId++;
        this.list.push(task);
        this.setList(this.list)
        return task;
    }
    removeTask({id}) {
        var list = todoController.getList('list');
        for (var i = 0; i < list.length; i++) {
            if (list[i].id == id) {
                list.splice(i, 1);
                break;
            }
        }
        this.setList(list);
    }
}

var app = new ToDoApp();

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

function appendData (data) {
    const newTask = app.addTask({title: data})
    console.log(newTask);
    const menu = createItem('div', {className: 'icon'}, createItem('img', {className: 'small', src: 'menu.png'}));
    const checkbox = createItem('input', {type: 'checkbox', className: 'icon', id: newTask.id, value: false});
    const title = createItem('input', {className: 'text', value: data});
    const date = createItem('div', {className: 'date'}, newTask.deadline)
    const expand = createItem('div', {className: 'icon expand'}, createItem('img', {src: 'down.png'}));
    
    const notes = createItem('div',  {className: 'notes'}, 
        createItem('label',{for: 'notes'}, 'Notes'),
        createItem('textarea', {className: 'bordered', name: 'notes', value: newTask.notes}))
    const deadline = createItem('div',  {className: 'deadline'},
        createItem('label', {for: 'deadline'}, 'Due Date'),
        createItem('input', {type: 'date', className: 'bordered', name: 'deadline', value: newTask.deadline}))
    const priority = createItem('div',  {className: 'priority'},
        createItem('label', {for: 'priority'}, 'Priority'),
        createItem('input', {type: 'select', className: 'bordered', name: 'priority', value: newTask.priority}))
    // const deleteButton = createItem('div', {className: 'deleteButton'}, createItem('button', {for: 'notes'}, 'Delete'))
    const deleteButton = createItem('button', {className: 'bordered deleteButton'}, 'Delete')

    const container = createItem('div', {className: 'bordered task-container'},
        createItem('div', {className: 'title-bar', onclick: expandPanel}, menu, checkbox, title, date, expand),
        createItem('div', {className: 'panel'}, notes, deadline, priority, deleteButton))
    container.style.borderLeft = `5px solid ${color[newTask.priority]}`;
    document.getElementById('list').appendChild(document.createElement('li').appendChild(container))
}
function newItem () {
  console.log('Inside new Item')
  const item = document.getElementById('input-text')
  console.log(item)
  if (item.value) appendData(item.value)
  item.value = ''
}
console.log(list)
// function removeItem (e) {
//   e.target.remove()
// }
document.body.onkeyup = function (e) {
  if (e.keyCode === 13) {
    console.log('enter clicked!')
    newItem()
  }
}
