import express from "express";
import verifyToken from "../helpers/verifyToken.js";
import Notification from "../models/notificationModel.js";
import User from "../models/userModel.js";

const router = express.Router();

router.delete("/:notificationId", async function (req, res) {
  console.log("bie");
  //request payload
  const notificationId = req.params.notificationId;

  //validate notificationId
  if (!notificationId) {
    res
      .status(400)
      .json({ status: false, error: "notificationId is required" });
    return;
  }

  try {
    //check if chatbot exists
    const notification = Notification.findById(notificationId);
    if (!notification) {
      res.status(400).json({ status: false, error: "Invalid notification" });
      return;
    }

    //delete chatbot
    const writeResult = await Notification.deleteOne({ _id: notificationId });

    //send response to client
    res.status(200).json({ status: true, data: writeResult });
  } catch (err) {
    res.status(500).json({ error: err });
  }
});

export default router;
