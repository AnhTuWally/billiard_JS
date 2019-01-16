const http = require('http');
const port = 8080;

const f = require('./Modules/func')

const mjs = require('mathjs');

function angleOut(angleIn){
    return angleIn;
}

http.createServer(function (req, res) {
    // HTTP header with the content type
    res.writeHead(200, {'Content-Type': 'text/html'});
    
    
    var v = [0, 1];
    var n = [0 , -1];

    res.write("Result: " + f.vectorOut(v, n));

    res.end();
}).listen(port);
