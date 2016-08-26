/**
 * Created by liusheng on 16/8/11.
 */
var channelService = require('../../services/channelService');
var dateUtils = require('../../utils/dateUtils');
var Response = require('../../utils/responseUtil.js');
var response = Response();
var logger = require('../../utils/log').logger;
var async = require('async');
var moment = require('moment');
var channel = function () {
};


/**
 * 频道列表
 * 1.
 * 2.
 * 3.
 * @param req
 * @param res
 */
channel.getChannelList = function (req, res) {
    channelService.getChannel({}, function (err, list) {
        if (err) {
            logger.error(err.message);
            response.success = false;
            response.resMessage(err.message);
            res.send(response);
        } else {
            var _list = [];
            async.map(list, function (item, callback) {
                var state = 1;
                if (item.state == 0 || item.release_state == 0) {
                    state = 0;
                }
                if (!item.category) {
                    item.category = '其他';
                }
                if (!item.proportion) {
                    item.proportion = '16:9';
                }
                var o = {};
                o.id = item.id;
                o.sid = item.key_code;
                o.name = item.name;
                o.category = item.category;
                o.source = item.source;
                o.state = state;
                o.proportion = item.proportion;
                _list.push(o);
                callback(null, item);
            }, function (err, result) {
                if (err) {
                    logger.error(err.message);
                    response.success = false;
                    response.resMessage(err.message);
                    res.send(response);
                } else {
                    res.send(_list);
                }
            });
        }
    });
};

/**
 *epg
 * @param req
 * @param res
 */
channel.getEpgList = function (req, res) {
    var start_date = dateUtils.getNumberDate(-3);
    var end_date = dateUtils.getNumberDate(3);
    var params = {};
    params.start_date = start_date;
    params.end_date = end_date;
    channelService.getEpgListForChannel(params, function (err, list) {
        if (err) {
            logger.error(err.message);
            response.success = false;
            response.resMessage(err.message);
            res.send(response);
        } else {
            var _list = [];
            async.map(list, function (item, callback) {
                item.startTime = dateUtils.formatDate(item.startTime);
                item.endTime = dateUtils.formatDate(item.endTime);
                var state = 1;
                if (item.state == 0 || item.release_state == 0) {
                    state = 0;
                }
                var o = {};
                o.epdId = item.epdId;
                o.startTime = item.startTime;
                o.endTime = item.endTime;
                o.state = state;
                o.channelId = item.channelId;
                o.name = item.name;
                _list.push(o);
                callback(null, item);
            }, function (err, result) {
                if (err) {
                    logger.error(err.message);
                    response.success = false;
                    response.resMessage(err.message);
                    res.send(response);
                } else {
                    res.send(_list);
                }
            });
        }
    });
};


module.exports = channel;
