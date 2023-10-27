import { body } from "express-validator";
import guestModel from "../../models/guestModel.js";
const updateNotificationValidationSchema = [
  body("notificationStatus")
    .optional()
    .matches(/^(read|unread)$/i),
  body("guest")
    .optional({ values: "" | null | undefined })
    .custom(async (guestId) => {
      await guestModel.findOne({ _id: guestId, status: true });
    }),
];
export { updateNotificationValidationSchema };
