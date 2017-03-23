'use strict';

var util = require('util');
var Handler = require('../lib/handler');

function ByteSplitHandler() {
	var self = this;
	
	this.type = "byteSplit";
	
	this.handle = function(key, options) {
		var result = "",
			size = options.size || 0,
			seperator = options.seperator || "";
		
		for (let i = 0; i < size ; i++) {
			result += this.buf.readUInt8(i);
			
			if (i + 1 < size) {
				result += seperator;
			}
		}
		
		this.buf = this.buf.slice(size);
		this.obj[key] = result;
	};
	
	this.unhandle = function(key, options) {
		var data = this.desc[key],
			size = options.size || 0,
			seperator = options.seperator || "",
			buf = new Buffer(size),
			value = null;
		
		data = data.split(seperator);
		
		if (!data || data.length !== size) {
			if (!options.ignore) {
				throw new Error('Unhandler Error - Unknown Value(Name:' + options.name + ", Value:" + data + ")");
			}
			
			for (let i = 0; i < size ; i++) {
				buf.writeUInt8(0x00, i + 1);
			}
			
		}
		else {
			for (let i = 0; i < size ; i++) {
				value = data[i];
				
				if (isNaN(value * 1) || value > 255) {
					if (!options.ignore) {
						throw new Error('Unhandle Error - Unknown Value (Name:' + options.name + ", Value:" + data + ")");
					}
					
					buf.writeUInt8(0x00, i);
				}
				else {
					buf.writeUInt8(value, i);
				}
			}
		}
		
		this.bufArray.push(buf);
	};
}

util.inherits(ByteSplitHandler, Handler);

module.exports = new ByteSplitHandler();