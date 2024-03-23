const mongoose = require('mongoose');
const medicineSchema = new mongoose.Schema({
  medicine: { type: String, required: true },
  composition: { type: String, required: true },
  brand: { type: String, required: true },
  strength: { type: String, required: true },
  purpose: { type: String, required: true },
  description: { type: String, required: true },
  quantity: { type: String, required: true },
  stock: { type: Number, required: true, default: 1 },
  price: { type: Number, required: true },
  image: { type: String, required: true },
});

var medicineDB = mongoose.model('medicine_tb', medicineSchema);
module.exports = medicineDB;
