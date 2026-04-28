import client from "./client";

export const orderApi = {
  checkout: async (payload) => {
    const { data } = await client.post("/orders/checkout", payload);
    return data.order;
  },
  list: async () => {
    const { data } = await client.get("/orders");
    return data.orders;
  },
  updateStatus: async (id, payload) => {
    const { data } = await client.patch(`/orders/${id}/status`, payload);
    return data.order;
  }
};
