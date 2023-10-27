import express from "express";
import Notification from "../models/notificationModel.js";
import User from "../models/userModel.js";
import findRecivers from "../helpers/notifications/findRecivers.js";
import axios from "axios";
var router = express.Router();

//create chatbot
router.post("/", async function (req, res) {
  try {
    //get data from request body
    const {
      notificationText,
      userId,
      propertyId,
      location,
      role,
      stores,
      guest,
      notificationType = "accepted",
    } = req.body;

    /**
     * this function finds the total number of users who are eligible to receive the notification
     */
    const users = await findRecivers({
      userId: userId,
      propertyId: propertyId,
      location: location,
      role: role,
      stores: stores,
      // guest: guest,
    });
    // const uid = req.user_info.main_uid;
    if (!notificationText) {
      res.status(200).json({
        status: false,
        error: 'Sorry we can"t send a notification with the given data',
      });
      return;
    }
    if (!users.length > 0 && !guest) {
      res.status(200).json({
        status: false,
        error: 'Sorry we can"t send a notification with the given data',
      });
      return;
    }

    // let writeResult;
    let fromUser;
    let locationId = location;
    if (typeof locationId !== "string") {
      if (locationId[0]) locationId = locationId[0];
    }
    console.log({ locationId });
    if (guest === null || guest === undefined) {
      fromUser = await User.findOne({ _id: userId });
      if (!fromUser) {
        res.status(400).json({ status: false, error: "Invalid userId" });
        return;
      }

      await Notification.insertMany(
        users?.map((toUser) => ({
          fromUser: fromUser._id,
          toUser: toUser?._id,
          location: locationId,
          notificationText: notificationText,
          notificationType: notificationType,
          notificationStatus: "unread",
          timestamp: new Date(),
          status: true,
        }))
      );
    } else if (!guest?.recive) {
      await Notification.insertMany(
        users?.map((toUser) => ({
          fromGuest: guest.id,
          toUser: toUser?._id,
          location: locationId,
          notificationText: notificationText,
          notificationType: notificationType,
          notificationStatus: "unread",
          timestamp: new Date(),
          status: true,
        }))
      );
    } else {
      await Notification.insertMany(
        users?.map((toUser) => ({
          fromUser: userId,
          toUser: toUser?._id,
          notificationText: notificationText,
          location: locationId,
          notificationType: notificationType,
          notificationStatus: "unread",
          timestamp: new Date(),
          status: true,
        }))
      );
      const data = await Notification({
        fromUser: userId,
        toGuest: guest.id,
        notificationText: notificationText,
        notificationType: notificationType,
        location: locationId,
        notificationStatus: "unread",
        timestamp: new Date(),
        status: true,
      });
      const dad = await data.save();
      console.log({ dad });
    }

    axios.post(`${process.env.SOCKET_SERVICE_URL}/sendNoticationEvents`, {
      users: users,
      guest: guest,
    });

    //send response to client
    res.status(200).json({ status: true, data: { status: "updated" } });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err });
  }
});

export default router;
