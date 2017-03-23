function Factory () {
	this.list = {};
}

Factory.prototype.addParser = function(code, parser) {
	this.list[code] = parser;
};

Factory.prototype.process = function(code, buffer, cb) {
	var result = null;
	
	if (!this.list[code]) {
		return cb( new Error('Unsuppoted code'), null);
	}
	else {
		try {
			this.list[code].parse(buffer, cb);
			
			//return cb( null, result);
		} catch (e) {
			cb(e, "");
		}
	}
}

module.exports = Factory; 