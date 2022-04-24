let div = "</div>\n";
let item = '<div class="side-element" onclick="redirect(\'%1\')">';
let sub = '<div class="sub-menu" style="animation-play-state:paused;" id="%1">';
let subTitle = '<div class="sub-title" onclick="toggle(\'%1\')">'
let subItem = '<div class="sub-element" onclick="redirect(\'%1\')">'
const sidebarPath = "./sidebar.json";
const htmlPath = "./index.html";
function toSidebar(arr: (ItemSidebar | SubmenuSidebar)[]) {
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

type ItemSidebar = {
    type: "item",
    url: string,
    text: string
}
type SubmenuSidebar = {
    type: "menu",
    title: string,
    items: {
        url: string,
        text:string
    }[]
}

import { serve } from "https://deno.land/std@0.114.0/http/server.ts";
console.log("Listening...");
serve(async (req, inf) => {
    let path = req.url.substring(req.url.indexOf("/",8));
    if (path.indexOf("/..") != -1) {
        return new Response("Forbidden", {"status": 403});
    }
    let loc = "."+path;
    if (loc.startsWith("./assets")) {
        try {
            await Deno.stat(loc);
        } catch(err) {
            return new Response("Not found", {"status": 404});
        }

        let stream = await Deno.readFile(loc);

        return new Response(stream);
    }

    loc = "./site"+path;
    try {
        await Deno.stat(loc + "/title.txt");
        await Deno.stat(loc + "/body.txt");
    } catch(err) {
        return new Response("Not found", {"status": 404});
    }

    const title = await Deno.readTextFile(loc + "/title.txt");
    const content = await Deno.readTextFile(loc + "/body.txt");
    const sidebar = toSidebar(JSON.parse(await Deno.readTextFile(sidebarPath)));
    const html = (await Deno.readTextFile(htmlPath)).replace("%sidebar%", sidebar).replace("%content%", content).replace("%title%", title);

    return new Response(html, {
        "headers": {
            "content-type": "text/html"
        }
    });
}, {
    "addr": "localhost:80"
});