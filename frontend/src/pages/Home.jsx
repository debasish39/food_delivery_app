import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import {
  ArrowRight,
  Clock,
  ShieldCheck,
  Star,
  Truck,
  UtensilsCrossed,
  Sparkles,
  Flame,
} from "lucide-react";

const STATS = [
  { label: "Restaurants", value: "1,200+" },
  { label: "Cities", value: "40+" },
  { label: "Happy customers", value: "500K+" },
  { label: "Avg. delivery", value: "28 min" },
];

const FEATURES = [
  {
    icon: Truck,
    title: "Lightning fast delivery",
    desc: "Hot, fresh meals at your door in 30 minutes or less.",
  },
  {
    icon: ShieldCheck,
    title: "Verified restaurants",
    desc: "Every partner is hygiene-checked and quality assured.",
  },
  {
    icon: Star,
    title: "Top rated dishes",
    desc: "Curated menus from the highest rated kitchens nearby.",
  },
  {
    icon: Clock,
    title: "Live order tracking",
    desc: "Watch your order move from kitchen to doorstep, in real time.",
  },
];

export default function Home() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 80);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="min-h-screen bg-[#0b0a13] text-white overflow-hidden">
      {/* ───────────────────────── AMBIENT BACKGROUND ───────────────────────── */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-[#1a1030] via-[#0b0a13] to-[#160e08]" />
        <div className="absolute -top-32 -left-32 w-[34rem] h-[34rem] bg-orange-500/30 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute top-1/3 -right-40 w-[30rem] h-[30rem] bg-pink-500/25 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-1/4 w-[28rem] h-[28rem] bg-purple-500/25 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/3 w-72 h-72 bg-yellow-400/15 rounded-full blur-[100px]" />

        {/* Grain / grid texture */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
      </div>

      {/* ───────────────────────── HERO ───────────────────────── */}
      <section className="relative max-w-7xl mx-auto px-6 pt-24 pb-28 md:pt-32 md:pb-36">
        <div className="grid lg:grid-cols-2 gap-14 items-center">
          {/* Left column */}
          <div
            className={`transition-all duration-700 ${
              loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
          >
            <span className="inline-flex items-center gap-2 backdrop-blur-xl bg-white/10 border border-white/15 px-4 py-2 rounded-full text-sm font-medium text-white shadow-lg shadow-black/20">
              <UtensilsCrossed className="w-4 h-4 text-orange-300" />
              Fastest food delivery in your city
            </span>

            <h1 className="mt-7 text-5xl sm:text-6xl lg:text-7xl font-black leading-[1.05] tracking-tight">
              Hungry?
              <br />
              <span className="bg-gradient-to-r from-orange-300 via-amber-200 to-yellow-200 bg-clip-text text-transparent">
                We deliver
              </span>
              <br />
              happiness.
            </h1>

            <p className="mt-6 text-lg sm:text-xl text-white/60 max-w-xl leading-relaxed">
              Discover thousands of restaurants, order your favorite meals,
              and get them delivered fresh to your doorstep — in minutes,
              not hours.
            </p>

            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                to="/foods"
                className="group inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-4 rounded-2xl font-bold shadow-xl shadow-orange-900/40 hover:shadow-2xl hover:shadow-orange-700/50 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
              >
                Order now
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </Link>

              <Link
                to="/foods"
                className="inline-flex items-center gap-2 backdrop-blur-xl bg-white/5 border border-white/15 px-8 py-4 rounded-2xl text-white font-semibold hover:bg-white/10 hover:border-white/30 transition-all duration-200 shadow-lg shadow-black/10"
              >
                Explore menu
              </Link>
            </div>

            {/* Stats row — glass panel */}
            <div className="mt-14 backdrop-blur-2xl bg-white/5 border border-white/10 rounded-3xl p-6 shadow-xl shadow-black/20">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                {STATS.map((stat) => (
                  <div key={stat.label}>
                    <p className="text-2xl sm:text-3xl font-extrabold tracking-tight bg-gradient-to-br from-white to-white/60 bg-clip-text text-transparent">
                      {stat.value}
                    </p>
                    <p className="mt-1 text-sm text-white/50">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right column — glass image card */}
          <div
            className={`relative transition-all duration-700 delay-150 ${
              loaded ? "opacity-100 scale-100" : "opacity-0 scale-95"
            }`}
          >
            <div className="relative">
              {/* Glow behind image */}
              <div className="absolute -inset-6 bg-gradient-to-br from-orange-500/30 via-pink-500/20 to-purple-500/30 rounded-[48px] blur-3xl" />

              {/* Glass frame */}
              <div className="relative backdrop-blur-xl bg-white/5 border border-white/15 rounded-[40px] p-3 shadow-2xl shadow-black/40">
                <img
                  src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=80"
                  className="rounded-[32px] w-full object-cover aspect-[4/5] sm:aspect-square lg:aspect-[4/5]"
                  alt="Delicious food spread ready for delivery"
                />
              </div>

              {/* Floating delivery time card */}
              <div className="absolute -left-4 sm:-left-10 bottom-10 backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl shadow-xl shadow-black/30 px-5 py-4 flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-orange-400/20 border border-orange-300/30 flex items-center justify-center flex-shrink-0">
                  <Clock className="w-5 h-5 text-orange-300" />
                </div>
                <div>
                  <p className="text-sm font-bold text-white leading-tight">
                    25–30 min
                  </p>
                  <p className="text-xs text-white/60">Avg delivery time</p>
                </div>
              </div>

              {/* Floating rating card */}
              <div className="absolute -right-4 sm:-right-8 top-10 backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl shadow-xl shadow-black/30 px-5 py-4 flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-yellow-400/20 border border-yellow-300/30 flex items-center justify-center flex-shrink-0">
                  <Star className="w-5 h-5 text-yellow-300 fill-yellow-300" />
                </div>
                <div>
                  <p className="text-sm font-bold text-white leading-tight">
                    4.8/5.0
                  </p>
                  <p className="text-xs text-white/60">12K+ reviews</p>
                </div>
              </div>

              {/* Floating flash deal pill */}
              <div className="absolute left-1/2 -translate-x-1/2 -bottom-6 backdrop-blur-xl bg-gradient-to-r from-orange-500/90 to-red-500/90 border border-white/20 rounded-full shadow-xl shadow-orange-900/40 px-5 py-2.5 flex items-center gap-2">
                <Flame className="w-4 h-4 text-yellow-200" />
                <p className="text-xs font-bold text-white whitespace-nowrap">
                  20% off your first order
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ───────────────────────── FEATURES ───────────────────────── */}
      <section className="relative max-w-7xl mx-auto px-6 py-20">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="inline-flex items-center gap-2 backdrop-blur-xl bg-white/5 border border-white/10 px-4 py-1.5 rounded-full text-orange-300 font-semibold text-sm">
            <Sparkles className="w-4 h-4" />
            Why choose us
          </span>
          <h2 className="mt-4 text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Everything you need, delivered
          </h2>
          <p className="mt-4 text-white/50 text-lg">
            We've reimagined food delivery from the ground up — faster,
            fresher, and more reliable than ever.
          </p>
        </div>

        <Swiper
  modules={[Autoplay, Pagination]}
  spaceBetween={24}
  loop={true}
  grabCursor={true}
  speed={800}
  autoplay={{
    delay: 3000,
    disableOnInteraction: false,
  }}
  pagination={{
    clickable: true,
  }}
  breakpoints={{
    0: {
      slidesPerView: 1,
    },
    640: {
      slidesPerView: 2,
    },
    1024: {
      slidesPerView: 4,
    },
  }}
  className="feature-swiper pb-12"
>
  {FEATURES.map((feature) => {
    const Icon = feature.icon;

    return (
      <SwiperSlide key={feature.title}>
        <div className="group h-full backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 shadow-lg shadow-black/20 hover:bg-white/10 hover:border-white/20  transition-all duration-200">
          <div className="w-12 h-12 rounded-xl bg-orange-400/15 border border-orange-300/20 flex items-center justify-center mb-4 group-hover:bg-orange-400/25 transition-colors">
            <Icon className="w-6 h-6 text-orange-300" />
          </div>

          <h3 className="font-bold text-white text-lg">
            {feature.title}
          </h3>

          <p className="mt-2 text-sm text-white/50 leading-relaxed">
            {feature.desc}
          </p>
        </div>
      </SwiperSlide>
    );
  })}
</Swiper>
      </section>

      {/* ───────────────────────── CTA BANNER ───────────────────────── */}
      <section className="relative max-w-7xl mx-auto px-6 pb-24">
        <div className="relative overflow-hidden rounded-3xl backdrop-blur-2xl bg-white/5 border border-white/10 px-8 sm:px-16 py-14 sm:py-20 text-center shadow-2xl shadow-black/30">
          <div className="absolute inset-0 -z-10">
            <div className="absolute -top-10 -right-10 w-72 h-72 bg-orange-500/30 rounded-full blur-3xl" />
            <div className="absolute -bottom-10 -left-10 w-72 h-72 bg-pink-500/25 rounded-full blur-3xl" />
          </div>

          <div className="relative">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Ready to taste something amazing?
            </h2>
            <p className="mt-4 text-white/60 text-lg max-w-xl mx-auto">
              Browse hundreds of dishes from top-rated restaurants near you
              and get your first order delivered today.
            </p>
            <Link
              to="/foods"
              className="mt-8 inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-4 rounded-2xl font-bold shadow-lg shadow-orange-900/40 hover:shadow-orange-700/50 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
            >
              Get started
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}