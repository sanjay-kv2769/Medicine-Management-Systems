const express = require('express');
const medicineDB = require('../models/medicineSchema');
const ordersDB = require('../models/ordersSchema');
const userRoutes = express.Router();



userRoutes.post('/order-med/:login_id/:med_id', async (req, res) => {
  try {
    const loginId = req.params.login_id;
    const medicineId = req.params.med_id;
    const Medicine = {
      login_id: loginId,
      medicine_id: medicineId,
      unit: req.body.unit,
    };
    const Data = await ordersDB(Medicine).save();
    if (Data) {
      return res.status(201).json({
        Success: true,
        Error: false,
        data: Data,
        Message: 'Order successful',
      });
    } else {
      return res.status(400).json({
        Success: false,
        Error: true,
        Message: 'Order Failed',
      });
    }
  } catch (error) {
    return res.status(500).json({
      Success: false,
      Error: true,
      Message: 'Internal Server Error',
      ErrorMessage: error.message,
    });
  }
});

userRoutes.get('/view-order/:login_id', async (req, res) => {

})

module.exports = userRoutes;
