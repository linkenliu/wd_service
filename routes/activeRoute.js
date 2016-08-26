"use strict";
var express = require('express');
var router = express.Router();
var async = require('async');
var dateUtils = require('../utils/dateUtils');
var activeService = require('../services/activeService');
var Response = require('../utils/responseUtil.js');
var response = Response();
var logger = require('../utils/log').logger;
var moment = require('moment');
var fs = fs = require('fs');
var schedule = require("node-schedule");
/**
 * 获取活跃度列表
 */
router.get('/activeList', function (req, res) {
    var postChoose = req.query.postChoose;
    var keyWord = req.query.keyWord;
    var params = {};
    params.postChoose = postChoose;
    params.keyWord = keyWord;
    var index = req.query.pageIndex ? req.query.pageIndex : 1;
    var pageSize = req.query.pageSize ? req.query.pageSize : 50;
    var pageIndex = index == null ? 0 : (index - 1) * pageSize;
    params.pageIndex = pageIndex;
    params.pageSize = pageSize;
    var totalCount = 0;
    activeService.getActiveCount(params, function (err, count) {
        if (err) return res.send({success: false, message: '程序异常' + err.message});
        totalCount = count.length;
        activeService.getActiveList(params, function (err, activeList) {
            if (err) {
                res.send({success: false, message: '程序异常' + err.message});
            } else {

                res.render('admin/activeList', {
                    activeList: activeList, currentPage: index,
                    totalCount: totalCount, params: params
                });
            }
        });
    });
});


var pullActive = function () {
    var params = {};
    var host = 'http://218.92.227.216/broker_behavior_' + dateUtils.getYesterdayDate() + '.log';
    params.host = host;
    var log_name = 'broker_behavior_' + dateUtils.getYesterdayDate() + '.log';
    params.log_name = log_name;
    activeService.pullActiveList(params, function (body) {
        var str = body;
        var active_arr = str.split('\n');
        var _list = [];
        async.map(active_arr, function (item, next) {
            var active_sub_arr = item.split(' ');
            if (active_sub_arr && active_sub_arr.length == 17) {
                var exit_date = active_sub_arr[3] + ' ' + active_sub_arr[4];
                exit_date = exit_date.replace(/\"/g, "");
                var look_long = active_sub_arr[12];
                look_long = look_long.replace(/\"/g, "");
                var channel_id = active_sub_arr[6];
                channel_id = channel_id.replace(/\"/g, "");
                var user_id = active_sub_arr[7];
                user_id = user_id.replace(/\"/g, "");
                user_id = parseInt(user_id, 16);
                var pre_id = active_sub_arr[8];
                pre_id = pre_id.replace(/\"/g, "");
                var user_ip = active_sub_arr[10];
                user_ip = user_ip.replace(/\"/g, "");
                var o = {};
                o.exit_date = exit_date;
                o.look_long = look_long;
                o.channel_id = channel_id;
                o.user_id = user_id;
                o.pre_id = pre_id;
                o.user_ip = user_ip;
                _list.push(o);
                console.log(o)
            }
            next(null);

        }, function () {
            //console.log(_list)
            /*if(_list && _list.length > 0){
             async.map(_list, function (item, next) {
             activeService.addActive(item, function (err, active) {
             next(err, active);
             });
             }, function (err, result) {

             });
             }*/
        });
        /* str = str.replace(/\n/g, " ");
         str = str.replace(/\"/g, "");
         var arr = str.split(' ');
         var resArrObj = [], i = 0;
         while (true) {
         var arr_slice = arr.slice(i, i += 17);
         console.log("*****==="+JSON.stringify(arr_slice))
         if (arr_slice.length !== 17) {
         break;
         }
         var exit_date = arr_slice[3] + ' ' + arr_slice[4],
         look_long = arr_slice[12],
         channel_id = arr_slice[6],
         user_id = arr_slice[7],
         pre_id = arr_slice[8],
         user_ip = arr_slice[10];
         var _user_id = parseInt(user_id, 16);
         var o = {
         exit_date: exit_date,
         look_long: look_long,
         channel_id: channel_id,
         user_id: _user_id,
         pre_id: pre_id,
         user_ip: user_ip
         };
         resArrObj.push(o);
         }*/
        /*if (resArrObj && resArrObj.length > 0) {
         async.map(resArrObj, function (item, next) {
         activeService.addActive(item, function (err, active) {
         next(err, active);
         });
         }, function (err, result) {

         });
         }*/

    });
};


var start = function () {
    var myDate = new Date();
    var myYear = myDate.getFullYear();
    var myMonth = myDate.getMonth();
    var myDate = myDate.getDate();
    var date = new Date(myYear, myMonth, myDate, 3, 30, 30);

    var j = schedule.scheduleJob(date, function () {

        console.log("执行任务");
        pullActive();



    });
};


//start();


module.exports = router;
