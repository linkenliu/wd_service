
var util = require('util'),
    https = require('https'),
    moment = require('moment'),
    crypto = require('crypto'),
    self = {};
module.exports = self;

/*
 * 格式化字符串
 */
self.format = function (formats, args) {
    var result = formats;
    if (arguments.length > 2 || (arguments.length == 2 && typeof(args) != "object" && typeof(args) != "function")) {
        var args2 = [];
        for (var i = 1; i < arguments.length; i++) {
            args2.push(arguments[i]);
        }
        args = args2;
    }
    var replacer = function (value) {
        if (value.indexOf('{') == 0) {
            var r = '';
            try {
                var key = value.substr(1, value.length - 2);
                if (typeof(args) == "function") {
                    r = args(key);
                } else {
                    r = args[key];
                }
            } catch (e) {
            }
            if (r == null || r == undefined) return '';
            else return r;
        }
    };
    return formats.replace(/\{[.\w\:]+\}/ig, replacer);
};

/*
 * 返回克隆的数据
 */
self.clone = function (obj) {
    if (obj == null)return null;
    if (util.isArray(obj)) {
        var newArray = [];
        for (var i = 0; i < obj.length; i++) {
            if (typeof(obj[i]) == 'object' || typeof(obj[i]) == 'function') {
                newArray[i] = self.clone(obj[i]);
            }
            else{
                newArray[i] = obj[i];
            }
        }
        return newArray;
    }
    if (typeof(obj) == 'function') {
        var that = obj;
        var newFunc = function () {
            return that.apply(this, arguments);
        };
        for (var key in obj) {
            newFunc[key] = obj[key];
        }
        return newFunc;
    }
    var newObj = {};
    for (var i in obj) {
        if (typeof(obj[i]) == 'object' || typeof(obj[i]) == 'function') {
            newObj[i] = self.clone(obj[i]);
        }
        else {
            newObj[i] = obj[i];
        }
    }
    return newObj;
};

/*
 * 对返回前端的数据进行格式化
 */
self.JSONHelper = function (obj) {
    var json = self.clone(obj);
    if (!json.hasOwnProperty("success")) {
        json.success = true;
    }
    return json
};
self.decode = function(str) {
    try {
        return decodeURIComponent(str.replace(/\+/g, ' '));
    } catch (err) {
        return str;
    }
};

self.getWechatAccessToken = function (next){
    //判断有效期
    if (__config.wechat_info.wechatAccessToken){
        if (moment().isBefore(__config.wechat_info.wechatAccessToken.expires_moment)){
            next(__config.wechat_info.wechatAccessToken);
        }
        else{
            _createWechatAccessToken(function(token){
                __config.wechat_info.wechatAccessToken = token;
                next(__config.wechat_info.wechatAccessToken);
            });
        }
    }
    else{
        _createWechatAccessToken(function(token){
            __config.wechat_info.wechatAccessToken = token;
            next(__config.wechat_info.wechatAccessToken);
        });
    }
};

//创建access_token
var _createWechatAccessToken = function (next){
    var url = util.format(__config.wechat_info.wechat_accessTokenUrl, __config.wechat_info.wechat_appID, __config.wechat_info.wechat_appSecrect);
    https.get(url, function (_res) {
        var body = "";
        _res.on('data', function (d) {
            body += d;
        });
        _res.on('end', function () {
            var json = JSON.parse(body);
            json.expires_moment = moment().add(json.expires_in, 'seconds');
            next(json);
        });
    });
};

self.getWechatJSApiTicket = function (next){
    //判断有效期
    var i = 0;
    if (__config.wechat_info.wechatJSApiTicket){
        if (moment().isBefore(__config.wechat_info.wechatJSApiTicket.expires_moment)){
            next(__config.wechat_info.wechatJSApiTicket);
        }
        else{
            _createWechatJSApiTicket(function(token){
                __config.wechat_info.wechatJSApiTicket = token;
                next(__config.wechat_info.wechatJSApiTicket);
            });
        }
    }
    else{
        _createWechatJSApiTicket(function(token){
            __config.wechat_info.wechatJSApiTicket = token;
            next(__config.wechat_info.wechatJSApiTicket);
        });
    }
};


//创建api_ticket
var _createWechatJSApiTicket = function (next){
    self.getWechatAccessToken(function(accessToken){
        var url = util.format(__config.wechat_info.wechat_getTicketUrl, accessToken.access_token);
        https.get(url, function (_res) {
            var body = "";
            _res.on('data', function (d) {
                body += d;
            });
            _res.on('end', function () {
                var json = JSON.parse(body);
                json.expires_moment = moment().add(json.expires_in, 'seconds');
                next(json);
            });
        });
    });
};



//创建Signature
self.getWechatJSApiSignature = function (cfg,next){
    self.getWechatJSApiTicket(function(token) {
        var json = {};
        json.noncestr = __config.wechat_info.wechatNoncestr;
        json.appID = __config.wechat_info.wechat_appID;
        json.timestamp = moment().unix();
        json.strsha1 = "jsapi_ticket=" + token.ticket +
            "&noncestr=" + json.noncestr +
            "&timestamp=" + json.timestamp +
            "&url=" + cfg.href;
        var shasum = crypto.createHash('sha1');
        shasum.update(json.strsha1);
        var d = shasum.digest('hex');
        json.signature = d;
        next(json);
    });
};

