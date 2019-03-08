var http = require('http');
var dt = require('./myfirstmodule');
const math = require('mathjs');
const alte = require('algebrite');
const alba = require('algebra.js');

// the function inside create server will be executed when someone tries to access the computer on port 8080
http.createServer(function (req, res) {
    res.writeHead(200, {'Content-Type': 'text/html'}); // HTTP header with the content type
    
    res.write('The date and time are currently: ' + dt.myDateTime() + '<br>');
    res.write('The current page is ' + req.url + '<br>');

    res.end('Hello World!');
}).listen(8080); 
