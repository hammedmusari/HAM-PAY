require('dotenv').config();
console.log('Loaded Password:', process.env.DB_PASS);
const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize('postgres://user:pass@localhost:5432/finance_db');

const User = sequelize.define('User', {
    username: { type: DataTypes.STRING, unique: true }
});

const Account = sequelize.define('Account', {
    currency: { type: DataTypes.STRING, defaultValue: 'USD' },
    balance: { type: DataTypes.DECIMAL(20, 2), defaultValue: 0.00 }
});

const Transaction = sequelize.define('Transaction', {
    amount: DataTypes.DECIMAL(20, 2),
    type: DataTypes.ENUM('transfer', 'deposit'),
    currency: DataTypes.STRING,
    senderId: DataTypes.INTEGER,
    receiverId: DataTypes.INTEGER
});

User.hasMany(Account);
Account.belongsTo(User);

module.exports = { sequelize, User, Account, Transaction };