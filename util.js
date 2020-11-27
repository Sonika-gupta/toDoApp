
export function createItem (type, props, ...children) {
    let item = document.createElement(type);
    if (props) Object.assign(item, props);
    for (let child of children) {
      if (typeof child != "string") item.appendChild(child);
      else item.appendChild(document.createTextNode(child));
    }
    return item;
}