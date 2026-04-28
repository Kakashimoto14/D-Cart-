import { OrderService } from "../services/order.service.js";

const orderService = new OrderService();

export const checkout = async (req, res) => {
  const order = await orderService.checkout(req.user.id, req.body);
  res.status(201).json({ order });
};

export const listOrders = async (req, res) => {
  const orders = await orderService.listOrders(req.user);
  res.status(200).json({ orders });
};

export const updateOrderStatus = async (req, res) => {
  const order = await orderService.updateStatus(Number(req.params.id), req.body.status);
  res.status(200).json({ order });
};
