import { useEffect, useState } from "react";

const API_URL = "http://localhost:5000/api/products";

// WhatsApp number
// Kenya format: 2547XXXXXXXX
const WHATSAPP_NUMBER = "254797319558";

function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =========================================================
  // GET PRODUCTS
  // =========================================================

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(API_URL);
      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "Failed to load products"
        );
      }

      setProducts(result.data || []);
    } catch (error) {
      console.error("Fetch products error:", error);
      setError("Unable to load products. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // WHATSAPP
  // =========================================================

  const getWhatsAppLink = (product) => {
    const message = `Hello Xaaji Electronics,

I am interested in this product:

Product: ${product.name}
Category: ${product.category}
Price: KSh ${product.price}

Is this product available?`;

    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
      message
    )}`;
  };

  // =========================================================
  // UI
  // =========================================================

  return (
    <main
      className="min-h-screen px-4 py-12 transition-colors duration-300 sm:px-6 lg:px-8"
      style={{
        backgroundColor: "var(--background)",
        color: "var(--foreground)",
      }}
    >
      {/* =====================================================
          HEADER
      ====================================================== */}
      <div className="mx-auto max-w-7xl text-center">
        <p className="font-semibold uppercase tracking-wider text-yellow-500">
          Xaaji Electronics
        </p>

        <h1
          className="mt-2 text-3xl font-black sm:text-4xl lg:text-5xl"
          style={{
            color: "var(--foreground)",
          }}
        >
          Electrical Products
        </h1>

        <p
          className="mx-auto mt-4 max-w-2xl leading-7"
          style={{
            color: "var(--muted)",
          }}
        >
          Find quality electrical products and equipment for your
          home, office, construction and electrical projects.
        </p>

        {/* Yellow Line */}
        <div className="mx-auto mt-6 flex justify-center gap-2">
          <div className="h-1 w-14 rounded-full bg-yellow-400"></div>
          <div className="h-1 w-6 rounded-full bg-yellow-300"></div>
          <div className="h-1 w-2 rounded-full bg-yellow-200"></div>
        </div>
      </div>

      {/* =====================================================
          LOADING
      ====================================================== */}
      {loading && (
        <div
          className="mx-auto mt-12 max-w-7xl rounded-2xl border p-10 text-center shadow-sm"
          style={{
            backgroundColor: "var(--surface)",
            borderColor: "var(--border)",
          }}
        >
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-gray-300 border-t-yellow-500"></div>

          <p
            className="mt-4"
            style={{
              color: "var(--muted)",
            }}
          >
            Loading products...
          </p>
        </div>
      )}

      {/* =====================================================
          ERROR
      ====================================================== */}
      {!loading && error && (
        <div className="mx-auto mt-12 max-w-7xl rounded-2xl border border-red-200 bg-red-50 p-8 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-100 text-2xl">
            ⚠️
          </div>

          <p className="mt-4 font-medium text-red-700">
            {error}
          </p>

          <button
            type="button"
            onClick={fetchProducts}
            className="mt-5 rounded-lg bg-yellow-500 px-5 py-3 font-semibold text-gray-950 transition-all duration-300 hover:bg-yellow-400 hover:shadow-lg"
          >
            Try Again
          </button>
        </div>
      )}

      {/* =====================================================
          EMPTY
      ====================================================== */}
      {!loading && !error && products.length === 0 && (
        <div
          className="mx-auto mt-12 max-w-7xl rounded-2xl border p-10 text-center shadow-sm"
          style={{
            backgroundColor: "var(--surface)",
            borderColor: "var(--border)",
          }}
        >
          <div className="text-5xl">📦</div>

          <h2
            className="mt-4 text-xl font-bold"
            style={{
              color: "var(--foreground)",
            }}
          >
            No Products Available
          </h2>

          <p
            className="mt-2"
            style={{
              color: "var(--muted)",
            }}
          >
            New products will appear here when they are added.
          </p>
        </div>
      )}

      {/* =====================================================
          PRODUCTS
      ====================================================== */}
      {!loading && !error && products.length > 0 && (
        <div className="mx-auto mt-12 grid max-w-7xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product) => (
            <div
              key={product._id}
              className="group overflow-hidden rounded-2xl border shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
              style={{
                backgroundColor: "var(--surface)",
                borderColor: "var(--border)",
              }}
            >
              {/* =================================================
                  IMAGE
              ================================================== */}
              <div
                className="relative h-56 overflow-hidden"
                style={{
                  backgroundColor: "var(--surface-secondary)",
                }}
              >
                {product.image ? (
                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <div className="text-center">
                      <div className="text-5xl">⚡</div>

                      <p
                        className="mt-2 text-sm"
                        style={{
                          color: "var(--muted)",
                        }}
                      >
                        No image
                      </p>
                    </div>
                  </div>
                )}

                {/* Availability */}
                <div className="absolute right-3 top-3">
                  {product.available && product.stock > 0 ? (
                    <span className="rounded-full bg-green-100 px-3 py-1.5 text-xs font-semibold text-green-700 shadow-sm">
                      Available
                    </span>
                  ) : (
                    <span className="rounded-full bg-red-100 px-3 py-1.5 text-xs font-semibold text-red-700 shadow-sm">
                      Out of Stock
                    </span>
                  )}
                </div>
              </div>

              {/* =================================================
                  PRODUCT INFORMATION
              ================================================== */}
              <div className="p-5">
                {/* Category */}
                <p className="text-sm font-semibold text-yellow-500">
                  {product.category}
                </p>

                {/* Name */}
                <h2
                  className="mt-1 text-lg font-bold"
                  style={{
                    color: "var(--foreground)",
                  }}
                >
                  {product.name}
                </h2>

                {/* Description */}
                <p
                  className="mt-2 line-clamp-3 text-sm leading-6"
                  style={{
                    color: "var(--muted)",
                  }}
                >
                  {product.description}
                </p>

                {/* Price */}
                <div className="mt-4">
                  <p
                    className="text-2xl font-black"
                    style={{
                      color: "var(--foreground)",
                    }}
                  >
                    KSh{" "}
                    {Number(product.price || 0).toLocaleString()}
                  </p>
                </div>

                {/* Stock */}
                <p
                  className="mt-1 text-sm"
                  style={{
                    color: "var(--muted)",
                  }}
                >
                  {product.stock > 0
                    ? `${product.stock} in stock`
                    : "Currently unavailable"}
                </p>

                {/* =================================================
                    WHATSAPP
                ================================================== */}
                <a
                  href={getWhatsAppLink(product)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`mt-5 flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold text-white transition-all duration-300 ${
                    product.available && product.stock > 0
                      ? "bg-green-600 hover:-translate-y-0.5 hover:bg-green-700 hover:shadow-lg"
                      : "pointer-events-none cursor-not-allowed bg-gray-400"
                  }`}
                >
                  <span className="text-lg">💬</span>

                  {product.available && product.stock > 0
                    ? "Ask on WhatsApp"
                    : "Unavailable"}
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* =====================================================
          BOTTOM INFORMATION
      ====================================================== */}
      {!loading && !error && products.length > 0 && (
        <div
          className="mx-auto mt-12 max-w-7xl rounded-2xl border p-6 text-center"
          style={{
            backgroundColor: "var(--surface-secondary)",
            borderColor: "var(--border)",
          }}
        >
          <p
            className="text-sm"
            style={{
              color: "var(--muted)",
            }}
          >
            💬 Interested in a product? Contact Xaaji Electronics
            through WhatsApp to confirm availability and place your
            order.
          </p>
        </div>
      )}
    </main>
  );
}

export default Products;