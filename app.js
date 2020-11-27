const localStorage = window.localStorage;
class Task {
    constructor({id, title, notes, priority, deadline, isComplete}) {
        this.id = id
        this.title = title
        this.notes = notes || ''
        this.priority = priority || ''
        this.deadline = deadline || ''
        this.isComplete = isComplete || false
    }
    updateTask(task) {
        return Object.assign(this, task);
    }
}
class ToDoApp {
    constructor() {
        var temp = localStorage.getItem('lists')
        if(temp) this.lists = JSON.parse(temp)
        else {
            this.lists = {
                personal: {
                    color: 'grey',
                    location: 'On This Computer',
                    tasks: [],
                    nextId: 1
                }
            };
            localStorage.setItem('lists', JSON.stringify(this.lists))
        }
        this.default = {
            color: '#becedd',
            location: 'On This Computer',
        };
    }
    getList(listName) {
        return JSON.parse(localStorage.getItem('lists'))[listName];
    }
    setList() {
        localStorage.setItem('lists', JSON.stringify(this.lists));
        console.log('list set.', localStorage)
    }
    addTask(task, listName) {
        console.log(this.lists)
        task.id = this.lists[listName].nextId;
        task = new Task(task)
        this.lists[listName].nextId++;
        this.lists[listName].tasks.push(task);
        this.setList()
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
        this.setList();
    }
    newList(name) {
        this.lists[name] = {
            color: this.default.color,
            location: this.default.location,
            tasks: [],
            nextId: 1
        }
        this.setList(name);
    }
}
var app = new ToDoApp();
export {app, localStorage};