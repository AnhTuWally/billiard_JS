// Make the paper scope global, by injecting it into window:
paper.install(window);

const wall = [[100, 100], [100, 200], [500, 200], [500, 100]];

vectorOut = function(v, n){
    /*
    var v = [x0, y0];
    var n = [x1, y1];
    v is the vector of the particle
    n is the normal vector of the wall
    v - 2(n . v)n 
	n need to be normalized
    */
    return  math.subtract(v, math.multiply(2 * math.dot(n,v), n));
}

normalize = function(v){
	/*
	input: vector
	output: normalized vector
	*/
	return math.divide(v, math.norm(v))
}

nextPt = function(pt, v, c=1){
	v = math.multiply(c, v);
	return math.add(pt, v);
}

window.onload = function() {
	// Setup directly from canvas id:
	paper.setup('b_table');
    
    // Initialize path
	var path = new Path();
	path.strokeColor = 'black';
	for ( var i = 0; i < wall.length; i++ ){
        path.add(new Point(wall[i]));
    console.log(wall[i])
    }
    path.closed = true;
    path.fullySelected = true;


    // http://mathjs.org/docs/reference/functions/lusolve.html
    const a = [[-2, 3], [2, 1]];
    const b = [11, 9];
    const x = math.lusolve(a, b);  // [[2], [5]]
    console.log(x);

    
    const a1 = [[1, 0], [2, 0]];
    const b1 = [11, 9];
    try{
        const x1 = math.lusolve(a1, b1);
        console.log(x1);
    }
    catch( err ){
        console.log(err.message); // system cannot be solved
    }

	console.log(vectorOut([5,-1], [0, 1]));
	
	var n = normalize([5, 1]);
	var v = [2, -1];	
	var v2 = vectorOut(v, n);
		
	var mirror = new Path.Line({
		from: [100, 500],
		to:   nextPt([100, 500], n, 100),
		strokeColor: 'black',
		selected: true
	});	

	console.log(nextPt([100, 500], n, 50));	
	
	var v_in = new Path.Line({
		from: [100, 500],
		to:   nextPt([100, 500], v, 100),
		strokeColor: 'black',
		selected: false
	});	
	
	var v_out = new Path.Line({
		from: [100, 500],
		to:   nextPt([100, 500], v2, 100),
		strokeColor: 'blue',
		selected: false
	});	
}
