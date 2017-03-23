var util = require('util');
var Handler =  require('../lib/handler');
var Parser = require('../lib/parser');

function CustomHandler(type, map) {
	var pa = new Parser(map);
	
	this.type = type;
	
	this.handle = function(key) {
		var self = this;
		//var result = pa.parse(this.buf, this);
		var result = pa.parse(this.buf, function(err, obj, next) {
			if (err) {
				console.log(JSON.stringify(err));
				throw err;
			}
			
			self.obj[key] = obj;
			self.buf = next;
		});
	};
	
	this.unhandle = function(key) {
		var self = this;
//		var result = pa.unparse(this.desc[key], this);
		var result = pa.unparse(this.desc[key], function(err, buf, obj) {
			if (err) {
				console.log(JSON.stringify(err));
				throw err;
			}
			self.bufArray.push (buf);
		});
		
	};
	
	this.addHandle = function(handler) {
		pa.addHandle(handler);
		return this;
	};
}

util.inherits(CustomHandler, Handler);

module.exports = CustomHandler;


