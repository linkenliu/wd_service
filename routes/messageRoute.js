"use strict";
var express = require('express');
var router = express.Router();
var async = require('async');
var dateUtils = require('../utils/dateUtils');
var messageService = require('../services/messageService');
var Response = require('../utils/responseUtil.js');
var response = Response();
var logger = require('../utils/log').logger;
var moment = require('moment');


/*广播消息*/
router.post('/pushMessage', function (req, res) {
    var id = req.body.id;
    var message = req.body.message;
    var action = req.body.action;
    var editor_id = req.session.sessionUser.id;//得到session中的值
    if ('single' == action) {
        messageService.addMessage({user_id: id, message: message, type: 1,editor_id:editor_id}, function (err) {
            if (err) {
                logger.error(err.message);
                res.send({success: false, message: '程序异常'});
            } else {
                res.send({success: true, message: '推送成功'});
            }
        });
    } else if ('all' == action) {
        messageService.addMessage({message: message, type: 0,editor_id:editor_id}, function (err) {
            if (err) {
                logger.error(err.message);
                res.send({success: false, message: '程序异常'});
            } else {
                res.send({success: true, message: '推送成功'});
            }
        });
    } else {
        res.send({success: false, code: 401});
    }
});

/**
 * 消息列表
 */
router.get('/messageList', function (req, res) {
    var postChoose = req.query.postChoose;
    var keyWord = req.query.keyWord?req.query.keyWord.trim():'';
    var params = {};
    params.keyWord = keyWord;
    params.postChoose = postChoose;
    messageService.getMessageList(params, function (err, messageList) {
        if(err){
            logger.error(err.message);
            response.success = false;
            response.resMessage('程序异常:' + err.message);
            res.send(response);
        }else{
            async.map(messageList, function (item, callback) {
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
                    res.render('admin/messageList', {messageList: result});
                }
            });
        }
    });
});


/**
 * 删除消息
 */
router.post('/deleteMessage',function(req,res){
    var id = req.body.id;
    messageService.deleteMessage({id:id},function(err){
       if(err){
           logger.error(err.message);
           res.send({success:false,message:'程序异常'});
       } else{
           res.send({success:true,message:'删除成功'});
       }
    });
});


/**
 * 修改消息
 */
router.post('/updateMessage',function(req,res){
    var id = req.body.id;
    var message = req.body.message;
    messageService.updateMessage({id:id},{message:message},function(err){
        if(err){
            logger.error(err.message);
            res.send({success:false,message:'程序异常'});
        } else{
            res.send({success:true,message:'删除成功'});
        }
    });
});

module.exports = router;
