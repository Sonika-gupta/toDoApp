const app = require('./app.js')
(function(exports) { 
   
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
        container.style.borderLeft = `5px solid ${priorityColor[task.priority]}`;
       viewtasks.appendChild(document.createElement('li').appendChild(container))
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
    }
   
    // Export the function to exports 
    // In node.js this will be exports  
    // the module.exports 
    // In browser this will be function in 
    // the global object sharedModule 
    exports.loadList = loadList; 
       
})(typeof exports === 'undefined' ? this['appController'] = {} : exports); 