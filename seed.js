const { sequelize, User, Account } = require('./models');

const seed = async () => {
    await sequelize.sync({ force: true }); // Warning: This clears the DB!

    const user1 = await User.create({ username: 'Abike', email: 'abike@test.com', password: '123' });
    const user2 = await User.create({ username: 'Bola', email: 'bola@test.com', password: '123' });

    await Account.create({ currency: 'USD', balance: 1000, UserId: user1.id });
    await Account.create({ currency: 'EUR', balance: 500, UserId: user1.id });
    
    await Account.create({ currency: 'USD', balance: 200, UserId: user2.id });
    await Account.create({ currency: 'EUR', balance: 100, UserId: user2.id });

    console.log("✅ Demo users created!");
    process.exit();
};

seed();
