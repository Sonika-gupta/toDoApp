'use strict'

function newItem () {
  console.log('Inside new Item')
  const item = document.getElementById('new-task').value
  console.log(item)
  const ul = document.getElementById('list')
  const li = document.createElement('li')
  li.appendChild(document.createTextNode('- ' + item))
  ul.appendChild(li)
  document.getElementById('new-task').value = ''
} // function removeItem (e) {
//   e.target.remove()
// }

document.body.onkeyup = function (e) {
  if (e.keyCode == 13) {
    console.log('enter clicked!')
    newItem()
  }
}
