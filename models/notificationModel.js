import mongoose from "mongoose";

const notificationSchema = mongoose.Schema(
  {
    fromUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
    fromGuest: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Guest",
      required: false,
    },
    location: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Location",
    },
    toUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
    toGuest: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Guest",
      required: false,
    },
    location: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Location",
      required: false,
    },
    notificationText: {
      type: String,
    },
    notificationType: {
      type: String,
      enum: ["accepted", "rejected", "warning"],
      default: "accepted",
    },
    notificationStatus: {
      type: String,
      enum: ["unread", "read"],
      default: "unread",
    },

    status: {
      type: Boolean,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Notification", notificationSchema);
