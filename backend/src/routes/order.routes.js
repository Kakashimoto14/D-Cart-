import { Router } from "express";
import {
  checkout,
  listOrders,
  updateOrderStatus
} from "../controllers/order.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/role.middleware.js";
import { validateBody, validateParams } from "../middlewares/validate.middleware.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {
  checkoutSchema,
  orderIdParamSchema,
  updateOrderStatusSchema
} from "../validators/order.validator.js";

const router = Router();

router.use(authenticate);
router.get("/", asyncHandler(listOrders));
router.post("/checkout", validateBody(checkoutSchema), asyncHandler(checkout));
router.patch(
  "/:id/status",
  authorize("ADMIN"),
  validateParams(orderIdParamSchema),
  validateBody(updateOrderStatusSchema),
  asyncHandler(updateOrderStatus)
);

export default router;
