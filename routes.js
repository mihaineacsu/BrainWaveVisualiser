var express = require('express'),
	fs = require('fs'),
	path = require('path'),
	router = express.Router();

var WaveDataFolder = path.join(__dirname, 'Experiment_Data');

router.get('/', function (req, res) {
	res.send('Hello, World!');
});

// router.get('/wave/:userName/:waveType/:waveIndex', function(req, res) {
router.get('/test/:userName', function(req, res) {
	res.render('user', {
		userName: req.params.userName,
	});
});

router.get('/test/waves/:userName', function(req, res) {
	var waves = getWaves(req.params.userName);
	var timestamps = _getTimestamps(req.params.userName);

	res.send({
		alpha: waves.alpha,
		beta: waves.beta,
		delta: waves.delta,
		eeg: waves.eeg,
		gamma: waves.gamma,
		theta: waves.theta,
		timestamps: timestamps
	});
});

var timestamps = null;

function getWaves(userName) {
	var waves = {
		alpha : _getWaves('alpha', userName),
		beta : _getWaves('beta', userName),
		delta : _getWaves('delta', userName),
		eeg : _getWaves('eeg', userName),
		gamma : _getWaves('gamma', userName),
		theta : _getWaves('theta', userName)
	};

	return waves;
}

function _getWaves(waveType, userName) {
	var userWavesFolder = path.join(WaveDataFolder, userName);

	var waves = [];
	var subwaveIndex = 1;
	for (subwaveIndex = 1; subwaveIndex <= 4; ++subwaveIndex) {
		var fileName = path.join(userWavesFolder, waveType + '_raw' + subwaveIndex.toString() + '.txt');
		var contents = fs.readFileSync(fileName).toString();
		var lines = contents.split('\n');

		var arr = [];
		for (var i = 0; i < lines.length; ++i) {
			var line = lines[i];

			if (line.length == 0 ||
				line.length == 4)
				continue;

			arr.push(_getTuple(line));
		}

		waves.push({
			name: waveType + subwaveIndex.toString(),
			data: arr
		});
	}

	return waves;
}

function _getTuple(line) {
	var lineData = line.split(';');
	var timestamp = Date.parse(lineData[0]);
	var value = lineData[1];

	if (value.localeCompare('NaN') == 4) {
		value = 0;
	} else {
		value = parseFloat(value);
	}

	return [timestamp, value];
}

// calm, laughter, frustration, low engagement, high engagement
function _getTimestamps(userName) {
	var userWavesFolder = path.join(WaveDataFolder, userName);
	var fileName = path.join(userWavesFolder, 'test.task');
	var contents = fs.readFileSync(fileName).toString();

	var taskStartEndTime = [];
	var lines = contents.split('\n');
	for (var i = 0; i < 10; i += 2) {
		var line = lines[i];
		taskStartEndTime.push(lines[i].split(';')[1]);
		taskStartEndTime.push(lines[i + 1].split(';')[1]);
	}

	var flags = {};
	var flagsData = [];
	for (var i = 0; i < 10; ++i) {
		var title, text;
		var taskId = Math.floor(i / 2) + 1;
		if (i % 2 == 0) {
			title = 'Start T' + taskId.toString();
			text = 'some text';
		}
		else {
			title = 'End T' + taskId.toString();
			text = 'some text';
		}

		var flag = { 
			x: Date.parse(taskStartEndTime[i]),
			title: title,
			text: text,
		};

		flagsData.push(flag);
	}

	var flags = {
		type: 'flags',
		data: flagsData,
	}

	return flags;
}


router.get('/users', function(req, res) {
	var users = getDirectories(WaveDataFolder);
	
	res.render('users', {
		users: users
	});
});

function getDirectories(srcpath) {
	return fs.readdirSync(srcpath).filter(function(file) {
		return fs.statSync(path.join(srcpath, file)).isDirectory();
	});
}

router.get('/user/:userName', function(req, res) {
	res.render('user', {
		userName: req.params.userName
	});
});

module.exports = router;
