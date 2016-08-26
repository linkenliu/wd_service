var crypto = require('crypto');
var request_module = require("request");
var async = require('async');




/**
 * 判断Object对象中的参数是否为空
 * 为空返回参数为空错误信息
 * @param req
 * @param res
 * @param Array
 */
exports.paramsIsNull = function (req, res, params,code) {
	var object = req.body;
	for (var i = 0; i < params.length; i++) {
		if (object.hasOwnProperty(params[i]) == false || object[params[i]] === "") {
			res.send({success:false,message:"The server check to "+params[i]+" is empty"});
			//返回true意味着有空值
			return true;
		}
	}
	//无空值
	return false;
};

exports.checkParams = function (req, res, params,code) {
	var object = req.body;
	for (var i = 0; i < params.length; i++) {
		if (object.hasOwnProperty(params[i]) == false || object[params[i]] === "") {
			res.send({result_code:'-203',result:"The server check to "+params[i]+" is empty"});
			//返回true意味着有空值
			return true;
		}
	}
	//无空值
	return false;
};


/**
 * password加密       crypto
 * 参数:需要加密的字符串
 * @param {Object} params
 */
exports.encrypt = function(params){
	var cipher = crypto.createCipher('aes-256-cbc','InmbuvP6Z8')
	var crypted = cipher.update(params,'utf8','hex');
	crypted += cipher.final('hex');
	return crypted;
};

/**
 * password 解密  crypto
 * @param {Object} params
 */
exports.decrypt = function(params){
	var decipher = crypto.createDecipher('aes-256-cbc','InmbuvP6Z8')
	var dec = decipher.update(params,'hex','utf8')
	dec += decipher.final('utf8')
	return dec;	
};




/**
 * 深克隆方法：深克隆所有javascript对象
 * @param  {[object or primitive type]} obj [对象，数组，基本类型]
 * @return {[object or primitive type]}     [深克隆后的结果]
 */
exports.clone = function (obj) {
	var o;
	if (typeof obj === "object") {
		if (obj === null) {
			o = null;
		} else {
			if (obj instanceof Array) {
				o = [];
				for (var i = 0, len = obj.length; i < len; i++) {
					o.push(clone(obj[i]));
				}
			} else {
				o = {};
				for (var j in obj) {
					o[j] = clone(obj[j]);
				}
			}
		}
	} else {
		o = obj;
	}
	return o;
};

/**
 * 数组去重
 * @param arr
 * @returns {Array}
 */
exports.unique = function(arr) {
	var result = [], hash = {};
	for (var i = 0, elem; (elem = arr[i]) != null; i++) {
		if (!hash[elem]) {
			result.push(elem);
			hash[elem] = true;
		}
	}
	return result;
};

/**
 * 数组中删除指定值
 * @param arr
 * @param val
 */
exports.removeByValue = function(arr, val){
	for (var i = 0; i < arr.length; i++) {
		if (arr[i] == val) {
			arr.splice(i, 1);
			break;
		}
	}
	return arr;
};


exports.postForm = function(url,data,next,post_data_init){
	var reuslt = {};
	if(typeof next != "function"){
		next = function(){};
	}
	if(post_data_init){
		request_module(
			{
				method: 'POST',
				url: url,
				form: data
			},
			function (err, response, body) {
				try {
					if (err) {
						reuslt.success = false;
						reuslt.message = err;
						next(JSON.stringify(reuslt), null);
					} else {
						var body_obj = JSON.parse(body);
						if (body_obj.success) {
							next(null, body_obj);
						} else {
							reuslt.success = false;
							reuslt.message = body_obj.message;
							next(JSON.stringify(reuslt), body_obj);
						}
					}
				} catch (e) {
					reuslt.success = false;
					reuslt.message = e;
					next(JSON.stringify(reuslt), {});
				}
			});
	}
};


/**
 * 转换16进制
 * @param arr
 * @param val
 */
exports.convertHex = function (value) {
	var hex = value.toString(16);
	var hex_length = hex.length;
	var L = 16 - hex_length;
	var vb = '';
	if (hex_length < 16) {
		for (var i = 0; i < L; i++) {
			vb += '0';
		}
		vb = vb + hex;
	} else {
		vb = hex;
	}
	return vb;
};

/**
 * 获取peerid
 * @param ip
 * @param isSO
 * @returns {*}
 */
exports.getPeerID = function(ip, isSO) {
	var dot2num = function(dot, isSO) {
		var d = dot.split('.');
		if(isSO) {
			return ((((((+d[0])*256)+(+d[1]))*256)+(+d[2] | 0x80))*256)+(+d[3]);
		}
		else {
			return ((((((+d[0])*256)+(+d[1]))*256)+(+d[2] & 0x7F))*256)+(+d[3]);
		}
	};
	ip = ip.slice(ip.lastIndexOf(":") + 1);

	var iIP = dot2num(ip, isSO);
	var strIP = iIP.toString(16);
	while(strIP.length < 8) {
		strIP = "0" + strIP;
	}

	var buf = crypto.randomBytes(4);
	var strRand = buf.readUInt32BE(0).toString(16);
	while(strRand.length < 8) {
		strRand = "0" + strRand;
	}

	return strIP + strRand;
};

/**
 * 获取sessionkey
 * @param peerID
 * @param privateKey
 * @returns {string}
 */
exports.getSessionKey = function(peerID, privateKey) {
	var md5sum = crypto.createHash('md5');
	var bufPeerID = new Buffer(8);
	var bufPrivateKey = new Buffer(8);

	bufPeerID.writeUInt32BE(parseInt(peerID.substr(0,8), 16), 0);
	bufPeerID.writeUInt32BE(parseInt(peerID.substr(8,8), 16), 4);
	bufPrivateKey.writeUInt32BE(parseInt(privateKey.substr(0,8), 16), 0);
	bufPrivateKey.writeUInt32BE(parseInt(privateKey.substr(8,8), 16), 4);

	md5sum.update(bufPeerID);
	md5sum.update(bufPrivateKey);

	return md5sum.digest('hex').substr(0,16);
};