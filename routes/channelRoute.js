"use strict";
var express = require('express');
var router = express.Router();
var async = require('async');
var dateUtils = require('../utils/dateUtils');
var channelService = require('../services/channelService');
var Response = require('../utils/responseUtil.js');
var response = Response();
var logger = require('../utils/log').logger;
var moment = require('moment');
var schedule = require("node-schedule");

/**
 * 获取频道列表
 */
router.get('/channelList', function (req, res) {
    var params = {};
    var postChoose = req.query.postChoose;
    var keyWord = req.query.keyWord ? req.query.keyWord.trim() : '';
    var chid = req.query.chid;
    var category = req.query.category;
    params.postChoose = postChoose;
    params.keyWord = keyWord;
    params.chid = chid;
    params.category = category;
    async.parallel([
        function (next) {
            channelService.queryChannelList(params, function (err, channelList) {
                async.map(channelList, function (item, callback) {
                    if ("" == item.category) {
                        item.category = '其他';
                    }
                    callback(err, item);
                }, function (err, result) {
                    next(err, result);
                });
            });
        },
        function (next) {
            channelService.getChannelCategory({}, function (err, channelCategory) {
                next(err, channelCategory);
            });
        }
    ], function (err, result) {
        if (err) {
            logger.error(err.message);
            response.success = false;
            response.resMessage('程序异常:' + err.message);
            res.send(response);
        } else {
            res.render('admin/channelList', {channelList: result[0], channelCategory: result[1]});
        }
    });
});

/**
 * 获取epg列表
 */
router.get('/epgList', function (req, res) {
    var channel_id = req.query.channel_id;
    var channel_name = req.query.channel_name;
    var postChoose = req.query.postChoose;
    var keyWord = req.query.keyWord ? req.query.keyWord.trim() : '';
    var params = {};
    params.postChoose = postChoose;
    params.keyWord = keyWord;
    params.channel_id = channel_id;
    channelService.getEpgList(params, function (err, epgList) {
        if (err) {
            logger.error(err.message);
            response.success = false;
            response.resMessage('程序异常:' + err.message);
            res.send(response);
        } else {
            async.map(epgList, function (item, callback) {
                if (item.start_date) {
                    item.start_date = dateUtils.formatDate(item.start_date);
                }
                if (item.end_date) {
                    item.end_date = dateUtils.formatDate(item.end_date);
                }
                if (item.create_date) {
                    item.create_date = dateUtils.formatDate(item.create_date);
                }
                if (item.release_date) {
                    item.release_date = dateUtils.formatDate(item.release_date);
                }
                callback(null, item);
            }, function (err, result) {
                if (err) {
                    logger.error(err.message);
                    response.success = false;
                    response.resMessage('程序异常:' + err.message);
                    res.send(response);
                } else {
                    res.render('admin/epgList', {
                        epgList: result,
                        channel_name: decodeURIComponent(channel_name),
                        channel_id: channel_id
                    });
                }
            });
        }
    });
});
/**
 * epg新增UI
 */
router.get('/epgAddUI', function (req, res) {
    var channel_id = req.query.channel_id;
    var channel_name = req.query.channel_name;
    res.render('admin/epgAdd', {channel_id: channel_id, channel_name: channel_name});
});


/**
 * 新增epg
 */
router.post('/epgAdd', function (req, res) {
    var channel_id = req.body.channel_id;
    var channel_name = req.body.channel_name;
    var name = req.body.name;
    var start_date = req.body.start_date;
    var end_date = req.body.end_date;
    var release_date = req.body.release_date;
    var editor_id = req.session.sessionUser.id;//得到session中的值
    channelService.addEpg({
        channel_id: channel_id,
        name: name,
        start_date: start_date,
        end_date: end_date,
        release_date: release_date,
        editor_id: editor_id
    }, function (err, obj) {
        if (err) {
            logger.error(err.message);
            response.success = false;
            response.resMessage('程序异常:' + err.message);
            res.send(response);
        } else {
            res.redirect('/admin/epgList?channel_id=' + channel_id + '&channel_name=' + encodeURIComponent(channel_name));
        }
    });
});

