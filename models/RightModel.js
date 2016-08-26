
var sequelize = require('../utils/sequelizeDB');
var Sequelize = require('sequelize');
var RightModel = sequelize.define('Right', {
    right_id: { type: Sequelize.STRING, primaryKey: true,field:'right_id'},
    right_name: { type: Sequelize.STRING, field:'right_name'},
    right_node: { type: Sequelize.STRING, field:'right_node'},
    right_path: { type: Sequelize.STRING, field:'right_path'},
    right_parent_id: { type: Sequelize.STRING, field:'right_parent_id'},
    icon: { type: Sequelize.STRING, field:'icon'},
    sort: { type: Sequelize.INTEGER, field:'sort'},
    is_parent: { type: Sequelize.INTEGER, field:'is_parent'},
    create_date: { type: Sequelize.DATE, field:'create_date'},
}, {
    freezeTableName: true,
    tableName: 'right',
    timestamps: false
});

module.exports = RightModel;
