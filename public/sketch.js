// n = amp * sin((frameCount / period) * TAU);

var paragraphs = [];
var place;
var rlat, rlon;

function setup(){
	var c = createCanvas(400,400, WEBGL);
	c.parent("tweets");

	refresh();
	setInterval(refresh, 15 * 1000);

	place = createElement("h3","");
	place.parent("place");

	for (let i = 0; i < 50; i++){
		let p = createP("");
		p.parent("tweets")
		paragraphs.push(p);
	}
}



function draw(){
	background(255);

	let r = 100;

	let lat = map(rlat, -90, 90, -HALF_PI, HALF_PI);
	let lon = map(rlon, -180, 180, -PI, PI);

	let x = r * sin(lon) * cos(lat);
	let y = r * sin(lon) * sin(lat);
	let z = r * cos(lon);

	sphere(100);
	translate(x,y,z);
	sphere(5);
}

function refresh(){
	loadJSON('tweets.json', gotTweets);
	loadJSON('latlon.json', gotLatLon);
	loadJSON('placeName.json', gotPlace);
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
	let refreshLatLon = data.split(",");
	rlat = refreshLatLon[0];
	rlon = refreshLatLon[1];

}
