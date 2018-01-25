var express = require('express');
var app = express();
var server = app.listen(3000);
app.use(express.static('public'));

var Twit = require('twit');
var request = require('request');
var fs = require('fs');

var googleConfig = require("./data/googleConfig");
var googleMapsClient = require('@google/maps').createClient(googleConfig);

var twitConfig = require("./data/twitConfig");
var T = new Twit(twitConfig);

setInterval(coordPoll, 15 * 1000);
// setTimeout(coordPoll, 1000);

function coordPoll(){
  request('http://api.open-notify.org/iss-now.json', { json: true }, (err, res, body) => {
    if (err) { return console.log(err); }
    let issLon = body.iss_position.longitude;
    let issLat = body.iss_position.latitude;
    let latlon = JSON.stringify(issLat + "," + issLon);
    fs.writeFile('public/latlon.json', latlon);

    issLon = JSON.parse(body.iss_position.longitude);
    issLat = JSON.parse(body.iss_position.latitude);
    let rad = "100mi";
    let query = "geocode:" + issLat + "," + issLon + "," + rad + " -from:googuns_lulz -from:_grammar_";
    // fs.writeFile('public/latlon.json', latlon);


    googleMapsClient.reverseGeocode({
      latlng: issLat + "," + issLon,
      result_type: "administrative_area_level_1"
      }, function(err, response) {
        if (response.json.results.length > 0){
          let place = JSON.stringify(response.json.results[0].formatted_address);
          fs.writeFile('public/placeName.json', place);
        } else {
          let place = JSON.stringify("");
          fs.writeFile('public/placeName.json', place);
        }
      });


    T.get('search/tweets', {
      q: query,
      count: 50
    },function(err, data, response) {
      let tweets = [];
      if (data.statuses.length > 0){
        for (let i = 0; i < data.statuses.length; i++){
        tweets.push(data.statuses[i].user.screen_name + ": " + data.statuses[i].text);
        }
      } else {
        tweets.push('Quiet on the Surface');
      }
      let json = JSON.stringify(tweets);
      fs.writeFile('public/tweets.json', json);
    })
  })
}
