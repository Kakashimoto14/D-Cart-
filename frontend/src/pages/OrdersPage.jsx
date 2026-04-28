import { useEffect, useState } from "react";
import { orderApi } from "../api/orderApi";
import { EmptyState } from "../components/common/EmptyState";
import { LoadingState } from "../components/common/LoadingState";
import { StatusBadge } from "../components/common/StatusBadge";
import { currency, formatDateTime } from "../utils/format";

export function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const data = await orderApi.list();
        setOrders(data);
      } catch (requestError) {
        setError(requestError.response?.data?.message || "Unable to load orders.");
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, []);

  if (loading) {
    return <LoadingState label="Loading orders..." />;
  }

  return (
    <section className="space-y-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-brand-600">
          Order tracking
        </p>
        <h2 className="mt-2 text-3xl font-bold text-ink">Your grocery orders</h2>
      </div>

      {error ? <p className="text-sm font-medium text-rose-600">{error}</p> : null}

      {orders.length === 0 ? (
        <EmptyState
          title="No orders yet"
          description="Once you place an order, you can track its progress here."
        />
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <article key={order.id} className="panel px-6 py-6">
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div>
                  <div className="flex items-center gap-3">
                    <h3 className="text-xl font-semibold text-ink">Order #{order.id}</h3>
                    <StatusBadge status={order.status} />
                  </div>
                  <p className="mt-2 text-sm text-slate-500">{formatDateTime(order.createdAt)}</p>
                </div>
                <p className="text-lg font-bold text-slate-900">{currency(order.total)}</p>
              </div>

              <div className="mt-5 grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
                <div className="space-y-3">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex items-center justify-between text-sm">
                      <span className="text-slate-700">
                        {item.product.name} x {item.quantity}
                      </span>
                      <span className="font-semibold text-slate-900">
                        {currency(item.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="rounded-lg bg-slate-50 px-4 py-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
                    Delivery
                  </p>
                  <p className="mt-2 text-sm font-medium text-slate-700">
                    {order.delivery?.address || "Awaiting delivery details"}
                  </p>
                  {order.delivery?.status ? (
                    <div className="mt-3">
                      <StatusBadge status={order.delivery.status} />
                    </div>
                  ) : null}
                  {order.delivery?.estimatedAt ? (
                    <p className="mt-3 text-xs text-slate-500">
                      ETA {formatDateTime(order.delivery.estimatedAt)}
                    </p>
                  ) : null}
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
