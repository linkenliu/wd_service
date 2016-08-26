
var sequelize = require('../utils/sequelizeDB');
var Sequelize = require('sequelize');
var ChannelHistoryModel = sequelize.define('ChannelHistory', {
    id: { type: Sequelize.INTEGER, primaryKey: true,field:'id'},
    chid: { type: Sequelize.STRING, field:'chid'},
    users: { type: Sequelize.STRING, field:'users'},
    qs: { type: Sequelize.STRING, field:'qs'},
    qc: { type: Sequelize.STRING, field:'qc'},
    screenshot: { type: Sequelize.STRING, field:'screenshot'},
    screenshot_small: { type: Sequelize.STRING, field:'screenshot_small'},
    state: { type: Sequelize.INTEGER, field:'state'},
    create_date: { type: Sequelize.DATE, field:'create_date'},
}, {
    freezeTableName: true,
    tableName: 'channel_history',
    timestamps: false
});

module.exports = ChannelHistoryModel;
