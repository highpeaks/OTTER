var express = require('express');
var app = express();

var port = process.env.PORT || 8080;
app.use(express.static(__dirname + '/public'));

app.listen(port, function() {
    console.log('Our app is running on http://localhost:' + port);
});

var Twit = require('twit');
var request = require('request');
var fs = require('fs');
var googleConfig = require('./data/googleConfig');
var googleMapsClient = require('@google/maps').createClient(googleConfig);
var twitConfig = require('./data/twitConfig');
var T = new Twit(twitConfig);


app.get('/coordpoll', coordPoll);


function coordPoll(requ, resp){

  let finalobj = {
    tweets: [],
    loc: [],
    latlng: []
  };

  let issLat, issLon, query;
  let counter = 0;

  issquery(resp);

  function issquery(resp){
    request('http://api.open-notify.org/iss-now.json', { json: true }, (err, res, body) => {
      issLat = JSON.parse(body.iss_position.latitude);
      finalobj.latlng.push(issLat);
      issLon = JSON.parse(body.iss_position.longitude);
      finalobj.latlng.push(issLon);
      query = 'geocode:' + issLat + ',' + issLon + ',' + '100mi' + ' -from:googuns_lulz -from:_grammar_';
      geocodeQuery(resp);
      twitterQuery(resp);
    });
  }

  function geocodeQuery(resp){
    googleMapsClient.reverseGeocode({
      latlng: issLat + ',' + issLon,
      result_type: 'administrative_area_level_1'
      }, function(err, response) {
        if (response.json.results.length > 0){
          finalobj.loc.push(response.json.results[0].formatted_address);
        } else {
          finalobj.loc.push(issLat + ',' + issLon);
        }
        counter++;
        if (counter == 2){
          gotdata(resp);
        }
      }
    );
  }

  function twitterQuery(resp){
    T.get('search/tweets', {
      q: query,
      result_type: 'recent',
      count: 10
    },function(err, data, response) {
      let tweets = [];
      if (data.statuses.length > 0){
        for (let i = 0; i < data.statuses.length; i++){
          finalobj.tweets.push(data.statuses[i].user.screen_name + ': ' + data.statuses[i].text);
        }
      } else {
        finalobj.tweets.push('Quiet on the Surface');
      }
      counter++;
      if (counter == 2){
        gotdata(resp);
      }
    });
  }

  function gotdata(resp){
    resp.json(finalobj);
  }
}
