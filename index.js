
const http = require("http");
const fs = require("fs").promises;
const sidebarPath = "./sidebar.json";
const htmlPath = "./index.html";
const toSidebar = require("./sidebar").toSidebar;

http.createServer(async function (req, res) {
    if (req.url.startsWith("/git")) {
        res.writeHead(307, {Location: "http://github.com/oliver-makes-code" + req.url.substr(4)});
        res.end();
        return;
    }

    if (req.url.indexOf("/..") != -1) {
        res.writeHead(403);
        res.end();
        return;
    }

    let loc = "." + req.url;

    if (req.url.startsWith("/assets")) {
        try {
            await fs.stat(loc);
        } catch(err) {
            res.writeHead(404);
            res.end();
            return;
        }

        res.writeHead(200);
        res.write(await fs.readFile(loc));
        res.end();

        return;
    }

    loc = "./site" + req.url;

    try {
        await fs.stat(loc + "/title.txt");
        await fs.stat(loc + "/body.txt");
    } catch(err) {
        res.writeHead(404);
        res.end();
        return;
    }

    const title = await fs.readFile(loc+"/title.txt", {encoding: 'utf-8'});
    const content = await fs.readFile(loc+"/body.txt", {encoding: 'utf-8'});
    const sidebar = toSidebar(JSON.parse(await fs.readFile(sidebarPath, {encoding: 'utf-8'})));
    const html = (await fs.readFile(htmlPath, {encoding: 'utf-8'})).replace("%sidebar%", sidebar).replace("%content%", content).replace("%title%", title);

    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write(html);
    res.end();
}).listen(80);
