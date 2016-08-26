/**
 * Created by liusheng on 16/8/11.
 */
var userService = require('../../services/userService');
var messageService = require('../../services/messageService');
var commonUtil = require('../../utils/commonUtil.js');
var dateUtils = require('../../utils/dateUtils');
var Response = require('../../utils/responseUtil.js');
var response = Response();
var logger = require('../../utils/log').logger;
var async = require('async');
var moment = require('moment');
var config = require('../../config/config');
var resObj = require('../../utils/resObj.js');
var _resObj = resObj();
var user = function () {
};


/**
 * 登录验证
 * 1.用户状态
 * 2.账户剩余天数
 * 3.消息
 * @param req
 * @param res
 */
user.login = function (req, res) {
    var device_id = req.body.device_id;
    if (commonUtil.paramsIsNull(req, res, ["device_id"])) {
        return;
    }
    userService.findOneUser({device_id: device_id}, function (err, user) {
        if (err) {
            logger.error(err.message);
            response.success = false;
            response.resMessage(err.message);
            res.send(response);
        } else if (!user) {
            res.send({success: false, message: '用户不存在'});
        } else {
            async.parallel([
                function (next) {
                    userService.getMaxUserMoneyForEndDate({user_id: user.user_id}, function (err, maxDate) {
                        next(err, maxDate);
                    });
                },
                function (next) {
                    messageService.getLastMessage({}, function (err, lastMessage_all) {
                        next(err, lastMessage_all);
                    });
                },
                function (next) {
                    messageService.getLastMessage({user_id: user.user_id}, function (err, lastMessage) {
                        next(err, lastMessage);
                    });
                }
            ], function (err, result) {
                if (err) {
                    logger.error(err.message);
                    response.success = false;
                    response.resMessage(err.message);
                    res.send(response);
                } else {
                    //账户剩余天数
                    var diff_date = 0;//剩余天数
                    //var verdue = true;//是否到期    true表示未到期   false表示到期
                    var success = true;  //是否有效
                    var currentDate = dateUtils.currentDate();
                    var maxDate = null;  //到期时间
                    if (result[0][0]) {
                        maxDate = result[0][0].end_date
                    }
                    /*if (!maxDate) {
                        verdue = false;
                    }*/
                    if (maxDate) {
                        maxDate = dateUtils.formatDate(maxDate);
                        diff_date = dateUtils.diffDate(currentDate, maxDate);
                        diff_date = diff_date > 0 ? diff_date : 0;
                        //verdue = diff_date > 0 ? true : false;
                        //success = diff_date > 0 ? true : false;
                        maxDate = dateUtils.formatBirthday(maxDate);
                    }
                   /* if (user.state == 0) {
                        success = false;
                    }*/
                    //消息
                    var all_message = ''; //全部消息
                    if (result[1][0]) {
                        all_message = result[1][0].message;
                    }
                    var message = ''; //个人消息
                    if (result[2][0]) {
                        message = result[2][0].message;
                    }
                    var resobj = {};
                    resobj.success = success;
                    resobj.device_id = user.device_id;
                    resobj.state = user.state;
                    //resobj.verdue = verdue;
                    resobj.surplus_days = diff_date;
                    resobj.end_time = maxDate;
                    resobj.message = {
                        public_message: all_message,
                        private_message: message
                    };
                    res.send(resobj);
                }
            });
        }
    });
};


user.auth = function (req, res) {
    var x_real_ip = req.headers['x-real-ip'];
    var x_forword_ip = req.headers['x-forword-ip'];
    var _ip = null;
    if(x_real_ip){
        _ip = x_real_ip;
    }else if(x_forword_ip){
        _ip = x_forword_ip;
    }else{
        _ip = req.ip;
    }
    console.log("x_real_ip="+x_real_ip+"+x_forword_ip = "+x_forword_ip +"ip="+_ip);
    var username = req.body.username;
    if (commonUtil.checkParams(req, res, ["username"])) {
        return;
    }
    userService.findOneUser({device_id: username}, function (err, user) {
          if(err){
              _resObj.result_code = '-203';
              _resObj.result = err.message;
              res.send(_resObj)
          }else{
              if(user){
                  var user_id = commonUtil.convertHex(user.user_id);
                  var peer_id = commonUtil.getPeerID(_ip,false);
                  var session_key = commonUtil.getSessionKey(peer_id,config.auth.privateKey);
                  _resObj.result_code = '0';
                  _resObj.result = 'ok';
                  _resObj.keys = {
                      user_id:user_id,
                      peer_id:peer_id,
                      session_key:session_key
                  };
                  res.send(_resObj);
              }else{
                  _resObj.result_code = '-203';
                  _resObj.result = '查无此人';
                  _resObj.keys = {};
                  res.send(_resObj)
              }
          }
    });
};

module.exports = user;
