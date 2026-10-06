const  mongoose = require('mongoose');
const orderSchema = new mongoose.Schema({
  customerName: {   
    type: String,
    required: true
  },
  product: {
    type: String,
    required: true  
  },
  quantity: {
    type: Number,   
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  orderStatus: {    
     type: String,
     enum: ['Pending', 'Processing', 'Shipped', 'Delivered'],
     default: 'Pending'
  },   
  orderDate: {
    type: Date,
    required: true
  }
});

module.exports = mongoose.model('Order', orderSchema);