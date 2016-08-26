/**
 * Created by liusheng on 16/8/18.
 */

var rightService = require('../services/rightService'),
    async = require('async');
exports.getMenu = function (user_id, next) {
    rightService.getUserRoleByUSERID({user_id: user_id}, function (err, role) {
        if (err) {
            next({success: false, message: err.message});
        } else {
            var role = role[0];
            if (role) {
                rightService.getMenu({role_id: role.role_id}, function (err, menuList) {
                    if (err) {
                        next({success: false, message: err.message});
                    } else {
                        var _menuList = [];
                        async.map(menuList, function (item, callback) {
                            _menuList.push(item.right_node);
                            callback(null);
                        }, function () {
                            next({success: true, data: _menuList});
                        });
                    }
                });
            } else {
                next({success: true, data: []});
            }
        }
    });
};
