const express = require('express');
const medicineDB = require('../models/medicineSchema');
const staffDB = require('../models/staffSchema');
const ordersDB = require('../models/ordersSchema');
const staffRoutes = express.Router();

staffRoutes.put('/update-med-stock/:id', async (req, res) => {
  try {
    const id = req.params.id;

    const updatedData = await medicineDB.updateOne(
      { _id: id },
      { $set: { stock: req.body.stock } }
    );

    if (updatedData) {
      res.status(200).json({
        success: true,
        error: false,
        data: updatedData,
        message: 'Medicine stock updated successfully',
      });
    } else {
      res.status(400).json({
        success: false,
        error: true,
        message: 'stock updating failed',
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

staffRoutes.put('/update-med/:id', async (req, res) => {
  try {
    const previousData = await medicineDB.findOne({ _id: req.params.id });

    var Medicine = {
      medicine: req.body ? req.body.medicine : previousData.medicine,
      composition: req.body ? req.body.medicine : previousData.composition,
      brand: req.body ? req.body.brand : previousData.brand,
      strength: req.body ? req.body.strength : previousData.strength,
      purpose: req.body ? req.body.purpose : previousData.purpose,
      description: req.body ? req.body.description : previousData.description,
      quantity: req.body ? req.body.quantity : previousData.quantity,
      price: req.body ? req.body.price : previousData.price,
      // image: req.file
      //   ? req.file.path
      //   : previousData.image,
    };
    console.log(Medicine);
    const Data = await medicineDB.updateOne(
      { _id: req.params.id },
      { $set: Medicine }
    );

    if (Data) {
      return res.status(200).json({
        Success: true,
        Error: false,
        data: Data,
        Message: 'Medicine updated successfully',
      });
    } else {
      return res.status(400).json({
        Success: false,
        Error: true,
        Message: 'Failed while updating Medicine',
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

staffRoutes.delete('/delete-med/:id', async (req, res) => {
  try {
    const Data = await medicineDB.deleteOne({ _id: req.params.id });
    if (Data) {
      return res.status(200).json({
        Success: true,
        Error: false,
        data: Data,
        Message: 'Product deleted successfully',
      });
    } else {
      return res.status(400).json({
        Success: false,
        Error: true,
        Message: 'Failed to delete product',
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

staffRoutes.put('/attendance-med/:id', async (req, res) => {
  try {
    const loginId = req.params.id;
    function formatDate(date) {
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
    }
    // const date = new Date();
    const date = formatDate(new Date());
    const isPresent = true;
    // const isPresent = req.body.isPresent;

    const result = await staffDB.updateOne(
      { login_id: loginId },
      { $push: { attendance: { date, isPresent } } }
    );

    if (result.nModified === 0) {
      return res.status(404).json({ message: 'Staff member not found' });
    }

    return res
      .status(200)
      .json({ message: 'Attendance updated successfully', isPresent: true });
  } catch (error) {
    return res.status(500).json({
      Success: false,
      Error: true,
      Message: 'Internal Server Error',
      ErrorMessage: error.message,
    });
  }
});

staffRoutes.get('/view-orders', async (req, res) => {
  try {
    const result = await ordersDB.aggregate([
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

staffRoutes.put('/order-status-update/:id', async (req, res) => {
  try {
    const order_id = req.params.id;

    const updatedData = await ordersDB.updateOne(
      { _id: order_id },
      { $set: { status: 'Order Success' } }
    );

    if (updatedData) {
      res.status(200).json({
        success: true,
        error: false,
        data: updatedData,
        message: 'Medicine order status updated successfully',
      });
    } else {
      res.status(400).json({
        success: false,
        error: true,
        message: 'order status updating failed',
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

module.exports = staffRoutes;
