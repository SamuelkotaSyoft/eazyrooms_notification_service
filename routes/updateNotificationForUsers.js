import express from "express";
import verifyToken from "../helpers/verifyToken.js";
import Notification from "../models/notificationModel.js";
import userModel from "../models/userModel.js";
import { updateNotificationValidationSchema } from "../validationSchema/notifications/updateNotifications.js";
import { validateRequest } from "../helpers/validatorErrorHandling.js";
import { matchedData } from "express-validator";
import mongoose from "mongoose";
var router = express.Router();

async function updateNotificationForUsers(req, res) {
  try {
    const uid = req.user_info.main_uid;
    const user = await userModel.findOne({ uid: uid });
    const requestData = matchedData(req);

    const filterObj = {
      status: true,
      toUser: user?._id,
    };
    if (requestData?.guest) {
      delete filterObj.toUser;
      filterObj.toGuest = new mongoose.Types.ObjectId(requestData.guest);
    }
    const notification = await Notification.updateMany(
      filterObj,
      {
        $set: requestData,
      },
      { new: true }
    );
    // const notification = await Notification.deleteMany(filterObj);
    res.status(200).json({ status: true, message: notification });
  } catch (err) {
    console.log("err :>> ", err);
    res.status(500).json({ status: false, error: err });
  }
}

//get all blocks

router.post(
  "/",
  verifyToken,
  updateNotificationValidationSchema,
  validateRequest,
  updateNotificationForUsers
);

export default router;
