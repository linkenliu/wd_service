
var sequelize = require('../utils/sequelizeDB');
var Sequelize = require('sequelize');
var MessageModel = sequelize.define('Message', {
    id: { type: Sequelize.STRING, primaryKey: true,field:'id'},
    user_id: { type: Sequelize.STRING, field:'user_id'},
    editor_id: { type: Sequelize.STRING, field:'editor_id'},
    type: { type: Sequelize.INTEGER, field:'type'},
    message: { type: Sequelize.STRING, field:'message'},
    state: { type: Sequelize.INTEGER, field:'state'},
    create_date: { type: Sequelize.DATE, field:'create_date'},
    release_date: { type: Sequelize.DATE, field:'release_date'}
}, {
    freezeTableName: true,
    tableName: 'message',
    timestamps: false
});

module.exports = MessageModel;
