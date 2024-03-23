const express = require('express');
const medicineDB = require('../models/medicineSchema');
const ordersDB = require('../models/ordersSchema');
const { default: mongoose } = require('mongoose');
const complaintsDB = require('../models/complaintSchema');
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
  try {
    const login_id = req.params.login_id;
    console.log(login_id);
    const result = await ordersDB.aggregate([
      {
        $match: {
          login_id: new mongoose.Types.ObjectId(login_id),
        },
      },
      {
        $lookup: {
          from: 'medicine_tbs',
          localField: 'medicine_id',
          foreignField: '_id',
          as: 'medicine_data',
        },
      },
      {
        $unwind: '$medicine_data',
      },
      {
        $lookup: {
          from: 'login_tbs',
          localField: 'login_id',
          foreignField: '_id',
          as: 'login_data',
        },
      },
      {
        $unwind: '$login_data',
      },
    ]);
    return res.status(200).json({
      Success: true,
      Error: false,
      Data: result,
      Message: 'Order data fetched successfully',
    });
    // return res.send(result);
  } catch (error) {
    return res.status(500).json({
      Success: false,
      Error: true,
      Message: 'Internal Server Error',
      ErrorMessage: error.message,
    });
  }
});

userRoutes.post('/add-complaint/:login_id', async (req, res) => {
  try {
    const Complaint = {
      login_id: req.params.login_id,
      complaint: req.body.complaint,
    };
    const Data = await complaintsDB(Complaint).save();
    // console.log(Data);
    if (Data) {
      return res.status(201).json({
        Success: true,
        Error: false,
        data: Data,
        Message: 'Complaint added successfully',
      });
    } else {
      return res.status(400).json({
        Success: false,
        Error: true,
        Message: 'Failed adding Complaint ',
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

userRoutes.get('/view-complaint/:login_id', async (req, res) => {
  try {
    const Data = await complaintsDB.find({ login_id: req.params.login_id });
    if (Data) {
      return res.status(201).json({
        Success: true,
        Error: false,
        data: Data,
        Message: 'Complaint fetched successfully',
      });
    } else {
      return res.status(400).json({
        Success: false,
        Error: true,
        Message: 'Failed fetching Complaint ',
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

module.exports = userRoutes;
