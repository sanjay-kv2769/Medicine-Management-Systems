const express = require('express');
const medicineDB = require('../models/medicineSchema');
const physicianDB = require('../models/physicianSchema');
const commonRoutes = express.Router();

commonRoutes.get('/view-med', async (req, res) => {
  try {
    const Data = await medicineDB.find();
    if (Data) {
      return res.status(200).json({
        Success: true,
        Error: false,
        data: Data,
        Message: 'Products fetched successfully',
      });
    } else {
      return res.status(400).json({
        Success: false,
        Error: true,
        Message: 'Failed getting Products ',
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

commonRoutes.get('/view-physicians', async (req, res) => {
  try {
    const physicianData = await physicianDB.aggregate([
      {
        $lookup: {
          from: 'login_tbs',
          localField: 'login_id',
          foreignField: '_id',
          as: 'result',
        },
      },
      {
        $unwind: {
          path: '$result',
        },
      },
      {
        $group: {
          _id: '$_id',
          login_id: {
            $first: '$login_id',
          },
          name: {
            $first: '$name',
          },
          phone: {
            $first: '$phone',
          },
          place: {
            $first: '$place',
          },
         
          email: {
            $first: '$result.email',
          },
          // rawpassword: {
          //   $first: '$result.rawpassword',
          // },
        },
      },
    ]);

    if (physicianData.length > 0) {
      return res.json({
        Success: true,
        Error: false,
        data: physicianData,
        Message: 'Success',
      });
    } else {
      return res.json({
        Success: false,
        Error: true,
        Message: 'Failed',
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

module.exports = commonRoutes;
