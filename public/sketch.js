var x, y, z, img, lat, lon;

var paragraphs = [];
var place;

function preload(){
	img = loadImage('worldtex.jpg');
}

function setup() {

  var density = displayDensity();
  pixelDensity(density);
  var c = createCanvas(windowWidth/4, windowWidth/4, WEBGL);
	c.parent('map');

	place = createElement('h2');
	place.parent('place');

	for (let i = 0; i < 50; i++){
		let p = createP('');
		p.parent('tweets');
		paragraphs.push(p);
	}

	refresh();

	setInterval(refresh, 1000 * 7);

}

function draw() {

  background(0,0,0,0);
  ambientLight(255);

	if (frameCount <= 100){

		let d = map(sin((frameCount/200)*TAU),-1,1,1,4);
		sphere(d);

	} else{

		rotateY(PI);
		rotateX(lat);
		rotateY(lon * -1);

		texture(img);
	  sphere(width/2.5);

		translate(x, y, z);
	  fill(204,0,51);
		let d = map(sin((frameCount/200)*TAU),-1,1,1,4);
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
		for (let j = data.tweets.length; j < 50; j++){
			paragraphs[j].html('');
		}

		// place name
		place.html(data.loc[0]);

		//rotate globe
		let issLat = data.latlng[0];
		let issLon = data.latlng[1];
		let r = width/2.5;
		lat = radians(issLat);
		lon = radians(issLon);
		x = r * cos(lat) * sin(lon + radians(180));
		y = r * 1.0625 * sin(-lat);
		z = r * cos(lat) * cos(lon + radians(180));
	}
}

function windowResized() {
  resizeCanvas(windowWidth/4, windowWidth/4);
}
