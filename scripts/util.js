const priorityColor = {
  none: ' 1px #e0e0e0',
  low: '5px #3465a4',
  medium: '5px #f57900',
  high: '5px #cc0000'
}
const properties = {
  isComplete: 'checked',
  title: 'value',
  notes: 'value',
  deadline: 'value',
  priority: 'value'
}

function createItem (type, props, ...children) {
  const item = document.createElement(type)
  if (props) Object.assign(item, props)
  for (const child of children) {
    if (typeof child !== 'string') item.appendChild(child)
    else item.appendChild(document.createTextNode(child))
  }
  return item
}

function removeItem (id) {
  const item = document.getElementById(id)
  item.parentNode.removeChild(item)
}

function formatDate (date) {
  // date format: yyyy-mm-dd 
  // displayDate format: dd/mm/yyyy or 'today' or 'tomorrow'
  if(!date) return '';
  const [yyyy, mm, dd] = date.split('-');
  const today = new Date();
  if(yyyy == today.getFullYear() && mm == today.getMonth()+1) {
    if(dd == today.getDate()) return 'today';
    else if(dd == today.getDate() + 1) return 'tomorrow';
  }
  return `${dd}/${mm}/${yyyy}`;
}

function getDate(day) {
  let date = new Date()
  if (day.value == 'tomorrow') date.setDate(date.getDate() + 1)
  date = date.toLocaleString().slice(0, 10)
  date = date.split('/').reduce((deadline, term) => deadline = term + '-' + deadline)
  return date
}

function expandPanel () {
  const panel = this.nextElementSibling
  if (panel.classList.contains('active')) {
    panel.classList.remove('active')
    this.querySelector('.expand').style.removeProperty('transform')
  } else {
    document.querySelectorAll('.panel.active').forEach(node => node.classList.remove('active'))
    document.querySelectorAll('.expand').forEach(node => node.style.removeProperty('transform'))
    panel.classList.add('active')
    this.querySelector('.expand').style = 'transform: rotate(180deg)'
  }
}

export {createItem, removeItem, formatDate, getDate, expandPanel, properties, priorityColor}