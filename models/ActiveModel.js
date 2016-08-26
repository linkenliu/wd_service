
var sequelize = require('../utils/sequelizeDB');
var Sequelize = require('sequelize');
var ActiveModel = sequelize.define('Active', {
    active_id: { type: Sequelize.INTEGER, primaryKey: true,field:'active_id'},
    user_id: { type: Sequelize.INTEGER, field:'user_id'},
    channel_id: { type: Sequelize.INTEGER, field:'channel_id'},
    pre_id: { type: Sequelize.STRING, field:'pre_id'},
    look_long: { type: Sequelize.STRING, field:'look_long'},
    user_ip: { type: Sequelize.STRING, field:'user_ip'},
    exit_date: { type: Sequelize.DATE, field:'exit_date'},
    create_date: { type: Sequelize.DATE, field:'create_date'}
}, {
    freezeTableName: true,
    tableName: 'active',
    timestamps: false
});

module.exports = ActiveModel;
