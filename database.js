const Sequelize = require('sequelize');
module.exports = new Sequelize('event', 'rw_dev', 'rw_dev', {
    host: 'localhost',
    dialect: 'postgres',
    logging: true,
    benchmark: true
});