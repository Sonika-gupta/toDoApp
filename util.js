
export function createItem (type, props, ...children) {
    const item = document.createElement(type);
    if (props) Object.assign(item, props);
    for (let child of children) {
      if (typeof child != "string") item.appendChild(child);
      else item.appendChild(document.createTextNode(child));
    }
    return item;
}

export function removeItem(id) {
  const item = document.getElementById(id);
  item.parentNode.removeChild(item);
}