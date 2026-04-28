import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { cartApi } from "../api/cartApi";
import { orderApi } from "../api/orderApi";
import { EmptyState } from "../components/common/EmptyState";
import { LoadingState } from "../components/common/LoadingState";
import { currency } from "../utils/format";

export function CheckoutPage() {
  const navigate = useNavigate();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({
    address: "",
    deliveryType: "SAME_DAY"
  });

  useEffect(() => {
    const loadCart = async () => {
      try {
        const data = await cartApi.get();
        setCart(data);
      } catch (requestError) {
        setError(requestError.response?.data?.message || "Unable to load checkout.");
      } finally {
        setLoading(false);
      }
    };

    loadCart();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");
    setIsSubmitting(true);

    try {
      const order = await orderApi.checkout(form);
      setSuccess(`Order #${order.id} has been placed successfully.`);
      setTimeout(() => navigate("/orders"), 1200);
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          "Unable to place the order. Make sure the address is within Rodriguez, Rizal."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <LoadingState label="Preparing checkout..." />;
  }

  if (!cart || cart.items.length === 0) {
    return (
      <EmptyState
        title="Nothing to check out"
        description="Add items to your cart before placing an order."
      />
    );
  }

  return (
    <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
      <form onSubmit={handleSubmit} className="panel px-6 py-6">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-brand-600">
          Checkout
        </p>
        <h2 className="mt-2 text-2xl font-bold text-ink">Delivery details</h2>
        <p className="mt-2 text-sm leading-6 text-slate-500">
          Orders are only accepted for addresses that contain Rodriguez, Rizal.
        </p>

        <div className="mt-6 space-y-4">
          <textarea
            name="address"
            rows="4"
            placeholder="House number, street, barangay, Rodriguez, Rizal"
            value={form.address}
            onChange={(event) => setForm((current) => ({ ...current, address: event.target.value }))}
            className="field resize-none"
            required
          />

          <select
            name="deliveryType"
            value={form.deliveryType}
            onChange={(event) =>
              setForm((current) => ({ ...current, deliveryType: event.target.value }))
            }
            className="field"
          >
            <option value="SAME_DAY">Same-day delivery</option>
            <option value="STANDARD">Standard delivery</option>
          </select>
        </div>

        {error ? <p className="mt-4 text-sm font-medium text-rose-600">{error}</p> : null}
        {success ? <p className="mt-4 text-sm font-medium text-emerald-600">{success}</p> : null}

        <button type="submit" disabled={isSubmitting} className="btn-primary mt-6 w-full">
          {isSubmitting ? "Placing order..." : "Place order"}
        </button>
      </form>

      <aside className="panel h-fit px-6 py-6">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-brand-600">
          Order summary
        </p>
        <div className="mt-5 space-y-4">
          {cart.items.map((item) => (
            <div key={item.productId} className="flex items-center justify-between gap-4 text-sm">
              <div>
                <p className="font-semibold text-slate-800">{item.product.name}</p>
                <p className="text-slate-500">Qty {item.quantity}</p>
              </div>
              <span className="font-semibold text-slate-900">
                {currency(item.product.price * item.quantity)}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-6 border-t border-slate-100 pt-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-500">Subtotal</span>
            <span className="text-lg font-bold text-ink">{currency(cart.subtotal)}</span>
          </div>
        </div>
      </aside>
    </section>
  );
}
