let http = require("http");

http.createServer(function (req, res) {
    res.write('Coming soon!');
    res.end();
}).listen(80);