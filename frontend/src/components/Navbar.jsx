import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import useAuth from "../hooks/useAuth";
import Location from "../pages/Location";
import { searchFoods } from "../services/foodService";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [savedLocation, setSavedLocation] = useState({});
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [navHidden, setNavHidden] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const lastScrollYRef = useRef(0);
  const scrollRef = useRef(null);
const [showSearch, setShowSearch] = useState(false);
const [searchTerm, setSearchTerm] = useState("");
const [searchResults, setSearchResults] = useState([]);
const [searchLoading, setSearchLoading] = useState(false);
const [recentSearches, setRecentSearches] = useState([]);

const [listening, setListening] = useState(false);
  const navItems = [
    { to: "/", icon: "ti-home", label: "Home" },
    { to: "/foods", icon: "ti-tools-kitchen-2", label: "Menu" },
    { to: "/wishlist", icon: "ti-heart", label: "Wishlist" },
    { to: "/profile", icon: "ti-user", label: "Profile" },
  ];
useEffect(() => {
  const stored = JSON.parse(localStorage.getItem("recentSearches") || "[]");
  setRecentSearches(stored);
}, []);

const saveRecentSearch = (term) => {
  if (!term.trim()) return;

  let updated = [
    term,
    ...recentSearches.filter((t) => t !== term),
  ].slice(0, 6); // keep last 6

  setRecentSearches(updated);
  localStorage.setItem("recentSearches", JSON.stringify(updated));
};

const removeRecent = (term) => {
  const updated = recentSearches.filter((t) => t !== term);
  setRecentSearches(updated);
  localStorage.setItem("recentSearches", JSON.stringify(updated));
};

const clearRecent = () => {
  setRecentSearches([]);
  localStorage.removeItem("recentSearches");
};
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("deliveryLocation") || "{}");
    setSavedLocation(stored);
  }, []);

  useEffect(() => {
    const updateLocation = () => {
      const stored = JSON.parse(localStorage.getItem("deliveryLocation") || "{}");
      setSavedLocation(stored);
    };
    window.addEventListener("locationChanged", updateLocation);
    return () => window.removeEventListener("locationChanged", updateLocation);
  }, []);
useEffect(() => {
  const timer = setTimeout(async () => {
    if (!searchTerm.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      setSearchLoading(true);

      const { data } = await searchFoods(searchTerm);

      console.log("Search Result:", data);

      setSearchResults(data.foods || []);
    } catch (error) {
      console.log(error);
    } finally {
      setSearchLoading(false);
    }
  }, 400);

  return () => clearTimeout(timer);
}, [searchTerm]);
  // Bottom nav hide-on-scroll (attach to main scroll container via window)
useEffect(() => {
  const handleScroll = () => {
    const currentY = window.scrollY;
    const lastY = lastScrollYRef.current;

    // ignore tiny movement (prevents flicker)
    if (Math.abs(currentY - lastY) < 8) return;

    if (currentY > lastY && currentY > 80) {
      setNavHidden(true);   // scroll down → hide
    } else {
      setNavHidden(false);  // scroll up → show
    }

    lastScrollYRef.current = currentY;
  };

  window.addEventListener("scroll", handleScroll, { passive: true });

  return () => window.removeEventListener("scroll", handleScroll);
}, []);
  const handleLogout = () => { logout(); navigate("/login"); };

  const isActive = (path) =>
    path === "/" ? location.pathname === "/" : location.pathname.startsWith(path);
