var express = require('express');
var router = express.Router();
var menu = require('../utils/menu');
var channelService = require('../services/channelService');
/* GET home page. */
router.get('/admin', function (req, res, next) {
    res.render('admin/login', {title: 'Express'});
});

router.get('/admin/getMenu', function (req, res, next) {
    menu.getMenu(req.session.sessionUser.id, function (data) {
        if (data.success == true) {
            req.session.menuList = data.data;
            req.session.save(function (error) {
                if (error) {
                    res.render('admin/login');
                } else {
                    res.redirect('/admin/index');
                }
            });
        } else {
            res.render('admin/login');
        }
    });
});

router.get('/admin/index', function (req, res) {
    if(req.session.menuList.indexOf('SYSTEM_SUMMARY') > -1){
        channelService.queryChannelList({},function(err,channelList){
            if(err){
                res.send({success:false,message:'程序异常'+err.message});
            }else {
                res.render('admin/index',{channelList:channelList});
            }
        });
    }else{
        res.render('admin/index2');
    }
});

module.exports = router;
