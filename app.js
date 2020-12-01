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
/*     updateTask(task) {
        return Object.assign(this, task);
    } */
}
class ToDoApp {
    constructor() {
        var temp = localStorage.getItem('lists')
        if(temp) this.lists = JSON.parse(temp)
        else {
            this.lists = {
                0: {
                    name: 'personal',
                    color: 'white',
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
        this.nextId = localStorage.getItem('nextId') || 1;
    }
    getList(id) {
        return JSON.parse(localStorage.getItem('lists'))[id];
    }
    setList() {
        localStorage.setItem('lists', JSON.stringify(this.lists));
        console.log('list set.', localStorage)
    }
    newList(name) {
        let id = this.nextId;
        this.lists[id] = {
            name: name,
            color: this.default.color,
            location: this.default.location,
            tasks: [],
            nextId: 1
        }
        this.nextId++;
        localStorage.setItem('nextId', this.nextId);
        this.setList();
        return id;
    }
    deleteLists(ids) {
        console.log(ids);
        ids.forEach(id => {
            delete this.lists[id];
            console.log(this.lists.hasOwnProperty(id));            
        });
        this.setList();
    }
    renameList(id, newName) {
        console.log(id)
        this.lists[id].name = newName;
        this.setList();
    }
    updateList(id, newValue) {
        this.lists[id] = Object.assign(this.lists[id], newValue);
        this.setList()
    }
    addTask(task, listId) {
        console.log(this.lists)
        task.id = this.lists[listId].nextId;
        task = new Task(task)
        this.lists[listId].nextId++;
        this.lists[listId].tasks.push(task);
        this.setList()
        return task;
    }
    deleteTask({id}, listId) {
        var list = this.lists[listId].tasks;
        for (var i = 0; i < list.length; i++) {
            if (list[i].id == id) {
                list.splice(i, 1);
                break;
            }
        }
        this.setList();
    }
    updateTask(task, listId) {
        // console.log(id, name, value, 'inside update task')
        console.log(task.parent)
        /* var list = this.lists[listName].tasks;
        for (var i = 0; i < list.length; i++) {
            console.log(list[i]);
            if (list[i].id == id) {
                list[i][name] = value;
                console.log(list[i][name])
                break;
            }
        }
        this.setList(); */
    }
}
var app = new ToDoApp();
export {app, localStorage};