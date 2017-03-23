/**
 * Parser
 * - Map
 * Packet Data와 JSON이 상호 변환 될 형식 및 값 지정
 * Map의 Options
 * (필수) type : Handler의 형식 Primitive(byte, short, ushort, int, uint, string1, string2, string4) 또는 Custom
 * (필수) name : parsing되어 JSON으로 변환 될 때 입력될 attribute 명, 
 *  unparsing할 때 JSON에서 읽어올 attribute 명
 * (옵션) enum : parsing되어 JSON으로 변환 될 때 Packet의 byte data 대신 JSON의 값으로 저장되거나 (type이 Byte 또는 Custom일 경우에만 사용)
 *  unparsing할 때 JSON의 값 대신 packet에 저장할 값들을 매핑한 Object, 형식 : { "JSON Value" : "Packet Value" }
 * (옵션) isString : boolean Type, JSON으로 변활 될 때 문자형으로 변경할 때 사용 (default : false)
 * (옵션) ignore : boolean Type, 오류를 무시 여부 
 *   ignore를 지정하지 않으면 JSON으로 변활 될 때 enum에 해당하는 값이 없으면 오류가 발생하나 지정 시 ignore가 true일 경우에는 JSON의 attribute를 undefined로 지정,
 *   Packet Data로 변활 될 때는 ignore가 지정되지 않은 상태에서 JSON의 Attribute가 없거나 enum에 매핑되는 값이 없으면 오류가 발생되나 
 *   ignore가 true인 경우 오류가 발생해도 Packet의 크기 만큼 0x00가 입력됨 (단, string1,2,4는 legnth에만 입력 됨)
 */

'use strict';

var primitive =  require('./handler'),
	byteArray = require('../extends/byteArrayHandler'),
	byteSplit = require('../extends/byteSplitHandler');

function Data (buffer) {
	this.ognl = buffer;
	this.buf = buffer;
	this.obj = {};
}

function Byte (obj) {
	this.src = obj;
	this.desc = Object.create(obj);
	this.bufArray = new Array();
}

function Parser(map) {
	this.map = map;
	this.handlers = {};
	
	for(var type in primitive) {
		this.handlers[type] = primitive[type];
	}
	
	this.handlers[byteArray.getType()] = byteArray;
	this.handlers[byteSplit.getType()] = byteSplit;
}

Parser.prototype.addHandle = function(handler) {
	this.handlers[handler.getType()] = handler;
}

Parser.prototype.parse = function(buffer, cb) {
	var data = new Data(buffer),
		map = null;
	
	for (var i in this.map) {
		map = this.map[i];
		
		// console.log('[' + map.name + ":" + map.type + '] => parse called');
		
		if (!this.handlers[map.type] && !map.ignore) {
			console.log(map.name + " ==> " + map.type + "-parse call");
			return cb(new Error('[' + map.name + ":" + map.type + '] => Unsupport Handler')); 
		}
		
		try {
			this.handlers[map.type].handle.call(data, map.name, map);
		} catch (e) {
			console.log('[' + map.name + ":" + map.type + '] => Parsing Error('+ e.message + ')');
			return cb(new Error('[' + map.name + ":" + map.type + '] => Parsing Error(' + e.message + ')'));
		}
	}
	
	return cb(null, data.obj, data.buf);
}

Parser.prototype.unparse = function(obj, cb) {
	var byte = new Byte(obj),
		map = null;
	
	for(var i in this.map) {
		map = this.map[i];
		
		// console.log('[' + map.name + ":" + map.type + '] => unparse call');
		
		if ( (obj[map.name] === undefined || obj[map.name] === null) && !map.ignore ) {
			return cb(new Error('No Exist Attribute [' + map.name + ']'));
		}
		
		try {
			this.handlers[map.type].unhandle.call(byte, map.name, map);
		} catch (e) {
			console.log('[' + map.name + ":" + map.type + '] => Unparsing Error(' + e.message + ')');
			return cb(new Error('[' + map.name + ":" + map.type + '] => Unparsing Error(' + e.message + ')'));
		}
		
	}
	
	cb(null, Buffer.concat(byte.bufArray), obj);
}

Parser.prototype.next = function() {
	return this._next;
}

module.exports = Parser;