const startVoiceSearch = () => {
  const SpeechRecognition =
    window.SpeechRecognition ||
    window.webkitSpeechRecognition;

  if (!SpeechRecognition) {
    alert("Speech Recognition is not supported in this browser");
    return;
  }

  const recognition = new SpeechRecognition();

  recognition.lang = "en-IN";
  recognition.continuous = false;
  recognition.interimResults = false;

  recognition.start();
  setListening(true);

  recognition.onresult = (event) => {
    const transcript =
      event.results[0][0].transcript;

    console.log("Voice Search:", transcript);

    setSearchTerm(transcript);
  };

  recognition.onerror = (event) => {
    console.log("Speech Error:", event.error);
    setListening(false);
  };

  recognition.onend = () => {
    setListening(false);
  };
};
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500&display=swap');
        @import url('https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@latest/tabler-icons.min.css');

        .fn-root { --bg:#0f0f0f; --bg2:#1a1a1a; --bg3:#242424; --bdr:rgba(255,255,255,.08); --txt:#f0f0f0; --txt2:rgba(255,255,255,.5); --txt3:rgba(255,255,255,.28); --orange:#f97316; --orange2:rgba(249,115,22,.12); --orange3:rgba(249,115,22,.22); --red:#ef4444; }
.fn-topnav {
  transition: transform 0.3s ease;
  transform: translateY(0);
}

/* THIS is what you're missing */
.fn-topnav.hide {
  transform: translateY(-100%);
}
        /* ─── TOP NAV ─── */
        .fn-topnav { background:var(--bg2); border-bottom:1px solid var(--bdr); padding:0px 18px; height:60px; display:flex; align-items:center; justify-content:space-between; position: fixed;
top: 0;
left: 0;
right: 0; z-index:200; font-family:'DM Sans',sans-serif; }
        .fn-brand { font-family:'Syne',sans-serif; font-size:1.3rem; font-weight:800; color:var(--orange); letter-spacing:-.02em; text-decoration:none; }
        .fn-brand span { color:var(--txt); }

        .fn-loc-pill { display:flex; align-items:center; gap:8px; background:var(--bg3); border-radius:12px; padding:6px 10px; cursor:pointer; transition:border-color .2s,background .2s; max-width:190px; }
        .fn-loc-pill:hover { border-color:var(--orange3); background:var(--orange2); }
        .fn-loc-pin { width:28px; height:28px; border-radius:50%; background:var(--orange2); border:1px solid var(--orange3); display:flex; align-items:center; justify-content:center; flex-shrink:0; color:var(--orange); font-size:14px; }
        .fn-loc-text p { font-size:.72rem; font-weight:500; color:var(--txt); line-height:1.1; max-width:110px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
        .fn-loc-text span { font-size:.64rem; color:var(--txt3); }
        .fn-loc-chev { color:var(--txt3); font-size:13px; margin-left:2px; }

        .fn-nav-left { display:flex; align-items:center; gap:10px; }
        .fn-nav-right { display:flex; align-items:center; gap:8px; }

        .fn-icon-btn { width:36px; height:36px; border-radius:8px; background:var(--bg3); border:1px solid var(--bdr); display:flex; align-items:center; justify-content:center; cursor:pointer; position:relative; transition:all .2s; color:var(--txt2); font-size:18px; }
        .fn-icon-btn:hover { border-color:var(--orange3); color:var(--orange); }
        .fn-badge { position:absolute; top:-5px; right:-5px; width:17px; height:17px; border-radius:50%; background:var(--orange); color:#fff; font-size:.58rem; font-weight:700; display:flex; align-items:center; justify-content:center; font-family:'Syne',sans-serif; border:2px solid var(--bg2); }

        /* Desktop menu */
        .fn-desktop-menu { display:none; align-items:center; gap:4px; }
        @media(min-width:768px){ .fn-desktop-menu { display:flex; } }
        .fn-dlink { padding:7px 12px; border-radius:8px; font-size:.85rem; color:var(--txt2); text-decoration:none; transition:all .2s; display:flex; align-items:center; gap:5px; }
        .fn-dlink:hover,.fn-dlink.active { color:var(--orange); background:var(--orange2); }
        .fn-logout-btn { background:rgba(239,68,68,.15); border:1px solid rgba(239,68,68,.25); color:#f87171; padding:7px 14px; border-radius:8px; font-family:'DM Sans',sans-serif; font-size:.85rem; cursor:pointer; transition:all .2s; }
        .fn-logout-btn:hover { background:rgba(239,68,68,.25); }
        .fn-login-btn { background:var(--orange); color:#fff; padding:7px 14px; border-radius:8px; font-size:.85rem; text-decoration:none; font-weight:500; }
        .fn-register-btn { border:1px solid var(--orange3); color:var(--orange); padding:7px 14px; border-radius:8px; font-size:.85rem; text-decoration:none; background:transparent; }

        /* ─── BOTTOM NAV ─── */
        .fn-bottom-nav { display:flex; position:fixed; bottom:0; left:0; right:0; background:var(--bg2); border-top:1px solid var(--bdr); padding:8px 4px 14px; justify-content:space-around; z-index:200; transition:transform .35s cubic-bezier(.4,0,.2,1); font-family:'DM Sans',sans-serif; }
        .fn-bottom-nav.hidden { transform:translateY(100%); }
        @media(min-width:768px){ .fn-bottom-nav { display:none; } }

        .fn-nav-item { display:flex; flex-direction:column; align-items:center; gap:2px; padding:5px 10px; border-radius:8px; cursor:pointer; text-decoration:none; color:var(--txt3); min-width:52px; position:relative; transition:color .2s; }
        .fn-nav-item.active { color:var(--orange); }
        .fn-nav-item i { font-size:22px; }
        .fn-nav-item span { font-size:.6rem; font-weight:500; letter-spacing:.02em; }
        .fn-nav-pip { width:4px; height:4px; border-radius:50%; background:var(--orange); position:absolute; bottom:0; opacity:0; transition:opacity .2s; }
        .fn-nav-item.active .fn-nav-pip { opacity:1; }

        /* ─── LOCATION MODAL ─── */
        .fn-modal-overlay { position:fixed; inset:0; background:rgba(0,0,0,.7); z-index:300; display:flex; align-items:flex-end; opacity:0; pointer-events:none; transition:opacity .3s ease; }
        .fn-modal-overlay.open { opacity:1; pointer-events:all; }
        .fn-modal-sheet { background:var(--bg2); border-radius:24px 24px 0 0; width:100%; max-height:85vh; overflow-y:auto; transform:translateY(100%); transition:transform .35s cubic-bezier(.4,0,.2,1); }
        .fn-modal-overlay.open .fn-modal-sheet { transform:translateY(0); }
        .fn-handle { width:36px; height:4px; border-radius:2px; background:var(--bdr); margin:10px auto 0; }
        .fn-modal-hd { padding:16px; border-bottom:1px solid var(--bdr); position:relative; }
        .fn-modal-title { font-family:'Syne',sans-serif; font-size:1.05rem; font-weight:800; color:var(--txt); margin-bottom:2px; }
        .fn-modal-sub { font-size:.75rem; color:var(--txt2); }
        .fn-modal-close { position:absolute; top:14px; right:14px; width:30px; height:30px; border-radius:50%; background:var(--bg3); border:1px solid var(--bdr); display:flex; align-items:center; justify-content:center; cursor:pointer; color:var(--txt2); transition:all .2s; font-size:16px; }
        .fn-modal-close:hover { color:var(--red); border-color:rgba(239,68,68,.3); }
        .fn-modal-body { padding:16px; }

        .fn-search-bar { display:flex; align-items:center; gap:8px; background:var(--bg3); border:1px solid var(--bdr); border-radius:12px; padding:10px 12px; margin-bottom:16px; transition:border-color .2s; }
        .fn-search-bar:focus-within { border-color:var(--orange3); }
        .fn-search-bar i { font-size:18px; color:var(--txt3); flex-shrink:0; }
        .fn-search-bar input { flex:1; background:none; border:none; outline:none; font-family:'DM Sans',sans-serif; font-size:.88rem; color:var(--txt); }
        .fn-search-bar input::placeholder { color:var(--txt3); }

        .fn-sec-label { font-size:.7rem; font-weight:500; color:var(--txt3); text-transform:uppercase; letter-spacing:.07em; margin-bottom:8px; display:flex; align-items:center; gap:5px; }
        .fn-sec-label i { font-size:13px; }
        .fn-loc-section { margin-bottom:14px; }

        .fn-loc-option { display:flex; align-items:center; gap:12px; padding:11px; border-radius:12px; border:1px solid var(--bdr); margin-bottom:8px; cursor:pointer; transition:all .2s; background:var(--bg3); }
        .fn-loc-option:hover { border-color:var(--orange3); background:var(--orange2); }
        .fn-loc-option.selected { border-color:var(--orange); background:var(--orange2); }
        .fn-loc-iw { width:38px; height:38px; border-radius:8px; display:flex; align-items:center; justify-content:center; flex-shrink:0; font-size:18px; }
        .fn-loc-iw.orange { background:var(--orange2); border:1px solid var(--orange3); color:var(--orange); }
        .fn-loc-iw.blue { background:rgba(56,189,248,.1); border:1px solid rgba(56,189,248,.2); color:#38bdf8; }
        .fn-loc-iw.green { background:rgba(34,197,94,.1); border:1px solid rgba(34,197,94,.2); color:#22c55e; }
        .fn-loc-iw.purple { background:rgba(168,85,247,.1); border:1px solid rgba(168,85,247,.2); color:#a855f7; }
        .fn-loc-opt-text p { font-size:.83rem; font-weight:500; color:var(--txt); margin-bottom:1px; }
        .fn-loc-opt-text span { font-size:.72rem; color:var(--txt2); }
        .fn-loc-check { margin-left:auto; color:var(--orange); flex-shrink:0; display:none; font-size:18px; }
        .fn-loc-option.selected .fn-loc-check { display:block; }

        .fn-detect-btn { width:100%; display:flex; align-items:center; justify-content:center; gap:8px; background:var(--orange); border:none; border-radius:12px; padding:13px; color:#fff; font-family:'Syne',sans-serif; font-size:.88rem; font-weight:700; cursor:pointer; margin-top:4px; transition:opacity .2s; }
        .fn-detect-btn:hover { opacity:.88; }
        .fn-detect-btn i { font-size:18px; }

        .fn-area-grid { display:grid; grid-template-columns:1fr 1fr; gap:8px; }
        .fn-area-chip { background:var(--bg3); border:1px solid var(--bdr); border-radius:8px; padding:10px; display:flex; align-items:center; gap:7px; cursor:pointer; transition:all .2s; }
        .fn-area-chip:hover { border-color:var(--orange3); background:var(--orange2); }
        .fn-area-chip i { font-size:15px; color:var(--txt3); }
        .fn-area-chip span { font-size:.76rem; color:var(--txt2); }
      .fn-loc-pill {
  display: flex;
  align-items: center;
  gap: 10px;
}

.fn-loc-text {
  display: flex;
  flex-direction: column;

  min-width: 0; /* ⭐ CRITICAL for ellipsis in flex */
  flex: 1;
}

.fn-loc-address {
  font-size: 12px;
  color: rgba(255,255,255,0.6);

  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  max-width: 180px; /* adjust based on navbar size */
}
  /* default mobile: show only icon */
.fn-loc-hide-sm {
  display: none;
}

/* show full location on medium+ screens */
@media (min-width: 640px) {
  .fn-loc-hide-sm {
    display: flex;
  }
}
  .fn-search-trigger {
  display: flex;
  align-items: center;
  gap: 10px;

  background: var(--bg3);
  border: 1px solid var(--bdr);
  border-radius: 12px;

  padding: 6px 12px;

  cursor: pointer;

  /* mobile = full width feel */
  width: 200px;
  transition: all 0.2s ease;
}

.fn-search-trigger:hover {
  border-color: var(--orange3);
  background: var(--orange2);
}

.fn-search-trigger i {
  font-size: 18px;
  color: var(--orange);
}

/* fake input look */
.fn-search-trigger input {
  border: none;
  outline: none;
  background: transparent;

  color: var(--txt);
  font-size: 0.9rem;

  width: 100%;
  cursor: pointer;
}

/* 📱 MOBILE: make it full width like modern apps */
@media (max-width: 640px) {
  .fn-search-trigger {
    width: 100%;
    flex: 1;
    margin-left:30px;
    border-radius: 14px;
    padding: 8px 14px;
  }

  .fn-nav-right {
    flex: 1;
  }
}
      `}</style>

      <div className="fn-root">
        {/* ── TOP NAVBAR ── */}
       <nav className={`fn-topnav ${navHidden ? "hide" : ""}`}>
          <div className="fn-nav-left">
            <Link to="/" className="fn-brand hidden sm:block">
  Feast<span>Run</span>
</Link>

           <button
  className="fn-loc-pill"
  onClick={() => setShowLocationModal(true)}
  aria-label="Select delivery location"
>
  <div className="fn-loc-pin">
    <i className="ti ti-map-pin" aria-hidden="true" />
  </div>

  {/* 👇 hide completely on small screens */}
  <div className="fn-loc-text fn-loc-hide-sm">
    <p>{savedLocation.city || "Select Location"}</p>
    <span className="fn-loc-address">
      {savedLocation.address || "Add delivery address"}
    </span>
  </div>

  {/* 👇 also hide chevron on small screens */}
  <i className="ti ti-chevron-down fn-loc-chev fn-loc-hide-sm" />
</button>
          </div>

          {/* Desktop links */}
          <div className="fn-desktop-menu">
            {[{to:"/",label:"Home",icon:"ti-home"},{to:"/foods",label:"Menu",icon:"ti-tools-kitchen-2"},{to:"/cart",label:"Cart",icon:"ti-shopping-cart"},{to:"/wishlist",label:"Wishlist",icon:"ti-heart"}].map(item => (
              <Link key={item.to} to={item.to} className={`fn-dlink ${isActive(item.to) ? "active" : ""}`}>
                <i className={`ti ${item.icon}`} aria-hidden="true" /> {item.label}
              </Link>
            ))}
            {user ? (
              <>
                <Link to="/profile" className={`fn-dlink ${isActive("/profile") ? "active" : ""}`}><i className="ti ti-user" aria-hidden="true" /> Profile</Link>
                <Link to="/orders" className={`fn-dlink ${isActive("/orders") ? "active" : ""}`}><i className="ti ti-receipt" aria-hidden="true" /> Orders</Link>
                <button onClick={handleLogout} className="fn-logout-btn"><i className="ti ti-logout" aria-hidden="true" /> Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" className="fn-login-btn">Login</Link>
                <Link to="/register" className="fn-register-btn">Register</Link>
              </>
            )}
          </div>

          <div className="fn-nav-right">
  <div className="fn-search-trigger" onClick={() => setShowSearch(true)}>
  <i className="ti ti-search" />

  <input
    readOnly
    placeholder="Search for food, restaurants..."
  />
</div>
          <Link to="/cart" className="fn-icon-btn" aria-label="Cart"><i className="ti ti-shopping-cart" aria-hidden="true" /></Link>
          <button className="fn-icon-btn" aria-label="Notifications"><i className="ti ti-bell" aria-hidden="true" /></button>
          </div>
        </nav>

        {/* ── BOTTOM NAV (mobile only, hides on scroll-down) ── */}
        <nav className={`fn-bottom-nav ${navHidden ? "hidden" : ""}`} aria-label="Main navigation">
          {navItems.map(item => (
            <Link
              key={item.to}
              to={item.to}
              className={`fn-nav-item ${isActive(item.to) ? "active" : ""}`}
              aria-current={isActive(item.to) ? "page" : undefined}
            >
              <i className={`ti ${item.icon}`} aria-hidden="true" />
              {item.badge && <div className="fn-badge" aria-label={`${item.badge} items`}>{item.badge}</div>}
              <span>{item.label}</span>
              <div className="fn-nav-pip" aria-hidden="true" />
            </Link>
          ))}
        </nav>
    {/* ================= LOCATION MODAL ================= */}
      {showLocationModal && (
        <div className="fixed inset-0 z-[99999] bg-black/70 flex items-center justify-center p-4">
          <div className="bg-[#0f0f12] border border-white/10 w-full max-w-5xl h-[90vh] rounded-3xl overflow-hidden">

            <div className="flex justify-between items-center p-5 border-b border-white/10">
              <div>
                <h2 className="text-white font-bold text-xl">
                  Select Delivery Location
                </h2>
                <p className="text-white/50 text-sm">
                  Search area, pincode or landmark
                </p>
              </div>

              <button
                onClick={() => setShowLocationModal(false)}
                className="text-3xl text-white"
              >
                ×
              </button>
            </div>

            <div className="h-[calc(90vh-80px)] overflow-y-auto">
              <Location onClose={() => setShowLocationModal(false)} />
            </div>
          </div>
        </div>
      )}
{showSearch && (
  <div className="fixed inset-0 z-[99999] bg-black/70 backdrop-blur-md flex items-start justify-center pt-20 px-4">

    <div className="w-full max-w-2xl bg-[#12141a] border border-white/10 rounded-3xl overflow-hidden shadow-2xl animate-[fadeIn_.2s_ease]">

      {/* Header (sticky feel) */}
      <div className="sticky top-0 z-10 bg-[#12141a]/90 backdrop-blur border-b border-white/10 p-4">
        <div className="flex items-center gap-3 bg-white/5 rounded-2xl px-4 py-3 focus-within:ring-2 focus-within:ring-orange-400 transition">

          <i className="ti ti-search text-orange-400 text-xl" />

          <input
            autoFocus
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search food, restaurants, dishes..."
            className="flex-1 bg-transparent outline-none text-white text-base placeholder:text-white/40"
          />

          <button
            onClick={startVoiceSearch}
            className={`p-2 rounded-lg transition ${
              listening
                ? "text-red-400 animate-pulse bg-red-500/10"
                : "text-orange-400 hover:bg-white/10"
            }`}
          >
            <i className="ti ti-microphone text-xl" />
          </button>

          <button
            onClick={() => {
              setShowSearch(false);
              setSearchTerm("");
              setSearchResults([]);
            }}
            className="p-2 rounded-lg hover:bg-white/10 transition text-white/60 hover:text-white"
          >
            <i className="ti ti-x text-xl" />
          </button>

        </div>
      </div>

      {/* Body */}
      <div className="max-h-[500px] overflow-y-auto">
{/* 🔥 RECENT SEARCHES */}
{!searchLoading && !searchTerm && recentSearches.length > 0 && (
  <div className="p-4">
    <div className="flex items-center justify-between mb-3">
      <h3 className="text-white/60 text-xs uppercase tracking-wider">
        Recent Searches
      </h3>

      <button
        onClick={clearRecent}
        className="text-xs text-orange-400 hover:text-orange-300"
      >
        Clear all
      </button>
    </div>

    <div className="space-y-2">
      {recentSearches.map((item, idx) => (
        <div
          key={idx}
          onClick={() => setSearchTerm(item)}
          className="flex items-center justify-between px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 cursor-pointer group"
        >
          <div className="flex items-center gap-2 text-white/70">
            <i className="ti ti-history text-white/40" />
            <span className="text-sm">{item}</span>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              removeRecent(item);
            }}
            className="opacity-0 group-hover:opacity-100 text-white/40 hover:text-white transition"
          >
            <i className="ti ti-x text-sm" />
          </button>
        </div>
      ))}
    </div>
  </div>
)}
        {/* Loading */}
        {searchLoading && (
          <div className="py-16 flex flex-col items-center justify-center text-white/50">
            <div className="w-6 h-6 border-2 border-orange-400 border-t-transparent rounded-full animate-spin mb-3" />
            Searching delicious food...
          </div>
        )}

        {/* Results */}
        {!searchLoading && searchResults.length > 0 && (
          <div className="divide-y divide-white/5">
            {searchResults.map((food) => (
              <Link
                key={food._id}
                to={`/foods/${food._id}`}
                onClick={() => {
                  saveRecentSearch(food.title);   // ✅ add this
                  setShowSearch(false);
                  setSearchTerm("");
                }}
                className="flex items-center gap-4 p-4 hover:bg-white/5 transition group"
              >

             <div className="w-14 h-14 rounded-xl overflow-hidden">
<Swiper
  modules={[Pagination, Autoplay]}
  spaceBetween={0}
  slidesPerView={1}
  loop={food.images?.length > 1}
  autoplay={{
    delay: 1500,
    disableOnInteraction: false,
  }}
  className="w-14 h-14"
>
  {(food.images?.length ? food.images : ["/placeholder-food.png"]).map(
    (img, idx) => (
      <SwiperSlide key={idx}>
        <img
          src={img}
          alt={food.title}
          className="w-14 h-14 object-cover"
        />
      </SwiperSlide>
    )
  )}
</Swiper>
</div>

                <div className="flex-1 min-w-0">
                  <h3 className="text-white font-medium truncate">
                    {food.title}
                  </h3>

                  <div className="flex items-center justify-between mt-1">
                    <p className="text-orange-400 font-semibold">
                      ₹{food.price}
                    </p>

                    <p className="text-yellow-400 text-sm">
                      ⭐ {food.rating || 0}
                    </p>
                  </div>
                </div>

                <i className="ti ti-chevron-right text-white/20 group-hover:text-white/50 transition" />
              </Link>
            ))}
          </div>
        )}

        {/* Empty state */}
        {!searchLoading && searchTerm && searchResults.length === 0 && (
          <div className="py-16 text-center">
            <div className="text-white/40 text-sm">No results found</div>
            <div className="text-white/20 text-xs mt-1">
              Try searching something else
            </div>
          </div>
        )}

        {/* Initial state */}
        {!searchLoading && !searchTerm && (
          <div className="py-16 text-center text-white/30 text-sm">
            Search for burgers, pizzas, biryani, drinks...
          </div>
        )}

      </div>
    </div>
  </div>
)}
      </div>
    </>
  );
}