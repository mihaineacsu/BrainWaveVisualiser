var express = require('express'),
	mustacheLayout = require("mustache-layout"),
	routes = require('./routes');

var app = express();

app.set('view engine', 'html');
app.set('views', __dirname + '/views');
app.set("view options", {layout: true});
app.engine("html", mustacheLayout);

app.use(express.static(__dirname + '/public'));

app.listen(8000, function () {
  console.log('App listening on port 8000!');
});

app.use('/', routes);