const Sequelize = require('sequelize');
const bcrypt = require('bcryptjs');

const db = require('../database');

const Users = db.define('user',
    {
        id: {
            type: Sequelize.BIGINT,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
            unique: true
        },
        username: {
            type: Sequelize.STRING,
            allowNull: false
        },
        first_name: {
            type: Sequelize.STRING,
            allowNull: false
        },
        last_name: {
            type: Sequelize.STRING,
            allowNull: true
        },
        email: {
            type: Sequelize.STRING,
            allowNull: true
        },
        password: {
            type: Sequelize.STRING,
            allowNull: true
        }
    }, {
        tableName: 'user',
    });

const Events = db.define('event', {
        id: {
            type: Sequelize.BIGINT,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
            unique: true
        },
        name: {
            type: Sequelize.STRING,
            allowNull: true
        },
        description: {
            type: Sequelize.TEXT,
            allowNull: true
        },
        start_date: {
            type: Sequelize.DATEONLY,
            allowNull: true
        },
        end_date: {
            type: Sequelize.DATEONLY,
            allowNull: true
        },
        people: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        price: {
            type: Sequelize.DECIMAL,
            allowNull: true
        },
        user_id: {
            type: Sequelize.BIGINT,
            allowNull: false,
            primaryKey: true,
            references: {
                model: 'user',
                key: 'id'
            }
        }
    },
    {
        tableName: 'event',
    });

Events.belongsTo(Users, {foreignKey: 'user_id'});

function getUserByUsername (username) {
    return Users.findOne({
        where: {username: username}
    });
}

function getUserById (id, callback) {
    return Users.findOne({
        where: {id: id}
    }, callback);
}

function comparePassword (candidatePassword, hash, callback){
    return bcrypt.compare(candidatePassword, hash, function(err, isMatch) {
        if(err) throw err;
        callback(null, isMatch);
    });
}

module.exports = {
    Users,
    Events,
    getUserByUsername,
    getUserById,
    comparePassword
};