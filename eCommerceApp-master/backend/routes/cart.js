const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');
const verifyToken = require('../middleware/verifyToken');

// Shto në shportë
router.post('/add', verifyToken, async (req, res) => {
  const { productId, quantity = 1 } = req.body;
  const userId = req.user.id;

  try {
    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = new Cart({ userId, items: [] });
    }

    const existingItem = cart.items.find(item => item.productId.toString() === productId);

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({ productId, quantity });
    }

    await cart.save();
    res.status(200).json({ message: 'Product added to cart', cart });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error adding to cart' });
  }
});
router.get('/', verifyToken, async (req, res) => {
    try {
      const userId = req.user.id;
      const cart = await Cart.findOne({ userId }).populate('items.productId');
  
      if (!cart) {
        return res.status(200).json({ items: [] });
      }
  
      res.status(200).json({ items: cart.items });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Failed to fetch cart items' });
    }
  });
  router.delete('/:id', verifyToken, async (req, res) => {
    try {
      const deletedProduct = await Product.findByIdAndDelete(req.params.id);
      if (!deletedProduct) {
        return res.status(404).json({ message: 'Product not found' });
      }
      res.json({ message: 'Product deleted successfully' });
    } catch (err) {
      res.status(500).json({ message: 'Server error' });
    }
  });
  router.post('/remove', verifyToken, async (req, res) => {
    const { productId } = req.body;
    const userId = req.user.id;
  
    try {
      const cart = await Cart.findOne({ userId });
  
      if (!cart) return res.status(404).json({ message: 'Cart not found' });
  
      cart.items = cart.items.filter(item => item.productId.toString() !== productId);
      await cart.save();
  
      res.json({ message: 'Product removed from cart' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    }
  });
  
module.exports = router;
