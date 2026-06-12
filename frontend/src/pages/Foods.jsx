import { useEffect, useState, useRef, useCallback, useMemo } from "react";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { getFoods, searchFoods } from "../services/foodService";
import { addToCart } from "../services/cartService";
import { addToWishlist } from "../services/wishlistService";
import {
  FiSearch,
  FiGrid,
  FiList,
  FiSliders,
  FiHeart,
  FiCheck,
  FiShoppingCart,
  FiStar,
  FiClock,
  FiX,
} from "react-icons/fi";

// ─── Hero Carousel ────────────────────────────────────────────────────────────
function HeroCarousel({ foods }) {
  const [idx, setIdx] = useState(0);
  const timerRef = useRef(null);

  const goTo = useCallback((n) => setIdx((n + foods.length) % foods.length), [foods.length]);

  useEffect(() => {
    timerRef.current = setInterval(() => goTo(idx + 1), 4200);
    return () => clearInterval(timerRef.current);
  }, [idx, goTo]);

  if (!foods.length) return null;

  const badgeLabels = { hot: "🔥 Chef's Special", new: "✨ Featured", sale: "⚡ Flash Deal" };

  return (
    <div className="fr-hero">
      <div className="fr-hero-track-wrap">
        <div className="fr-hero-track" style={{ transform: `translateX(-${idx * 100}%)` }}>
          {foods.map((f) => (
            <div key={f._id} className="fr-hero-slide">
              <img src={f.image} alt={f.title} className="fr-hero-img" />
              <div className="fr-hero-overlay" />
              <div className="fr-hero-content">
                {f.badge && <div className="fr-hero-tag">{badgeLabels[f.badge] || f.badge}</div>}
                <h2 className="fr-hero-title">{f.title}</h2>
                <p className="fr-hero-desc">{f.description}</p>
                <div className="fr-hero-price">₹{f.price}</div>
                <div className="fr-hero-cta">
                  <button className="fr-btn-primary" onClick={() => {}}>Add to Cart</button>
                  <Link to={`/foods/${f._id}`} className="fr-btn-ghost">View Details</Link>
                </div>
              </div>
            </div>
          ))}
        </div>
        <button className="fr-hero-prev" onClick={() => goTo(idx - 1)} aria-label="Previous">‹</button>
        <button className="fr-hero-next" onClick={() => goTo(idx + 1)} aria-label="Next">›</button>
        <div className="fr-hero-dots">
          {foods.map((_, i) => (
            <div key={i} className={`fr-hero-dot ${i === idx ? "on" : ""}`} onClick={() => goTo(i)} />
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Card Image Carousel ──────────────────────────────────────────────────────
function CardImageCarousel({ food }) {
  const images = food.images?.length ? food.images : [food.image].filter(Boolean);
  const [idx, setIdx] = useState(0);

  if (!images.length) {
    return (
      <div className="fr-card-img-wrap">
        <div className="fr-card-img-placeholder">🍽️</div>
      </div>
    );
  }

  const slide = (dir, e) => {
    e.preventDefault(); e.stopPropagation();
    setIdx(p => (p + dir + images.length) % images.length);
  };

  return (
    <div className="fr-card-img-wrap">
      <div className="fr-card-imgs" style={{ transform: `translateX(-${idx * 100}%)` }}>
        {images.map((src, i) => (
          <img key={i} src={src} alt={food.title} className="fr-card-img" />
        ))}
      </div>
      {images.length > 1 && (
        <>
          <button className="fr-card-nav fr-card-prev" onClick={(e) => slide(-1, e)} aria-label="Previous image">‹</button>
          <button className="fr-card-nav fr-card-next" onClick={(e) => slide(1, e)} aria-label="Next image">›</button>
          <div className="fr-card-dots">
            {images.map((_, i) => (
              <div key={i} className={`fr-card-dot ${i === idx ? "on" : ""}`} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// ─── Food Card ────────────────────────────────────────────────────────────────
function FoodCard({ food, onCart, onWishlist, inWishlist, inCart }) {
  return (
    <div className="fr-card">
      <div className="fr-card-media">
        <CardImageCarousel food={food} />
        <div className="fr-card-overlay" />

        <div className="fr-card-badges">
          {food.stock <= 5 && <span className="fr-badge fr-badge-stock">Low Stock</span>}
          {food.badge === "hot" && <span className="fr-badge fr-badge-hot">🔥 Hot</span>}
          {food.badge === "new" && <span className="fr-badge fr-badge-new">✨ New</span>}
          {food.category?.name && <span className="fr-badge fr-badge-cat">{food.category.name}</span>}
        </div>

        <div className="fr-card-actions-overlay">
          <button
            className={`fr-icon-btn wish ${inWishlist ? "active" : ""}`}
            onClick={(e) => { e.stopPropagation(); onWishlist(food._id); }}
            aria-label="Toggle wishlist"
          >
            <FiHeart fill={inWishlist ? "#ec4899" : "none"} />
          </button>
          <button
            className={`fr-icon-btn cart ${inCart ? "active" : ""}`}
            onClick={(e) => { e.stopPropagation(); onCart(food._id); }}
            aria-label="Add to cart"
          >
           {inCart ? (
  <FiCheck style={{ color: "#22c55e" }} />
) : (
  <FiShoppingCart />
)}
          </button>
        </div>
      </div>

      <div className="fr-card-body">
        <Link to={`/foods/${food._id}`} className="fr-card-title">{food.title}</Link>
        <p className="fr-card-desc">{food.description}</p>

        <div className="fr-card-meta">
          <span className="fr-rating"><FiStar size={11} style={{ marginRight: 3, transform: "translateY(-1px)" }} />{(food.rating || 4.8).toFixed?.(1) || food.rating || "4.8"}</span>
          <span className="fr-time"><FiClock size={11} style={{ marginRight: 3, transform: "translateY(-1px)" }} />25–35 min</span>
        </div>

        <div className="fr-card-footer">
          <div>
            <span className="fr-price">₹{food.price}</span>
            {food.oldPrice && <span className="fr-price-old">₹{food.oldPrice}</span>}
          </div>
          <Link to={`/foods/${food._id}`} className="fr-view-btn">Details →</Link>
        </div>
      </div>
    </div>
  );
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────
function SkeletonGrid() {
  return (
    <div className="fr-grid">
      {Array(8).fill(0).map((_, i) => (
        <div key={i} className="fr-skeleton">
          <div className="fr-skel-img" />
          <div className="fr-skel-body">
            <div className="fr-skel-line fr-skel-w80" />
            <div className="fr-skel-line fr-skel-w60" />
            <div className="fr-skel-line fr-skel-w80" style={{ marginTop: "12px" }} />
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Range Slider (dual handle, price) ────────────────────────────────────────
function PriceRange({ min, max, value, onChange }) {
  const [lo, hi] = value;
  const pct = (v) => ((v - min) / (max - min || 1)) * 100;

  const handleLo = (e) => {
    const v = Math.min(Number(e.target.value), hi - 1);
    onChange([v, hi]);
  };
  const handleHi = (e) => {
    const v = Math.max(Number(e.target.value), lo + 1);
    onChange([lo, v]);
  };

  return (
    <div className="fr-price-range">
      <div className="fr-pr-track">
        <div className="fr-pr-fill" style={{ left: `${pct(lo)}%`, right: `${100 - pct(hi)}%` }} />
      </div>
      <input type="range" min={min} max={max} value={lo} onChange={handleLo} className="fr-pr-input fr-pr-lo" />
      <input type="range" min={min} max={max} value={hi} onChange={handleHi} className="fr-pr-input fr-pr-hi" />
      <div className="fr-pr-labels">
        <span>₹{lo}</span>
        <span>₹{hi}{hi >= max ? "+" : ""}</span>
      </div>
    </div>
  );
}

// ─── Filter Panel (shared between desktop sidebar & mobile drawer) ───────────
function FilterPanel({
  categories, activeCategories, toggleCategory,
  priceBounds, priceRange, setPriceRange,
  minRating, setMinRating,
  sort, setSort,
  onClear, activeCount,
}) {
  return (
    <div className="fr-fp">
      <div className="fr-fp-head">
        
        {activeCount > 0 && (
          <button onClick={onClear} className="fr-fp-clear">
            Clear all ({activeCount})
          </button>
        )}
      </div>

      {/* Sort */}
      <div className="fr-fp-section">
        <div className="fr-fp-label">Sort by</div>
        <div className="fr-sort-grid">
          {[
            { v: "default", l: "Recommended" },
            { v: "price_asc", l: "Price: Low to High" },
            { v: "price_desc", l: "Price: High to Low" },
            { v: "rating", l: "Top Rated" },
          ].map(opt => (
            <button
              key={opt.v}
              className={`fr-sort-chip ${sort === opt.v ? "active" : ""}`}
              onClick={() => setSort(opt.v)}
            >
              {opt.l}
              {sort === opt.v && <FiCheck size={14} />}
            </button>
          ))}
        </div>
      </div>

      {/* Categories */}
      {categories.length > 0 && (
        <div className="fr-fp-section">
          <div className="fr-fp-label">Categories</div>
          <div className="fr-fp-tags">
            {categories.map(cat => (
              <button
                key={cat}
                className={`fr-tag ${activeCategories.has(cat) ? "active" : ""}`}
                onClick={() => toggleCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Price */}
      <div className="fr-fp-section">
        <div className="fr-fp-label">Price Range</div>
        <PriceRange min={priceBounds[0]} max={priceBounds[1]} value={priceRange} onChange={setPriceRange} />
      </div>

      {/* Rating */}
      <div className="fr-fp-section">
        <div className="fr-fp-label">Minimum Rating</div>
        <div className="fr-rating-row">
          {[0, 3, 3.5, 4, 4.5].map(r => (
            <button
              key={r}
              className={`fr-rating-chip ${minRating === r ? "active" : ""}`}
              onClick={() => setMinRating(r)}
            >
              {r === 0 ? "Any" : <>{r}<span className="fr-rc-star">★</span>+</>}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function Foods() {
  const [foods, setFoods] = useState([]);
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState("");
  const [viewMode, setViewMode] = useState("grid");
  const [wishlist, setWishlist] = useState(new Set());
  const [cart, setCart] = useState(new Set());

  // Filter state
  const [activeCategories, setActiveCategories] = useState(new Set());
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [priceBounds, setPriceBounds] = useState([0, 1000]);
  const [priceTouched, setPriceTouched] = useState(false);
  const [minRating, setMinRating] = useState(0);
  const [sort, setSort] = useState("default");
  const [filterOpen, setFilterOpen] = useState(false);

  const fetchFoods = async () => {
    try {
      const { data } = await getFoods();
      setFoods(data.foods);
      setFeatured(data.foods.filter(f => f.featured).slice(0, 4));

      if (data.foods.length) {
        const prices = data.foods.map(f => f.price);
        const lo = Math.floor(Math.min(...prices) / 10) * 10;
        const hi = Math.ceil(Math.max(...prices) / 10) * 10;
        setPriceBounds([lo, hi]);
        if (!priceTouched) setPriceRange([lo, hi]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchFoods(); /* eslint-disable-next-line */ }, []);

  // Close drawer with Escape, lock body scroll while open
  useEffect(() => {
    if (!filterOpen) return;
    const onKey = (e) => { if (e.key === "Escape") setFilterOpen(false); };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [filterOpen]);

  const handleSearch = async (e) => {
    const value = e.target.value;
    setKeyword(value);
    if (!value.trim()) { fetchFoods(); return; }
    try {
      const { data } = await searchFoods(value);
      setFoods(data.foods);
    } catch (err) { console.error(err); }
  };

  const handleAddToCart = async (foodId) => {
    try {
      await addToCart(foodId, 1);
      setCart(p => new Set(p).add(foodId));
      toast.success("Added to cart 🛒");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add to cart");
    }
  };

  const handleWishlist = async (foodId) => {
    try {
      await addToWishlist(foodId);
      setWishlist(p => {
        const n = new Set(p);
        n.has(foodId) ? n.delete(foodId) : n.add(foodId);
        return n;
      });
      toast.success(wishlist.has(foodId) ? "Removed from wishlist" : "Added to wishlist ♥");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed");
    }
  };

  // Dynamic categories derived from real data
  const categories = useMemo(() => {
    const set = new Set();
    foods.forEach(f => { if (f.category?.name) set.add(f.category.name); });
    return Array.from(set).sort();
  }, [foods]);

  const toggleCategory = (cat) => {
    setActiveCategories(prev => {
      const n = new Set(prev);
      n.has(cat) ? n.delete(cat) : n.add(cat);
      return n;
    });
  };

  const handlePriceChange = (val) => {
    setPriceTouched(true);
    setPriceRange(val);
  };

  const clearFilters = () => {
    setActiveCategories(new Set());
    setPriceRange(priceBounds);
    setPriceTouched(false);
    setMinRating(0);
    setSort("default");
  };

  const activeFilterCount =
    activeCategories.size +
    (minRating > 0 ? 1 : 0) +
    (priceTouched && (priceRange[0] !== priceBounds[0] || priceRange[1] !== priceBounds[1]) ? 1 : 0);

  // Apply filters + search + sort
  const filteredFoods = useMemo(() => {
    let result = foods.filter(f => {
      const matchesCat = activeCategories.size === 0 || activeCategories.has(f.category?.name);
      const matchesSearch = !keyword || f.title.toLowerCase().includes(keyword.toLowerCase()) || f.description?.toLowerCase().includes(keyword.toLowerCase());
      const matchesPrice = f.price >= priceRange[0] && f.price <= priceRange[1];
      const matchesRating = !minRating || (f.rating || 4.8) >= minRating;
      return matchesCat && matchesSearch && matchesPrice && matchesRating;
    });

    result = [...result];
    if (sort === "price_asc") result.sort((a, b) => a.price - b.price);
    if (sort === "price_desc") result.sort((a, b) => b.price - a.price);
    if (sort === "rating") result.sort((a, b) => (b.rating || 4.8) - (a.rating || 4.8));

    return result;
  }, [foods, activeCategories, keyword, priceRange, minRating, sort]);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=Cabinet+Grotesk:wght@400;500;700&display=swap');

        .fr-root{--bg:#0a0a0a;--bg2:#141414;--bg3:#1e1e1e;--bg4:#282828;--bdr:rgba(255,255,255,.07);--bdr2:rgba(255,255,255,.12);--txt:#f2f0ea;--txt2:rgba(242,240,234,.55);--txt3:rgba(242,240,234,.28);--or:#f97316;--or2:rgba(249,115,22,.13);--or3:rgba(249,115,22,.25);--gr:#22c55e;--gr2:rgba(34,197,94,.12);--red:#ef4444;--rd2:rgba(239,68,68,.13);--amber:#f59e0b;min-height:100vh;background:var(--bg);font-family:'Cabinet Grotesk',sans-serif;color:var(--txt);}
        .fr-wrap{max-width:1400px;margin:0 auto;padding:28px 20px 80px;
        --bg:#0b0b0b;
  --bg2:#111111;
  --bg3:#181818;
  --bg4:#232323;

  --txt:#ffffff;
  --txt2:#b3b3b3;
  --txt3:#777777;

  --or:#ff7a18;
  --or-light:#ff9f43;
  --or-soft:rgba(255,122,24,.12);

  --success:#22c55e;
  --danger:#ef4444;
  --star:#ffc107;}

        /* page header */
        .fr-ph{display:flex;align-items:flex-end;justify-content:space-between;margin-bottom:28px;flex-wrap:wrap;gap:12px;}
        .fr-ph-eyebrow{font-size:.72rem;font-weight:500;color:var(--or);text-transform:uppercase;letter-spacing:.12em;margin-bottom:6px;display:flex;align-items:center;gap:6px;}
        .fr-ph-eyebrow::before{content:'';width:18px;height:2px;background:var(--or);border-radius:1px;}
        .fr-ph-title{font-family:'Syne',sans-serif;font-size:2.6rem;font-weight:800;color:var(--txt);line-height:1.05;letter-spacing:-.03em;}
        .fr-ph-title span{color:var(--or);}
        .fr-ph-sub{color:var(--txt2);font-size:.9rem;margin-top:6px;}
        .fr-stats{display:flex;gap:14px;}
        .fr-stat{background:var(--bg3);border:1px solid var(--bdr);border-radius:10px;padding:8px 14px;text-align:center;}
        .fr-stat-n{font-family:'Syne',sans-serif;font-size:1.2rem;font-weight:700;color:var(--or);}
        .fr-stat-l{font-size:.65rem;color:var(--txt3);text-transform:uppercase;letter-spacing:.08em;}
        @media(max-width:640px){.fr-stats{display:none;}}

        /* hero */
        .fr-hero{margin-bottom:32px;}
        .fr-hero-track-wrap{position:relative;overflow:hidden;border-radius:20px;background:var(--bg2);}
        .fr-hero-track{display:flex;transition:transform .5s cubic-bezier(.4,0,.2,1);}
        .fr-hero-slide{min-width:100%;height:260px;position:relative;flex-shrink:0;overflow:hidden;}
        .fr-hero-img{width:100%;height:100%;object-fit:cover;opacity:.4;filter:brightness(.6) saturate(1.1);}
        .fr-hero-overlay{position:absolute;inset:0;background:linear-gradient(to right,rgba(10,10,10,.88) 0%,rgba(10,10,10,.3) 60%,transparent 100%);}
        .fr-hero-content{position:absolute;inset:0;padding:28px 36px;display:flex;flex-direction:column;justify-content:center;}
        .fr-hero-tag{display:inline-flex;align-items:center;background:var(--or);color:#fff;font-size:.68rem;font-weight:700;padding:4px 10px;border-radius:20px;text-transform:uppercase;letter-spacing:.06em;width:fit-content;margin-bottom:10px;}
        .fr-hero-title{font-family:'Syne',sans-serif;font-size:2rem;font-weight:800;color:#fff;line-height:1.1;margin-bottom:6px;}
        .fr-hero-desc{font-size:.85rem;color:rgba(255,255,255,.6);max-width:340px;}
        .fr-hero-price{margin-top:10px;font-family:'Syne',sans-serif;font-size:1.5rem;font-weight:700;color:var(--or);}
        .fr-hero-cta{margin-top:12px;display:flex;gap:8px;}
        .fr-btn-primary{padding:9px 18px;border-radius:10px;background:var(--or);color:#fff;font-weight:700;font-size:.82rem;cursor:pointer;border:none;transition:background .2s;font-family:'Cabinet Grotesk',sans-serif;}
        .fr-btn-primary:hover{background:#ea6c0a;}
        .fr-btn-ghost{padding:9px 18px;border-radius:10px;background:rgba(255,255,255,.1);color:#fff;border:1px solid rgba(255,255,255,.2);font-weight:700;font-size:.82rem;cursor:pointer;text-decoration:none;display:inline-flex;align-items:center;font-family:'Cabinet Grotesk',sans-serif;}
        .fr-hero-prev,.fr-hero-next{position:absolute;top:50%;transform:translateY(-50%);width:36px;height:36px;border-radius:50%;background:rgba(15,15,15,.8);border:1px solid var(--bdr2);display:flex;align-items:center;justify-content:center;cursor:pointer;color:var(--txt);z-index:10;transition:all .2s;font-size:18px;}
        .fr-hero-prev{left:14px;} .fr-hero-next{right:14px;}
        .fr-hero-prev:hover,.fr-hero-next:hover{background:var(--or);border-color:var(--or);}
        .fr-hero-dots{position:absolute;bottom:12px;left:50%;transform:translateX(-50%);display:flex;gap:6px;}
        .fr-hero-dot{width:6px;height:6px;border-radius:50%;background:rgba(255,255,255,.25);cursor:pointer;transition:all .3s;}
        .fr-hero-dot.on{background:var(--or);width:20px;border-radius:3px;}

        /* layout: sidebar + content */
        .fr-layout{display:grid;grid-template-columns:272px 1fr;gap:24px;align-items:start;}
        @media(max-width:980px){.fr-layout{grid-template-columns:1fr;}}
        .fr-sidebar{display:block;}
        @media(max-width:980px){.fr-sidebar{display:none;}}

        /* search + toolbar */
        .fr-toolbar{display:flex;align-items:center;gap:10px;margin-bottom:18px;flex-wrap:wrap;}
        .fr-search-wrap{position:relative;flex:1;min-width:200px;}
        .fr-search-icon{position:absolute;left:13px;top:50%;transform:translateY(-50%);color:var(--txt3);font-size:16px;pointer-events:none;display:flex;align-items:center;}
        .fr-search-inp{width:100%;background:var(--bg3);border:1px solid var(--bdr);border-radius:12px;padding:11px 38px 11px 38px;color:var(--txt);font-family:'Cabinet Grotesk',sans-serif;font-size:.88rem;outline:none;transition:border-color .2s;}
        .fr-search-inp:focus{border-color:var(--or3);}
        .fr-search-inp::placeholder{color:var(--txt3);}
        .fr-search-clear{position:absolute;right:10px;top:50%;transform:translateY(-50%);width:22px;height:22px;border-radius:50%;background:var(--bg4);border:none;color:var(--txt2);font-size:12px;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all .2s;}
        .fr-search-clear:hover{background:var(--rd2);color:var(--red);}

        .fr-filter-btn{position:relative;display:flex;align-items:center;gap:8px;padding:11px 16px;border-radius:12px;background:var(--bg3);border:1px solid var(--bdr);color:var(--txt);font-family:'Cabinet Grotesk',sans-serif;font-size:.85rem;font-weight:600;cursor:pointer;transition:all .2s;white-space:nowrap;}
        .fr-filter-btn:hover{border-color:var(--or3);}
        .fr-filter-btn.has-active{border-color:var(--or3);background:var(--or2);color:var(--or);}
        @media(min-width:981px){.fr-filter-btn{display:none;}}

        .fr-filter-count{background:var(--or);color:#fff;font-size:.65rem;font-weight:800;border-radius:20px;min-width:18px;height:18px;display:flex;align-items:center;justify-content:center;padding:0 4px;}

        .fr-view-toggle{display:flex;gap:4px;flex-shrink:0;}
        .fr-vt-btn{width:38px;height:38px;border-radius:10px;background:var(--bg3);border:1px solid var(--bdr);display:flex;align-items:center;justify-content:center;cursor:pointer;color:var(--txt3);font-size:15px;transition:all .2s;}
        .fr-vt-btn:hover{border-color:var(--bdr2);color:var(--txt2);}
        .fr-vt-btn.active{background:var(--or2);border-color:var(--or3);color:var(--or);}

        /* active filter chips */
        .fr-active-chips{display:flex;flex-wrap:wrap;align-items:center;gap:6px;margin-bottom:14px;}
        .fr-active-chip{display:flex;align-items:center;gap:6px;background:var(--or2);border:1px solid var(--or3);color:var(--or);font-size:.74rem;font-weight:600;padding:5px 6px 5px 12px;border-radius:20px;}
        .fr-active-chip button{background:rgba(249,115,22,.25);border:none;color:var(--or);width:18px;height:18px;border-radius:50%;cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:11px;line-height:1;transition:background .2s;}
        .fr-active-chip button:hover{background:rgba(249,115,22,.4);}
        .fr-clear-all{font-size:.74rem;font-weight:600;color:var(--txt2);text-decoration:underline;cursor:pointer;background:none;border:none;padding:5px 4px;}
        .fr-clear-all:hover{color:var(--txt);}

        /* results bar */
        .fr-results-bar{display:flex;align-items:center;justify-content:space-between;margin-bottom:16px;}
        .fr-results-count{font-size:.78rem;color:var(--txt3);}
        .fr-results-count span{color:var(--or);font-weight:600;}

        /* ─── Filter Panel ─── */
        .fr-fp{background:var(--bg2);border:1px solid var(--bdr);border-radius:18px;padding:18px;position:sticky;top:20px;}
        .fr-fp-head{display:flex;align-items:center;justify-content:space-between;margin-bottom:16px;}
        .fr-fp-title{font-family:'Syne',sans-serif;font-size:1.1rem;font-weight:800;}
        .fr-fp-clear{font-size:.72rem;font-weight:600;color:var(--or);background:var(--or2);border:1px solid var(--or3);cursor:pointer;padding:4px 10px;border-radius:999px;transition:all .2s;}
        .fr-fp-clear:hover{background:rgba(249,115,22,.22);}
        .fr-fp-section{margin-bottom:20px;padding-bottom:20px;border-bottom:1px solid var(--bdr);}
        .fr-fp-section:last-child{border-bottom:none;margin-bottom:0;padding-bottom:0;}
        .fr-fp-label{font-size:.7rem;font-weight:700;color:var(--txt2);text-transform:uppercase;letter-spacing:.1em;margin-bottom:10px;}
        .fr-fp-tags{display:flex;flex-wrap:wrap;gap:6px;}
        .fr-tag{padding:7px 13px;border-radius:9px;border:1px solid var(--bdr);background:var(--bg3);color:var(--txt2);font-size:.78rem;font-weight:500;cursor:pointer;white-space:nowrap;transition:all .2s;font-family:'Cabinet Grotesk',sans-serif;}
        .fr-tag:hover{border-color:var(--bdr2);}
        .fr-tag.active{background:var(--or2);border-color:var(--or3);color:var(--or);}

        .fr-sort-grid{display:flex;flex-direction:column;gap:6px;}
        .fr-sort-chip{display:flex;align-items:center;justify-content:space-between;text-align:left;padding:9px 12px;border-radius:9px;border:1px solid var(--bdr);background:var(--bg3);color:var(--txt2);font-size:.8rem;font-weight:500;cursor:pointer;transition:all .2s;font-family:'Cabinet Grotesk',sans-serif;}
        .fr-sort-chip.active{background:var(--or2);border-color:var(--or3);color:var(--or);font-weight:700;}

        /* price range slider */
        .fr-price-range{position:relative;padding-top:6px;}
        .fr-pr-track{position:relative;height:4px;background:orange;border-radius:2px;margin:14px 2px;}
        .fr-pr-fill{position:absolute;top:0;bottom:0;background:white;border-radius:2px;}
        .fr-pr-input{position:absolute;top:8px;left:0;width:100%;height:4px;-webkit-appearance:none;appearance:none;background:transparent;pointer-events:none;margin:0;}
        /* THUMB FIX */
.fr-pr-input::-webkit-slider-thumb{
  -webkit-appearance:none;
  width:18px;
  height:18px;
  border-radius:50%;
  background:#f97316;   /* solid orange dot */
  border:2px solid #fff; /* white outline for visibility */
  cursor:pointer;
  pointer-events:auto;
}

.fr-pr-input::-moz-range-thumb{
  width:18px;
  height:18px;
  border-radius:50%;
  background:#f97316;
  border:2px solid #fff;
  cursor:pointer;
}
        .fr-pr-labels{display:flex;justify-content:space-between;font-size:.78rem;font-weight:700;color:orange;margin-top:8px;}

        /* rating chips */
        .fr-rating-row{display:flex;flex-wrap:wrap;gap:6px;}
        .fr-rating-chip{padding:7px 13px;border-radius:9px;border:1px solid var(--bdr);background:var(--bg3);color:var(--txt2);font-size:.78rem;font-weight:600;cursor:pointer;transition:all .2s;font-family:'Cabinet Grotesk',sans-serif;display:flex;align-items:center;gap:2px;}
        .fr-rating-chip.active{background:var(--or2);border-color:var(--or3);color:var(--or);}
        .fr-rc-star{color:var(--amber);}
        .fr-rating-chip.active .fr-rc-star{color:var(--or);}
/* =========================
   FILTER PANEL
========================= */

.fr-fp{
  color:#fff;
}

.fr-fp-head {
  display: flex;
  justify-content: flex-end; /* pushes content to right */
  align-items: center;
}

.fr-fp-title{
  font-size:1.2rem;
  font-weight:700;
  color:#fff;
}

.fr-fp-clear{
  border:none;
  background:none;
  color:#f97316;
  cursor:pointer;
  font-size:.85rem;
  font-weight:600;
}

.fr-fp-section{
  margin-bottom:24px;
}

.fr-fp-label{
  color:#fff;
  font-weight:600;
  margin-bottom:12px;
  font-size:.95rem;
}

/* =========================
   SORT CHIPS
========================= */

.fr-sort-grid{
  display:flex;
  flex-direction:column;
  gap:10px;
}

.fr-sort-chip{
  width:100%;
  display:flex;
  justify-content:space-between;
  align-items:center;

  padding:12px 14px;

  border-radius:14px;
  border:1px solid rgba(255,255,255,.08);

  background:#171717;
  color:rgba(255,255,255,.8);

  transition:.25s;
  cursor:pointer;
}

.fr-sort-chip:hover{
  border-color:rgba(249,115,22,.35);
  background:rgba(249,115,22,.08);
}

.fr-sort-chip.active{
  background:linear-gradient(
    135deg,
    rgba(249,115,22,.18),
    rgba(249,115,22,.08)
  );

  border-color:#f97316;
  color:#fff;
}

/* =========================
   CATEGORY TAGS
========================= */

.fr-fp-tags{
  display:flex;
  flex-wrap:wrap;
  gap:10px;
}

.fr-tag{
  border:none;
  border-radius:999px;

  padding:10px 16px;

  background:#171717;
  color:rgba(255,255,255,.75);

  cursor:pointer;
  transition:.25s;
}

.fr-tag:hover{
  background:#222;
}

.fr-tag.active{
  background:#f97316;
  color:white;
  box-shadow:0 8px 25px rgba(249,115,22,.35);
}

/* =========================
   RATING CHIPS
========================= */

.fr-rating-row{
  display:flex;
  flex-wrap:wrap;
  gap:10px;
}

.fr-rating-chip{
  border:none;
  border-radius:999px;

  padding:10px 14px;

  background:#171717;
  color:rgba(255,255,255,.75);

  cursor:pointer;
  transition:.25s;
}

.fr-rating-chip:hover{
  background:#222;
}

.fr-rating-chip.active{
  background:#f97316;
  color:white;
  box-shadow:0 8px 25px rgba(249,115,22,.35);
}

.fr-rc-star{
  margin-left:4px;
  color:#FFD54F;
}

/* =========================
   PRICE RANGE WRAPPER
========================= */

.fr-price-wrap{
  padding:16px;
  border-radius:16px;

  background:#171717;
  border:1px solid rgba(255,255,255,.06);
}

/* Slider orange theme */

input[type="range"]{
  accent-color:#f97316;
}

/* =========================
   DRAWER BODY
========================= */

.fr-drawer-body{
  background:#0f0f0f;
}

.fr-drawer-head{
  background:
    linear-gradient(
      90deg,
      rgba(249,115,22,.15),
      transparent
    );
}
        /* =========================
           OVERLAY + DRAWER
        ========================= */
        .fr-drawer-overlay{position:fixed;inset:0;background:rgba(0,0,0,.65);backdrop-filter:blur(12px);z-index:200;opacity:0;pointer-events:none;transition:.3s ease;}
        .fr-drawer-overlay.open{opacity:1;pointer-events:auto;}

        .fr-drawer{
          position:fixed;top:0;right:0;bottom:0;
          width:min(420px,92vw);
          background:radial-gradient(circle at top,rgba(249,115,22,.18),transparent 40%),linear-gradient(180deg,#0b0b0b 0%,#0f0f0f 40%,#0a0a0a 100%);
          border-left:1px solid rgba(255,255,255,.08);
          box-shadow:-25px 0 70px rgba(0,0,0,.7);
          z-index:201;
          transform:translateX(100%);
          transition:transform .35s cubic-bezier(.4,0,.2,1);
          display:flex;flex-direction:column;overflow:hidden;
        }
        .fr-drawer.open{transform:translateX(0);}

        .fr-drawer-head{
          display:flex;align-items:center;justify-content:space-between;
          padding:18px 20px;border-bottom:1px solid rgba(255,255,255,.06);
          background:linear-gradient(90deg,rgba(249,115,22,.12),transparent);
          backdrop-filter:blur(18px);
        }
        .fr-drawer-title{font-family:'Syne',sans-serif;font-size:1.2rem;font-weight:800;color:var(--txt);letter-spacing:-.02em;display:flex;align-items:center;gap:10px;}

        .fr-drawer-close{width:38px;height:38px;border-radius:12px;border:1px solid rgba(255,255,255,.08);background:rgba(255,255,255,.04);color:var(--txt);cursor:pointer;display:flex;align-items:center;justify-content:center;transition:.25s;}
        .fr-drawer-close:hover{background:rgba(249,115,22,.15);color:var(--or);transform:rotate(90deg);}

        .fr-drawer-body{flex:1;overflow-y:auto;padding:18px;}
        .fr-drawer .fr-fp{position:static;background:transparent;border:none;padding:0;}

        .fr-drawer-apply{padding:16px;border-top:1px solid rgba(255,255,255,.08);background:linear-gradient(180deg,transparent,rgba(249,115,22,.08));}
        .fr-drawer-apply-btn{width:100%;height:50px;border:none;border-radius:14px;background:linear-gradient(135deg,#f97316,#fb923c);color:#fff;font-size:.95rem;font-weight:700;cursor:pointer;box-shadow:0 12px 30px rgba(249,115,22,.35);transition:.25s;}
        .fr-drawer-apply-btn:hover{transform:translateY(-2px);box-shadow:0 16px 40px rgba(249,115,22,.45);}
        .fr-drawer-apply-btn:active{transform:scale(.98);}

        @media (min-width:981px){
          .fr-drawer,.fr-drawer-overlay{display:none;}
        }

        /* grid */
        .fr-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:16px;}
        .fr-grid.list{grid-template-columns:1fr;}
        .fr-grid.list .fr-card{display:flex;flex-direction:row;}
        .fr-grid.list .fr-card-media{width:180px;flex-shrink:0;height:auto;}
        .fr-grid.list .fr-card-img-wrap,.fr-grid.list .fr-card-img-placeholder{height:100%;min-height:150px;}
        .fr-grid.list .fr-card-body{flex:1;}

        /* card */
        .fr-card{background:var(--bg2);border:1px solid var(--bdr);border-radius:18px;overflow:hidden;transition:transform .25s,box-shadow .25s,border-color .25s;}
        .fr-card:hover{transform:translateY(-5px);box-shadow:0 20px 50px rgba(0,0,0,.5);border-color:var(--bdr2);}

        .fr-card-media{position:relative;}
        .fr-card-overlay{position:absolute;inset:0;background:linear-gradient(180deg,rgba(0,0,0,0) 50%,rgba(0,0,0,.45) 100%);pointer-events:none;opacity:0;transition:opacity .25s;}
        .fr-card:hover .fr-card-overlay{opacity:1;}

        .fr-card-img-wrap{position:relative;height:180px;overflow:hidden;background:var(--bg3);}
        .fr-card-imgs{display:flex;height:100%;transition:transform .4s cubic-bezier(.4,0,.2,1);}
        .fr-card-img{min-width:100%;height:100%;object-fit:cover;opacity:.9;transition:transform .4s ease;}
        .fr-card:hover .fr-card-img{transform:scale(1.04);}
        .fr-card-img-placeholder{height:180px;background:var(--bg3);display:flex;align-items:center;justify-content:center;font-size:56px;}
        .fr-card-dots{position:absolute;bottom:8px;left:50%;transform:translateX(-50%);display:flex;gap:4px;z-index:2;}
        .fr-card-dot{width:4px;height:4px;border-radius:50%;background:rgba(255,255,255,.3);transition:all .2s;}
        .fr-card-dot.on{background:#fff;width:12px;border-radius:2px;}
        .fr-card-nav{position:absolute;top:50%;transform:translateY(-50%);width:26px;height:26px;border-radius:50%;background:rgba(0,0,0,.65);border:none;color:#fff;display:flex;align-items:center;justify-content:center;cursor:pointer;font-size:14px;opacity:0;transition:opacity .2s;z-index:3;}
        .fr-card-media:hover .fr-card-nav{opacity:1;}
        .fr-card-prev{left:8px;} .fr-card-next{right:8px;}

        .fr-card-badges{position:absolute;top:10px;left:10px;display:flex;gap:4px;flex-wrap:wrap;z-index:2;max-width:calc(100% - 90px);}
        .fr-badge{font-size:.6rem;font-weight:700;padding:3px 8px;border-radius:20px;letter-spacing:.04em;text-transform:uppercase;}
        .fr-badge-cat{background:rgba(0,0,0,.65);color:#fff;border:1px solid rgba(255,255,255,.15);}
        .fr-badge-new{background:var(--or);color:#fff;}
        .fr-badge-hot{background:var(--red);color:#fff;}
        .fr-badge-stock{background:var(--gr2);border:1px solid var(--gr);color:var(--gr);}

        .fr-card-actions-overlay{position:absolute;top:10px;right:10px;display:flex;flex-direction:column;gap:6px;z-index:3;}
        .fr-icon-btn{width:32px;height:32px;border-radius:50%;background:rgba(0,0,0,.55);border:1px solid rgba(255,255,255,.12);display:flex;align-items:center;justify-content:center;cursor:pointer;transition:all .2s;font-size:14px;color:rgba(255,255,255,.8);backdrop-filter:blur(4px);}
        .fr-icon-btn:hover{transform:scale(1.1);}
       /* Wishlist = Pink */
.fr-icon-btn.wish:hover,
.fr-icon-btn.wish.active{
  background:rgba(236,72,153,.18);
  border-color:#ec4899;
  color:#ec4899;
  box-shadow:0 0 12px rgba(236,72,153,.35);
}

/* Cart hover */
.fr-icon-btn.cart:hover{
  background:rgba(34,197,94,.15);
  border-color:#22c55e;
  color:#22c55e;
}

/* Cart added = Green */
.fr-icon-btn.cart.active{
  background:rgba(34,197,94,.18);
  border-color:#22c55e;
  color:#22c55e;
  box-shadow:0 0 12px rgba(34,197,94,.35);
}

        .fr-card-body{padding:14px;}
        .fr-card-title{display:block;font-family:'Syne',sans-serif;font-size:1rem;font-weight:700;color:var(--txt);margin-bottom:4px;text-decoration:none;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
        .fr-card-title:hover{color:var(--or);}
        .fr-card-desc{font-size:.75rem;color:var(--txt2);line-height:1.4;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;min-height:2.1em;}
        .fr-card-meta{display:flex;align-items:center;gap:12px;margin-top:8px;}
        .fr-rating{font-size:.72rem;color:var(--amber);display:flex;align-items:center;font-weight:600;}
        .fr-time{font-size:.72rem;color:var(--txt2);display:flex;align-items:center;}
        .fr-card-footer{display:flex;align-items:center;justify-content:space-between;margin-top:12px;padding-top:12px;border-top:1px solid var(--bdr);}
        .fr-price{font-family:'Syne',sans-serif;font-size:1.2rem;font-weight:800;color:var(--or);}
        .fr-price-old{font-size:.72rem;color:var(--txt3);text-decoration:line-through;margin-left:4px;}
        .fr-view-btn{height:34px;padding:0 14px;border-radius:10px;background:var(--bg4);border:1px solid var(--bdr2);color:var(--txt2);font-family:'Cabinet Grotesk',sans-serif;font-size:.75rem;font-weight:600;cursor:pointer;text-decoration:none;display:flex;align-items:center;transition:all .2s;}
        .fr-view-btn:hover{color:var(--or);border-color:var(--or3);background:var(--or2);}

        /* empty state */
        .fr-empty{text-align:center;padding:60px 20px;background:var(--bg2);border:1px solid var(--bdr);border-radius:18px;}
        .fr-empty-icon{font-size:48px;margin-bottom:12px;}
        .fr-empty-title{font-family:'Syne',sans-serif;font-size:1.3rem;font-weight:800;margin-bottom:6px;}
        .fr-empty-sub{color:var(--txt2);font-size:.85rem;margin-bottom:18px;}
        .fr-empty-btn{padding:10px 20px;border-radius:10px;background:var(--or2);border:1px solid var(--or3);color:var(--or);font-weight:700;font-size:.82rem;cursor:pointer;font-family:'Cabinet Grotesk',sans-serif;transition:all .2s;}
        .fr-empty-btn:hover{background:rgba(249,115,22,.22);}

        /* skeleton */
        .fr-skeleton{background:var(--bg2);border:1px solid var(--bdr);border-radius:18px;overflow:hidden;}
        .fr-skel-img{height:180px;background:linear-gradient(90deg,var(--bg3) 25%,var(--bg4) 50%,var(--bg3) 75%);background-size:200% 100%;animation:frSkelShimmer 1.5s infinite;}
        .fr-skel-body{padding:14px;}
        .fr-skel-line{height:12px;border-radius:4px;background:linear-gradient(90deg,var(--bg3) 25%,var(--bg4) 50%,var(--bg3) 75%);background-size:200% 100%;animation:frSkelShimmer 1.5s infinite;margin-bottom:8px;}
        .fr-skel-w60{width:60%;} .fr-skel-w80{width:80%;}
        @keyframes frSkelShimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}
      `}</style>

      <div className="fr-root mt-3">
        <div className="fr-wrap">

          {/* Page Header */}
          <div className="fr-ph">
            <div>
              <div className="fr-ph-eyebrow">FeastRun · Explore</div>
              <h1 className="fr-ph-title">Our <span>Menu</span></h1>
              <p className="fr-ph-sub">Fresh, delicious meals delivered hot to your door</p>
            </div>
            <div className="fr-stats">
              <div className="fr-stat"><div className="fr-stat-n">{foods.length}</div><div className="fr-stat-l">Dishes</div></div>
            </div>
          </div>

          {/* Hero Carousel */}
          {featured.length > 0 && <HeroCarousel foods={featured} />}

          {/* Layout: sidebar filters + content */}
          <div className="fr-layout">

            {/* Desktop Sidebar */}
            <aside className="fr-sidebar">
              <FilterPanel
                categories={categories}
                activeCategories={activeCategories}
                toggleCategory={toggleCategory}
                priceBounds={priceBounds}
                priceRange={priceRange}
                setPriceRange={handlePriceChange}
                minRating={minRating}
                setMinRating={setMinRating}
                sort={sort}
                setSort={setSort}
                onClear={clearFilters}
                activeCount={activeFilterCount}
              />
            </aside>

            {/* Main content */}
            <div>
              {/* Toolbar */}
              <div className="fr-toolbar">
                <div className="fr-search-wrap">
                  <span className="fr-search-icon"><FiSearch /></span>
                  <input
                    type="text"
                    className="fr-search-inp"
                    placeholder="Search dishes, cuisines…"
                    value={keyword}
                    onChange={handleSearch}
                    aria-label="Search foods"
                  />
                  {keyword && (
                    <button className="fr-search-clear" onClick={() => { setKeyword(""); fetchFoods(); }} aria-label="Clear search"><FiX /></button>
                  )}
                </div>

                <button
                  className={`fr-filter-btn ${activeFilterCount > 0 ? "has-active" : ""}`}
                  onClick={() => setFilterOpen(true)}
                >
                  <FiSliders /> <span className="text-white" style={{color:"white"}} >Filters</span>
                  {activeFilterCount > 0 && <span className="fr-filter-count">{activeFilterCount}</span>}
                </button>

                <div className="fr-view-toggle">
                  <button
                    className={`fr-vt-btn ${viewMode === "grid" ? "active" : ""}`}
                    onClick={() => setViewMode("grid")}
                    aria-label="Grid view"
                  >
                    <FiGrid />
                  </button>
                  <button
                    className={`fr-vt-btn ${viewMode === "list" ? "active" : ""}`}
                    onClick={() => setViewMode("list")}
                    aria-label="List view"
                  >
                    <FiList />
                  </button>
                </div>
              </div>

              {/* Active filter chips */}
              {activeFilterCount > 0 && (
                <div className="fr-active-chips">
                  {Array.from(activeCategories).map(cat => (
                    <div key={cat} className="fr-active-chip">
                      {cat}
                      <button onClick={() => toggleCategory(cat)} aria-label={`Remove ${cat} filter`}><FiX /></button>
                    </div>
                  ))}
                  {minRating > 0 && (
                    <div className="fr-active-chip">
                      {minRating}★+
                      <button onClick={() => setMinRating(0)} aria-label="Clear rating filter"><FiX /></button>
                    </div>
                  )}
                  {priceTouched && (priceRange[0] !== priceBounds[0] || priceRange[1] !== priceBounds[1]) && (
                    <div className="fr-active-chip">
                      ₹{priceRange[0]} – ₹{priceRange[1]}
                      <button onClick={() => { setPriceRange(priceBounds); setPriceTouched(false); }} aria-label="Clear price filter"><FiX /></button>
                    </div>
                  )}
                  <button className="fr-clear-all" onClick={clearFilters}>Clear all</button>
                </div>
              )}

              {/* Results bar */}
              <div className="fr-results-bar">
                <div className="fr-results-count">
                  Showing <span>{filteredFoods.length}</span> of <span>{foods.length}</span> dishes
                </div>
              </div>

              {/* Food Grid / Skeleton / Empty */}
              {loading ? (
                <SkeletonGrid />
              ) : filteredFoods.length === 0 ? (
                <div className="fr-empty">
                  <div className="fr-empty-icon">🍽️</div>
                  <div className="fr-empty-title">No dishes found</div>
                  <div className="fr-empty-sub">Try adjusting your filters or search term</div>
                  <button className="fr-empty-btn" onClick={clearFilters}>Clear all filters</button>
                </div>
              ) : (
                <div className={`fr-grid ${viewMode === "list" ? "list" : ""}`}>
                  {filteredFoods.map(food => (
                    <FoodCard
                      key={food._id}
                      food={food}
                      onCart={handleAddToCart}
                      onWishlist={handleWishlist}
                      inWishlist={wishlist.has(food._id)}
                      inCart={cart.has(food._id)}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      <div className={`fr-drawer-overlay ${filterOpen ? "open" : ""}`} onClick={() => setFilterOpen(false)} />
      <div className={`fr-drawer ${filterOpen ? "open" : ""}`} role="dialog" aria-modal="true" aria-label="Filter dishes">
        <div className="fr-drawer-head">
          <div className="fr-drawer-title">
            <FiSliders /> Filters
            {activeFilterCount > 0 && <span className="fr-filter-count">{activeFilterCount}</span>}
          </div>
          <button className="fr-drawer-close" onClick={() => setFilterOpen(false)} aria-label="Close filters"><FiX /></button>
        </div>
        <div className="fr-drawer-body">
          <FilterPanel
            categories={categories}
            activeCategories={activeCategories}
            toggleCategory={toggleCategory}
            priceBounds={priceBounds}
            priceRange={priceRange}
            setPriceRange={handlePriceChange}
            minRating={minRating}
            setMinRating={setMinRating}
            sort={sort}
            setSort={setSort}
            onClear={clearFilters}
            activeCount={activeFilterCount}
          />
        </div>
        <div className="fr-drawer-apply">
          <button className="fr-drawer-apply-btn" onClick={() => setFilterOpen(false)}>
            Show {filteredFoods.length} results
          </button>
        </div>
      </div>
    </>
  );
}

