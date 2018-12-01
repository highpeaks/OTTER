var x, y, z, img, lat, lon;

var paragraphs = [];
var place;

var stars = [];

var firstload = false;

function preload(){
	img = loadImage('worldtex.jpg');
}

function setup() {

  var density = displayDensity();
  pixelDensity(density);
  var c = createCanvas(windowWidth * 0.4, windowWidth * 0.4, WEBGL);
	c.parent('map');

	place = createElement('h2');
	place.parent('place');

	for (let i = 0; i < 7; i++){
		let p = createP('');
		p.parent('tweets');
		paragraphs.push(p);
	}
	refresh();


	setInterval(refresh, 1000 * 7);

}

function draw() {

  background(0,0,0,0);
	pointLight(255, 255, 255, -width/2, -height/4, 0);

	if (firstload){

		rotateY(PI);
		rotateX(lat);
		rotateY(lon * -1);
		texture(img);
		sphere(height/2.45);

		translate(x, y, z);
	  fill(204,0,51);
		let d = map(sin((frameCount/200)*TAU),-1,1,1,2);
	  sphere(d);
	}
}

function refresh(){

	loadJSON('/coordpoll', gotCoord);

	function gotCoord(data){
		//tweets
		for (let i = 0; i < data.tweets.length; i++){
			paragraphs[i].html(data.tweets[i]);
		}
		for (let j = data.tweets.length; j < 10; j++){
			paragraphs[j].html('');
		}

		// place name
		place.html(data.loc[0]);

		//rotate globe
		let issLat = data.latlng[0];
		let issLon = data.latlng[1];

		let r;

		r = height/2.45;

		lat = radians(issLat);
		lon = radians(issLon);
		x = r * cos(lat) * sin(lon + radians(180));
		y = r * 1.0625 * sin(-lat);
		z = r * cos(lat) * cos(lon + radians(180));

		firstload = true;
	}
}

function windowResized() {
  resizeCanvas(windowWidth * 0.4, windowWidth * 0.4);
}
