
var sequelize = require('../utils/sequelizeDB');
var Sequelize = require('sequelize');
var ChannelModel = sequelize.define('Channel', {
    chid: { type: Sequelize.INTEGER, primaryKey: true,field:'chid'},
    sid: { type: Sequelize.STRING, field:'sid'},
    key_code: { type: Sequelize.INTEGER, field:'key_code'},
    editor_id: { type: Sequelize.STRING, field:'editor_id'},
    source: { type: Sequelize.STRING, field:'source'},
    category: { type: Sequelize.STRING, field:'category'},
    name: { type: Sequelize.STRING, field:'name'},
    users: { type: Sequelize.STRING, field:'users'},
    language: { type: Sequelize.STRING, field:'language'},
    proportion: { type: Sequelize.STRING, field:'proportion'},
    description: { type: Sequelize.STRING, field:'description'},
    state: { type: Sequelize.INTEGER, field:'state'},
    release_state: { type: Sequelize.INTEGER, field:'release_state'},
    create_date: { type: Sequelize.DATE, field:'create_date'},
    update_date: { type: Sequelize.DATE, field:'update_date'}
}, {
    freezeTableName: true,
    tableName: 'channel',
    timestamps: false
});

module.exports = ChannelModel;