/**
 * 编辑epgUI
 */
router.get('/epgEditUI', function (req, res) {
    var channel_id = req.query.channel_id;
    var channel_name = req.query.channel_name;
    var epg_id = req.query.epg_id;
    channelService.findOneEpg({epg_id: epg_id}, function (err, epg) {
        if (err) {
            logger.error(err.message);
            response.success = false;
            response.resMessage('程序异常:' + err.message);
            res.send(response);
        } else {
            if (epg.start_date) {
                epg.setDataValue('start_date', dateUtils.formatDate(epg.start_date))
            }
            if (epg.end_date) {
                epg.setDataValue('end_date', dateUtils.formatDate(epg.end_date));
            }
            if (epg.release_date) {
                epg.setDataValue('release_date', dateUtils.formatDate(epg.release_date));
            }
            res.render('admin/epgEdit', {channel_id: channel_id, channel_name: channel_name, epg: epg});
        }
    });
});

/**
 * 编辑epg
 */
router.post('/epgEdit', function (req, res) {
    var channel_id = req.body.channel_id;
    var channel_name = req.body.channel_name;
    var name = req.body.name;
    var start_date = req.body.start_date;
    var end_date = req.body.end_date;
    var epg_id = req.body.epg_id;
    var release_date = req.body.release_date;
    channelService.updateEpg({epg_id: epg_id}, {
        name: name,
        start_date: start_date,
        end_date: end_date,
        release_date: release_date,
        update_date: moment().format("YYYY-MM-DD HH:mm:ss")
    }, function (err) {
        if (err) {
            logger.error(err.message);
            response.success = false;
            response.resMessage('程序异常:' + err.message);
            res.send(response);
        } else {
            res.redirect('/admin/epgList?channel_name=' + encodeURIComponent(channel_name) + '&channel_id=' + channel_id);
        }
    });
});

/**
 * 删除epg
 */
router.post('/deleteEpg', function (req, res) {
    var epg_id = req.body.epg_id;
    channelService.deleteEpg({epg_id: epg_id}, function (err) {
        if (err) {
            logger.error(err.message);
            res.send({success: false, message: '删除失败'});
        } else {
            res.send({success: true, message: '删除成功'});
        }
    });
});

/**
 * 修改频道
 */
router.post('/updateChannel', function (req, res) {
    var id = req.body.id;
    var release_state = req.body.state;
    channelService.updateChannel({chid: id}, {release_state: release_state}, function (err) {
        if (err) {
            logger.error(err.message);
            res.send({success: false, message: '修改失败'});
        } else {
            res.send({success: true, message: '修改成功'});
        }
    });
});


/**
 * 频道统计UI
 */
router.get('/channelSPSS', function (req, res) {
    channelService.queryChannelList({}, function (err, channelList) {
        res.render('admin/channelSPSS', {
            channelList: channelList
        });
    });
});


/**
 * 历史记录统计
 */
