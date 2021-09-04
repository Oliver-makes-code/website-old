let div = "</div>\n";
let item = '<div class="side-element" onclick="redirect(\'%1\')">';
let sub = '<div class="sub-menu" style="animation-play-state:paused;" id="%1">';
let subTitle = '<div class="sub-title" onclick="toggle(\'%1\')">'
let subItem = '<div class="sub-element" onclick="redirect(\'%1\')">'
function toSidebar(arr) {
  let out = "";
  for (let i in arr) {
    let element = arr[i];
    if (element.type == "item")
      out += item.replace("%1",element.url) + element.text;
    else {
      out += sub.replace("%1", element.title)+"\n";
      out += subTitle.replace("%1", element.title) + element.title + div;
      for (let j in element.items) {
        let currItem = element.items[j];
        out += subItem.replace("%1",currItem.url) + currItem.text + div;
      }
    }
    out += div;
  }
  return out;
}

module.exports.toSidebar = toSidebar;