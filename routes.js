var express = require('express'),
	fs = require('fs'),
	path = require('path'),
	router = express.Router();

var WaveDataFolder = path.join(__dirname, 'WaveData'),
	WaveDataAngryFolder = path.join(WaveDataFolder, 'angry'),
	WaveDataRelaxFolder = path.join(WaveDataFolder, 'relax');

router.get('/', function (req, res) {
	res.send('Hello, World!');
});

router.get('/test', function(req, res) {
	fs.readFile(path.join(WaveDataAngryFolder, '1468426383051.beta0'),
				'utf8', function(err, contents) {
		res.render('wave', {
			contents: contents
		});
	});
});

module.exports = router;
