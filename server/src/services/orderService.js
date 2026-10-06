const Order = require('../models/orders');

const createOrder = async (orderData) => {
    try{
           console.log('Creating order with data:', orderData);
            const order = new Order(orderData);
            return await order.save();
    }catch (error) {
        console.error('Error creating order:', error);
        throw error;
    }
};

const getAllOrders = async () => {
  return await Order.find();
}   

module.exports = {
  createOrder,
  getAllOrders
};