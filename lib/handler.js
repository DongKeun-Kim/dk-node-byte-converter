function PrimitiveHandler() {
		this.type = "primitive";
		
		this.handle = function() {
		};
		
		this.unhandle = function() {
		};
};

PrimitiveHandler.prototype.changeEnumValue = changeEnumValue = function(val, enumObj) {
	
	if (enumObj) {
		for (var key in enumObj) {
			if (enumObj[key] === val) {
				return key;
			}
		}
		
		return undefined;
	}
	
	return val;
}

PrimitiveHandler.prototype.changeByteValue = changeByteValue = function(val, enumObj) {
	
	if (enumObj) {
		for (var key in enumObj) {
			if (key === val) {
				return enumObj[key];
			}
		}
		
		return undefined;
	}
	
	return val;
}

PrimitiveHandler.prototype.getType= function() {
	return this.type;
};

PrimitiveHandler.prototype.parser = function() {
	return this.handle;
};

PrimitiveHandler.byte = {
		handle : function(key, options) {
			var value = this.buf.readUInt8();
			
			this.buf = this.buf.slice(1);
			this.obj[key] = changeEnumValue(value, options.enum);
			
			if (this.obj[key] == undefined && !options.ignore) {
				throw new Error('Handler Error - Unknown Value(Name:' + options.name + ", Value:" + value + ")");
			} 
			
			if (this.obj[key] != undefined && options.isString) {
				this.obj[key] += "";
			}
			console.log("["+ key + ":byte] =>", this.obj[key]);
		},
		unhandle : function(key, options) {
			var value = this.desc[key],
				buf = new Buffer(1);
			
			value = changeByteValue(value, options.enum);
			if (value == undefined || value == null) {
				if (!options.ignore) {
					throw new Error('Unhandle Error - Not Defined(Name:' + options.name + ", Value:" + value + ")");
				}
				
				value = 0x00;		// Set default
			}
			
			buf.writeUInt8(value);
			this.bufArray.push(buf);
		}
};

PrimitiveHandler.short = {
		handle : function(key, options) {
			this.obj[key] = this.buf.readInt16BE();
			this.buf = this.buf.slice(2);
			
			if (options.isString) {
				this.obj[key] += "";
			}
			console.log("["+ key + ":short] =>", this.obj[key]);
		},
		unhandle : function(key, options) {
			var value = this.desc[key],
				buf = new Buffer(2);
			
			if (value == undefined || value == null) {
				if (!options.ignore) {
					throw new Error('Unhandle Error - Not Defined(Name:' + options.name + ", Value:" + value + ")");
				}
				
				value = 0x00;		// Set default
			}
			
			value = value *1;
			
			if (isNaN(value)) {
				throw new Error('Unhandle Error - Is NaN(Name:' + options.name + ", Value:" + value + ")");
			}
			
			if (value > 32767 || value < -32768 ) {
				throw new Error('Unhandle Error - Overflow(Name:' + options.name + ", Value:" + value + ")");
			}			
			
			buf.writeInt16BE(value);
			this.bufArray.push(buf);
		}
}; 

PrimitiveHandler.ushort = {
		handle : function(key, options) {
			this.obj[key] = this.buf.readUInt16BE();
			this.buf = this.buf.slice(2);
			
			if (options.isString) {
				this.obj[key] += "";
			}
			console.log("["+ key + ":ushort] =>", this.obj[key]);
		},
		unhandle : function(key, options) {
			var value = this.desc[key],
				buf = new Buffer(2);
			
			if (value == undefined || value == null) {
				if (!options.ignore) {
					throw new Error('Unhandle Error - Not Defined(Name:' + options.name + ", Value:" + value + ")");
				}
				
				value = 0x00;		// Set default
			}
			
			value = value * 1;
			
			if (isNaN(value)) {
				throw new Error('Unhandle Error - Is NaN(Name:' + options.name + ", Value:" + value + ")");
			}
			
			if (value > 65535 || value < 0 ) {
				throw new Error('Unhandle Error - Overflow(Name:' + options.name + ", Value:" + value + ")");
			}	
			
			buf.writeUInt16BE(value);
			this.bufArray.push(buf);
		}
};

PrimitiveHandler.int = {
		handle : function(key, options) {
			this.obj[key]  = this.buf.readInt32BE();
			this.buf = this.buf.slice(4);
			
			if (options.isString) {
				this.obj[key] += "";
			}
			console.log("["+ key + ":int] =>", this.obj[key]);
		},
		unhandle : function(key, options) {
			var value = this.desc[key],
				buf = new Buffer(4);
			
			if (value == undefined || value == null) {
				if (!options.ignore) {
					throw new Error('Unhandle Error - Not Defined(Name:' + options.name + ", Value:" + value + ")");
				}
				
				value = 0x00;		// Set default
			}
			
			value = value * 1;
			
			if (isNaN(value)) {
				throw new Error('Unhandle Error - Is NaN(Name:' + options.name + ", Value:" + value + ")");
			}
			
			if (value > 2147483647  || value < -2147483648 ) {
				throw new Error('Unhandle Error - Overflow(Name:' + options.name + ", Value:" + value + ")");
			}	
			
			buf.writeInt32BE(value);
			this.bufArray.push(buf);
		}
};

