const express = require('express');
const medicineDB = require('../models/medicineSchema');
const staffDB = require('../models/staffSchema');
const loginDB = require('../models/loginSchema');
const bcrypt = require('bcryptjs');
const { default: mongoose } = require('mongoose');
const complaintsDB = require('../models/complaintSchema');
const adminRoutes = express.Router();

// ------------------------------Medicine--------------------------------------

adminRoutes.post('/add-med', async (req, res) => {
  try {
    const Medicine = {
      medicine: req.body.medicine,
      composition: req.body.composition,
      brand: req.body.brand,
      strength: req.body.strength,
      quantity: req.body.quantity,
      purpose: req.body.purpose,
      price: req.body.price,
      description: req.body.description,
    };
    const Data = await medicineDB(Medicine).save();
    // console.log(Data);
    if (Data) {
      return res.status(201).json({
        Success: true,
        Error: false,
        data: Data,
        Message: 'Medicine added successfully',
      });
    } else {
      return res.status(400).json({
        Success: false,
        Error: true,
        Message: 'Failed adding Medicine ',
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

adminRoutes.put('/update-med/:id', async (req, res) => {
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

adminRoutes.delete('/delete-med/:id', async (req, res) => {
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

// ------------------------------Staff--------------------------------------

adminRoutes.get('/view-staff', async (req, res) => {
  try {
    const staffData = await staffDB.aggregate([
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
          designation: {
            $first: '$designation',
          },
          email: {
            $first: '$result.email',
          },
          rawpassword: {
            $first: '$result.rawpassword',
          },
        },
      },
    ]);

    if (staffData.length > 0) {
      return res.json({
        Success: true,
        Error: false,
        data: staffData,
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
adminRoutes.get('/view-staff/:id', async (req, res) => {
  try {
    const user_id = req.params.id;
    const staffData = await staffDB.aggregate([
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
          designation: {
            $first: '$designation',
          },
          email: {
            $first: '$result.email',
          },
          rawpassword: {
            $first: '$result.rawpassword',
          },
        },
      },
      {
        $match: {
          login_id: new mongoose.Types.ObjectId(user_id),
        },
      },
    ]);

    if (staffData.length > 0) {
      return res.json({
        Success: true,
        Error: false,
        data: staffData,
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

adminRoutes.put('/update-staff/:id', async (req, res) => {
  try {
    var loginID = req.params.id;
    const previousData = await staffDB.findOne({
      login_id: loginID,
    });
    const previousloginData = await loginDB.findOne({
      _id: loginID,
    });
    var Staff = {
      login_id: previousData.login_id,
      name: req.body ? req.body.name : previousData.name,
      phone: req.body ? req.body.phone : previousData.phone,
      place: req.body ? req.body.place : previousData.place,
      //  image:
      //    req.file && req.file.length > 0
      //      ? req.file.path)
      //      : previousData.image,
    };
    if (req.body.password !== undefined) {
      var hashedPassword = await bcrypt.hash(req.body.password, 10);
    }
    var StaffLoginDetails = {
      email: req.body ? req.body.email : previousloginData.email,
      password: req.body ? hashedPassword : previousloginData.password,
      rawpassword: req.body ? req.body.password : previousloginData.rawpassword,
    };

    const Data = await staffDB.updateOne(
      { login_id: loginID },
      { $set: Staff }
    );
    const LoginData = await loginDB.updateOne(
      { _id: loginID },
      { $set: StaffLoginDetails }
    );

    if (Data && LoginData) {
      return res.status(200).json({
        Success: true,
        Error: false,
        data: Data,
        loginData: LoginData,
        Message: 'Staff details updated successfully ',
      });
    } else {
      return res.status(400).json({
        Success: false,
        Error: true,
        Message: 'Failed while updating Staff details',
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

adminRoutes.delete('/delete-staff/:login_id', async (req, res) => {
  try {
    const staffData = await staffDB.deleteOne({
      login_id: req.params.login_id,
    });
    const logData = await loginDB.deleteOne({ _id: req.params.login_id });
    if (staffData && logData) {
      return res.status(200).json({
        Success: true,
        Error: false,
        Message: 'Deleted staff data',
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

adminRoutes.get('/view-complaints', async (req, res) => {
  try {
    const Data = await complaintsDB.find();
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

module.exports = adminRoutes;
