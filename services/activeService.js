/**
 * Created by liusheng on 16/8/19.
 */
"use strict";
var http = require("http"),
    ActiveModel = require('../models/ActiveModel'),
    moment = require('moment'),
    uuid = require('../utils/uuid'),
    activeSql = require('../sql_file/active_sql'),activeSql = new activeSql(),
    sequelize = require('../utils/sequelizeDB'),
    fs = require('fs'),
    activeService = function(){};


/**
 * 日志分析
 * @param params
 * @param next
 */
activeService.pullActiveList = function (params, next) {
    var d = __dirname;
    d = d.replace('services', 'sqlscript');
    var exec = require('child_process').exec;
    var option = {
        encoding: 'utf8',
        timeout: 120, /*子进程最长执行时间 */
        maxBuffer: 1024 * 200, /*stdout和stderr的最大长度*/
        killSignal: 'SIGTERM',
        cwd: null,
        env: null
    };
    var cmdStr = 'curl ' + params.host + ' | grep SC_STOP_DIED >> ' + d + '/' + params.log_name + '';
    exec(cmdStr, option, function (err, stdout, stderr) {
        setTimeout(function () {
            var contentText = fs.readFileSync(d + '/' + params.log_name + '', 'utf-8');
            fs.unlink(d + '/' + params.log_name + '', function (err) {
            });
            next(contentText)
        }, 15000)
    });
};



/**
 * 新增用户
 * @param {Object} params
 * @param {Object} callback
 */
activeService.addActive = function(params,callback){
    ActiveModel.create({
        active_id:uuid.v1(),
        user_id:params.user_id,
        channel_id:params.channel_id,
        pre_id:params.pre_id,
        look_long:params.look_long,
        user_ip:params.user_ip,
        exit_date: params.exit_date,
        create_date: moment().format("YYYY-MM-DD HH:mm:ss")
    }).then(function(obj){
        callback(null,obj);
    }).catch(function(err){
        callback(err);
    });
};

/**
 * 获取活跃度列表
 * @param params
 * @param callback
 */
activeService.getActiveList = function(params,callback){
    sequelize.query(activeSql.getActiveList(params), {
        type: sequelize.QueryTypes.SELECT
    }).then(function (list) {
        callback(null, list);
    }).catch(function(err){
        callback(err);
    });
};

/**
 * 获取活跃度count
 * @param params
 * @param callback
 */
activeService.getActiveCount = function(params,callback){
    sequelize.query(activeSql.getActiveCount(params), {
        type: sequelize.QueryTypes.SELECT
    }).then(function (list) {
        callback(null, list);
    }).catch(function(err){
        callback(err);
    });
};


module.exports = activeService;