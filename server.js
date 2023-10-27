import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import path from "path";
import "./firebase-config.js";

const app = express();
const port = 3008;

app.use(cors());
app.use(express.json());

/**
 *
 * dotenv config
 */
const __dirname = path.resolve();
dotenv.config({
  path: path.resolve(__dirname, ".env"),
});

/**
 *
 * connect to mongodb
 */
await mongoose.connect(process.env.MONGODB_CONNECTION_STRING);
console.log("MONGODB CONNECTED...");

/**
 *
 * routes
 */

app.use(
  "/createNotification",
  (await import("./routes/createNotification.js")).default
);

app.use(
  "/getUserNotifications",
  (await import("./routes/getUserNotifications.js")).default
);

app.use(
  "/deleteNotificationById",
  (await import("./routes/deleteNotificationById.js")).default
);
app.use(
  "/deleteNotificationForGuest",
  (await import("./routes/deleteNotificationForGuest.js")).default
);

app.use(
  "/getAllNotificationsForUsers",
  (await import("./routes/getAllNotificationsForUsers.js")).default
);

app.use(
  "/getAllNotificationsForGuest",
  (await import("./routes/getNotificationsForGuest.js")).default
);

app.use(
  "/updateNotificationForUsers",
  (await import("./routes/updateNotificationForUsers.js")).default
);

/**
 *
 * start listening to requests
 */
app.listen(port, () => {
  console.log(`notification service listening on port ${port}`);
});

app.get("/", (req, res) => {
  res.status(200).json({ status: "OK", service: "Notification Service" });
});
