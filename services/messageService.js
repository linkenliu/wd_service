/**
 * Created by liusheng on 16/7/8.
 */
var sequelize = require('../utils/sequelizeDB');
var moment = require('moment');
var MessageModel = require('../models/MessageModel');
var messageSql = require('../sql_file/message_sql'),messageSql = new messageSql();
var uuid = require('../utils/uuid');
var messageService = function(){}




/**
 * 新增广播消息
 * @param {Object} params
 * @param {Object} callback
 */
messageService.addMessage = function(params,callback){
    MessageModel.create({
        id:uuid.v1(),
        user_id:params.user_id,
        editor_id:params.editor_id,
        type:params.type,
        message:params.message,
        state:1,
        create_date: moment().format("YYYY-MM-DD HH:mm:ss"),
        release_date: params.release_date
    }).then(function(obj){
        callback(null,obj);
    }).catch(function(err){
        callback(err);
    });
};
/*获取消息列表*/
messageService.getMessageList = function(params,callback){
    sequelize.query(messageSql.getMessageList(params), {
        type: sequelize.QueryTypes.SELECT
    }).then(function (list) {
        callback(null, list);
    }).catch(function(err){
        callback(err);
    });
};


/**
 * 删除消息
 * @param {Object} params
 * @param {Object} callback
 */
messageService.deleteMessage = function(params,callback){
    MessageModel.destroy({where:params}).then(function(obj){
        callback(null,obj);
    }).catch(function(err){
        callback(err,null);
    });
};


/**
 * 修改消息
 * @param {Object} con
 * @param {Object} params
 * @param {Object} callback
 */
messageService.updateMessage = function(con,params,callback){
    MessageModel.update(params,{
        where:con
    }).then(function(obj){
        callback(null,obj);
    }).catch(function(err){
        callback(err);
    });
};

/*获取最后一条消息*/
messageService.getLastMessage = function(params,callback){
    sequelize.query(messageSql.getLastMessage(params), {
        type: sequelize.QueryTypes.SELECT
    }).then(function (obj) {
        callback(null, obj);
    }).catch(function(err){
        callback(err);
    });
};


module.exports = messageService;