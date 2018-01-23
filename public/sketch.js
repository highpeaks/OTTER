// n = amp * sin((frameCount / period) * TAU);

var paragraphs = [];
var place;


function setup(){
	noCanvas();
	refresh();
	setInterval(refresh, 15 * 1000);
	for (let i = 0; i < 50; i++){
		let p = createP("");
		p.parent("dynamic")
		paragraphs.push(p);
	}
	place = createElement("h3","");
	place.parent("place");
}


function refresh(){
	loadJSON('tweets.json', gotTweets);
	loadJSON('place.json', gotPlace);
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
