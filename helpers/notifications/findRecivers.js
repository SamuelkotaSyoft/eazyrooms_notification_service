import mongoose from "mongoose";
import User from "../../models/userModel.js";

async function findRecivers({
  propertyId,
  userId,
  role,
  location,
  stores = [],
  // guest = {},
}) {
  /**
   * extras is used to find the users who are eligible to recive the notification
   * based on extra parameters
   * such as stores
   */

  let extras = {};
  /**
   * if stores is not empty then we will add the stores to the query
   */
  if (stores.length > 0) {
    extras = {
      stores: { $elemMatch: { $in: [...stores] } },
    };
  }
  /**
   * this is the query that is used to find the users who are eligible to recive the notification
   * property admin is not included with location so diffrent query
   */

  const propertyAdmins = await User.find({
    property: propertyId,
    _id: { $ne: new mongoose.Types.ObjectId(userId) },
    role: "propertyAdmin",
  });

  /**
   * these guys have their own query they will be assigned to a particular location or a store based on their role
   * so we will use $in operator to match the role of reciver
   * $ne is to avoid sending notification to the sender
   * $or is used to match the location or the extras
   * since locationAdmin may not have storeids
   */
  let notifyUsersList = [];
  if (Object.keys(extras).length > 0) {
    notifyUsersList = await User.find({
      property: propertyId,
      _id: { $ne: new mongoose.Types.ObjectId(userId) },
      role: { $in: [...role] },
      $or: [{ location: { $in: [...location] } }, { ...extras }],
    });
  } else
    notifyUsersList = await User.find({
      property: propertyId,
      _id: { $ne: new mongoose.Types.ObjectId(userId) },
      role: { $in: [...role] },
      location: { $in: [...location] },
    });

  // if (guest.recive) {
  //   notifyUsersList.push(await User.findOne({ _id: guest.id }));
  // }
  return [...notifyUsersList, ...propertyAdmins];
}

export default findRecivers;
