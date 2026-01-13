router.post('/transfer', async (req, res) => {
    const { fromAccountId, toUsername, amount } = req.body;
    const t = await sequelize.transaction();

    try {
        const sourceAcc = await Account.findByPk(fromAccountId);
        const receiver = await User.findOne({ where: { username: toUsername } });
        const destAcc = await Account.findOne({ 
            where: { UserId: receiver.id, currency: sourceAcc.currency } 
        });

        if (sourceAcc.balance < amount) throw new Error("Insufficient funds");

        // 1. Deduct from sender
        await sourceAcc.update({ balance: sourceAcc.balance - amount }, { transaction: t });
        
        // 2. Add to receiver
        await destAcc.update({ balance: parseFloat(destAcc.balance) + parseFloat(amount) }, { transaction: t });

        // 3. Log transaction
        await Transaction.create({
            amount, senderId: sourceAcc.UserId, receiverId: receiver.id, currency: sourceAcc.currency
        }, { transaction: t });

        await t.commit();
        res.redirect('/dashboard?success=1');
    } catch (err) {
        await t.rollback();
        res.status(400).send(err.message);
    }
});