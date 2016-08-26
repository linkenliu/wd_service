"use strict";
var express = require('express');
var router = express.Router();
var async = require('async');
var dateUtils = require('../utils/dateUtils');
var userService = require('../services/userService');
var Response = require('../utils/responseUtil.js');
var response = Response();
var logger = require('../utils/log').logger;
var moment = require('moment');

/* 获取用户列表 */
router.get('/userList', function (req, res) {
    var params = {};
    var keyWord = req.query.keyWord ? req.query.keyWord.trim() : '';
    var postChoose = req.query.postChoose;
    var index = req.query.pageIndex ? req.query.pageIndex : 1;
    var pageSize = req.query.pageSize ? req.query.pageSize :50;
    var pageIndex = index == null ? 0 : (index - 1) * pageSize;
    var totalCount = 0;
    params.keyWord = keyWord;
    params.postChoose = postChoose;
    params.pageSize = pageSize;
    params.pageIndex = pageIndex;
    userService.getUserCount(params,function(err,count){
        if(err) res.send({success:false,message:'程序异常:' + err.message});
        totalCount = count[0].count;
        userService.getUserList(params, function (err, list) {
            if (err) {
                logger.error(err.message);
                response.success = false;
                response.resMessage('程序异常:' + err.message);
                res.send(response);
            } else {
                async.map(list, function (item, callback) {
                    if (item.create_date) {
                        item.create_date = dateUtils.formatDate(item.create_date);
                    }
                    callback(null, item);
                }, function (err, result) {
                    if (err) {
                        logger.error(err.message);
                        response.success = false;
                        response.resMessage('程序异常:' + err.message);
                        res.send(response);
                    } else {
                        res.render('admin/userList', {userList: result, currentPage: index,
                            totalCount: totalCount,params:params});
                    }
                });
            }
        });
    });
});

/*新增用户UI*/
router.get('/userAddUI', function (req, res) {
    res.render('admin/userAdd');
});

/**
 * 新增用户
 */
router.post('/userAdd', function (req, res) {
    var params = {};
    var obj = req.body;
    params.device_id = obj.device_id ? obj.device_id.trim() : "";
    params.user_name = obj.user_name;
    params.phone = obj.phone;
    params.email = obj.email;
    params.gender = obj.gender;
    params.address = obj.address;
    var editor_id = '';
    if (req.session.sessionUser) {
        editor_id = req.session.sessionUser.id;//得到session中的值
    }
    params.editor_id = editor_id;
    userService.addUser(params, function (err, obj) {
        if (err) {
            logger.error(err.message);
            response.success = false;
            response.resMessage('程序异常:' + err.message);
            res.send(response);
        } else {
            res.redirect('/admin/userList');
        }
    });
});

/*编辑用户UI*/
router.get('/userEditUI', function (req, res) {
    var key_id = req.query.key_id;
    userService.findOneUser({user_id: key_id}, function (err, user) {
        if (err) {
            logger.error(err.message);
            response.success = false;
            response.resMessage('程序异常:' + err.message);
            res.send(response);
        } else {
            res.render('admin/userEdit', {user: user});
        }
    });
});

/*编辑用户*/
router.post('/userEdit', function (req, res) {
    var params = {};
    var obj = req.body;
    params.user_name = obj.user_name;
    params.phone = obj.phone;
    params.gender = obj.gender;
    params.email = obj.email;
    params.address = obj.address;
    params.device_id = obj.device_id;
    userService.updateUser({user_id: obj.key_id}, params, function (err, obj) {
        if (err) {
            logger.error(err.message);
            response.success = false;
            response.resMessage('程序异常:' + err.message);
            res.send(response);
        } else {
            res.redirect('/admin/userList');
        }
    });
});


/**
 * 删除用户
 */
router.post('/userDelete', function (req, res) {
    var id = req.body.id;
    var action = req.body.action;
    if ('edit' == action) {
        userService.updateUser({user_id: id}, {
            state: 0
        }, function (err) {
            if (err) {
                logger.error(err.message);
                res.send({success: false, message: '程序异常'});
            } else {
                res.send({success: true, message: '编辑成功'});
            }
        });
    } else {
        userService.deleteUser({user_id: id}, function (err) {
            if (err) {
                logger.error(err.message);
                res.send({success: false, message: '程序异常'});
            } else {
                res.send({success: true, message: '删除成功'});
            }
        })
    }
});


router.get('/userState', function (req, res) {
    var key_id = req.query.key_id;
    userService.updateUser({user_id: key_id}, {
        state: 1
    }, function (err) {
        if (err) {
            logger.error(err.message);
            res.send({success: false, message: '程序异常:' + err.message});
        } else {
            res.redirect('/admin/userList');
        }
    });
});

