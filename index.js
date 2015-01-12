var elasticsearch = require('elasticsearch');
var client = new elasticsearch.Client({
  host: 'localhost:9200',
  log: 'trace'
});
var uuid = require('node-uuid');
var index = 'data';
var type = 'hits';

var dimensions001 = ['chrome', 'firefox', 'ie', 'safari'];
var dimensions002 = ['male', 'female'];
var rand = function (array) {
	var length = array.length;
	var random = Math.floor(Math.random() * (length))
	return array[random];
}



for (var i = 0; i < 2000; i++) {
	var doc = {
		date: new Date(),
		dim001: rand(dimensions001),
		dim002: rand(dimensions002),
		met001: 1,
		met002: Math.random(),
		published: true,
	}
	client.index({
		index: index,
		type: type,
		id: uuid.v4(),
		body: doc
	}, function (err, response) {
		if (err) throw err;
		//client.close();
	});
};
