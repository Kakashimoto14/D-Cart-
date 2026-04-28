import { AdminService } from "../services/admin.service.js";

const adminService = new AdminService();

export const getDashboard = async (_req, res) => {
  const dashboard = await adminService.getDashboardMetrics();
  res.status(200).json({ dashboard });
};
