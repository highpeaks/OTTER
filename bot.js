var express = require('express');
var app = express();
var server = app.listen(3000);
app.use(express.static('public'));

var Twit = require('twit');
var request = require('request');
var fs = require('fs');

var googleMapsClient = require('@google/maps').createClient({
  key: 'AIzaSyClm4tJ3_TPxe5MrEbSUVg_QflhIzT-dwA'
});

var T = new Twit({
  consumer_key:         '9TE3FlzVjLaIotoo5290hhrt3',
  consumer_secret:      'I6TtEzjFEi1opX4dliyUR989OkIGrEdFzGZ5xrVsoeHoBnEZcK',
  access_token:         '899964182745026560-ecNAjNRAYbSTYGCDE3FgSZi728nI98j',
  access_token_secret:  'rCmlqjgdhtkG6hltYHfTRyADR8BREFk2LcYEQHvkh6V14'
})

setInterval(coordPoll, 15 * 1000);
// setTimeout(coordPoll, 1000);

function coordPoll(){
  request('http://api.open-notify.org/iss-now.json', { json: true }, (err, res, body) => {
    if (err) { return console.log(err); }
    let issLon = JSON.parse(body.iss_position.longitude);
    let issLat = JSON.parse(body.iss_position.latitude);
    let rad = "100mi";
    let query = "geocode:" + issLat + "," + issLon + "," + rad + " -from:googuns_lulz -from:_grammar_";


    googleMapsClient.reverseGeocode({
      latlng: issLat + "," + issLon,
      result_type: "administrative_area_level_1"
      }, function(err, response) {
        console.log(response.json.results);
          let place = JSON.stringify(response.json.results[0].formatted_address);
          fs.writeFile('public/place.json', place);
        // } else {
        //   let place = JSON.stringify("");
        //   fs.writeFile('public/place.json', place);
        // }
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