router.post('/channelHistory', function (req, res) {
    var currentDate = moment().format("YYYY-MM-DD");
    currentDate = currentDate + " 23:59:59";
    var actDate = moment().subtract(7, 'days').calendar();
    var arr = actDate.split('/');
    actDate = arr[2] + '-' + arr[0] + '-' + arr[1];
    var channel_id = req.body.channel_id;
    channelService.getChannelHistory({
        startDate: actDate,
        endDate: currentDate,
        channel_id: channel_id
    }, function (err, list) {
        if (err) {
            res.send({success: false, message: '程序异常:' + err.message});
        } else {
            async.map(list, function (item, callback) {
                if (item.create_date) {
                    item.create_date = dateUtils.formatDate(item.create_date);
                }
                item.create_date = item.create_date.replace(/-/g, ',');
                item.create_date = item.create_date.replace(/\s/g, ',');
                item.create_date = item.create_date.replace(/:/g, ',');
                var _split = item.create_date.split(',');
                item.year = parseInt(_split[0]);
                item.month = parseInt(_split[1]);
                item.day = parseInt(_split[2]);
                item.hour = parseInt(_split[3]);
                item.minute = parseInt(_split[4]);
                item.second = parseInt(_split[5]);
                callback(null, item);
            }, function (err, results) {
                var lookList = [];
                var qsList = [];
                var qcList = [];
                var _list = [];
                for (var i = 0; i < results.length; i++) {
                    var users = results[i].users ? Math.round(results[i].users) : 0;
                    lookList.push({
                        x: Date.UTC(results[i].year, results[i].month - 1, results[i].day, results[i].hour, results[i].minute, results[i].second),
                        y: users
                    });
                    qsList.push({
                        x: Date.UTC(results[i].year, results[i].month - 1, results[i].day, results[i].hour, results[i].minute, results[i].second),
                        y: results[i].qs
                    });
                    qcList.push({
                        x: Date.UTC(results[i].year, results[i].month - 1, results[i].day, results[i].hour, results[i].minute, results[i].second),
                        y: results[i].qc
                    });
                }
                _list.push(lookList);
                _list.push(qsList);
                _list.push(qcList);
                res.send({success: true, data: _list});
            });
        }
    });
});

/**
 * 获取当前频道
 */
router.post('/currentChannel', function (req, res) {
    channelService.queryChannelList({}, function (err, list) {
        if (err) {
            res.send({success: false, message: '程序异常:' + err.message});
        } else {
            async.map(list, function (item, callback) {
                channelService.getChannelHistoryByCHID({chid: item.chid}, function (err, obj) {
                    if (obj[0] && obj[0].qs) {
                        item.qs = obj[0].qs;
                    } else {
                        item.qs = 0;
                    }
                    if (obj[0] && obj[0].qc) {
                        item.qc = obj[0].qc;
                    } else {
                        item.qc = 0;
                    }
                    callback(null, item);
                });
            }, function (err, results) {
                if (err) {
                    res.send({success: false, message: '程序异常:' + err.message});
                } else {
                    res.send({success: true, data: results});
                }
            });
        }
    });
});


/**
 * 电视墙UI
 */
router.get('/channelScreenshot', function (req, res) {
    res.render('admin/channelScreenshot');
});

/**
 * 获取电视墙
 */
router.post('/channelScreenshot', function (req, res) {
    channelService.queryChannelList({}, function (err, list) {
        if (err) {
            res.send({success: false, message: '程序异常:' + err.message});
        } else {
            async.map(list, function (item, callback) {
                channelService.getChannelHistoryByCHID({chid: item.chid}, function (err, obj) {
                    if (obj[0] && obj[0].qs) {
                        item.qs = obj[0].qs;
                    } else {
                        item.qs = 0;
                    }
                    if (obj[0] && obj[0].qc) {
                        item.qc = obj[0].qc;
                    } else {
                        item.qc = 0;
                    }
                    if (obj[0] && obj[0].create_date) {
                        item.create_date = moment(obj[0].create_date).format('HH:mm');
                    }
                    if (obj[0] && obj[0].screenshot) {
                        item.screenshot = obj[0].screenshot;
                    }
                    if (obj[0] && obj[0].screenshot_small) {
                        item.screenshot_small = obj[0].screenshot_small;
                    }
                    callback(null, item);
                });
            }, function (err, result) {
                if (err) {
                    res.send({success: false, message: '程序异常:' + err.message});
                } else {
                    res.send({success: true, data: result});
                }
            });
        }
    });
});


/**
 * 编辑频道UI
 */
router.get('/editorChannel', function (req, res) {
    var chid = req.query.id;
    channelService.findOneChannel({chid: chid}, function (err, channel) {
        if (err) {
            res.send({success: false, message: '程序异常:' + err.message});
        } else {
            res.render('admin/channelEdit', {channel: channel});
        }
    });
});

/**
 * 编辑频道
 */
