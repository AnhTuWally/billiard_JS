const mjs = require('mathjs');
exports.vectorOut = function(v, n){
    /*
    var v = [x0, y0];
    var n = [x1, y1];
    v is the vector of the particle
    n is the normal vector of the wall
    v - 2(n . v)n 
    */
    return  mjs.subtract(v, mjs.multiply(2 * mjs.dot(n,v), n));
}
