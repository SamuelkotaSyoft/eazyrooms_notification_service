import express from "express";
import { commonGetRequestValidationSchema } from "../validationSchema/commonSchema.js";
import { validateRequest } from "../helpers/validatorErrorHandling.js";
import { matchedData } from "express-validator";
import Notification from "../models/notificationModel.js";
import Guest from "../models/guestModel.js";
import mongoose from "mongoose";
var router = express.Router();

async function getAllNotificationsForGuest(req, res) {
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

    const uid = req.params.guestUid;

    //get user by uid
    const guest = await Guest.findOne({ uid: uid });

    if (!guest) {
      res.status(400).json({ status: false, message: "User not found" });
    }

    filterObj.toGuest = new mongoose.Types.ObjectId(guest._id);
    console.log("filterObj :>> ", filterObj);
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
  "/:guestUid",
  commonGetRequestValidationSchema,
  validateRequest,
  getAllNotificationsForGuest
);

export default router;
