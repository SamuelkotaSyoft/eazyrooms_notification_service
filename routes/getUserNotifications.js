import express from "express";
import verifyToken from "../helpers/verifyToken.js";
import Notification from "../models/notificationModel.js";
import User from "../models/userModel.js";

const router = express.Router();

//get all notifications
router.get("/", verifyToken, async function (req, res) {
  const uid = req.user_info.main_uid;

  try {
    //check if user exists
    const user = await User.findOne({ uid: uid });
    if (!user) {
      res.status(400).json({ status: false, error: "Invalid user" });
      return;
    }

    //query
    let query = Notification.find({ toUser: user._id });

    //execute query
    const queryResult = await query.exec();

    //return result
    res.status(200).json({ status: true, data: queryResult });
  } catch (err) {
    res.status(404).json({ status: false, error: err });
  }
});

export default router;
