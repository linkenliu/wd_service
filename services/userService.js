/**
 * Created by liusheng on 16/7/8.
 */
var sequelize = require('../utils/sequelizeDB');
var moment = require('moment');
var UserModel = require('../models/UserModel');
var UserMoneyModel = require('../models/UserMoneyModel');
var uuid = require('../utils/uuid');
var userSql = require('../sql_file/user_sql'),userSql = new userSql();;
var userServices = function(){}


/**
 * 查询单个用户
 * @param params
 * @param callback
 */
userServices.findOneUser = function(params,callback){
    UserModel.findOne({
        where:params
    }).then(function(obj){
        callback(null,obj);
    }).catch(function(err){
        callback(err);
    });
};

/**
 * 查询单个计费
 * @param params
 * @param callback
 */
userServices.findOneUserMoney = function(params,callback){
    UserMoneyModel.findOne({
        where:params
    }).then(function(obj){
        callback(null,obj);
    }).catch(function(err){
        callback(err);
    });
};

/**
 * 修改计费
 * @param {Object} con
 * @param {Object} params
 * @param {Object} callback
 */
userServices.updateUserMoney = function(con,params,callback){
    UserMoneyModel.update(params,{
        where:con
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
userServices.addUser = function(params,callback){
    UserModel.create({
        device_id:params.device_id,
        editor_id:params.editor_id,
        user_name:params.user_name,
        phone:params.phone,
        email:params.email,
        gender:params.gender,
        address:params.address,
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
 * 新增用户计费
 * @param {Object} params
 * @param {Object} callback
 */
userServices.addUserMoney = function(params,callback){
    UserMoneyModel.create({
        id:uuid.v1(),
        user_id:params.user_id,
        money:params.money,
        start_date:params.start_date,
        end_date:params.end_date,
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
userServices.updateUser = function(con,params,callback){
    UserModel.update(params,{
        where:con
    }).then(function(obj){
        callback(null,obj);
    }).catch(function(err){
        callback(err);
    });
};


/**
 * 获取用户list
 * @param params
 * @param callback
 */
userServices.getUserList = function(params,callback){
    sequelize.query(userSql.getUserList(params), {
        type: sequelize.QueryTypes.SELECT
    }).then(function (list) {
        callback(null, list);
    }).catch(function(err){
        callback(err);
    });
};


/**
 * 获取用户count
 * @param params
 * @param callback
 */
userServices.getUserCount = function(params,callback){
    sequelize.query(userSql.getUserCount(params), {
        type: sequelize.QueryTypes.SELECT
    }).then(function (obj) {
        callback(null, obj);
    }).catch(function(err){
        callback(err);
    });
};


/**
 * 获取用户count
 * @param params
 * @param callback
 */
userServices.getUserCount = function(params,callback){
    sequelize.query(userSql.getUserCount(params), {
        type: sequelize.QueryTypes.SELECT
    }).then(function (list) {
        callback(null, list);
    }).catch(function(err){
        callback(err);
    });
};

/**
 * 删除用户
 * @param {Object} params
 * @param {Object} callback
 */
userServices.deleteUser = function(params,callback){
    UserModel.destroy({where:params}).then(function(obj){
        callback(null,obj);
    }).catch(function(err){
        callback(err,null);
    });
};



/**
 * 获取用户计费列表
 * @param params
 * @param callback
 */
userServices.getUserMoneyList = function(params,callback){
    sequelize.query(userSql.getUserMoneyList(params), {
        type: sequelize.QueryTypes.SELECT
    }).then(function (list) {
        callback(null, list);
    }).catch(function(err){
        callback(err);
    });
};

/**
 * 获取最大的时间
 * @param params
 * @param callback
 */
userServices.getMaxUserMoneyForEndDate = function(params,callback){
    sequelize.query(userSql.getMaxUserMoneyForEndDate(params), {
        type: sequelize.QueryTypes.SELECT
    }).then(function (obj) {
        callback(null, obj);
    }).catch(function(err){
        callback(err);
    });
};


/**
 * 删除用户缴费记录
 * @param {Object} params
 * @param {Object} callback
 */
userServices.deleteUserMoney = function(params,callback){
    UserMoneyModel.destroy({where:params}).then(function(obj){
        callback(null,obj);
    }).catch(function(err){
        callback(err,null);
    });
};




module.exports = userServices;