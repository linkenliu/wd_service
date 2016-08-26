var express = require('express');
var router = express.Router();
var async = require('async');
var dateUtils = require('../utils/dateUtils');
var rightService = require('../services/rightService');

/**
 * 菜单列表
 */
router.get('/rightList', function (req, res) {
    rightService.getRightParent({}, function (err, list) {
        if (err) {
            res.send({success: false, message: '程序异常:' + err.message});
        } else {
            var _list = [];
            async.map(list, function (item, callback) {
                rightService.getRightByParentID({right_id: item.right_id}, function (err, rightList) {
                    _list.push(item);
                    async.map(rightList, function (item2) {
                        _list.push(item2);
                    });
                    callback(err, rightList);
                });
            }, function (err) {
                if (err) {
                    res.send({success: false, message: '程序异常:' + err.message});
                } else {
                    res.render('admin/rightList', {rightList: _list});
                }

            });
        }
    });
});

/**
 * 新增菜单UI
 */
router.get('/rightAdd', function (req, res) {
    rightService.getRightParent({}, function (err, list) {
        if (err) {
            res.send({success: false, message: '程序异常:' + err.message});
        } else {
            res.render('admin/rightAdd', {list: list});
        }
    });
});

/**
 * 新增菜单
 */
router.post('/rightAdd', function (req, res) {
    var obj = req.body;
    var right_parent_id = obj.right_parent_id;
    var right_name = obj.right_name;
    var right_node = obj.right_node;
    var right_path = obj.right_path;
    var icon = obj.icon;
    var sort = obj.sort ? obj.sort : 0;
    params = {};
    if (!right_parent_id) {
        params.is_parent = 1;
    }
    params.right_parent_id = right_parent_id ? right_parent_id : null;
    params.right_name = right_name;
    params.right_node = right_node;
    params.right_path = right_path;
    params.icon = icon;
    params.sort = sort;
    rightService.addRight(params, function (err, obj) {
        if (err) {
            res.send({success: false, message: '程序异常:' + err.message});
        } else {
            res.redirect('/admin/rightList');
        }
    });
});


/**
 * 编辑菜单UI
 */
router.get('/rightEdit', function (req, res) {
    var right_id = req.query.right_id;
    async.parallel([
        function (next) {
            rightService.findOneRight({right_id: right_id}, function (err, right) {
                next(err, right);
            });
        },
        function (next) {
            rightService.getRightParent({}, function (err, list) {
                next(err, list);
            });
        }
    ], function (err, result) {
        if (err) {
            res.send({success: false, message: '程序异常:' + err.message});
        } else {
            res.render('admin/rightEdit', {right: result[0], list: result[1]});
        }
    });
});

/**
 * 编辑菜单
 */
router.post('/rightEdit', function (req, res) {
    var obj = req.body;
    var right_id = obj.right_id;
    var right_parent_id = obj.right_parent_id;
    var right_name = obj.right_name;
    var right_node = obj.right_node;
    var right_path = obj.right_path;
    var icon = obj.icon;
    var sort = obj.sort ? obj.sort : 0;
    params = {};
    if (!right_parent_id) {
        params.is_parent = 1;
    }
    params.right_parent_id = right_parent_id ? right_parent_id : null;
    params.right_name = right_name;
    params.right_node = right_node;
    params.right_path = right_path;
    params.icon = icon;
    params.sort = sort;
    rightService.updateRight({right_id: right_id}, params, function (err) {
        if (err) {
            res.send({success: false, message: '程序异常:' + err.message});
        } else {
            res.redirect('/admin/rightList');
        }
    });
});

/**
 * 删除菜单
 */
router.post('/deleteRight', function (req, res) {
    var right_id = req.body.right_id;
    async.parallel([
        function (next) {
            rightService.deleteRight({right_id: right_id}, function (err) {
                next(err);
            });
        },
        function (next) {
            rightService.deleteRoleRight({right_id: right_id}, function (err) {
                next(err);
            });
        }
    ], function (err) {
        if (err) {
            res.send({success: false, message: '删除失败'});
        } else {
            res.send({success: true, message: '删除成功'});
        }
    });
});


/**
 * 角色列表
 */
router.get('/roleList', function (req, res) {
    rightService.getRoleList({}, function (err, roleList) {
        if (err) {
            res.send({success: false, message: '程序异常:' + err.message});
        } else {
            async.map(roleList, function (item, callback) {
                if (item.create_date) {
                    item.create_date = dateUtils.formatDate(item.create_date);
                }
                callback(null, item);
            }, function (err, result) {
                if (err) {
                    res.send({success: false, message: '程序异常:' + err.message});
                } else {
                    res.render('admin/roleList', {roleList: result});
                }
            });
        }
    });
});

/**
 * 新增角色UI
 */
