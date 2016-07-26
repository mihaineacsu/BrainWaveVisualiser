var express = require('express'),
	fs = require('fs'),
	mustacheLayout = require("mustache-layout"),
	path = require('path');

var app = express();
app.set('view engine', 'html');
app.set('views', __dirname + '/views');
app.set("view options", {layout: true});
app.engine("html", mustacheLayout);

app.use(express.static(__dirname + '/public'));

app.get('/', function (req, res) {
	res.send('Hello Kevin!');
});

app.listen(8000, function () {
  console.log('App listening on port 8000!');
});

var WaveDataFolder = path.join(__dirname, 'WaveData'),
	WaveDataAngryFolder = path.join(WaveDataFolder, 'angry'),
	WaveDataRelaxFolder = path.join(WaveDataFolder, 'relax');


app.get('/test', function(req, res) {
	fs.readFile(path.join(WaveDataAngryFolder, '1468426383051.beta0'),
				'utf8', function(err, contents) {
		res.render('wave', {
			contents: contents
		});
	});
});