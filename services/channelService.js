/**
 * Created by liusheng on 16/8/11.
 */
var sequelize = require('../utils/sequelizeDB');
var moment = require('moment');
var uuid = require('../utils/uuid');
var channelService = function(){}
var channelSql = require('../sql_file/channel_sql'),channelSql = new channelSql();;
var http = require("https");
var request = require('request');
var ChannelModel = require('../models/ChannelModel');
var ChannelHistoryModel = require('../models/ChannelHistoryModel');
var EpgModel = require('../models/EpgModel');
var async = require('async');
/**
 * 获取频道列表
 * @param params
 * @param next
 */
channelService.getChannelList = function(params,next){
    var options = {
        "method": "GET",
        "hostname": "api.binfun.tv",
        "port": null,
        "path": "/api/v1/channel?gid=57a97783bbd112814a671ee0",
        "headers": {
            "content-type": "application/json",
            "cache-control": "no-cache",
            "postman-token": "eed7be5a-a2ab-672f-ec83-3cbd46f095d4"
        }
    };

    var req = http.request(options, function (res) {
        var chunks = [];

        res.on("data", function (chunk) {
            chunks.push(chunk);
        });

        res.on("end", function () {
            var body = Buffer.concat(chunks);
            body = JSON.parse(body);
            next(null,body);
        });
    });

    req.end();
};

/**
 * 获取频道列表
 * @param params
 * @param next
 */
channelService.queryChannelList = function(params,next){
    sequelize.query(channelSql.getChannelList(params), {
        type: sequelize.QueryTypes.SELECT
    }).then(function (list) {
        next(null,list);
    }).catch(function(err){
        next(err,null);
    });
};

/**
 * 获取epg列表
 * @param params
 * @param next
 */
channelService.getEpgList = function(params,next){
    sequelize.query(channelSql.getEpgList(params), {
        type: sequelize.QueryTypes.SELECT
    }).then(function (list) {
        next(null,list);
    }).catch(function(err){
        next(err,null);
    });
};


/**
 * 获取频道list
 * @param params
 * @param next
 */
channelService.getChannel = function(params,next){
    sequelize.query(channelSql.getChannel(params), {
        type: sequelize.QueryTypes.SELECT
    }).then(function (list) {
        next(null,list);
    }).catch(function(err){
        next(err,null);
    });
};

/**
 * 获取epg列表
 * @param params
 * @param next
 */
channelService.getEpgListForChannel = function(params,next){
    sequelize.query(channelSql.getEpgListForChannel(params), {
        type: sequelize.QueryTypes.SELECT
    }).then(function (list) {
        next(null,list);
    }).catch(function(err){
        next(err,null);
    });
};


/**
 * 获取频道历史记录
 * @param params
 * @param next
 */
channelService.getChannelHistory = function(params,next){
    sequelize.query(channelSql.getChannelHistory(params), {
        type: sequelize.QueryTypes.SELECT
    }).then(function (list) {
        next(null,list);
    }).catch(function(err){
        next(err,null);
    });
};


/**
 *
 * @param params
 * @param next
 */
channelService.getChannelHistoryByCHID = function(params,next){
    sequelize.query(channelSql.getChannelHistoryByCHID(params), {
        type: sequelize.QueryTypes.SELECT
    }).then(function (obj) {
        next(null,obj);
    }).catch(function(err){
        next(err,null);
    });
};

/**
 * 查询单个epg
 * @param params
 * @param callback
 */
channelService.findOneEpg = function(params,callback){
    EpgModel.findOne({
        where:params
    }).then(function(obj){
        callback(null,obj);
    }).catch(function(err){
        callback(err);
    });
};

/**
 * 查询单个频道
 * @param params
 * @param callback
 */
channelService.findOneChannel = function(params,callback){
    ChannelModel.findOne({
        where:params
    }).then(function(obj){
        callback(null,obj);
    }).catch(function(err){
        callback(err);
    });
};