router.get('/roleAdd', function (req, res) {
    rightService.getRightParent({}, function (err, list) {
        if (err) res.send({success: false, message: '程序异常:' + err.message});
        var _list = [];
        async.map(list, function (item, callback) {
            var resobj = {};
            resobj.right_id = item.right_id;
            resobj.right_name = item.right_name;
            rightService.getRightByParentID({right_id: item.right_id}, function (err, rightList) {
                resobj.subList = rightList;
                callback(err, rightList);
            });
            _list.push(resobj);
        }, function (err) {
            if (err) {
                res.send({success: false, message: '程序异常:' + err.message});
            } else {
                res.render('admin/roleAdd', {rightList: _list});
            }
        });
    });
});

/**
 * 新增角色
 */
router.post('/roleAdd', function (req, res) {
    var role_name = req.body.role_name;
    var role_node = req.body.role_node;
    var role_right_list = req.body.role_right;
    rightService.addRole({role_name: role_name, role_node: role_node}, function (err, role) {
        if (err) {
            res.send({success: false, message: '程序异常:' + err.message});
        } else {
            async.map(role_right_list, function (item, next) {
                rightService.addRoleRight({role_id: role.role_id, right_id: item}, function (err, roleRight) {
                    next(err, roleRight);
                });
            }, function (err) {
                if (err) {
                    res.send({success: false, message: '程序异常:' + err.message});
                } else {
                    res.redirect('/admin/roleList');
                }
            });
        }
    });
});


/**
 * 删除角色
 */
router.post('/deleteRole', function (req, res) {
    var role_id = req.body.role_id;
    async.parallel([
        function (next) {
            rightService.deleteRole({role_id: role_id}, function (err) {
                next(err);
            });
        },
        function (next) {
            rightService.deleteRoleRight({role_id: role_id}, function (err) {
                next(err);
            })
        }
    ], function (err) {
        if (err) {
            res.send({success: false, message: '删除失败'});
        } else {
            res.send({success: true, message: '删除成功'});
        }
    });
});


/**
 * 编辑角色UI
 */
router.get('/roleEdit', function (req, res) {
    var role_id = req.query.role_id;
    rightService.findOneRole({role_id: role_id}, function (err, role) {
        rightService.getRightParent({}, function (err, list) {
            if (err) res.send({success: false, message: '程序异常:' + err.message});
            var _list = [];
            async.map(list, function (item, callback) {
                var resobj = {};
                resobj.right_id = item.right_id;
                resobj.right_name = item.right_name;
                rightService.getRightByParentID({right_id: item.right_id}, function (err, rightList) {
                    resobj.subList = rightList;
                    callback(err, rightList);
                });
                _list.push(resobj);
            }, function (err) {
                if (err) {
                    res.send({success: false, message: '程序异常:' + err.message});
                } else {
                    rightService.findRoleRight({role_id: role_id}, function (err, crrList) {
                        for (var i = 0; i < crrList.length; i++) {
                            for (var j = 0; j < _list.length; j++) {
                                if (crrList[i].right_id == _list[j].right_id) {
                                    _list[j].flagS = 1;
                                }
                                for (k = 0; k < _list[j].subList.length; k++) {
                                    if (crrList[i].right_id == _list[j].subList[k].right_id) {
                                        _list[j].subList[k].flagS = 1;
                                    }
                                }
                            }
                        }
                        res.render('admin/roleEdit', {rightList: _list, role: role});
                    });

                }
            });
        });
    });
});


/**
 * 编辑角色
 */
router.post('/roleEdit', function (req, res) {
    var role_id = req.body.role_id;
    var role_name = req.body.role_name;
    var role_node = req.body.role_node;
    var role_right_list = req.body.role_right;
    async.parallel([
        function (next) {
            rightService.updateRole({role_id: role_id}, {
                role_name: role_name,
                role_node: role_node
            }, function (err, role) {
                next(err, role);
            });
        },
        function (next) {
            rightService.deleteRoleRight({role_id: role_id}, function (err) {
                if (err) {
                    res.send({success: false, message: '程序异常:' + err.message});
                } else {
                    if (typeof role_right_list == 'string') {
                        rightService.addRoleRight({
                            role_id: role_id,
                            right_id: role_right_list
                        }, function (err, roleRight) {
                            next(err, roleRight);
                        });
                    } else {
                        async.map(role_right_list, function (item, next) {
                            rightService.addRoleRight({role_id: role_id, right_id: item}, function (err, roleRight) {
                                next(err, roleRight);
                            });
                        }, function (err) {
                            next(err);
                        });
                    }
                }
            });
        }
    ], function (err) {
        if (err) {
            res.send({success: false, message: '程序异常:' + err.message});
        } else {
            res.redirect('/admin/roleList');
        }
    });
});


module.exports = router;
