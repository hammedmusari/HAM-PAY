const express = require('express');
const bodyParser = require('body-parser');
const { sequelize, User, Account, Transaction } = require('./models');

const app = express();
const PORT = 3000;

// Middleware
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

// --- ROUTES ---

// 1. Home Page - Show All Users & Balances
app.get('/', async (req, res) => {
    try {
        const users = await User.findAll({ include: Account });
        res.render('index', { users });
    } catch (err) {
        res.status(500).send("Database Error: " + err.message);
    }
});

// 2. Simple Transfer Logic
app.post('/transfer', async (req, res) => {
    const { senderId, receiverUsername, amount, currency } = req.body;
    
    // Start a managed transaction to ensure data integrity
    const t = await sequelize.transaction();

    try {
        // Find sender account
        const senderAcc = await Account.findOne({ where: { UserId: senderId, currency } });
        // Find receiver user
        const receiver = await User.findOne({ where: { username: receiverUsername } });
        // Find receiver account
        const receiverAcc = await Account.findOne({ where: { UserId: receiver.id, currency } });

        if (!senderAcc || senderAcc.balance < amount) {
            throw new Error("Insufficient funds or invalid account");
        }

        // Subtract from sender, Add to receiver
        await senderAcc.update({ balance: parseFloat(senderAcc.balance) - parseFloat(amount) }, { transaction: t });
        await receiverAcc.update({ balance: parseFloat(receiverAcc.balance) + parseFloat(amount) }, { transaction: t });

        // Record the transaction
        await Transaction.create({
            amount,
            type: 'transfer',
            senderId: senderId,
            receiverId: receiver.id
        }, { transaction: t });

        await t.commit();
        res.redirect('/');
    } catch (err) {
        await t.rollback();
        res.status(400).send("Transfer Failed: " + err.message);
    }
});

// Sync Database and Start Server
sequelize.sync().then(() => {
    app.listen(PORT, () => {
        console.log(`🚀 Server running at http://localhost:${PORT}`);
    });
});

app.use(express.static('public'));