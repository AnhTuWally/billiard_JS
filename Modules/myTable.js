// Make the paper scope global, by injecting it into window:
paper.install(window);

const rot_90 = [ [0, -1],
                 [1,0  ]];

const tol = 10e-6;

const ul_corner = [0, 0]; // upper left corner

var states = [];

xvToEq = function(xv){
    const x = xv[0];
    const v = xv[1];

    try{
        const m = v[1]/v[0];

        if (Math.abs(m) > 10e10) {throw new Error('Undefined slop bc of big number');}
        return [ [m, -1, 0], (m*x[0] - x[1])]
    }
    catch(err){
        // console.log("Undefined slope");
        return [ [1, 0, 0], x[0] ]
    }
}

collide = function(p, w){
    /*
     * p : particle
     * w : wall
     */
    // console.log(w);
    const x_p = p[0];
    const v_p = p[1];
    
    const w_Ab = xvToEq(w);

    const mat_A = [ 
                    [1,     0,      -v_p[0]],
                    [0,     1,      -v_p[1]],
                    w_Ab[0],
                  ];

    const vec_b = [x_p[0], x_p[1], w_Ab[1]];
    
    // console.log(mat_A);
    // console.log(vec_b);

    return math.transpose(math.lusolve(mat_A, vec_b))[0]
}

normalize = function(v){
    /*
    input: vector
    output: normalized vector
    */
    return math.divide(v, math.norm(v))
}

vectorOut = function(ptc, w){
    /*
     * FUNCTION: 
     * - Calculating the collision point, reflected vector, and collution time 
     * INPUT:
     * ptc 
     * -[ [x_0, y_0], [v_x0, v_y0] ]
     * -the vector of the particle
     * w
     * -[ [x_w0, y_w0], [wx, wy] ];
     * -the vector of the wall

     * OUTPUT:
     * [ [x_1, y_1], [v_x1, v_y1], t]       
     */
    
    try{
        // Solving for colliding point
        var sol = collide(ptc, w);
        
        // CASE 1: t < 0
        if (sol[2] < 0) {
            return [ [[sol[0], sol[1]], [Number.NaN, Number.NaN]], sol[2] ];
        }
        
        // CASE 3: t >=0
        const v = normalize(ptc[1]); // normalize v of particle
        const n = normalize( math.multiply( rot_90 , w[1] ) ); // normalize n of wall
        const v_out =  math.subtract(v, math.multiply(2 * math.dot(n,v), n));

        return [ [[sol[0], sol[1]], v_out], sol[2] ];

    } catch( err ) {
        // CASE 3: No Solution
        console.log( err );
        return [ [[Number.NaN, Number.NaN], [Number.NaN, Number.NaN]], -1 ];
    }
}


nextPt = function(pt, v, c=1){
	/*
     * Calculating the next point based on current pos and vector
     */
    
    v = math.multiply(c, v);
	return math.add(pt, v);
}

nextPt2 = function(xv, t){
    /*
     * Calculating the next point at time t
     */
    const x = xv[0];
    const v = xv[1];

    x[0] = x[0] + t*v[0];
    x[1] = x[1] + t*v[1];

    return [ [x[0], x[1]], v ];
}

drawVector = function(xv, c=1, sc = 'black', draw_root = false){
    /*
     * Draw the path given the current pos and vector
     */
    const x = xv[0];
    const v = xv[1];
    
    if (draw_root){
        var rt = new Path.Circle(new Point(x[0], x[1]), 3);
        rt.strokeColor = 'green'; // root
    }
	const path =  new Path.Line({
		from: x,
		to:   nextPt(x, v, c),
		strokeColor: sc,
		selected: false
	});	

    return [rt, path]
}

drawPath = function(start, end, c=1, sc = 'blue', draw_root = true){
    /*
     * Draw the path given the current pos and vector
     */
    if (draw_root){
        var rt = new Path.Circle(new Point(start), 3);
        rt.strokeColor = 'green'; // root
    }
	var path =  new Path.Line({
		from: start,
		to:   end,
		strokeColor: sc,
		selected: false
	});	
	
    return path
}
// MISC function
ptsToEq = function(x0, x1){
    /*
     * convert two points to parametrix array [x, y, t]
     */
    try{
        const m = (x1[1] - x0[1]) / (x1[0] - x0[0]);
        return [ [m, -1, 0], (m*x0[0]- x0[1]) ]
    }
    catch(err){
        // console.log("Undefined slope");
        return [ [1, 0, 0], x0[0] ]
    }
    
}

idxSmallest = function(arr){
    /*
     * Smallest positive index
     */

    var output_idx = [];

    var num, diff;
    
    var pos_arr = arr.filter(function(x){ return x>0 })
    var smallest   = Math.min(...pos_arr);
    
    for ( var idx = 0; idx < arr.length; idx++ ){
        num = arr[idx];    
        if ( (num > 0) && Math.abs(num - smallest) < tol ){
            output_idx.push(idx);
        }
    }

    // console.log(output_idx);
    return output_idx
}

parseCord = function(cord){
    /*
     * Parse coord in the form of (x, y)
     */
    cord = cord.split(',');
    return cord.map(parseFloat)
}

