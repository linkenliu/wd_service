
var sequelize = require('../utils/sequelizeDB');
var Sequelize = require('sequelize');
var EpgModel = sequelize.define('Epg', {
    epg_id: { type: Sequelize.INTEGER, primaryKey: true,field:'epg_id'},
    channel_id: { type: Sequelize.INTEGER, field:'channel_id'},
    name: { type: Sequelize.STRING, field:'name'},
    editor_id: { type: Sequelize.STRING, field:'editor_id'},
    start_date: { type: Sequelize.DATE, field:'start_date'},
    end_date: { type: Sequelize.DATE, field:'end_date'},
    state: { type: Sequelize.INTEGER, field:'state'},
    release_date: { type: Sequelize.DATE, field:'release_date'},
    create_date: { type: Sequelize.DATE, field:'create_date'},
    update_date: { type: Sequelize.DATE, field:'update_date'}
}, {
    freezeTableName: true,
    tableName: 'epg',
    timestamps: false
});

module.exports = EpgModel;
