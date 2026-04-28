import { startTransition, useEffect, useState } from "react";
import { cartApi } from "../api/cartApi";
import { productApi } from "../api/productApi";
import { EmptyState } from "../components/common/EmptyState";
import { LoadingState } from "../components/common/LoadingState";
import { ProductCard } from "../components/products/ProductCard";

export function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busyProductId, setBusyProductId] = useState(null);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const records = await productApi.list();
        startTransition(() => {
          setProducts(records);
        });
      } catch (requestError) {
        setError(requestError.response?.data?.message || "Unable to load products.");
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  const handleAddToCart = async (productId) => {
    setBusyProductId(productId);

    try {
      await cartApi.addItem({
        productId,
        quantity: 1
      });
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Unable to add item to cart.");
    } finally {
      setBusyProductId(null);
    }
  };

  if (loading) {
    return <LoadingState label="Loading product catalog..." />;
  }

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-4 rounded-lg bg-white/70 px-6 py-6 backdrop-blur-sm md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-brand-600">
            Catalog
          </p>
          <h2 className="mt-2 text-3xl font-bold text-ink">Fresh grocery essentials</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
            Browse products available for same-day service within Rodriguez, Rizal.
          </p>
        </div>
      </div>

      {error ? <p className="text-sm font-medium text-rose-600">{error}</p> : null}

      {products.length === 0 ? (
        <EmptyState
          title="No products available"
          description="Add inventory from the admin area to start receiving orders."
        />
      ) : (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={handleAddToCart}
              busy={busyProductId === product.id}
            />
          ))}
        </div>
      )}
    </section>
  );
}
