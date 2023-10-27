import express from "express";
import verifyToken from "../helpers/verifyToken.js";
import { commonGetRequestValidationSchema } from "../validationSchema/commonSchema.js";
import { validateRequest } from "../helpers/validatorErrorHandling.js";
import { matchedData } from "express-validator";
import Notification from "../models/notificationModel.js";
import User from "../models/userModel.js";
var router = express.Router();

async function getAllNotifications(req, res) {
  try {
    const requestData = matchedData(req);

    var skip = 0;
    var limit = null;
    const filterObj = {
      status: true,
      notificationStatus: "unread",
    };
    if (requestData.status) {
      filterObj.status = requestData.status;
    }
    if (requestData.notificationStatus) {
      filterObj.notificationStatus = {
        $in: requestData.notificationStatus,
      };
    }
    if (requestData.page && requestData.limit) {
      skip = (requestData.page - 1) * requestData.limit;
      limit = requestData.limit;
    }

    if (requestData.location) {
      filterObj.location = requestData.location;
    }
    const uid = req.user_info.main_uid;
    const role = req.user_info.role;

    if (
      role !== "propertyAdmin" &&
      role !== "locationAdmin" &&
      role !== "storeAdmin"
    ) {
      res.status(403).json({ status: false, error: "Unauthorized" });
      return;
    }

    //get user by uid
    const user = await User.findOne({ uid: uid });

    if (!user) {
      res.status(400).json({ status: false, message: "User not found" });
    }

    filterObj.toUser = user._id;

    //query
    let query = Notification.find(filterObj)
      .sort({ updatedAt: -1 })
      .skip(skip)
      .limit(limit);

    //execute query
    const queryResult = await query.exec();

    const notificationsCount = await Notification.countDocuments(
      filterObj
    ).exec();

    //return result
    res.status(200).json({
      status: true,
      data: {
        notifications: queryResult,
        page: Number(requestData.page),
        limit: limit,
        totalPageCount: Math.ceil(notificationsCount / limit),
        totalCount: notificationsCount,
      },
    });
  } catch (err) {
    console.log("err :>> ", err);
    res.status(500).json({ status: false, error: err });
  }
}

//get all blocks

router.get(
  "/",
  verifyToken,
  commonGetRequestValidationSchema,
  validateRequest,
  getAllNotifications
);

export default router;
