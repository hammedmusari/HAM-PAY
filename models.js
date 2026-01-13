const { DataTypes } = require('sequelize');
const sequelize = require('./db');

// 1. User Model
const User = sequelize.define('User', {
    username: { type: DataTypes.STRING, allowNull: false, unique: true },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: false }
});

// 2. Account/Wallet Model (Multi-currency support)
const Account = sequelize.define('Account', {
    currency: { 
        type: DataTypes.STRING, 
        allowNull: false,
        defaultValue: 'USD' // e.g., 'USD', 'EUR', 'GBP'
    },
    balance: { 
        type: DataTypes.DECIMAL(20, 2), 
        defaultValue: 0.00 
    }
});

// 3. Transaction Model (The Ledger)
const Transaction = sequelize.define('Transaction', {
    amount: { type: DataTypes.DECIMAL(20, 2), allowNull: false },
    type: { type: DataTypes.ENUM('deposit', 'transfer', 'withdrawal'), allowNull: false },
    status: { type: DataTypes.STRING, defaultValue: 'completed' }
});

// Set up Relationships
User.hasMany(Account);
Account.belongsTo(User);

User.hasMany(Transaction, { as: 'SentTransactions', foreignKey: 'senderId' });
User.hasMany(Transaction, { as: 'ReceivedTransactions', foreignKey: 'receiverId' });

module.exports = { User, Account, Transaction, sequelize };

// This will create the tables if they don't exist
sequelize.sync({ alter: true })
    .then(() => console.log("--- Tables Created/Updated ---"))
    .catch(err => console.log("Error syncing: ", err));
