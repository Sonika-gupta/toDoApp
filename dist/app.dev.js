'use strict'

function newItem () {
  console.log('Inside new Item')
  var item = document.getElementById('new-task').value
  console.log(item)
  var ul = document.getElementById('list')
  var li = document.createElement('li')
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
