// manual minification / optimisation

//a = c.getContext('2d');
//b = document.body;
//c = document.getElementsByTagName('canvas')[0];

//d = blossom()
//	scope:
//		flower() = ff
//		stalk() = ss
//		multiplier = mm
//		posMultiplier = mp
//		startX = xs
//		startY = ys
//		stopX = xt
//		stopY = yt
//		ctrlX = xc
//		ctrlY = yc
//		deltaX = xd
//		deltaY = yd
//		diffX = xf
//		diffY = yf
//		posX = xp
//		posY = yp
//e
//f//reserved
//g = block
//h = height
//i = horizon
//j
//k
//l = limit
//m//reserved
//n//reserved
//o
//p = pi
//q = render_()
//	render frame -> f
//r = random_()
//	random min -> m
//	random max -> n
//s = sky
//t = ground
//u
//v
//w = width
//x//reserved
//y
//z
//M = Math
//P = pi
//W = window

// ===
// 		Daisy Chain!
//						===

// properties
// var
// globals
W = window;
Wt = window.setTimeout;
M = Math;

//width, height,

// plot
P = M.PI;
//horizon,
//block,

// palette
//sky;

// body width, 3:1 ratio
c.width = w = b.clientWidth;
c.height = h = w / 3;

// set plot
i = h * 0.2;
g = 10;

// set sky drop
s = a.createLinearGradient(0, 0, 0, h);
s.addColorStop(0, '#0FF');
s.addColorStop(1, '#00F');

// set fill to sky
a.fillStyle = s;
a.fillRect(0, 0, w, h);

/**
 *	Generate random number.
 *	@param {Number} min Minimum number to generate
 *	@param {Number} max Maximum number to generate
 */
function r(m, n) {
	// _.random()
	return m + M.floor(M.random() * (n - m + 1));
}

/**
 *	Intelligently render on framerate intervals. (reduces lag)
 *	@param {Function} frame Callback function to generate frame
 */
function q(f) {
	// requestAnimationFrame shim (@paul_irish)
	(W.requestAnimationFrame ||
		W.webkitRequestAnimationFrame ||
		W.mozRequestAnimationFrame ||
		function(fn){
			Wt(fn, 1000 / 60);
		})(f);
}

/**
 *	Blossoms a daisy!
 */
function d() {
	// set scope
	var mm, mp,
		xs, ys,
		xt, yt,
		xc, xy,
		xd, yd,
		xf, yf,
		xp, yp;

	// set random mm, determines size
	mp = 0;
	mm = r(5, (i * 3) / g);

	// set where to start
	xp = xs = r(g, w - g);
	yp = ys = h - i + g;

	// set where to end
	xt = r(xs - mm, xs + mm);
	yt = ys - (g * mm);

	// set gradient for quadratic curve
	xc = r(xs - mm, xt + mm);
	xy = r(ys, yt);

	// determine velocity in x and y directions
	xd = M.abs(xt - xs);
	yd = M.abs(yt - ys);

	// velocity, where diff = distance per frame
	xf = yf = 1; (xd > yd) ? yf = yd / xd : xf = xd / yd;

	/**
	 *	Renders daisy flower.
	 */
	function ff() {
		// render stamen
		a.beginPath();
		a.fillStyle = '#FF0';
		a.arc(xt, yt, (g * mp)/P/1.5/1.5, 0, P*2);
		a.fill();
		//a.restore();

		// render petals (unicode chars ftw)
		a.fillStyle = '#FFF';
		a.font = (g * mp) + "pt serif";
		a.fillText("\u273f", xt - (g * mp)/2, yt + (g * mp)/2, g * mp);

		// progress position
		mp++;

		// loop until flower is fully rendered
		if(mp !== mm) q(ff);
	}

	/**
	 *	Renders daisy stalk.
	 */
	function ss() {
		// render quadratic curve
		a.beginPath();
		a.lineWidth = g;
		a.strokeStyle = '#000';
		a.moveTo(xs, ys);
		a.quadraticCurveTo(xc, xy, xp, yp);
		a.stroke();
		//a.restore();

		// set ground drop (maintains position above stalk)
		a.fillStyle = '#080';
		a.fillRect(0, h - i, w, i);

		// progress position
		xp += xf;
		yp -= yf;

		// loop, or move on to the flower
		(yp !== yt) ? q(ss) : ff();
	}

	// render only when coordinates are different, else try again
	// fixes rendering bug where flowers would appear without stalk
	(xt !== xs) ? ss() : d();

	// and we're done!
	// return;
}

// generate random number of daisies, *spor*adically between 0.5s and 8s
// excuse the pun...
d();
for(var x=0, l=r(0, 25); x<l; x++) {
	Wt(d, r(500, 8000));
}
