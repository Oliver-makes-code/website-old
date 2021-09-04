let http = require("http");
let fs = require("fs");
let sidebarPath = "./sidebar.json";
let htmlPath = "./index.html";
let toSidebar = require("./sidebar").toSidebar;
console.log("a");
http.createServer(function (req, res) {
    console.log("Recieved request");
    console.log(req.url);
    if (req.url.indexOf("/..") != -1) {
        res.writeHead(403);
        res.end();
        return;
    }
    let loc = "." + req.url;
    if (req.url.startsWith("/assets")) {
        if (!fs.existsSync(loc)) {
            res.writeHead(404);
            res.end();
            return;
        }
        res.writeHead(200);
        res.write(fs.readFileSync(loc));
        res.end();
        return;
    }
    loc = "./site"+req.url;
    if (!fs.existsSync(loc+"/title.txt") || !fs.existsSync(loc+"/body.txt")) {
        res.writeHead(404);
        res.end();
        return;
    }
    let title = fs.readFileSync(loc+"/title.txt").toString();
    let content = fs.readFileSync(loc+"/body.txt").toString();
    let sidebar = toSidebar(JSON.parse(fs.readFileSync(sidebarPath)));
    let html = fs.readFileSync(htmlPath).toString().replace("%sidebar%",sidebar).replace("%content%",content).replace("%title%",title);
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write(html);
    res.end();

}).listen(80);