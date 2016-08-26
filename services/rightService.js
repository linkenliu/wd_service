/**
 * Created by liusheng on 16/7/8.
 */
var sequelize = require('../utils/sequelizeDB');
var moment = require('moment');
var RightModel = require('../models/RightModel');
var RoleModel = require('../models/RoleModel');
var RoleRightModel = require('../models/RoleRightModel');
var UserRoleModel = require('../models/UserRoleModel');
var uuid = require('../utils/uuid');
var rightSql = require('../sql_file/right_sql'),rightSql = new rightSql();
var rightService = function(){};


/**
 * 获取父级菜单
 * @param params
 * @param callback
 */
rightService.getRightParent = function(params,callback){
    sequelize.query(rightSql.getRightParent(params), {
        type: sequelize.QueryTypes.SELECT
    }).then(function (list) {
        callback(null, list);
    }).catch(function(err){
        callback(err);
    });
};


/**
 * 根据父级获取子级
 * @param params
 * @param callback
 */
rightService.getRightByParentID = function(params,callback){
    sequelize.query(rightSql.getRightByParentID(params), {
        type: sequelize.QueryTypes.SELECT
    }).then(function (list) {
        callback(null, list);
    }).catch(function(err){
        callback(err);
    });
};


/**
 * 新增菜单
 * @param {Object} params
 * @param {Object} callback
 */
rightService.addRight = function(params,callback){
    RightModel.create({
        right_id:uuid.v1(),
        right_name:params.right_name,
        right_node:params.right_node,
        right_path:params.right_path,
        right_parent_id:params.right_parent_id,
        is_parent:params.is_parent,
        icon:params.icon,
        sort:params.sort,
        create_date: moment().format("YYYY-MM-DD HH:mm:ss"),
    }).then(function(obj){
        callback(null,obj);
    }).catch(function(err){
        callback(err);
    });
};


/**
 * 查询单个菜单
 * @param params
 * @param callback
 */
rightService.findOneRight = function(params,callback){
    RightModel.findOne({
        where:params
    }).then(function(obj){
        callback(null,obj);
    }).catch(function(err){
        callback(err);
    });
};


/**
 * 修改菜单
 * @param {Object} con
 * @param {Object} params
 * @param {Object} callback
 */
rightService.updateRight = function(con,params,callback){
    RightModel.update(params,{
        where:con
    }).then(function(obj){
        callback(null,obj);
    }).catch(function(err){
        callback(err);
    });
};

/**
 * 删除菜单
 * @param {Object} params
 * @param {Object} callback
 */
rightService.deleteRight = function(params,callback){
    RightModel.destroy({where:params}).then(function(obj){
        callback(null,obj);
    }).catch(function(err){
        callback(err,null);
    });
};



/**
 * 新增角色
 * @param {Object} params
 * @param {Object} callback
 */
rightService.addRole = function(params,callback){
    RoleModel.create({
        role_id:uuid.v1(),
        role_name:params.role_name,
        role_node:params.role_node,
        create_date: moment().format("YYYY-MM-DD HH:mm:ss"),
    }).then(function(obj){
        callback(null,obj);
    }).catch(function(err){
        callback(err);
    });
};

/**
 * role LIST
 * @param params
 * @param callback
 */
rightService.getRoleList = function(params,callback){
    sequelize.query(rightSql.getRoleList(params), {
        type: sequelize.QueryTypes.SELECT
    }).then(function (list) {
        callback(null, list);
    }).catch(function(err){
        callback(err);
    });
};


/**
 * 新增角色权限关系
 * @param {Object} params
 * @param {Object} callback
 */
rightService.addRoleRight = function(params,callback){
    RoleRightModel.create({
        role_right_id:uuid.v1(),
        role_id:params.role_id,
        right_id:params.right_id,
        create_date: moment().format("YYYY-MM-DD HH:mm:ss"),
    }).then(function(obj){
        callback(null,obj);
    }).catch(function(err){
        callback(err);
    });
};

/**
 * 新增用户角色关系
 * @param {Object} params
 * @param {Object} callback
 */
rightService.addUserRole = function(params,callback){
    UserRoleModel.create({
        user_role_id:uuid.v1(),
        user_id:params.user_id,
        role_id:params.role_id,
        create_date: moment().format("YYYY-MM-DD HH:mm:ss"),
    }).then(function(obj){
        callback(null,obj);
    }).catch(function(err){
        callback(err);
    });
};

rightService.updateUserRole = function(con,params,callback){
    UserRoleModel.update(params,{
        where:con
    }).then(function(obj){
        callback(null,obj);
    }).catch(function(err){
        callback(err);
    });
};

rightService.findOneUserRole = function(params,callback){
    UserRoleModel.findOne({
        where:params
    }).then(function(obj){
        callback(null,obj);
    }).catch(function(err){
        callback(err);
    });
};

rightService.deleteUserRole = function(params,callback){
    UserRoleModel.destroy({where:params}).then(function(obj){
        callback(null,obj);
    }).catch(function(err){
        callback(err,null);
    });
};


rightService.findOneEditorRole = function(params,callback){
    sequelize.query(rightSql.findOneEditorRole(params), {
        type: sequelize.QueryTypes.SELECT
    }).then(function (list) {
        callback(null, list);
    }).catch(function(err){
        callback(err);
    });
};


rightService.deleteRole = function(params,callback){
    RoleModel.destroy({where:params}).then(function(obj){
        callback(null,obj);
    }).catch(function(err){
        callback(err,null);
    });
};


rightService.deleteRoleRight = function(params,callback){
    RoleRightModel.destroy({where:params}).then(function(obj){
        callback(null,obj);
    }).catch(function(err){
        callback(err,null);
    });
};


rightService.findRoleRight = function(params,callback){
    RoleRightModel.findAll({
        where:params
    }).then(function(obj){
        callback(null,obj);
    }).catch(function(err){
        callback(err);
    });
};


rightService.findOneRole = function(params,callback){
    RoleModel.findOne({
        where:params
    }).then(function(obj){
        callback(null,obj);
    }).catch(function(err){
        callback(err);
    });
};

rightService.updateRole = function(con,params,callback){
    RoleModel.update(params,{
        where:con
    }).then(function(obj){
        callback(null,obj);
    }).catch(function(err){
        callback(err);
    });
};

rightService.getMenu = function(params,callback){
    sequelize.query(rightSql.getMenu(params), {
        type: sequelize.QueryTypes.SELECT
    }).then(function (list) {
        callback(null, list);
    }).catch(function(err){
        callback(err);
    });
};

rightService.getUserRoleByUSERID = function(params,callback){
    sequelize.query(rightSql.getUserRoleByUSERID(params), {
        type: sequelize.QueryTypes.SELECT
    }).then(function (list) {
        callback(null, list);
    }).catch(function(err){
        callback(err);
    });
};

rightService.findEditorAndRole = function(params,callback){
    sequelize.query(rightSql.findEditorAndRole(params), {
        type: sequelize.QueryTypes.SELECT
    }).then(function (list) {
        callback(null, list);
    }).catch(function(err){
        callback(err);
    });
};



module.exports = rightService;