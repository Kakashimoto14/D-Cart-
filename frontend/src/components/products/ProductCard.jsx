import { currency } from "../../utils/format";

export function ProductCard({ product, onAddToCart, busy }) {
  return (
    <article className="panel overflow-hidden">
      <div className="bg-mesh-soft px-5 py-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand-700">
              {product.category?.name || "General"}
            </p>
            <h3 className="mt-2 text-xl font-semibold text-ink">{product.name}</h3>
          </div>
          <span className="rounded-full bg-white/80 px-3 py-1 text-xs font-semibold text-brand-700">
            {product.stock} in stock
          </span>
        </div>
      </div>
      <div className="space-y-5 px-5 py-5">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Unit price</p>
            <p className="mt-1 text-2xl font-bold text-slate-900">{currency(product.price)}</p>
          </div>
          <button
            type="button"
            onClick={() => onAddToCart(product.id)}
            disabled={busy || product.stock === 0}
            className="btn-primary px-4 py-2.5"
          >
            {busy ? "Adding..." : "Add to cart"}
          </button>
        </div>
      </div>
    </article>
  );
}
