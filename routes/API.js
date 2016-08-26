/**
 * Created by liusheng on 16/8/11.
 */
"use strict";
/**
 * Created by liusheng on 16/7/8.
 */
var express = require('express'),
    router = express.Router(),
    userController = require('./controller/userController'),
    channelController = require('./controller/channelController');
/* GET home page. */
router.post('/v1/:flag', function(req, res, next) {
    var url = req.originalUrl;
    switch (url){
        case '/v1/login'://用户登录     验证剩余天数,是否可播放.
            userController.login(req,res);
            break;
        case '/v1/channel'://频道列表
            channelController.getChannelList(req,res);
            break;
        case '/v1/epg':
            channelController.getEpgList(req,res);
            break;
        case '/v1/auth':
            userController.auth(req,res);
            break;
        default :
            next;
            res.send({'error':'request is not path'});
            break;
    }
});

router.get('/v1/:flag', function(req, res, next) {
    var url = req.originalUrl;
    switch (url){
        case '/v1/login'://用户登录     验证剩余天数,是否可播放.
            res.send({success:false,message:'请用post请求'});
            break;
        case '/v1/channel'://频道列表
            res.send({success:false,message:'请用post请求'});
            break;
        case '/v1/epg':
            res.send({success:false,message:'请用post请求'});
            break;
        case '/v1/auth':
            res.send({success:false,message:'请用post请求'});
            break;
        default :
            next;
            res.send({'error':'request is not path'});
            break;
    }
});


module.exports = router;
