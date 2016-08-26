
var sequelize = require('../utils/sequelizeDB');
var Sequelize = require('sequelize');
var UserMoneyModel = sequelize.define('UserMoney', {
    id: { type: Sequelize.STRING, primaryKey: true,field:'id'},
    user_id:{ type: Sequelize.STRING, field:'user_id'},
    money: { type: Sequelize.STRING, field:'money'},
    start_date: { type: Sequelize.DATE, field:'start_date'},
    end_date: { type: Sequelize.DATE, field:'end_date'},
    state: { type: Sequelize.INTEGER, field:'state'},
    create_date: { type: Sequelize.DATE, field:'create_date'},
    update_date: { type: Sequelize.DATE, field:'update_date'}
}, {
    freezeTableName: true,
    tableName: 'user_money',
    timestamps: false
});

module.exports = UserMoneyModel;
