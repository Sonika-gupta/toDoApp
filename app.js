var count = 0; var list = []

function createItem (data, type, className) {
  let item
  console.log(data)
  if (type) {
    item = document.createElement(type)
    type === 'img'
      ? item.src = data
      : type === 'div'
        ? typeof data === 'object'
          ? item.appendChild(data)
          : item.appendChild(document.createTextNode(data))
        : item.innerHTML = data
  } else item = document.createTextNode(data)
  if (className) item.className = className
  return item
}
function createCheckbox (data) {
  var checkbox = document.createElement('input')
  checkbox.className = 'icon'
  checkbox.type = 'checkbox'
  /* checkbox.name = 'name'
  checkbox.value = 'value' */
  checkbox.id = count++

  var label = document.createElement('label')
  label.htmlFor = checkbox.id
  label.appendChild(data)
  return [checkbox, label]
}
function appendData (data) {
  list.push(data)
  const img = createItem('menu.png', 'img')
  const icon = createItem(img, 'div', 'icon small')
  const div = createItem(icon, 'div', 'task')
  const task = createItem(data, 'div', 'text')
  const [checkbox, label] = createCheckbox(task)
  div.appendChild(checkbox)
  div.appendChild(label)
  document.getElementById('list').appendChild(document.createElement('li').appendChild(div))
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
