const http = require('http');
const port = 8080;

const f = require('./Modules/func')

const mjs = require('mathjs');
const paper = require('./Modules/paper/paper-full.js');

http.createServer(function (req, res) {
    // HTTP header with the content type
    res.writeHead(200, {'Content-Type': 'text/html'});
    
    res.write("Hello");

    res.end();
}).listen(port);
