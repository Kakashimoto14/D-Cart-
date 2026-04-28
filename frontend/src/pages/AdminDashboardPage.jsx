import { useEffect, useState } from "react";
import { adminApi } from "../api/adminApi";
import { categoryApi } from "../api/categoryApi";
import { orderApi } from "../api/orderApi";
import { productApi } from "../api/productApi";
import { LoadingState } from "../components/common/LoadingState";
import { StatusBadge } from "../components/common/StatusBadge";
import { currency, formatDateTime } from "../utils/format";

const initialForm = {
  id: null,
  name: "",
  price: "",
  stock: "",
  categoryId: ""
};

export function AdminDashboardPage() {
  const [dashboard, setDashboard] = useState(null);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [orders, setOrders] = useState([]);
  const [productForm, setProductForm] = useState(initialForm);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const loadData = async () => {
    try {
      const [categoryData, dashboardData, productData, orderData] = await Promise.all([
        categoryApi.list(),
        adminApi.dashboard(),
        productApi.list(),
        orderApi.list()
      ]);

      setCategories(categoryData);
      setDashboard(dashboardData);
      setProducts(productData);
      setOrders(orderData);
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Unable to load admin dashboard.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const resetForm = () => setProductForm(initialForm);

  const handleProductSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");

    const payload = {
      name: productForm.name,
      price: Number(productForm.price),
      stock: Number(productForm.stock),
      categoryId: Number(productForm.categoryId)
    };

    try {
      if (productForm.id) {
        await productApi.update(productForm.id, payload);
      } else {
        await productApi.create(payload);
      }

      resetForm();
      await loadData();
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Unable to save product.");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteProduct = async (productId) => {
    setError("");

    try {
      await productApi.remove(productId);
      await loadData();
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Unable to delete product.");
    }
  };

  const handleStatusChange = async (orderId, status) => {
    setError("");

    try {
      await orderApi.updateStatus(orderId, { status });
      await loadData();
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Unable to update order status.");
    }
  };

  if (loading) {
    return <LoadingState label="Loading admin dashboard..." />;
  }

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-4 rounded-lg bg-white/70 px-6 py-6 backdrop-blur-sm lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-brand-600">
            Admin
          </p>
          <h2 className="mt-2 text-3xl font-bold text-ink">Operations dashboard</h2>
        </div>
      </div>

      {error ? <p className="text-sm font-medium text-rose-600">{error}</p> : null}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <MetricCard label="Orders" value={dashboard?.totals.orders || 0} />
        <MetricCard label="Delivered" value={dashboard?.totals.delivered || 0} />
        <MetricCard label="Products" value={dashboard?.totals.products || 0} />
        <MetricCard label="Pending" value={dashboard?.totals.pendingOrders || 0} />
        <MetricCard label="Sales" value={currency(dashboard?.totals.sales || 0)} />
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <div className="panel px-6 py-6">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-brand-600">
                Product form
              </p>
              <h3 className="mt-2 text-xl font-bold text-ink">
                {productForm.id ? "Update inventory item" : "Add inventory item"}
              </h3>
            </div>
            {productForm.id ? (
              <button type="button" onClick={resetForm} className="btn-secondary px-3 py-2">
                New item
              </button>
            ) : null}
          </div>

          <form onSubmit={handleProductSubmit} className="space-y-4">
            <input
              className="field"
              placeholder="Product name"
              value={productForm.name}
              onChange={(event) =>
                setProductForm((current) => ({ ...current, name: event.target.value }))
              }
              required
            />
            <div className="grid gap-4 sm:grid-cols-2">
              <input
                className="field"
                type="number"
                step="0.01"
                placeholder="Price"
                value={productForm.price}
                onChange={(event) =>
                  setProductForm((current) => ({ ...current, price: event.target.value }))
                }
                required
              />
              <input
                className="field"
                type="number"
                placeholder="Stock"
                value={productForm.stock}
                onChange={(event) =>
                  setProductForm((current) => ({ ...current, stock: event.target.value }))
                }
                required
              />
            </div>
            <select
              className="field"
              value={productForm.categoryId}
              onChange={(event) =>
                setProductForm((current) => ({ ...current, categoryId: event.target.value }))
              }
              required
            >
              <option value="">Select category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            <button type="submit" disabled={saving} className="btn-primary w-full">
              {saving ? "Saving..." : productForm.id ? "Update product" : "Create product"}
            </button>
          </form>
        </div>

        <div className="panel px-6 py-6">
          <div className="mb-5">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-brand-600">
              Inventory
            </p>
            <h3 className="mt-2 text-xl font-bold text-ink">Product catalog management</h3>
          </div>
          <div className="space-y-4">
            {products.map((product) => (
              <div
                key={product.id}
                className="flex flex-col gap-4 rounded-lg border border-slate-100 px-4 py-4 md:flex-row md:items-center md:justify-between"
              >
                <div>
                  <h4 className="font-semibold text-slate-900">{product.name}</h4>
                  <p className="text-sm text-slate-500">
                    {currency(product.price)} | Stock {product.stock} | Category{" "}
                    {product.category?.name || product.categoryId}
                  </p>
                </div>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() =>
                      setProductForm({
                        id: product.id,
                        name: product.name,
                        price: String(product.price),
                        stock: String(product.stock),
                        categoryId: String(product.categoryId)
                      })
                    }
                    className="btn-secondary px-3 py-2"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteProduct(product.id)}
                    className="btn-danger px-3 py-2"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <div className="panel px-6 py-6">
          <div className="mb-5">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-brand-600">
              Recent sales
            </p>
            <h3 className="mt-2 text-xl font-bold text-ink">Latest order activity</h3>
          </div>
          <div className="space-y-4">
            {dashboard?.recentOrders.map((order) => (
              <div key={order.id} className="rounded-lg border border-slate-100 px-4 py-4">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="font-semibold text-slate-900">Order #{order.id}</p>
                    <p className="text-sm text-slate-500">{order.customer.name}</p>
                  </div>
                  <StatusBadge status={order.status} />
                </div>
                <div className="mt-3 flex items-center justify-between text-sm">
                  <span className="text-slate-500">{formatDateTime(order.createdAt)}</span>
                  <span className="font-semibold text-slate-900">{currency(order.total)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="panel px-6 py-6">
          <div className="mb-5">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-brand-600">
              Fulfillment
            </p>
            <h3 className="mt-2 text-xl font-bold text-ink">Update order status</h3>
          </div>
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order.id}
                className="rounded-lg border border-slate-100 px-4 py-4 md:flex md:items-center md:justify-between"
              >
                <div>
                  <div className="flex items-center gap-3">
                    <p className="font-semibold text-slate-900">Order #{order.id}</p>
                    <StatusBadge status={order.status} />
                  </div>
                  <p className="mt-2 text-sm text-slate-500">
                    {order.delivery?.address || "No delivery address available"}
                  </p>
                </div>
                <select
                  value={order.status}
                  onChange={(event) => handleStatusChange(order.id, event.target.value)}
                  className="field mt-4 w-full md:mt-0 md:max-w-52"
                >
                  <option value="PENDING">Pending</option>
                  <option value="CONFIRMED">Confirmed</option>
                  <option value="PACKING">Packing</option>
                  <option value="OUT_FOR_DELIVERY">Out for delivery</option>
                  <option value="DELIVERED">Delivered</option>
                  <option value="CANCELLED">Cancelled</option>
                </select>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function MetricCard({ label, value }) {
  return (
    <div className="panel px-5 py-5">
      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">{label}</p>
      <p className="mt-3 text-3xl font-bold text-ink">{value}</p>
    </div>
  );
}
