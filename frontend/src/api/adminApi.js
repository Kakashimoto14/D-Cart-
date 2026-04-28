import client from "./client";

export const adminApi = {
  dashboard: async () => {
    const { data } = await client.get("/admin/dashboard");
    return data.dashboard;
  }
};
