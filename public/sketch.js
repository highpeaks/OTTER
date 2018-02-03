var x, y, z, img, lat, lon, gui;

var paragraphs = [];
var place;

function preload(){
	img = loadImage("world.200409.3x5400x2700.jpg");
}

function setup() {
  var c = createCanvas(windowWidth/4, windowWidth/4, WEBGL);
	c.parent("map");
// 	pixelDensity(1);

	gui = createGraphics(100,100);

	place = createElement("h3","");
	place.parent("place");

	for (let i = 0; i < 50; i++){
		let p = createP("");
		p.parent("tweets")
		paragraphs.push(p);
	}
	refresh();
	setInterval(refresh, 10 * 1000);
}

function draw() {

  background(255);
  ambientLight(255);

	if (frameCount <= 100){
		let d = map(sin((frameCount/200)*TAU),-1,1,1,4);
		sphere(d);
	}

	if (frameCount > 100){
		rotateY(PI);
		rotateX(lat);
		rotateY(lon * -1);

		texture(img);
	  sphere(width/3);

		translate(x, y, z);
	  fill(204,0,51);
		let d = map(sin((frameCount/200)*TAU),-1,1,1,4);
	  sphere(d);
	}
}

// function refresh() {
//   loadJSON("http://api.open-notify.org/iss-now.json", plotCoord);
//   function plotCoord(data) {
//     let issLat = data.iss_position.latitude;
//     let issLon = data.iss_position.longitude;
//     let r = 150;
//     lat = radians(issLat);
//     lon = radians(issLon);
//     x = r * cos(lat) * sin(lon + radians(180));
//     y = r * 1.0625 * sin(-lat);
//     z = r * cos(lat) * cos(lon + radians(180));
//   }
// }

function refresh(){
	loadJSON('json/tweets.json', gotTweets);
	loadJSON('json/latlon.json', gotLatLon);
	loadJSON('json/placeName.json', gotPlace);
}

function gotTweets(data){
	for (let i = 0; i < data.length; i++){
		paragraphs[i].html(data[i]);
	}
	for (let j = data.length; j < 50; j++){
		paragraphs[j].html("");
	}
}

function gotPlace(data){
	place.html(data);
}

function gotLatLon(data){
	let coordSplit = data.split(",");
	let issLat = coordSplit[0];
  let issLon = coordSplit[1];
  let r = width/3;
  lat = radians(issLat);
  lon = radians(issLon);
  x = r * cos(lat) * sin(lon + radians(180));
  y = r * 1.0625 * sin(-lat);
  z = r * cos(lat) * cos(lon + radians(180));
}


function windowResized() {
  resizeCanvas(windowWidth/4, windowWidth/4);
}
