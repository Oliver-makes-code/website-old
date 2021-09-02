let http = require("http");

http.createServer(function (req, res) {
    res.write('Coming soon!');
    console.log("Recieved request");
    res.end();
}).listen(80);