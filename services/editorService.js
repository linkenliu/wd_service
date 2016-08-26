/**
 * Created by liusheng on 16/7/8.
 */
var sequelize = require('../utils/sequelizeDB');
var moment = require('moment');
var EditorModel = require('../models/EditorModel');
var uuid = require('../utils/uuid');
var editorServices = function(){};


/**
 * 查询单个用户
 * @param params
 * @param callback
 */
editorServices.findOneEditor = function(params,callback){
    EditorModel.findOne({
        where:params
    }).then(function(obj){
        callback(null,obj);
    }).catch(function(err){
        callback(err);
    });
};

/**
 * 查询集合用户
 * @param params
 * @param callback
 */
editorServices.getEditorList = function(params,callback){
    EditorModel.findAndCount({
        where:params
    }).then(function(obj){
        callback(null,obj);
    }).catch(function(err){
        callback(err);
    });
};



/**
 * 新增用户
 * @param {Object} params
 * @param {Object} callback
 */
editorServices.addEditor = function(params,callback){
    EditorModel.create({
        id:uuid.v1(),
        name:params.name,
        password:params.password,
        phone:params.phone,
        email:params.email,
        state:1,
        create_date: moment().format("YYYY-MM-DD HH:mm:ss"),
        update_date: moment().format("YYYY-MM-DD HH:mm:ss")
    }).then(function(obj){
        callback(null,obj);
    }).catch(function(err){
        callback(err);
    });
};


/**
 * 修改用户
 * @param {Object} con
 * @param {Object} params
 * @param {Object} callback
 */
editorServices.updateEditor = function(con,params,callback){
    EditorModel.update(params,{
        where:con
    }).then(function(obj){
        callback(null,obj);
    }).catch(function(err){
        callback(err);
    });
};

/**
 * 删除用户
 * @param {Object} params
 * @param {Object} callback
 */
editorServices.deleteEditor = function(params,callback){
    EditorModel.destroy({where:params}).then(function(obj){
        callback(null,obj);
    }).catch(function(err){
        callback(err,null);
    });
};



module.exports = editorServices;