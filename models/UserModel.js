
var sequelize = require('../utils/sequelizeDB');
var Sequelize = require('sequelize');
var UserModel = sequelize.define('User', {
    user_id: { type: Sequelize.STRING, primaryKey: true,field:'user_id'},
    user_name: { type: Sequelize.STRING, field:'user_name'},
    editor_id: { type: Sequelize.STRING, field:'editor_id'},
    device_id: { type: Sequelize.STRING, field:'device_id'},
    password: { type: Sequelize.STRING, field:'password'},
    phone: { type: Sequelize.STRING, field:'phone'},
    email: { type: Sequelize.STRING, field:'email'},
    address: { type: Sequelize.STRING, field:'address'},
    gender: { type: Sequelize.INTEGER, field:'gender'},
    state: { type: Sequelize.INTEGER, field:'state'},
    create_date: { type: Sequelize.DATE, field:'create_date'},
    update_date: { type: Sequelize.DATE, field:'update_date'}
}, {
    freezeTableName: true,
    tableName: 'user',
    timestamps: false
});

module.exports = UserModel;
