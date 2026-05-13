import { useState, useMemo, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ChevronRight, Truck, Tag, CreditCard, Headphones } from "lucide-react";
import client from "../../api/client";

import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import { useCategories } from "../../hooks/categories/useCategories";
import { useProducts } from "../../hooks/products/useProducts";

// ── Resolve image URLs ────────────────────────────────────────────────────────
const API_BASE = (import.meta.env?.VITE_API_URL || client.defaults?.baseURL || "http://localhost:1500/api")
  .replace(/\/api.*$/, "")
  .replace(/\/$/, "");

const resolveImageUrl = (path) => {
  if (!path) return null;
  if (path.startsWith("http")) return path;
  return `${API_BASE}${path}`;
};

// ── Trust badge data (matches design exactly) ─────────────────────────────────
const TRUST_BADGES = [
  { icon: Truck, label: "Free Shipping", sub: "Free shipping for order above $185" },
  { icon: Tag, label: "Members Discount", sub: "Discount for elite members" },
  { icon: CreditCard, label: "Flexible Payment", sub: "Secured payment options" },
  { icon: Headphones, label: "Swift Support", sub: "24/7 customer support" },
];

// ── Component ─────────────────────────────────────────────────────────────────
export default function ProductListingPage() {
  const { data: categories = [], isLoading: catsLoading } = useCategories();
  const [searchParams] = useSearchParams();

  // Initialize from URL query param (?category=dan-wear)
  const [activeCategorySlug, setActiveCategorySlug] = useState(() => {
    return searchParams.get("category") || "";
  });

  // When categories load, validate the URL category or fall back to first
  useEffect(() => {
    if (categories?.length === 0) return;

    const urlCategory = searchParams.get("category");
    const exists = categories.some((c) => c.slug === urlCategory);

    if (urlCategory && exists) {
      if (activeCategorySlug !== urlCategory) {
        setActiveCategorySlug(urlCategory);
      }
    } else if (!activeCategorySlug) {
      setActiveCategorySlug(categories[0].slug);
    }
  }, [categories, searchParams]);

  const [activeSubcategories, setActiveSubcategories] = useState([]);

  const activeCategory = useMemo(
    () =>
      categories?.find((c) => c.slug === activeCategorySlug) ?? categories?.[0] ?? null,
    [categories, activeCategorySlug],
  );

  const productParams = useMemo(() => {
    const params = {};
    if (activeCategorySlug) params.categorySlug = activeCategorySlug;
    if (activeSubcategories.length === 1) {
      params.subcategorySlug = activeSubcategories[0];
    }
    return params;
  }, [activeCategorySlug, activeSubcategories]);

  const { data: rawProducts, isLoading: productsLoading } = useProducts(productParams);

  // ═══════════════════════════════════════════════════════════════════════════
  //  FIX: Strictly use the FIRST variant (by creation date) for thumbnail,
  //  price, and sale status. Removed the fallback that scanned other variants
  //  for images, which caused the wrong variant's image to display.
  // ═══════════════════════════════════════════════════════════════════════════
  const products = useMemo(() => {
    if (!rawProducts) return [];
    return rawProducts.map((p) => {
      const sortedVariants = [...(p.variants || [])].sort(
        (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );
      const firstVariant = sortedVariants[0];

      const image = firstVariant?.images?.[0]?.url || null;

      return {
        ...p,
        price:      firstVariant?.price      ?? p.price      ?? 0,
        salePrice:  firstVariant?.salePrice  ?? p.salePrice  ?? 0,
        isOnSale:   firstVariant?.isOnSale   ?? p.isOnSale   ?? false,
        image,
      };
    });
  }, [rawProducts]);

  const filteredProducts = useMemo(() => {
    if (!products || !activeSubcategories.length) return products || [];
    return products.filter((p) =>
      activeSubcategories.includes(p.subcategorySlug),
    );
  }, [products, activeSubcategories]);

  const handleCategoryChange = (slug) => {
    setActiveCategorySlug(slug);
    setActiveSubcategories([]);
  };

  const handleSubcategoryToggle = (slug) => {
    setActiveSubcategories((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug],
    );
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* ── Hero / Page Header ─────────────────────────────────────────────── */}
      <section
        className="pt-10 pb-5 text-center"
        style={{
          backgroundColor: "#ffffff",
          backgroundImage:
            "linear-gradient(45deg, #f0f0f0 25%, transparent 25%), linear-gradient(-45deg, #f0f0f0 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #f0f0f0 75%), linear-gradient(-45deg, transparent 75%, #f0f0f0 75%)",
          backgroundSize: "10px 10px",
          backgroundPosition: "0 0, 0 5px, 5px -5px, -5px 0px",
        }}
      >
        <h1 className="text-[28px] font-bold text-gray-900 tracking-tight">Shop</h1>
        <p className="mt-1 text-[15px] font-semibold text-[#DA5605]">
          {activeCategory?.name ?? "Men"}
        </p>

        <nav className="mt-2 flex items-center justify-center gap-1 text-[11px] text-gray-500">
          <Link to="/" className="hover:text-[#DA5605] transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-gray-800 font-medium">Shop</span>
          {activeCategory && (
            <>
              <ChevronRight className="w-3 h-3" />
              <span className="text-[#DA5605] font-medium">
                {activeCategory.name}
              </span>
            </>
          )}
        </nav>
      </section>

      {/* ── Category Pills ─────────────────────────────────────────────────── */}
      <section className="py-4">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-2">
            {catsLoading
              ? Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-8 w-20 bg-gray-100 rounded-full animate-pulse"
                  />
                ))
              : categories.map((cat) => {
                  const isActive = cat.slug === activeCategorySlug;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => handleCategoryChange(cat.slug)}
                      className={`px-5 py-1.5 rounded-full text-[12px] font-medium border transition-all duration-200 ${
                        isActive
                          ? "bg-[#DA5605] text-white border-[#DA5605]"
                          : "bg-white text-gray-700 border-gray-300 hover:border-gray-400"
                      }`}
                    >
                      {cat.name}
                    </button>
                  );
                })}
          </div>
        </div>
      </section>

      {/* ── Main Content: Sidebar + Product Grid ───────────────────────────── */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left: Subcategory Filter */}
          <aside className="w-full lg:w-44 flex-shrink-0">
            <h3 className="text-[15px] font-semibold text-gray-900 mb-4">
              Subcategory
            </h3>

            {activeCategory?.children?.length > 0 ? (
              <div className="space-y-3">
                {activeCategory.children.map((sub) => (
                  <label
                    key={sub.id}
                    className="flex items-center gap-2.5 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={activeSubcategories.includes(sub.slug)}
                      onChange={() => handleSubcategoryToggle(sub.slug)}
                      className="h-3.5 w-3.5 border border-gray-300 text-[#DA5605] focus:ring-[#DA5605] cursor-pointer rounded-none"
                    />
                    <span className="text-[13px] text-gray-700">{sub.name}</span>
                  </label>
                ))}
              </div>
            ) : (
              <p className="text-[13px] text-gray-400">No subcategories available</p>
            )}
          </aside>

          {/* Right: Product Grid */}
          <div className="flex-1 min-w-0">
            <p className="text-[11px] text-gray-400 mb-3">
              {productsLoading
                ? "Loading…"
                : `${filteredProducts.length} product${filteredProducts.length !== 1 ? "s" : ""} found`}
            </p>

            {productsLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="aspect-square max-h-[220px] bg-gray-200 mb-1.5" />
                    <div className="h-3 bg-gray-200 rounded w-3/4 mb-1" />
                    <div className="h-3 bg-gray-200 rounded w-1/4 mb-1.5" />
                    <div className="h-8 bg-gray-200 rounded" />
                  </div>
                ))}
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-sm text-gray-500">No products found</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {filteredProducts.map((product) => (
                  <div key={product.id} className="bg-white">
                    <Link to={`/products/${product.slug}`} className="block">
                      <div className="aspect-square max-h-[220px] bg-gray-50 overflow-hidden mb-1.5">
                        <img
                          src={resolveImageUrl(product.image) || "/placeholder-product.png"}
                          alt={product.name}
                          loading="lazy"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <h3 className="text-[11px] text-gray-900 leading-snug">
                        {product.name}
                      </h3>
                      <p className="text-[11px] font-bold text-gray-900 mt-0.5 mb-1.5">
                        ${Number(product.price).toFixed(2)}
                      </p>
                    </Link>
                    <button
                      onClick={() => {
                        console.log("Add to cart:", product);
                      }}
                      className="w-full bg-[#DA5605] hover:bg-[#c04a04] text-white text-[10px] font-medium py-1.5 rounded transition-colors"
                    >
                      Add to Cart
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* ── Trust Badges ───────────────────────────────────────────────────── */}
      <section className="border-t border-gray-100 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {TRUST_BADGES.map(({ icon: Icon, label, sub }) => (
              <div key={label} className="flex items-start gap-2.5">
                <Icon className="w-4 h-4 text-[#DA5605] flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-[13px] font-semibold text-gray-900">{label}</p>
                  <p className="text-[11px] text-gray-500 mt-0.5">{sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}