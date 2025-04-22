const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const verifyToken = require('../middleware/verifyToken'); // importo

router.post('/', verifyToken, async (req, res) => {
    try {
        const userId = req.user.id; // nga tokeni i verifikuar
        const { products } = req.body;

        if (!products || !products.length) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        const total = products.reduce((acc, item) => {
            const quantity = item.quantity || 1;
            const price = item.price || 0;
            return acc + (quantity * price);
        }, 0);

        const newOrder = new Order({
            userId,
            products: products.map(p => ({
                productId: p.productId,
                quantity: p.quantity || 1
            })),
            total
        });

        await newOrder.save();
        res.status(201).json({ message: 'Order placed successfully', order: newOrder });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to place order' });
    }
});

module.exports = router;
