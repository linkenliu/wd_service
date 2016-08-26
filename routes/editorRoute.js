"use strict";
var express = require('express');
var router = express.Router();
var async = require('async');
var editorService = require('../services/editorService');
var rightService = require('../services/rightService');
var dateUtils = require('../utils/dateUtils');
var commonUtil = require('../utils/commonUtil');
var moment = require('moment');
var logger = require('../utils/log').logger;
/**
 * 用户登录
 */
router.post('/login', function (req, res) {
    var name = req.body.name;
    var password = req.body.password;
    rightService.findEditorAndRole({name: name}, function (err, user) {
        var user = user[0];
        if (user && user.state == 1) {
            if (user.password == commonUtil.encrypt(password)) {
                req.session.regenerate(function () {
                    // 将用户信息存入session中
                    req.session.sessionUser = user;
                    req.session.save(function (error) {
                        if (error) {
                            console.log('会话保存失败!');
                        } else {
                            console.log('会话保存成功!');
                        }
                        res.json({message: '登陆成功,正在跳转...', code: 200});
                    });
                });
            } else {
                res.json({message: '用户名或密码错误!', code: 400});
            }
        } else if (!user) {
            res.json({message: '用户名或密码错误!', code: 400});
        } else if (user.state != 1) {
            res.json({message: '用户被锁定!', code: 400});
        } else {
            res.json({message: '未知用户!', code: 400});
        }
    });
});



/**
 * 用户列表
 */
router.get('/editorList', function (req, res) {
    var keyWord = req.query.keyWord;
    var postChoose = req.query.postChoose;
    var params = {
        state: {ne: -1}
    };
    if (postChoose == 1) {
        params.name = {like: '%' + keyWord + '%'};
    }
    editorService.getEditorList(params, function (err, editorObj) {
        async.map(editorObj.rows, function (item, callback) {
            item.createDate = dateUtils.formatGMTDate(item.create_date);
            callback(err, item);
        }, function (err, results) {
            if (err) {
                logger.error(err.message);
                res.send({success: false, message: '程序异常'});
            } else {
                res.render('admin/editorList', {editorList: results});
            }
        })
    });
});

/**
 * 新增小编用户UI
 */
router.get('/editorAddUI', function (req, res) {
    rightService.getRoleList({}, function (err, roleList) {
        if (err) {
            res.send({success: false, message: '程序异常' + err.message});
        } else {
            res.render('admin/editorAdd', {roleList: roleList});
        }
    });
});

/**
 * 新增小编用户
 */
router.post('/editorAdd', function (req, res) {
    var name = req.body.name;
    name = name ? name.trim() : null;
    var password = req.body.password;
    password = password ? password.trim() : null;
    var phone = req.body.phone;
    phone = phone ? phone.trim() : null;
    var email = req.body.email;
    email = email ? email.trim() : null;
    password = commonUtil.encrypt(password);
    var role_id = req.body.role;
    editorService.addEditor({name: name, password: password, phone: phone, email: email}, function (err, userObj) {
        if (err) {
            logger.error(err.message);
            res.send({success: false, message: '程序异常' + err.message});
        } else {
            if(role_id){
                rightService.addUserRole({role_id: role_id, user_id: userObj.id}, function (err) {
                    if (err) {
                        res.send({success: false, message: '程序异常' + err.message});
                    } else {
                        res.redirect("/admin/editorList");
                    }
                });
            }else{
                res.redirect("/admin/editorList");
            }
        }
    });
});
/**
 * 编辑用户UI
 */
router.get('/editorEditUI', function (req, res) {
    var id = req.query.id;
    async.parallel([
        function (next) {
            rightService.findOneEditorRole({id: id}, function (err, editors) {
                var editor = editors[0];
                if (!err) {
                    if (editor && editor.password) {
                        editor.password = commonUtil.decrypt(editor.password);
                    }
                }
                next(err, editor);
            });
        },
        function (next) {
            rightService.getRoleList({}, function (err, roleList) {
                next(err, roleList);
            });
        }
    ], function (err, result) {
        if (err) {
            res.send({success: false, message: '程序异常' + err.message});
        } else {
            res.render('admin/editorEdit', {editor: result[0], roleList: result[1]});
        }
    });
});

/**
 * 编辑用户
 */
router.post('/editorEdit', function (req, res) {
    var id = req.body.id;
    var name = req.body.name;
    name ? name.trim() : null;
    var password = req.body.password;
    password ? password.trim() : null;
    password = commonUtil.encrypt(password);
    var phone = req.body.phone;
    phone ? phone.trim() : null;
    var email = req.body.email;
    email ? email.trim() : null;
    var role_id = req.body.role;
    /* editorService.updateEditor({id: id}, {
     name: name,
     password: password,
     update_date: moment().format("YYYY-MM-DD HH:mm:ss"),
     phone: phone,
     email: email
     }, function (err) {
     if (err) {
     logger.error(err.message);
     res.send({success: false, message: '程序异常'});
     } else {
     res.redirect("/admin/editorList");
     }
     });*/
    async.parallel([
        function (next) {
            editorService.updateEditor({id: id}, {
                name: name,
                password: password,
                update_date: moment().format("YYYY-MM-DD HH:mm:ss"),
                phone: phone,
                email: email
            }, function (err, obj) {
                next(err, obj);
            });
        },
        function (next) {
            if(role_id){
                rightService.findOneUserRole({user_id: id}, function (err, userRole) {
                    if (userRole) {
                        rightService.updateUserRole({user_id: id}, {role_id: role_id}, function (err) {
                            next(err)
                        });
                    } else {
                        rightService.addUserRole({user_id: id, role_id: role_id}, function (err) {
                            next(err)
                        });
                    }
                    next(err);
                });
            }else{
                next();
            }
        }
    ], function (err, result) {
        if (err) {
            res.send({success: false, message: '程序异常' + err.message});
        } else {
            res.redirect("/admin/editorList");
        }
    });
});

/**
 * 删除用户
 */
router.get('/editorDelete', function (req, res) {
    var id = req.query.id;
    async.parallel([
        function (next) {
            editorService.deleteEditor({id: id}, function (err) {
                next(err);
            });
        },
        function (next) {
            rightService.deleteUserRole({user_id: id}, function (err) {
                next(err);
            });
        }
    ], function (err) {
        if (err) {
            logger.error(err.message);
            res.send({success: false, message: '程序异常' + err.message});
        } else {
            res.redirect("/admin/editorList");
        }
    });
});

/**
 * 退出
 */
router.get('/layout', function (req, res) {
    req.session.destroy(function (err) {
        if (err) {
            logger.error(err.message);
            console.log('session 销毁失败!');
            res.send({success: false, message: '程序异常'});
        } else {
            console.log('session 销毁成功!');
            res.redirect('/admin');
        }
    });
});


/**
 * 验证用户名
 */
router.post('/checkEditorName', function (req, res) {
    var name = req.body.name;
    var action = req.body.action;
    if ('editorAdd' == action) {
        editorService.findOneEditor({name: name}, function (err, editor) {
            if (editor) {
                res.send({success: true, message: '用户已存在'});
            } else {
                res.send({success: false, message: '敬请的添加吧'});
            }
        });
    } else if ('editorEdit' == action) {
        var id = req.body.id;
        editorService.findOneEditor({name: name, id: {ne: id}}, function (err, editor) {
            if (editor) {
                res.send({success: true, message: '用户已存在'});
            } else {
                res.send({success: false, message: '敬请的添加吧'});
            }
        });
    }
});

module.exports = router;