router.post('/channelEdit', function (req, res) {
    var chid = req.body.chid;
    var proportion = req.body.proportion;
    var key_code = req.body.key_code;
    var editor_id = req.session.sessionUser.id;
    var update_date = moment().format("YYYY-MM-DD HH:mm:ss");
    var params = {};
    params.editor_id = editor_id;
    params.update_date = update_date;
    if (proportion) {
        params.proportion = proportion;
    }
    if (key_code) {
        params.key_code = key_code;
    }
    channelService.updateChannel({chid: chid}, params, function (err) {
        if (err) {
            res.send({success: false, message: '程序异常:' + err.message});
        } else {
            res.send({success: true, message: '修改成功:'});
        }
    });
});


/**
 * 定时任务,获取频道list
 */
var start = function () {
    var rule = new schedule.RecurrenceRule();
    var times = [];
    for (var i = 1; i <= 60; i += 2) {
        times.push(i);
    }
    //rule.second = times;
    rule.minute = times;
    schedule.scheduleJob(rule, function () {
        pullChannel();
    });
};

var pullChannel = function () {
    var params = {};
    var bodyCHID = [];
    channelService.getChannelList(params, function (err, body) {
        channelService.getChannelCHID({}, function (error, channelList) {//查询channel集合
            if (!channelList) {//如果没有就新增
                async.map(body, function (item, callback) {
                    var params = {};
                    params.chid = item.chid;
                    params.description = item.description.init;
                    params.source = item.source.address;
                    params.sid = item.sid;
                    params.category = item.categories.join(',');
                    params.name = item.name.init;
                    params.editor_id = item.source.host.nickname;
                    params.users = item.source.users;
                    params.language = item.language ? item.language : 'zh';
                    params.proportion = '16:9';
                    channelService.addChannel(params, function (err, obj) {
                        callback(err, obj);
                    });
                }, function (err, result) {
                });
            } else {
                async.map(body, function (item, callback) {//遍历集合
                    bodyCHID.push(item.chid);
                    var params = {};
                    params.chid = item.chid;
                    params.description = item.description.init;
                    params.source = item.source.address;
                    params.sid = item.sid;
                    params.category = item.categories.join(',');
                    params.name = item.name.init;
                    params.editor_id = item.source.host.nickname;
                    params.users = item.source.users;
                    params.language = item.language ? item.language : 'zh';
                    var _chid = '';
                    if (item.chid) {
                        _chid = item.chid.toString();
                    }
                    if (channelList.indexOf(_chid) == -1) {//如果channelList里面不包涵chid的话那就新增
                        channelService.addChannel(params, function (err, obj) {
                            callback(err, obj);
                        });
                    }
                    if (channelList.indexOf(_chid) > -1) {////如果channelList里面包涵chid的话那就修改
                        params.state = 1;
                        channelService.updateChannel({chid: item.chid}, params, function (err, obj) {
                            callback(err, obj);
                        });
                    }
                }, function (err, result) {
                    async.map(JSON.parse(channelList), function (item, callback) {//遍历集合
                        if (bodyCHID.indexOf(item) == -1) {
                            channelService.updateChannel({chid: item}, {state: 0}, function () {
                            });
                        }
                    }, function (err, results) {
                    })
                });
            }
        });
    });
};


start();


/**
 * 定时任务,获取频道历史记录
 */
var startChannelHistory = function () {
    var rule = new schedule.RecurrenceRule();
    var times = [];
    for (var i = 1; i <= 60; i += 2) {
        times.push(i);
    }
    rule.minute = times;
    schedule.scheduleJob(rule, function () {
        pullChannelHistory();
    });
};

/**
 * 定时任务  获取频道历史记录
 */
var pullChannelHistory = function () {
    var params = {};
    channelService.getChannelList(params, function (err, body) {
        async.map(body, function (item, callback) {
            var params = {};
            params.chid = item.chid;
            params.users = item.source.users;
            params.qs = item.source.qs;
            params.qc = item.source.qc;
            params.screenshot = item.snaps.big1;
            params.screenshot_small = item.snaps.small1;
            channelService.addChannelHistory(params, function (err, obj) {
                callback(err, obj);
            });
        }, function (err, result) {
        });
    });
};

startChannelHistory();

module.exports = router;