/**
 * 新增epg
 * @param params
 * @param next
 */
channelService.addEpg = function(params,next){
    EpgModel.create({
        channel_id:params.channel_id,
        name:params.name,
        start_date:params.start_date,
        end_date:params.end_date,
        editor_id:params.editor_id,
        state:1,
        release_date:params.release_date,
        create_date: moment().format("YYYY-MM-DD HH:mm:ss"),
        update_date: moment().format("YYYY-MM-DD HH:mm:ss")
    }).then(function(obj){
        next(null,obj);
    }).catch(function(err){
        next(err);
    });
};

/**
 * 新增频道历史记录
 * @param params
 * @param next
 */
channelService.addChannelHistory = function(params,next){
    ChannelHistoryModel.create({
        id:uuid.v1(),
        chid:params.chid,
        users:params.users,
        qs:params.qs,
        qc:params.qc,
        screenshot:params.screenshot,
        screenshot_small:params.screenshot_small,
        state:1,
        create_date: moment().format("YYYY-MM-DD HH:mm:ss"),
    }).then(function(obj){
        next(null,obj);
    }).catch(function(err){
        next(err);
    });
};


/**
 * 新增频道
 * @param params
 * @param next
 */
channelService.addChannel = function(params,next){
    ChannelModel.create({
        chid:params.chid,
        source:params.source,
        category:params.category,
        name:params.name,
        users:params.users,
        language:params.language,
        editor_id:params.editor_id,
        sid:params.sid,
        description:params.description,
        proportion:params.proportion,
        create_date: moment().format("YYYY-MM-DD HH:mm:ss"),
        update_date: moment().format("YYYY-MM-DD HH:mm:ss")
    }).then(function(obj){
        next(null,obj);
    }).catch(function(err){
        next(err);
    });
};

/*获取频道chid*/
channelService.getChannelCHID = function(params,callback){
    var arr = [];
    sequelize.query(channelSql.getChannelCHID(params), {
        type: sequelize.QueryTypes.SELECT
    }).then(function (list) {
        async.map(list, function (item, next) {
            arr.push(item.chid);
            next(null,arr);
        }, function (err, results) {
            callback(null, JSON.stringify(results[0]));
        });
    }).catch(function(err){
        callback(err);
    });
};



/**
 * 修改频道
 * @param {Object} con
 * @param {Object} params
 * @param {Object} callback
 */
channelService.updateChannel = function(con,params,callback){
    ChannelModel.update(params,{
        where:con
    }).then(function(obj){
        callback(null,obj);
    }).catch(function(err){
        callback(err);
    });
};

/**
 * 修改epg
 * @param {Object} con
 * @param {Object} params
 * @param {Object} callback
 */
channelService.updateEpg = function(con,params,callback){
    EpgModel.update(params,{
        where:con
    }).then(function(obj){
        callback(null,obj);
    }).catch(function(err){
        callback(err);
    });
};

/**
 * 删除epg
 * @param {Object} params
 * @param {Object} callback
 */
channelService.deleteEpg = function(params,callback){
    EpgModel.destroy({where:params}).then(function(obj){
        callback(null,obj);
    }).catch(function(err){
        callback(err,null);
    });
};



/**
 * 删除channel
 * @param {Object} params
 * @param {Object} callback
 */
channelService.deleteChannel = function(params,callback){
    ChannelModel.destroy({where:params}).then(function(obj){
        callback(null,obj);
    }).catch(function(err){
        callback(err,null);
    });
};

/**
 * 获取频道的类型
 * @param params
 * @param next
 */
channelService.getChannelCategory = function(params,next){
    sequelize.query(channelSql.getChannelCategory(params), {
        type: sequelize.QueryTypes.SELECT
    }).then(function (obj) {
        next(null,obj);
    }).catch(function(err){
        next(err,null);
    });
};


module.exports = channelService;