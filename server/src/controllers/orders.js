const OrderService = require('../services/orderService');
const express = require('express');
const router = express.Router();


router.post('/orders', async (req, res) => {
  try {
    const orderData = req.body;     
    const newOrder = await OrderService.createOrder(orderData);
    res.status(201).json(newOrder);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create order' });
  }     
});

router.get('/orders', async (req, res) => {
  try {
    const orders = await OrderService.getAllOrders();
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

module.exports = router;

