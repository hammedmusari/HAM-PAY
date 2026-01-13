require('dotenv').config();
const { Sequelize } = require('sequelize');

// Replace 'user', 'pass', and 'localhost' with your actual Postgres credentials
const sequelize = new Sequelize('finance_db', 'postgres', '000064', {
    host: 'localhost',
    dialect: 'postgres',
    logging: false, // Set to true if you want to see the SQL commands in your terminal
    pool: {
        max: 5,         // Maximum number of connections in pool
        min: 0,
        acquire: 30000,
        idle: 10000
    }
});

// Test the connection
const testConnection = async () => {
    try {
        await sequelize.authenticate();
        console.log('✅ Connection to PostgreSQL has been established successfully.');
    } catch (error) {
        console.error('❌ Unable to connect to the database:', error);
    }
};

testConnection();

module.exports = sequelize;