PrimitiveHandler.uint = {
		handle : function(key, options) {
			this.obj[key] = this.buf.readUInt32BE();
			this.buf = this.buf.slice(4);
			
			if (options.isString) {
				this.obj[key] += "";
			}
			console.log("["+ key + ":uint] =>", this.obj[key]);
		},
		unhandle : function(key, options) {
			var value = this.desc[key],
				buf = new Buffer(4);
			
			if (value == undefined || value == null) {
				if (!options.ignore) {
					throw new Error('Unhandle Error - Not Defined(Name:' + options.name + ", Value:" + value + ")");
				}
				
				value = 0x00;		// Set default
			}
			
			value = value * 1;
			if (isNaN(value)) {
				throw new Error('Unhandle Error - Is NaN(Name:' + options.name + ", Value:" + value + ")");
			}
			
			if (value > 4294967295   || value < 0 ) {
				throw new Error('Unhandle Error - Overflow(Name:' + options.name + ", Value:" + value + ")");
			}
			
			buf.writeUInt32BE(value);
			this.bufArray.push(buf);
		}
};

PrimitiveHandler.string1 = {
		handle : function(key, options) {
			var length = this.buf.readUInt8();

			if (length === 0) {
				if (!options.ignore) {
					throw new Error('Unhandle Error - Not Defined(Name:' + options.name + ", Value:" + value + ")");
				}
				value = undefined;
			}
			else {
				value = this.buf.slice(1, length + 1).toString();
			}
			
			console.log("["+ key + ":string1] =>", this.obj[key]);
			this.obj[key] = value;
			this.buf = this.buf.slice(1 + length);
		},
		unhandle : function(key, options) {
			var value = this.desc[key],
				lengthBuf = new Buffer(1);
				dataBuf = null;
			
			if (value == undefined || value == null) {
				if (!options.ignore) {
					throw new Error('Unhandle Error - Not Defined(Name:' + options.name + ", Value:" + value + ")");
				}
				
				value = '';		// Set default
			}
			
			dataBuf = new Buffer(value);
			lengthBuf.writeUInt8(dataBuf.length);
			this.bufArray.push(Buffer.concat([lengthBuf, dataBuf]));
		}
};

PrimitiveHandler.string2 = {
		handle : function(key, options) {
			var length = this.buf.readUInt16BE();

			if (length === 0) {
				if (!options.ignore) {
					throw new Error('Unhandle Error - Not Defined(Name:' + options.name + ", Value:" + value + ")");
				}
				
				value = undefined;
			}
			else {
				value = this.buf.slice(2, length + 2).toString();
			}
			
			console.log("["+ key + ":string1] =>", this.obj[key]);
			this.obj[key] = value;
			this.buf = this.buf.slice(2 + length);
		},
		unhandle : function(key, options) {
			var value = this.desc[key],
				lengthBuf = new Buffer(2),
				dataBuf = null;
			
			if (value == undefined || value == null) {
				if (!options.ignore) {
					throw new Error('Unhandle Error - Not Defined(Name:' + options.name + ", Value:" + value + ")");
				}
				
				value = '';		// Set default
			}
			
			dataBuf = new Buffer(value);
			lengthBuf.writeUInt16BE(dataBuf.length);
			this.bufArray.push(Buffer.concat([lengthBuf, dataBuf]));
		}
};	

PrimitiveHandler.string4 = {
		handle : function(key, options) {
			var length = this.buf.readInt32BE();
			
			if (length === 0) {
				if (!options.ignore) {
					throw new Error('Unhandle Error - Not Defined(Name:' + options.name + ", Value:" + value + ")");
				}
				value = undefined;
			}
			else {
				value = this.buf.slice(4, length + 4).toString();
			}
			
			console.log("["+ key + ":string1] =>", this.obj[key]);
			this.obj[key] = value;
			this.buf = this.buf.slice(4 + length);
		},
		unhandle : function(key, options) {
			var value = this.desc[key],
				lengthBuf = new Buffer(4),
				dataBuf = new Buffer(value);
			
			if (value == undefined || value == null) {
				if (!options.ignore) {
					throw new Error('Unhandle Error - Not Defined(Name:' + options.name + ", Value:" + value + ")");
				}
				
				value = '';		// Set default
			}
			
			dataBuf = new Buffer(value);
			lengthBuf.writeUInt32BE(dataBuf.length);
			this.bufArray.push(Buffer.concat([lengthBuf, dataBuf]));
		}
};

module.exports = PrimitiveHandler;