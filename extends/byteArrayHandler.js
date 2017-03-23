'use strict';

var util = require('util');
var Handler = require('../lib/handler');

function ByteArrayHandler() {
	var self = this;
	
	this.type = "byteArray";
	
	this.handle = function(key, options) {
		var count = this.buf[0],
			resultArray = [],
			i = 0;
		
		for (; i < count; i++) {
			let value = self.changeEnumValue(this.buf.readUInt8(i + 1), options.enum);
			
			if (value == undefined && !options.ignore) {
				throw new Error('Handler Error - Unknown Value(Name:' + options.name + ", Value:" + value + ")");
			} 
			
			if (value != undefined && options.isString) {
				value += "";
			}
			resultArray.push( value );
		}
		
		this.buf = this.buf.slice(i + 1);
		this.obj[key] = resultArray;
	};
	
	this.unhandle = function(key, options) {
		var array = this.desc[key],
			i = 0,
			result = null,
			value = null;
		
		if (!array || !Array.isArray(array)) {
			if (!options.ignore) {
				throw new Error('Unhandler Error - Unknown Value(Name:' + options.name + ", Value:" + JSON.stringify(array) + ")");
			} 
			
			result = new Buffer([0x00]);
		}
		else if (array.length > 255) {
			throw new Error('Unhandler Error - Out of index(Name:' + options.name +', Value:' + array.length + ")");
		}
		else {
			result = new Buffer(array.length + 1);
			result.writeUInt8(array.length);
			
			for (; i < array.length ; i++) {
				value = self.changeByteValue(array[i], options.enum);
				
				if (isNaN(value * 1) || value > 255) {
					if (!options.ignore) {
						throw new Error('Unhandle Error - Unknown Value (Name:' + options.name + ", Value:" + JSON.stringify(array) + ")");
					}
					
					result.writeUInt8(0x00, i + 1);
				}
				else {
					result.writeUInt8(value, i + 1);
				}
			}
			
		}
		
		this.bufArray.push (result);
	};
}

util.inherits(ByteArrayHandler, Handler);

module.exports = new ByteArrayHandler();



