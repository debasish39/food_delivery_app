import { useEffect, useState } from "react";
import { getWishlist, removeWishlist } from "../services/wishlistService";
import { FiHeart, FiTrash2, FiEye } from "react-icons/fi";
import { useNavigate, Link } from "react-router-dom";
import {
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
export default function Wishlist() {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [removingId, setRemovingId] = useState(null);
const [imageIndexes, setImageIndexes] = useState({});
  const navigate = useNavigate();
const nextImage = (foodId, totalImages) => {
  setImageIndexes((prev) => ({
    ...prev,
    [foodId]: ((prev[foodId] || 0) + 1) % totalImages,
  }));
};

const prevImage = (foodId, totalImages) => {
  setImageIndexes((prev) => ({
    ...prev,
    [foodId]:
      ((prev[foodId] || 0) - 1 + totalImages) % totalImages,
  }));
};
  const fetchWishlist = async () => {
    try {
      const { data } = await getWishlist();

      console.log("Fetched wishlist data:", data);

      const foods = data?.wishlist?.foods || [];
      console.log("Wishlist foods array:", foods);

      setWishlist(foods);
    } catch (error) {
      console.error("Error fetching wishlist:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (foodId) => {
    console.log("Removing food with id:", foodId);
    setRemovingId(foodId);

    try {
      await removeWishlist(foodId);
      setWishlist((prev) =>
        prev.filter((food) => food._id !== foodId)
      );
    } catch (error) {
      console.error("Error removing from wishlist:", error);
    } finally {
      setRemovingId(null);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);
useEffect(() => {
  const interval = setInterval(() => {
    setImageIndexes((prev) => {
      const updated = { ...prev };

      wishlist.forEach((food) => {
        if (food.images?.length > 1) {
          updated[food._id] =
            ((prev[food._id] || 0) + 1) %
            food.images.length;
        }
      });

      return updated;
    });
  }, 3000);

  return () => clearInterval(interval);
}, [wishlist]);
if (loading) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#0a0b0e] text-gray-400">

      {/* Spinner */}
      <div className="relative w-14 h-14 mb-5">
        {/* outer glow */}
        <div className="absolute inset-0 rounded-full bg-orange-500/10 blur-xl" />

        {/* ring */}
        <div className="absolute inset-0 rounded-full border-4 border-white/5" />

        {/* animated spinner */}
        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-orange-500 animate-spin" />
      </div>

      {/* Text */}
      <h2 className="text-sm font-medium text-white/80 tracking-wide">
        Loading your wishlist
      </h2>

      <p className="text-xs text-gray-500 mt-1">
        Fetching your saved items...
      </p>
    </div>
  );
}

  if (!wishlist.length) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center px-5 bg-[#0a0b0e] text-gray-400">
        <FiHeart className="text-5xl text-red-400 mb-4" />
        <h2 className="text-xl font-semibold text-white">
          Your wishlist is empty
        </h2>
        <p className="mt-2 text-sm">
          Save your favorite foods here ❤️
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0b0e] text-white mt-15">
      <div className="max-w-6xl mx-auto px-5 py-10">

        {/* Header */}
        <div className="flex items-center gap-3 mb-10">
          <FiHeart className="text-orange-400 text-2xl drop-shadow-[0_0_10px_rgba(255,120,0,0.6)]" />
          <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
            My Wishlist
          </h1>
        </div>

        {/* Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-7">

          {wishlist.map((food) => {
            const isRemoving = removingId === food._id;

            return (
              <div
                key={food._id}
                className={`group relative rounded-2xl overflow-hidden transition duration-300
                  bg-gradient-to-b from-[#1a1c22] to-[#111318]
                  border border-white/10
                  hover:border-orange-500/40
                  hover:shadow-[0_0_25px_rgba(255,120,0,0.15)]
                  hover:scale-[1.03]
                  ${isRemoving ? "opacity-40 scale-[0.98]" : ""}`}
              >
                <Link to={`/foods/${food._id}`}>
                {/* Image */}
            <div className="relative h-52 overflow-hidden">

<Swiper
  modules={[Autoplay]}
  autoplay={{
    delay: 2500,
    disableOnInteraction: false,
  }}
  loop={(food.images?.length || 1) > 1}
  className="h-full w-full"
>
  {(food.images?.length ? food.images : ["/placeholder-food.png"]).map(
    (img, idx) => (
      <SwiperSlide key={idx} className="h-full w-full">
        <Link to={`/foods/${food._id}`}>
        <img
          src={img}
          alt={food.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        </Link>
      </SwiperSlide>
    )
  )}
</Swiper>

  {/* Gradient overlay */}
  <div className="absolute inset-0 bg-gradient-to-t from-[#0a0b0e]/70 via-transparent to-transparent pointer-events-none" />
</div>
</Link>

                {/* Content */}
                <div className="p-5 relative z-10">
                  <h2 className="font-semibold text-lg group-hover:text-orange-300 transition">
                    <Link to={`/foods/${food._id}`}>
                    {food.title}
                    </Link>
                  </h2>
                  <Link to={`/foods/${food._id}`}>
                  <p>
                    {food.description}
                  </p>
                  </Link>
                  <p className="text-orange-400 font-bold mt-2 text-lg">
                    ₹{food.price}
                  </p>

                  <p className="text-gray-400 text-sm mt-1">
                    ⭐ {food.rating || 0}
                  </p>

                  {/* Buttons */}
                  <div className="flex gap-3 mt-5">

                   

                    {/* REMOVE BUTTON */}
                    <button
                      onClick={() => handleRemove(food._id)}
                      disabled={isRemoving}
                      className="flex-1 flex items-center justify-center gap-2
                        bg-gradient-to-r from-orange-500 to-red-500
                        hover:from-red-500 hover:to-orange-500
                        text-white py-2.5 rounded-xl
                        shadow-lg shadow-orange-500/20
                        hover:shadow-orange-500/40
                        active:scale-95
                        transition-all"
                    >
                      <FiTrash2 />
                      {isRemoving ? "..." : "Remove"}
                    </button>

                  </div>
                </div>
              </div>
            );
          })}

        </div>
      </div>
    </div>
  );
}