drawRect = function() {
    
    paper.clear();

    paper.setup('b_table');

    // GATHER INPUT INFO
    
    var w = parseInt(document.getElementById('table_width').value);
    var h = parseInt(document.getElementById('table_height').value);

    var initial_position = parseCord(document.getElementById('position').value);
    
    // initial_position = math.add(ul_corner, initial_position);
    


    var initial_heading  = parseCord(document.getElementById('heading').value);
    var particle = [ initial_position, initial_heading ];

    var num_iter  = parseInt(document.getElementById('num_iter').value);

    // DRAW RECTANGLE
    
    var walls =[
                    [ ul_corner,                            [w, 0]  ],
                    [ [ul_corner[0] + w, ul_corner[1]],     [0, h]  ],
                    [ [ul_corner[0] + w, ul_corner[1]+h],   [-w, 0] ],
                    [ [ul_corner[0],     ul_corner[1]+h],   [0, -h] ]
                 ]
    
    var draw_walls = walls.map(function(x) {return drawVector(x, 1, 'blue')});
    
    // Initialization
    var v_out_lst, t_col, idx_wall, w, v_in, v_out, bounce, path, start, end;
	
	states = [];  //reset states

    // BEGIN LOOP
    for ( var  lp = 0; lp < num_iter; lp++ ){
        v_out_lst = walls.map(function(x) {return vectorOut(particle, x)});
        // console.log(v_out_lst)
        
        t_col = v_out_lst.map(function(x) {return x[1]});

        // console.log(t_col);
        idx_wall = idxSmallest(t_col);
        w = walls[idx_wall[0]];
        v_out = vectorOut(particle, w);

        // DRAW
        start = new Point(particle[0]);
        end = new Point(v_out[0][0])

        path = drawPath(start, end);
        
        v_out[0][0] = nextPt2( particle, v_out[1] - tol)[0]; // BACK UP just a tad bit 

        // NEW POS
        if ( idx_wall.length > 1 ) {
            // Bounce to the corner
            // v_out[0] = nextPt2( particle, v_out[1] - 3*tol); 
            v_out[0][1] = math.multiply(-1, particle[1]);
        }

        particle = v_out[0];
		states.push(particle); //append new state
    }
}


circleCollide = function(circle, line){
    
    /*
     *  https://math.stackexchange.com/questions/311921/get-location-of-vector-circle-intersection
     */
    var center = circle[0];
    var r = circle[1];

    var x = line[0];
    var v = line[1];

    var a = v[0]**2 + v[1]**2;
    var b = 2*( v[0]*(x[0] - center[0]) + v[1]*(x[1] - center[1]) );
    var c = (x[0] - center[0])**2 + (x[1] - center[1])**2 - r**2;

    var delta = b**2 - 4 * a * c;

    if (delta < 0){
        return Number.NaN;
    } else{
        delta = math.sqrt(delta)
        return [(-b - delta) / (2 * a), (-b + delta) / (2 * a)]
    }
}

vecFromPts = function(x, y){
    return math.subtract(y, x);
}

reflect = function(ptc, n){
        
    const v = normalize(ptc[1]); // normalize v of particle
    const n_vec = normalize(n[1]); // normalize n of wall
    const v_out =  math.subtract(v, math.multiply(2 * math.dot(n_vec, v), n_vec));

    return [n[0], v_out];
}

drawCircle = function(){
    paper.clear();

    paper.setup('b_table');

    // GATHER INPUT INFO
    
    var w = parseInt(document.getElementById('table_width').value);
    var h = parseInt(document.getElementById('table_height').value);

    var initial_position = parseCord(document.getElementById('position').value);
    
    initial_position = math.add(ul_corner, initial_position);
    

    var initial_heading  = parseCord(document.getElementById('heading').value);
    var particle = [ initial_position, initial_heading ];

    var num_iter  = parseInt(document.getElementById('num_iter').value);

    // DRAW CIRCLE
    var center = new Point(w, w);
    var cle = new Path.Circle(center, w);
     
    cle.strokeColor = 'black';
    
    var circle = [[w, w], w];

    var path, t_res, n, start, end, v_out ;
    
    // -----------------
	
	states = [];  //reset states

    for (var i = 0; i < num_iter; i++){
    
        t_res = circleCollide(circle, particle);
        t_res = t_res.filter(function(x){return x > 0});
    
        start = new Point(particle[0]);
        end = nextPt2( particle, t_res[0] - tol)[0]; 
        
        path = drawPath(start, end);

        //console.log(path);

        n = [end, vecFromPts(end, circle[0])];
        particle = reflect(particle, n);
		states.push(particle); //append new state
        //drawVector(particle, 1000, 'red');
    }
    
}

exportSVG = function(){
    var svg = paper.project.exportSVG({asString: true});
    console.log(svg);
    var blob = new Blob([svg], {type: "image/svg+xml;charset=utf-8"});
    saveAs(blob, 'billiard.svg');
}

run = function(){
    var table_shape = document.querySelector('input[name="table_shape"]:checked').value;
    console.log(table_shape);

    if (table_shape === 'rectangle'){
        drawRect();
    }else if (table_shape === 'circle'){
        drawCircle();
    }
}

exportStates = function(){
	states = states.map(function(x) {return x.flat()});

	var lineArray = [];
	states.forEach(function (infoArray, index) {
	    var line = infoArray.join(",");
	    lineArray.push(line);
	});
	var csvContent = lineArray.join("\n");
	console.log(csvContent);
	var blob = new Blob([csvContent], {type: "data:text/csv;charset=utf-8"});
	saveAs(blob, 'states.csv');
}

window.onload = function() {
    drawRect();
}



