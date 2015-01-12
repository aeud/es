var elasticsearch = require('elasticsearch');
var client = new elasticsearch.Client({
  host: 'localhost:9200',
  log: 'trace'
});
var index = 'data';
var type = 'hits';
var moment = require('moment');

var ranges = [];
var inter  = 1;
var from = '2015-01-12 00:00';
var to = '2015-01-13 00:00';

var fromTmp = moment(from, "YYYY-MM-DD HH:mm");
var toTmp = moment(to, "YYYY-MM-DD HH:mm");

while (fromTmp < toTmp) {
	var tmp = moment(fromTmp);
	tmp = tmp.add(1, 'h');
	ranges.push({
		'from': fromTmp.format('YYYY-MM-DD HH'),
		'to': tmp.format('YYYY-MM-DD HH')
	});
	fromTmp = tmp;
}

console.log(ranges);


search(index, type, ['dim001', 'met001', 'date'], {
	'query': {
		'range': {
			'date': {
				'gte': '2015-01-01',
				'lte': '2015-02-01'
			}
		}
	},
	'aggs': {
		'browsers': {
			'terms': {
				'field': 'dim001'
			},
			'aggs': {
				'gender': {
					'terms': {
						'field': 'dim002'
					},
					'aggs': {
						'range': {
							'date_range': {
								'field': 'date',
								'format': 'Y-M-d H',
								'ranges': ranges
							},
							'aggs': {
								'met001': {
									'sum': {
										'field': 'met001'
									}
								},
								'met002': {
									'sum': {
										'field': 'met002'
									}
								}
							}
						}
					}
					
				}
			}
		}
	}
}, function(){
	client.close();
});

function search (index, type, fields, body, callback) {
	client.search({
		index: index,
		type: type,
		fields: fields,
		body: body
	}, function (err, resp) {
		if (err) throw err;
	  	callback();
	});
}
