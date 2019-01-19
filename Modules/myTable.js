// Make the paper scope global, by injecting it into window:
paper.install(window);
window.onload = function() {
	// Setup directly from canvas id:
	paper.setup('b_table');
	var path = new Path();
	path.strokeColor = 'black';
	var start = new Point(100, 100);
	path.moveTo(start);
	path.lineTo(start.add([ 200, -50 ]));
	view.draw();
}