/*获取用户计费列表*/
router.get('/userMoneyList', function (req, res) {
    var params = {};
    var currentDate = moment().format("YYYY-MM-DD HH:mm:ss");
    params.key_id = req.query.key_id;
    userService.getUserMoneyList(params, function (err, list) {
        async.map(list, function (item, callback) {
            if (item.create_date) {
                item.create_date = dateUtils.formatDate(item.create_date);
            }
            if (item.start_date) {
                item.start_date = dateUtils.formatDate(item.start_date);
            }
            if (item.end_date) {
                item.end_date = dateUtils.formatDate(item.end_date);
                if (item.end_date >= currentDate) {
                    item.state = 1;
                } else if (item.date_date < currentDate) {
                    item.state = 0;
                }
            }
            callback(null, item);
        }, function (err, result) {
            if (err) {
                logger.error(err.message);
                response.success = false;
                response.resMessage('程序异常:' + err.message);
                res.send(response);
            } else {
                res.render('admin/userMoneyList', {userMoneyList: result, key_id: req.query.key_id});
            }
        });
    });
});

/*新增用户计费UI*/
router.get('/userMoneyAddUI', function (req, res) {
    var key_id = req.query.key_id;
    res.render('admin/userMoneyAdd', {key_id: key_id});
});

/*新增用户计费*/
router.post('/userMoneyAdd', function (req, res) {
    var key_id = req.body.key_id;
    var start_date = req.body.start_date;
    var end_date = req.body.end_date;
    var money = req.body.money;
    userService.addUserMoney({
        user_id: key_id,
        money: money,
        start_date: start_date,
        end_date: end_date
    }, function (err, obj) {
        if (err) {
            logger.error(err.message);
            response.success = false;
            response.resMessage('程序异常:' + err.message);
            res.send(response);
        } else {
            res.redirect('/admin/userMoneyList?key_id=' + key_id);
        }
    });
});

/*编辑计费UI*/
router.get('/userMoneyEditUI', function (req, res) {
    var id = req.query.id;
    userService.findOneUserMoney({id: id}, function (err, obj) {
        if (err) {
            logger.error(err.message);
            response.success = false;
            response.resMessage('程序异常:' + err.message);
            res.send(response);
        } else {
            if (obj) {
                if (obj.start_date) {
                    obj.setDataValue('start_date', dateUtils.formatDate(obj.start_date))
                }
                if (obj.end_date) {
                    obj.setDataValue('end_date', dateUtils.formatDate(obj.end_date))
                }
            }
            res.render('admin/userMoneyEdit', {userMoney: obj});
        }
    });
});

/*编辑计费*/
router.post('/userMoneyEdit', function (req, res) {
    var id = req.body.id;
    var money = req.body.money;
    var start_date = req.body.start_date;
    var end_date = req.body.end_date;
    var currentDate = moment().format("YYYY-MM-DD HH:mm:ss");
    var key_id = req.body.key_id;
    userService.updateUserMoney({id: id}, {
        money: money,
        start_date: start_date,
        end_date: end_date,
        update_date: currentDate
    }, function (err, obj) {
        if (err) {
            logger.error(err.message);
            response.success = false;
            response.resMessage('程序异常:' + err.message);
            res.send(response);
        } else {
            res.redirect('/admin/userMoneyList?key_id=' + key_id);
        }
    });
});

/**
 * 删除缴费记录
 */
router.post('/deleteUserMoney', function (req, res) {
    var id = req.body.id;
    userService.deleteUserMoney({id: id}, function (err) {
        if (err) {
            res.send({success: false, message: '删除失败'});
        } else {
            res.send({success: true, message: '删除成功'});
        }
    });
});


/**
 * 验证用户唯一ID
 */
router.post('/checkUserID', function (req, res) {
    var device_id = req.body.device_id;
    var action = req.body.action;
    if ('add' == action) {
        userService.findOneUser({device_id: device_id}, function (err, obj) {
            if (obj) {
                res.send({success: true, message: '用户已存在'});
            } else {
                res.send({success: false, message: '尽情的添加吧'});
            }
        });
    } else {
        var user_id = req.body.user_id;
        userService.findOneUser({device_id: device_id, user_id: {ne: user_id}}, function (err, obj) {
            if (obj) {
                res.send({success: true, message: '用户已存在'});
            } else {
                res.send({success: false, message: '尽情的添加吧'});
            }
        });
    }
});

module.exports = router;
