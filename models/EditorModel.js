
var sequelize = require('../utils/sequelizeDB');
var Sequelize = require('sequelize');
var EditorModel = sequelize.define('Editor', {
    id: { type: Sequelize.STRING, primaryKey: true,field:'id'},
    name: { type: Sequelize.STRING, field:'name'},
    password: { type: Sequelize.STRING, field:'password'},
    phone: { type: Sequelize.STRING, field:'phone'},
    email: { type: Sequelize.STRING, field:'email'},
    picture: { type: Sequelize.STRING, field:'picture'},
    state: { type: Sequelize.INTEGER, field:'state'},
    create_date: { type: Sequelize.DATE, field:'create_date'},
    update_date: { type: Sequelize.DATE, field:'update_date'}
}, {
    freezeTableName: true,
    tableName: 'editor',
    timestamps: false
});

module.exports = EditorModel;
