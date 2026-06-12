import { useEffect, useState, useRef, useCallback } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import {
  FiHeart, FiShoppingCart, FiShare2, FiChevronLeft,
  FiChevronRight, FiMaximize2, FiArrowLeft, FiZap,
  FiClock, FiPackage, FiStar, FiCheck, FiThumbsUp,
  FiShield, FiTruck, FiCreditCard, FiX, FiEdit2,
} from "react-icons/fi";
import { getSingleFood } from "../services/foodService";
import { addToCart } from "../services/cartService";
import { addToWishlist } from "../services/wishlistService";
import { likeReview, dislikeReview } from "../services/reviewService";

// ─── Image Carousel ───────────────────────────────────────────────────────────
function ImageCarousel({ images = [], title, liked, onLike, onOpen }) {
  const [idx, setIdx] = useState(0);
  const timerRef = useRef(null);

  const goTo = useCallback((n) => setIdx((n + images.length) % images.length), [images.length]);

  useEffect(() => {
    timerRef.current = setInterval(() => goTo(idx + 1), 3800);
    return () => clearInterval(timerRef.current);
  }, [idx, goTo]);

  if (!images.length) return (
    <div className="sf-img-main" style={{ display: "flex", alignItems: "center", justifyContent: "center", fontSize: "80px" }}>🍽️</div>
  );

  return (
    <div className="sf-img-panel">
      <div className="sf-img-main">
        <img
          src={images[idx]}
          alt={title}
          className="sf-img"
          onClick={() => onOpen?.(images[idx])}
          style={{ cursor: "pointer" }}
        />

        {/* Overlay badges */}
        <div className="sf-img-tl">
          <span className="sf-badge sf-badge-hot">🔥 Hot</span>
          <span className="sf-badge sf-badge-cat">Chef's Pick</span>
        </div>

        <div className="sf-img-tr">
          <button className={`sf-iab ${liked ? "liked" : ""}`} onClick={(e) => { e.stopPropagation(); onLike?.(); }} aria-label="Like">
            <FiHeart />
          </button>
          <button className="sf-iab" onClick={async (e) => {
            e.stopPropagation();
            try {
              if (navigator.share) await navigator.share({ title, text: `Check out: ${title}`, url: window.location.href });
              else { await navigator.clipboard.writeText(window.location.href); toast.success("Link copied!"); }
            } catch {}
          }} aria-label="Share"><FiShare2 /></button>
          <button className="sf-iab" onClick={(e) => { e.stopPropagation(); onOpen?.(images[idx]); }} aria-label="Fullscreen"><FiMaximize2 /></button>
        </div>

        {images.length > 1 && (
          <>
            <button className="sf-nav-btn sf-nav-prev" onClick={(e) => { e.stopPropagation(); goTo(idx - 1); }} aria-label="Previous"><FiChevronLeft /></button>
            <button className="sf-nav-btn sf-nav-next" onClick={(e) => { e.stopPropagation(); goTo(idx + 1); }} aria-label="Next"><FiChevronRight /></button>
          </>
        )}

        <div className="sf-img-count">{idx + 1} / {images.length}</div>
        <div className="sf-img-prog-bar">
          <div className="sf-img-prog-fill" style={{ width: `${((idx + 1) / images.length) * 100}%` }} />
        </div>
      </div>

      {images.length > 1 && (
        <div className="sf-thumbs">
          {images.map((src, i) => (
            <div key={i} className={`sf-thumb ${i === idx ? "active" : ""}`} onClick={() => goTo(i)}>
              <img src={src} alt={`View ${i + 1}`} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Stars ────────────────────────────────────────────────────────────────────
function Stars({ rating = 4.8, size = 14 }) {
  return (
    <div style={{ display: "flex", gap: "2px", fontSize: size }}>
      {[1, 2, 3, 4, 5].map(n => (
        <span key={n} style={{ color: n <= Math.round(rating) ? "var(--sf-amber)" : "var(--sf-txt3)" }}>★</span>
      ))}
    </div>
  );
}

// ─── Rating Bar ───────────────────────────────────────────────────────────────
function RatingBar({ label, pct, color = "var(--sf-amber)" }) {
  return (
    <div className="sf-rbar-row">
      <span>{label}</span>
      <div className="sf-rbar-track">
        <div className="sf-rbar-fill" style={{ width: `${pct}%`, background: color }} />
      </div>
      <span>{pct}%</span>
    </div>
  );
}

// ─── Lightbox ─────────────────────────────────────────────────────────────────
function Lightbox({ src, onClose }) {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    const esc = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", esc);
    return () => { document.body.style.overflow = ""; window.removeEventListener("keydown", esc); };
  }, [onClose]);

  return (
    <div className="sf-lightbox" onClick={onClose} role="dialog" aria-modal="true" aria-label="Image fullscreen">
      <button className="sf-lb-close" onClick={onClose} aria-label="Close"><FiX /></button>
      <img src={src} alt="Full view" onClick={(e) => e.stopPropagation()} />
    </div>
  );
}

// ─── Sticky Mobile Bar ─────────────────────────────────────────────────────────
function StickyBar({ food, qty, setQty, cartAdded, onAddToCart, onBuyNow }) {
  return (
    <div className="sf-sticky-bar">
      <div className="sf-sticky-info">
        <div className="sf-sticky-price">₹{qty * food.price}</div>
        <div className="sf-sticky-title">{food.title}</div>
      </div>
      <div className="sf-sticky-qty">
        <button className="sf-qty-btn" onClick={() => setQty(p => Math.max(1, p - 1))} disabled={qty <= 1} aria-label="Decrease">−</button>
        <div className="sf-qty-val">{qty}</div>
        <button className="sf-qty-btn" onClick={() => setQty(p => p + 1)} aria-label="Increase">+</button>
      </div>
      <button className={`sf-sticky-cart ${cartAdded ? "added" : ""}`} onClick={onAddToCart}>
        {cartAdded ? <FiCheck /> : <FiShoppingCart />}
      </button>
      <button className="sf-sticky-buy" onClick={onBuyNow}>
        <FiZap /> Buy
      </button>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
const TABS = [ "delivery", "ingredients"];

export default function SingleFood() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [food, setFood] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [activeTab, setActiveTab] = useState("delivery");
  const [selectedImage, setSelectedImage] = useState(null);
  const [liked, setLiked] = useState(false);
  const [wishlisted, setWishlisted] = useState(false);
  const [cartAdded, setCartAdded] = useState(false);

  const [reviewReactions, setReviewReactions] = useState({});

  useEffect(() => {
    (async () => {
      try {
        const { data } = await getSingleFood(id);
        setFood(data.food);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    })();
  }, [id]);

  const handleReviewReaction = async (reviewId, type) => {
    try {
      if (type === "like") {
        await likeReview(food._id, reviewId);
      } else {
        await dislikeReview(food._id, reviewId);
      }

      setReviewReactions(prev => {
        const updated = {
          ...prev,
          [reviewId]: type,
        };

        localStorage.setItem(
          "reviewReactions",
          JSON.stringify(updated)
        );

        return updated;
      });

      const { data } = await getSingleFood(food._id);
      setFood(data.food);

    } catch (err) {
      toast.error(
        err.response?.data?.message ||
        "Failed to update reaction"
      );
    }
  };

  useEffect(() => {
    const saved = localStorage.getItem("reviewReactions");

    if (saved) {
      setReviewReactions(JSON.parse(saved));
    }
  }, []);

  const handleAddToCart = async () => {
    try {
      await addToCart(food._id, qty);
      setCartAdded(true);
      toast.success("Added to cart 🛒");
      setTimeout(() => setCartAdded(false), 2200);
    } catch (err) { toast.error(err.response?.data?.message || "Failed to add to cart"); }
  };

  const handleWishlist = async () => {
    try {
      await addToWishlist(food._id);
      setWishlisted(prev => {
        const next = !prev;
        toast.success(next ? "Added to wishlist ♥" : "Removed from wishlist");
        return next;
      });
    } catch (err) { toast.error(err.response?.data?.message || "Failed"); }
  };

  const css = `
    @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500;600&display=swap');
    .sf-root{--sf-bg:#08090c;--sf-bg2:#111318;--sf-bg3:#1a1c23;--sf-bg4:#22252f;--sf-bdr:rgba(255,255,255,.07);--sf-bdr2:rgba(255,255,255,.13);--sf-txt:#f0ede6;--sf-txt2:rgba(240,237,230,.55);--sf-txt3:rgba(240,237,230,.28);--sf-or:#f97316;--sf-or2:rgba(249,115,22,.13);--sf-or3:rgba(249,115,22,.28);--sf-gr:#22c55e;--sf-gr2:rgba(34,197,94,.13);--sf-gr3:rgba(34,197,94,.28);--sf-red:#ef4444;--sf-amber:#f59e0b;--sf-blue:#38bdf8;min-height:100vh;background:var(--sf-bg);font-family:'DM Sans',sans-serif;color:var(--sf-txt);position:relative;}
    .sf-wrap{max-width:1180px;margin:0 auto;padding:24px 16px 60px;}

    /* ambient glow */
    .sf-glow{position:fixed;border-radius:50%;pointer-events:none;z-index:0;filter:blur(80px);opacity:.5;}
    .sf-glow1{width:480px;height:480px;top:-180px;right:-160px;background:radial-gradient(circle,rgba(249,115,22,.16) 0%,transparent 70%);}
    .sf-glow2{width:420px;height:420px;bottom:-140px;left:-140px;background:radial-gradient(circle,rgba(34,197,94,.08) 0%,transparent 70%);}

    .sf-back-bar{display:flex;align-items:center;justify-content:space-between;margin-bottom:24px;position:relative;z-index:1;}
    .sf-back-btn{display:inline-flex;align-items:center;gap:7px;background:var(--sf-bg3);border:1px solid var(--sf-bdr);border-radius:10px;padding:8px 14px;font-size:.82rem;color:var(--sf-txt2);cursor:pointer;transition:all .2s;text-decoration:none;}
    .sf-back-btn:hover{border-color:var(--sf-or3);color:var(--sf-or);transform:translateX(-2px);}
    .sf-breadcrumb{font-size:.72rem;color:var(--sf-txt3);display:flex;align-items:center;gap:5px;}
    .sf-breadcrumb a{color:var(--sf-or);text-decoration:none;}
    .sf-breadcrumb a:hover{text-decoration:underline;}

    .sf-main-grid{display:grid;grid-template-columns:1fr 1fr;gap:32px;position:relative;z-index:1;}
    @media(max-width:768px){.sf-main-grid{grid-template-columns:1fr;gap:22px;}}

    .sf-img-panel{display:flex;flex-direction:column;gap:12px;}
    .sf-img-main{position:relative;height:460px;border-radius:24px;overflow:hidden;background:var(--sf-bg3);border:1px solid var(--sf-bdr);box-shadow:0 24px 60px -20px rgba(0,0,0,.6);}
    @media(max-width:768px){.sf-img-main{height:300px;border-radius:18px;}}
    .sf-img{width:100%;height:100%;object-fit:cover;transition:transform .5s cubic-bezier(.4,0,.2,1);}
    .sf-img-main:hover .sf-img{transform:scale(1.04);}
    .sf-img-tl{position:absolute;top:14px;left:14px;display:flex;gap:6px;flex-wrap:wrap;z-index:2;}
    .sf-img-tr{position:absolute;top:14px;right:14px;display:flex;gap:7px;z-index:2;}
    .sf-badge{font-size:.62rem;font-weight:700;padding:5px 12px;border-radius:20px;text-transform:uppercase;letter-spacing:.06em;backdrop-filter:blur(8px);}
    .sf-badge-cat{background:rgba(0,0,0,.55);color:rgba(255,255,255,.9);border:1px solid rgba(255,255,255,.15);}
    .sf-badge-hot{background:rgba(239,68,68,.85);color:#fff;}
    .sf-badge-new{background:var(--sf-or);color:#fff;}
    .sf-iab{width:36px;height:36px;border-radius:50%;background:rgba(8,9,12,.55);backdrop-filter:blur(8px);border:1px solid rgba(255,255,255,.12);display:flex;align-items:center;justify-content:center;cursor:pointer;transition:all .2s;color:var(--sf-txt2);font-size:15px;}
    .sf-iab:hover{background:rgba(8,9,12,.8);border-color:rgba(255,255,255,.3);transform:scale(1.08);}
    .sf-iab.liked{color:var(--sf-red);border-color:rgba(239,68,68,.35);background:rgba(239,68,68,.12);}
    .sf-nav-btn{position:absolute;top:50%;transform:translateY(-50%);width:38px;height:38px;border-radius:50%;background:rgba(8,9,12,.5);backdrop-filter:blur(8px);border:1px solid rgba(255,255,255,.12);display:flex;align-items:center;justify-content:center;cursor:pointer;color:#fff;font-size:18px;transition:all .2s;z-index:2;opacity:0;}
    .sf-img-main:hover .sf-nav-btn{opacity:1;}
    .sf-nav-btn:hover{background:var(--sf-or);border-color:var(--sf-or);}
    .sf-nav-prev{left:14px;} .sf-nav-next{right:14px;}
    .sf-img-count{position:absolute;bottom:16px;left:50%;transform:translateX(-50%);background:rgba(8,9,12,.6);backdrop-filter:blur(8px);border:1px solid rgba(255,255,255,.12);color:#fff;font-size:.7rem;font-weight:500;padding:4px 12px;border-radius:20px;z-index:2;}
    .sf-img-prog-bar{position:absolute;bottom:0;left:0;right:0;height:3px;background:rgba(255,255,255,.08);z-index:2;}
    .sf-img-prog-fill{height:100%;background:linear-gradient(90deg,var(--sf-or),#fb923c);transition:width .5s ease;border-radius:2px;}
    .sf-thumbs{display:flex;gap:9px;overflow-x:auto;padding-bottom:4px;}
    .sf-thumbs::-webkit-scrollbar{height:3px;}
    .sf-thumbs::-webkit-scrollbar-thumb{background:var(--sf-or3);border-radius:2px;}
    .sf-thumb{width:70px;height:70px;flex-shrink:0;border-radius:12px;overflow:hidden;cursor:pointer;border:2px solid transparent;transition:all .2s;opacity:.5;}
    .sf-thumb.active{border-color:var(--sf-or);opacity:1;transform:scale(1.05);box-shadow:0 4px 16px rgba(249,115,22,.25);}
    .sf-thumb:hover{opacity:.85;}
    .sf-thumb img{width:100%;height:100%;object-fit:cover;}

    .sf-det{display:flex;flex-direction:column;}
    .sf-cat-row{display:flex;align-items:center;gap:8px;margin-bottom:12px;flex-wrap:wrap;}
    .sf-cat-chip{background:var(--sf-or2);border:1px solid var(--sf-or3);color:var(--sf-or);font-size:.72rem;font-weight:700;padding:5px 14px;border-radius:20px;letter-spacing:.02em;}
    .sf-title{font-family:'Syne',sans-serif;font-size:clamp(1.8rem,4.2vw,2.6rem);font-weight:800;color:var(--sf-txt);line-height:1.08;letter-spacing:-.03em;margin-bottom:10px;}
    .sf-desc{font-size:.92rem;color:var(--sf-txt2);line-height:1.7;font-weight:300;}
    .sf-meta-row{display:flex;align-items:center;gap:18px;padding:16px 0;border-top:1px solid var(--sf-bdr);border-bottom:1px solid var(--sf-bdr);margin:18px 0;flex-wrap:wrap;}
    .sf-meta-item{display:flex;align-items:center;gap:6px;font-size:.8rem;color:var(--sf-txt2);font-weight:500;}
    .sf-meta-item svg{flex-shrink:0;}

    .sf-price-block{margin:4px 0 18px;}
    .sf-price-main{font-family:'Syne',sans-serif;font-size:2.4rem;font-weight:800;color:var(--sf-or);letter-spacing:-.02em;}
    .sf-price-old{font-size:.95rem;color:var(--sf-txt3);text-decoration:line-through;margin-left:9px;}
    .sf-price-save{background:var(--sf-gr2);border:1px solid var(--sf-gr3);color:var(--sf-gr);font-size:.7rem;font-weight:700;padding:4px 11px;border-radius:20px;margin-left:9px;}
    .sf-price-sub{font-size:.74rem;color:var(--sf-txt3);margin-top:7px;display:flex;align-items:center;gap:6px;}

    .sf-qty-row{display:flex;align-items:center;gap:18px;margin:6px 0 18px;flex-wrap:wrap;}
    .sf-qty-label{font-size:.72rem;color:var(--sf-txt3);text-transform:uppercase;letter-spacing:.1em;font-weight:600;}
    .sf-qty-ctrl{display:flex;align-items:center;background:var(--sf-bg3);border:1px solid var(--sf-bdr);border-radius:13px;overflow:hidden;}
    .sf-qty-btn{width:42px;height:42px;border:none;background:none;color:var(--sf-txt);font-size:18px;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all .2s;}
    .sf-qty-btn:hover:not(:disabled){background:var(--sf-or2);color:var(--sf-or);}
    .sf-qty-btn:disabled{opacity:.3;cursor:not-allowed;}
    .sf-qty-val{width:46px;text-align:center;font-family:'Syne',sans-serif;font-size:1.05rem;font-weight:800;color:var(--sf-txt);border-left:1px solid var(--sf-bdr);border-right:1px solid var(--sf-bdr);}
    .sf-qty-total{font-size:.85rem;color:var(--sf-txt2);}
    .sf-qty-total span{color:var(--sf-or);font-weight:700;font-family:'Syne',sans-serif;}

    .sf-act-grid{display:grid;grid-template-columns:1fr 1fr;gap:11px;margin-top:6px;}
    .sf-act-btn{display:flex;align-items:center;justify-content:center;gap:8px;padding:15px 16px;border-radius:14px;font-family:'Syne',sans-serif;font-size:.9rem;font-weight:700;cursor:pointer;transition:all .25s cubic-bezier(.4,0,.2,1);border:none;position:relative;overflow:hidden;}
    .sf-act-btn::before{content:'';position:absolute;inset:0;background:linear-gradient(135deg,rgba(255,255,255,.12) 0%,transparent 55%);pointer-events:none;}
    .sf-act-btn:hover:not(:disabled){transform:translateY(-2px);}
    .sf-act-btn:active:not(:disabled){transform:translateY(0) scale(.98);}
    .sf-act-btn.sf-cart{background:linear-gradient(135deg,var(--sf-or),#ea580c);color:#fff;grid-column:span 2;box-shadow:0 8px 24px -8px rgba(249,115,22,.5);}
    .sf-act-btn.sf-cart:hover{box-shadow:0 12px 32px -8px rgba(249,115,22,.65);}
    .sf-act-btn.sf-cart.added{background:linear-gradient(135deg,var(--sf-gr),#16a34a);box-shadow:0 8px 24px -8px rgba(34,197,94,.5);}
    .sf-act-btn.sf-buy{background:var(--sf-bg3);border:1px solid var(--sf-gr3);color:var(--sf-gr);}
    .sf-act-btn.sf-buy:hover{background:var(--sf-gr2);border-color:var(--sf-gr);}
    .sf-act-btn.sf-wish{background:var(--sf-bg3);border:1px solid var(--sf-bdr2);color:var(--sf-txt2);}
    .sf-act-btn.sf-wish:hover{border-color:rgba(239,68,68,.3);color:var(--sf-red);background:rgba(239,68,68,.07);}
    .sf-act-btn.sf-wish.active{border-color:rgba(239,68,68,.35);color:var(--sf-red);background:rgba(239,68,68,.1);}

    .sf-guar{display:flex;background:var(--sf-bg3);border:1px solid var(--sf-bdr);border-radius:16px;overflow:hidden;margin-top:20px;}
    .sf-guar-item{flex:1;display:flex;align-items:center;justify-content:center;gap:7px;padding:13px 9px;font-size:.72rem;color:var(--sf-txt2);border-right:1px solid var(--sf-bdr);font-weight:500;text-align:center;}
    .sf-guar-item:last-child{border-right:none;}
    .sf-guar-item svg{color:var(--sf-or);flex-shrink:0;}
    @media(max-width:480px){.sf-guar{flex-direction:column;}.sf-guar-item{border-right:none;border-bottom:1px solid var(--sf-bdr);justify-content:flex-start;}.sf-guar-item:last-child{border-bottom:none;}}

    .sf-tabs{margin-top:48px;position:relative;z-index:1;}
    .sf-tabs-bar{display:flex;background:var(--sf-bg3);border:1px solid var(--sf-bdr);border-radius:16px;padding:5px;margin-bottom:26px;overflow-x:auto;gap:2px;}
    .sf-tab-btn{padding:11px 22px;border-radius:11px;font-size:.85rem;font-weight:600;color:var(--sf-txt2);cursor:pointer;white-space:nowrap;transition:all .25s;border:none;background:none;flex:1;}
    .sf-tab-btn.active{background:linear-gradient(135deg,var(--sf-or),#ea580c);color:#fff;font-weight:700;box-shadow:0 4px 14px -4px rgba(249,115,22,.5);}

    .sf-nut-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(130px,1fr));gap:12px;}
    .sf-nut-card{background:var(--sf-bg3);border:1px solid var(--sf-bdr);border-radius:14px;padding:18px 14px;text-align:center;transition:all .2s;}
    .sf-nut-card:hover{border-color:var(--sf-or3);transform:translateY(-2px);}
    .sf-nut-val{font-family:'Syne',sans-serif;font-size:1.5rem;font-weight:800;color:var(--sf-or);margin-bottom:4px;}
    .sf-nut-label{font-size:.7rem;color:var(--sf-txt3);text-transform:uppercase;letter-spacing:.08em;font-weight:600;}

    .sf-deliv-cards{display:flex;flex-direction:column;gap:12px;}
    .sf-deliv-card{background:var(--sf-bg3);border:1px solid var(--sf-bdr);border-radius:14px;padding:18px;display:flex;align-items:flex-start;gap:14px;transition:all .2s;}
    .sf-deliv-card:hover{border-color:var(--sf-bdr2);transform:translateX(2px);}
    .sf-deliv-icon{width:42px;height:42px;border-radius:12px;display:flex;align-items:center;justify-content:center;flex-shrink:0;font-size:18px;}
    .sf-deliv-icon.or{background:var(--sf-or2);border:1px solid var(--sf-or3);color:var(--sf-or);}
    .sf-deliv-icon.gr{background:var(--sf-gr2);border:1px solid var(--sf-gr3);color:var(--sf-gr);}
    .sf-deliv-icon.bl{background:rgba(56,189,248,.1);border:1px solid rgba(56,189,248,.22);color:var(--sf-blue);}
    .sf-deliv-title{font-size:.92rem;font-weight:700;color:var(--sf-txt);margin-bottom:4px;}
    .sf-deliv-sub{font-size:.78rem;color:var(--sf-txt2);line-height:1.55;}

    .sf-ingr-chips{display:flex;flex-wrap:wrap;gap:9px;}
    .sf-ingr-chip{background:var(--sf-bg3);border:1px solid var(--sf-bdr);border-radius:11px;padding:10px 16px;font-size:.83rem;color:var(--sf-txt2);font-weight:500;transition:all .2s;}
    .sf-ingr-chip:hover{border-color:var(--sf-or3);color:var(--sf-txt);}
    .sf-chef-note{margin-top:16px;background:linear-gradient(135deg,var(--sf-bg3),var(--sf-bg2));border:1px solid var(--sf-bdr);border-radius:14px;padding:18px;font-size:.82rem;color:var(--sf-txt2);line-height:1.7;}

    .sf-rev-section{margin-top:52px;position:relative;z-index:1;}
    .sf-rev-header{display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:24px;flex-wrap:wrap;gap:18px;padding-bottom:24px;border-bottom:1px solid var(--sf-bdr);}
    .sf-rev-title{font-family:'Syne',sans-serif;font-size:1.3rem;font-weight:800;margin-bottom:16px;}
    .sf-rating-summary{display:flex;align-items:flex-start;gap:24px;flex-wrap:wrap;}
    .sf-rating-big{font-family:'Syne',sans-serif;font-size:3.2rem;font-weight:800;color:var(--sf-or);line-height:1;}
    .sf-rbar-row{display:flex;align-items:center;gap:8px;font-size:.7rem;color:var(--sf-txt3);margin-bottom:5px;font-weight:600;}
    .sf-rbar-track{width:110px;height:5px;background:var(--sf-bg4);border-radius:3px;overflow:hidden;}
    .sf-rbar-fill{height:100%;border-radius:3px;transition:width .6s ease;}
    .sf-write-rev-btn{display:flex;align-items:center;gap:6px;padding:11px 20px;border-radius:12px;background:var(--sf-or2);border:1px solid var(--sf-or3);color:var(--sf-or);font-size:.85rem;font-weight:700;cursor:pointer;transition:all .2s;}
    .sf-write-rev-btn:hover{background:rgba(249,115,22,.2);transform:translateY(-1px);}

    .sf-rev-cards{display:flex;flex-direction:column;gap:14px;}
    .sf-rev-card{background:var(--sf-bg2);border:1px solid var(--sf-bdr);border-radius:18px;padding:20px;transition:border-color .2s;}
    .sf-rev-card:hover{border-color:var(--sf-bdr2);}
    .sf-rev-top{display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:12px;}
    .sf-rev-user{display:flex;align-items:center;gap:11px;}
    .sf-rev-avatar{width:40px;height:40px;border-radius:50%;object-fit:cover;border:1.5px solid var(--sf-bdr2);}
    .sf-rev-avatar-fb{width:40px;height:40px;border-radius:50%;background:linear-gradient(135deg,var(--sf-or2),rgba(249,115,22,.05));border:1.5px solid var(--sf-or3);display:flex;align-items:center;justify-content:center;font-family:'Syne',sans-serif;font-size:.9rem;font-weight:800;color:var(--sf-or);flex-shrink:0;}
    .sf-rev-name{font-size:.88rem;font-weight:700;color:var(--sf-txt);margin-bottom:2px;}
    .sf-rev-verified{font-size:.66rem;color:var(--sf-gr);display:flex;align-items:center;gap:3px;font-weight:600;}
    .sf-rev-comment{font-size:.85rem;color:var(--sf-txt2);line-height:1.65;margin-bottom:12px;}
    .sf-rev-imgs{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin-bottom:12px;}
    .sf-rev-img{border-radius:10px;overflow:hidden;height:76px;cursor:pointer;border:1px solid var(--sf-bdr);}
    .sf-rev-img img{width:100%;height:100%;object-fit:cover;transition:transform .25s;}
    .sf-rev-img:hover img{transform:scale(1.06);}
    .sf-rev-date{font-size:.68rem;color:var(--sf-txt3);font-weight:500;}
    .sf-rev-foot{display:flex;align-items:center;gap:10px;margin-top:12px;padding-top:12px;border-top:1px solid var(--sf-bdr);}
    .sf-helpful-btn{display:flex;align-items:center;gap:5px;font-size:.76rem;color:var(--sf-txt3);cursor:pointer;transition:color .2s;background:none;border:none;font-weight:600;padding:5px 10px;border-radius:8px;}
    .sf-helpful-btn:hover{color:var(--sf-txt);background:var(--sf-bg3);}

    .sf-lightbox{position:fixed;inset:0;background:rgba(0,0,0,.96);z-index:9999;display:flex;align-items:center;justify-content:center;backdrop-filter:blur(4px);}
    .sf-lightbox img{max-width:90vw;max-height:85vh;object-fit:contain;border-radius:14px;box-shadow:0 24px 60px rgba(0,0,0,.6);}
    .sf-lb-close{position:absolute;top:18px;right:18px;width:40px;height:40px;border-radius:50%;background:rgba(255,255,255,.1);border:1px solid rgba(255,255,255,.2);display:flex;align-items:center;justify-content:center;cursor:pointer;color:#fff;font-size:18px;transition:all .2s;}
    .sf-lb-close:hover{background:rgba(239,68,68,.25);border-color:rgba(239,68,68,.4);}

    .sf-load{display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:60vh;gap:16px;}
    .sf-spinner{width:44px;height:44px;border-radius:50%;border:3px solid var(--sf-bdr);border-top-color:var(--sf-or);animation:sf-spin .8s linear infinite;}
    @keyframes sf-spin{to{transform:rotate(360deg);}}
    .sf-load-txt{font-size:.85rem;color:var(--sf-txt2);font-weight:500;}
    .sf-not-found{text-align:center;padding:100px 20px;color:var(--sf-txt2);}
    .sf-not-found-icon{font-size:64px;margin-bottom:18px;}

    /* sticky mobile bar */
    .sf-sticky-bar{position:fixed;bottom:0;left:0;right:0;z-index:50;display:none;align-items:center;gap:10px;padding:12px 14px;background:rgba(17,19,24,.92);backdrop-filter:blur(16px);border-top:1px solid var(--sf-bdr);box-shadow:0 -8px 32px rgba(0,0,0,.4);}
    @media(max-width:768px){.sf-sticky-bar{display:flex;}.sf-wrap{padding-bottom:90px;}}
    .sf-sticky-info{flex:1;min-width:0;}
    .sf-sticky-price{font-family:'Syne',sans-serif;font-size:1.05rem;font-weight:800;color:var(--sf-or);}
    .sf-sticky-title{font-size:.7rem;color:var(--sf-txt3);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:120px;}
    .sf-sticky-qty{display:flex;align-items:center;background:var(--sf-bg3);border:1px solid var(--sf-bdr);border-radius:10px;overflow:hidden;flex-shrink:0;}
    .sf-sticky-qty .sf-qty-btn{width:34px;height:34px;font-size:15px;}
    .sf-sticky-qty .sf-qty-val{width:32px;font-size:.85rem;}
    .sf-sticky-cart{width:42px;height:42px;border-radius:11px;background:var(--sf-bg3);border:1px solid var(--sf-bdr2);color:var(--sf-or);display:flex;align-items:center;justify-content:center;font-size:17px;flex-shrink:0;transition:all .2s;}
    .sf-sticky-cart.added{background:var(--sf-gr2);border-color:var(--sf-gr3);color:var(--sf-gr);}
    .sf-sticky-buy{display:flex;align-items:center;gap:5px;padding:0 16px;height:42px;border-radius:11px;background:linear-gradient(135deg,var(--sf-or),#ea580c);color:#fff;font-family:'Syne',sans-serif;font-weight:700;font-size:.82rem;flex-shrink:0;border:none;}
  `;

  if (loading) return (
    <>
      <style>{css}</style>
      <div className="sf-root">
        <div className="sf-load">
          <div className="sf-spinner" />
          <div className="sf-load-txt">Loading dish details…</div>
        </div>
      </div>
    </>
  );

  if (!food) return (
    <>
      <style>{css}</style>
      <div className="sf-root">
        <div className="sf-not-found">
          <div className="sf-not-found-icon">🍽️</div>
          <div className="sf-title">Dish not found</div>
          <Link to="/foods" className="sf-back-btn" style={{ marginTop: "16px", display: "inline-flex" }}>
            <FiArrowLeft /> Back to Menu
          </Link>
        </div>
      </div>
    </>
  );

  const images = food.images?.length ? food.images : [food.image].filter(Boolean);
  const currentPrice = food.price;
  const originalPrice = food.originalPrice || Math.round(food.price * 1.27);

  const discountPercent = Math.round(
    ((originalPrice - currentPrice) / originalPrice) * 100
  );

  const savedAmount = originalPrice - currentPrice;

  return (
    <>
      <style>{css}</style>
      <div className="sf-root mt-15">
        <div className="sf-glow sf-glow1" />
        <div className="sf-glow sf-glow2" />

        <div className="sf-wrap">

          {/* Back bar */}
          <div className="sf-back-bar">
            <Link to="/foods" className="sf-back-btn"><FiArrowLeft />Back to Menu</Link>
            <div className="sf-breadcrumb">
              <Link to="/foods">Menu</Link> › <span style={{ color: "var(--sf-or)" }}>{food.title}</span>
            </div>
          </div>

          {/* Main grid */}
          <div className="sf-main-grid">

            {/* Image */}
            <ImageCarousel
              images={images}
              title={food.title}
              liked={liked}
              onLike={() => {
                setLiked(p => !p);
                toast.success(liked ? "Unliked" : "Liked ♥");
              }}
              onOpen={setSelectedImage}
            />

            {/* Details */}
            <div className="sf-det">
              <div>
                <div className="sf-cat-row">
                  <span className="sf-cat-chip">{food.category?.name || "Food"}</span>
                  {food.badge === "new" && <span className="sf-badge sf-badge-new">✨ New</span>}
                  {food.badge === "hot" && <span className="sf-badge sf-badge-hot">🔥 Hot</span>}
                </div>
                <div className="sf-title">{food.title}</div>
                <div className="sf-desc">{food.description}</div>
              </div>

              <div className="sf-meta-row">
                <div className="sf-meta-item" style={{ color: "var(--sf-amber)" }}>
                  <Stars rating={food.rating || 4.8} />
                  <span style={{ color: "var(--sf-amber)" }}>{food.rating || "4.8"}</span>
                  <span style={{ color: "var(--sf-txt3)" }}>({food.totalReviews || 0} reviews)</span>
                </div>
                <div className="sf-meta-item"><FiClock size={14} /><span>25–35 min</span></div>
                <div className="sf-meta-item" style={{ color: food.stock <= 5 ? "var(--sf-red)" : "var(--sf-gr)" }}>
                  <FiPackage size={14} /><span>Stock: {food.stock}</span>
                </div>
              </div>

              <div className="sf-price-block">
                <div style={{ display: "flex", alignItems: "baseline", gap: "6px", flexWrap: "wrap" }}>
                  <span className="sf-price-main">
                    ₹{currentPrice}
                  </span>

                  <span className="sf-price-old">
                    ₹{originalPrice}
                  </span>

                  <span className="sf-price-save">
                    Save {discountPercent}% (₹{savedAmount})
                  </span>
                </div>

                <div className="sf-price-sub">
                  <FiCheck size={12} style={{ color: "var(--sf-gr)" }} />
                  Inclusive of all taxes · Free delivery
                </div>
              </div>

              <div className="sf-qty-row">
                <span className="sf-qty-label">Quantity</span>
                <div className="sf-qty-ctrl">
                  <button className="sf-qty-btn" onClick={() => setQty(p => Math.max(1, p - 1))} disabled={qty <= 1} aria-label="Decrease">−</button>
                  <div className="sf-qty-val">{qty}</div>
                  <button className="sf-qty-btn" onClick={() => setQty(p => p + 1)} aria-label="Increase">+</button>
                </div>
                <span className="sf-qty-total">Total: <span>₹{qty * food.price}</span></span>
              </div>

              <div className="sf-act-grid">
                <button
                  className={`sf-act-btn sf-cart ${cartAdded ? "added" : ""}`}
                  onClick={handleAddToCart}
                >
                  {cartAdded ? <FiCheck /> : <FiShoppingCart />}
                  {cartAdded ? "Added to cart!" : "Add to Cart"}
                </button>
                <button className="sf-act-btn sf-buy" onClick={() => navigate("/checkout", { state: { directBuy: { food, quantity: qty } } })}>
                  <FiZap />Buy Now
                </button>
                <button className={`sf-act-btn sf-wish ${wishlisted ? "active" : ""}`} onClick={handleWishlist}>
                  <FiHeart />Wishlist
                </button>
              </div>

              <div className="sf-guar">
                <div className="sf-guar-item"><FiShield size={15} />Fresh guaranteed</div>
                <div className="sf-guar-item"><FiClock size={15} />On-time delivery</div>
                <div className="sf-guar-item"><FiTruck size={15} />Free returns</div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="sf-tabs">
            <div className="sf-tabs-bar" role="tablist">
              {TABS.map(tab => (
                <button
                  key={tab}
                  className={`sf-tab-btn ${activeTab === tab ? "active" : ""}`}
                  onClick={() => setActiveTab(tab)}
                  role="tab"
                  aria-selected={activeTab === tab}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>

            {activeTab === "nutrition" && (
              <div>
                <div className="sf-nut-grid">
                  {[["620","Calories"],["24g","Protein"],["78g","Carbs"],["18g","Fat"],["4g","Fiber"],["890mg","Sodium"]].map(([v,l]) => (
                    <div key={l} className="sf-nut-card"><div className="sf-nut-val">{v}</div><div className="sf-nut-label">{l}</div></div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "delivery" && (
              <div className="sf-deliv-cards">
                <div className="sf-deliv-card">
                  <div className="sf-deliv-icon or"><FiTruck /></div>
                  <div><div className="sf-deliv-title">Express Delivery</div><div className="sf-deliv-sub">Delivered hot in 25–35 minutes. Available 10 AM – 11 PM daily.</div></div>
                </div>
                <div className="sf-deliv-card">
                  <div className="sf-deliv-icon gr"><FiShield /></div>
                  <div><div className="sf-deliv-title">Quality Guaranteed</div><div className="sf-deliv-sub">Not satisfied? We'll refund or replace — no questions asked.</div></div>
                </div>
                <div className="sf-deliv-card">
                  <div className="sf-deliv-icon bl"><FiCreditCard /></div>
                  <div><div className="sf-deliv-title">Secure Payments</div><div className="sf-deliv-sub">256-bit SSL on all transactions. UPI, cards, wallets and COD accepted.</div></div>
                </div>
              </div>
            )}

            {activeTab === "ingredients" && (
              <div>
                <div className="sf-ingr-chips">
                  {["🍅 San Marzano Tomatoes","🧀 Buffalo Mozzarella","🌿 Fresh Basil","🫒 Extra Virgin Olive Oil","🌾 Stone-ground Flour","🧂 Sea Salt","🌸 Dry Yeast"].map(i => (
                    <span key={i} className="sf-ingr-chip">{i}</span>
                  ))}
                </div>
                <div className="sf-chef-note">
                  <strong style={{ color: "var(--sf-txt)", fontWeight: 700 }}>Chef's note:</strong> Our dough is slow-fermented for 48 hours for the perfect airy crust. The sauce is made fresh daily with no added sugar or preservatives.
                </div>
              </div>
            )}
          </div>

          {/* Reviews */}
          <div className="sf-rev-section">
            <div className="sf-rev-header">
              <div className="sf-rating-summary">
                <div>
                  <div className="sf-rating-big">{food.rating?.toFixed?.(1) || "4.8"}</div>
                  <Stars rating={food.rating || 4.8} size={16} />
                  <div style={{ fontSize: ".7rem", color: "var(--sf-txt3)", marginTop: "4px", fontWeight: 600 }}>{food.totalReviews || 0} reviews</div>
                </div>
                <div>
                  {[[5,78],[4,14],[3,5],[2,2],[1,1]].map(([s,p]) => (
                    <RatingBar key={s} label={`${s}★`} pct={p} color={s >= 4 ? "var(--sf-amber)" : s === 3 ? "var(--sf-or)" : "var(--sf-red)"} />
                  ))}
                </div>
              </div>
             
            </div>

            <div className="sf-rev-cards">
              {food.reviews?.length ? food.reviews.map(rev => (
                <div key={rev._id} className="sf-rev-card">
                  <div className="sf-rev-top">
                    <div className="sf-rev-user">
                      {rev.user?.profileImage
                        ? <img src={rev.user.profileImage} alt={rev.user.fullname} className="sf-rev-avatar" />
                        : <div className="sf-rev-avatar-fb">{rev.user?.fullname?.charAt(0) || "U"}</div>
                      }
                      <div>
                        <div className="sf-rev-name">{rev.user?.fullname || "Anonymous"}</div>
                        <div className="sf-rev-verified"><FiCheck size={10} />Verified purchase</div>
                      </div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "4px", justifyContent: "flex-end" }}>
                        <FiStar size={13} style={{ color: "var(--sf-amber)" }} />
                        <span style={{ fontFamily: "'Syne',sans-serif", fontSize: ".84rem", fontWeight: 800, color: "var(--sf-amber)" }}>{rev.rating}/5</span>
                      </div>
                      <div className="sf-rev-date">{new Date(rev.createdAt).toLocaleDateString()}</div>
                    </div>
                  </div>
                  <p className="sf-rev-comment">{rev.comment}</p>
                  {rev.images?.length > 0 && (
                    <div className="sf-rev-imgs">
                      {rev.images.map((img, i) => (
                        <div key={i} className="sf-rev-img" onClick={() => setSelectedImage(img)}>
                          <img src={img} alt={`Review image ${i + 1}`} />
                        </div>
                      ))}
                    </div>
                  )}
                  <div className="sf-rev-foot">
                    <button
                      className="sf-helpful-btn"
                      onClick={() => handleReviewReaction(rev._id, "like")}
                      style={{
                        color:
                          reviewReactions[rev._id] === "like"
                            ? "var(--sf-gr)"
                            : "var(--sf-txt3)"
                      }}
                    >
                      👍 Like ({rev.likes?.length || 0})
                    </button>

                    <button
                      className="sf-helpful-btn"
                      onClick={() => handleReviewReaction(rev._id, "dislike")}
                      style={{
                        color:
                          reviewReactions[rev._id] === "dislike"
                            ? "var(--sf-red)"
                            : "var(--sf-txt3)"
                      }}
                    >
                      👎 Dislike ({rev.dislikes?.length || 0})
                    </button>
                  </div>
                </div>
              )) : (
                <div style={{ textAlign: "center", padding: "48px 20px", color: "var(--sf-txt3)", background: "var(--sf-bg2)", border: "1px solid var(--sf-bdr)", borderRadius: "18px" }}>
                  <div style={{ fontSize: "32px", marginBottom: "10px" }}>💬</div>
                  No reviews yet — be the first to share your thoughts!
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Sticky mobile action bar */}
      <StickyBar
        food={food}
        qty={qty}
        setQty={setQty}
        cartAdded={cartAdded}
        onAddToCart={handleAddToCart}
        onBuyNow={() => navigate("/checkout", { state: { directBuy: { food, quantity: qty } } })}
      />

      {/* Lightbox */}
      {selectedImage && <Lightbox src={selectedImage} onClose={() => setSelectedImage(null)} />}
    </>
  );
}