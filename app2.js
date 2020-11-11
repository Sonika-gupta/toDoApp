class task {
    constructor({id, title, notes, priority, deadline, isComplete}) {
        this.id = id
        this.title = title
        this.notes = notes || ''
        this.priority = priority || 'none'
        this.deadline = deadline || ''
        this.isComplete = isComplete || false
    }
    updateTask(task) {
        return Object.assign(this, task);
    }
}

class toDoApp {
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

var app = new toDoApp();

function createItem (type, props, ...children) {
    let item = document.createElement(type);
    if (props) Object.assign(item, props);
    for (let child of children) {
      if (typeof child != "string") item.appendChild(child);
      else item.appendChild(document.createTextNode(child));
    }
    return item;
}

function appendData (data) {
    const newTask = app.addTask({title: data})

    const menu = createItem('div', {className: 'icon'}, createItem('img', {className: 'small', src: 'menu.png'}));
    const checkbox = createItem('input', {type: 'checkbox', className: 'icon', id: newTask.id, value: false});
    const title = createItem('label', {htmlFor: newTask.id}, createItem('div', {className: 'text'}, data));
    const date = createItem('div', {className: 'date'})
    const expand = createItem('div', {className: 'icon'}, createItem('img', {src: 'down.png'}));

    
    const notes = createItem('div',  {className: 'notes'}, createItem('label', {}, 'Notes', createItem('input', {type: 'textarea', value: newTask.notes})))
    const deadline = createItem('div',  {className: 'deadline'}, createItem('label', {}, 'Due Date', createItem('input', {type: 'date', value: newTask.deadline})))
    const priority = createItem('div',  {className: 'priority'}, createItem('label', {}, 'Priority', createItem('input', {type: 'select', value: newTask.priority})))
    const deleteButton = createItem('input', {className: 'deleteButton', type: 'button'}, 'Delete')

    const container = createItem('div', {className: 'bordered task-container'},
        createItem('div', {className: 'title-bar'}, menu, checkbox, title, date, expand),
        createItem('div', {className: 'panel'}, notes, deadline, priority, deleteButton))

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
