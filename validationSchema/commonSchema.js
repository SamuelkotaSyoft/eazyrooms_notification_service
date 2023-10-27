import { query } from "express-validator";

const commonGetRequestValidationSchema = [
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("page should be a number"),
  query("limit").optional().isNumeric().withMessage("limit should be a number"),
  query("notificationStatus").optional(),
  query("location").optional(),
  query("status").isBoolean().optional(),
  query("active")
    .optional()
    .isBoolean()
    .withMessage("active should be a boolean"),
];

export { commonGetRequestValidationSchema };
