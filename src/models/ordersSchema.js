const mongoose = require('mongoose');
const ordersSchema = new mongoose.Schema({
  medicine_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'medicine_tb',
    required: true,
  },
  login_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'login_tb',
    required: true,
  },

  unit: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    required: true,
    default: 'processing',
  },
});

var ordersDB = mongoose.model('orders_tb', ordersSchema);
module.exports = ordersDB;
