import {
    useEffect,
    useState,
} from "react";

import {
    useParams,
} from "react-router-dom";

import toast from "react-hot-toast";

import {
    getSingleFood,
} from "../services/foodService";

import {
    addToCart,
} from "../services/cartService";

import {
    addToWishlist,
} from "../services/wishlistService";

export default function SingleFood() {

    const { id } =
        useParams();

    const [food, setFood] =
        useState(null);

    const [loading, setLoading] =
        useState(true);
    const [quantity, setQuantity] = useState(1);
    const [selectedImage, setSelectedImage] = useState(null);

    const fetchFood =
        async () => {

            try {

                const { data } =
                    await getSingleFood(
                        id
                    );

                setFood(
                    data.food
                );

            } catch (error) {

                console.log(error);

            } finally {

                setLoading(false);
            }
        };

    useEffect(() => {
        fetchFood();
    }, [id]);
    const increaseQuantity = () => {
        setQuantity((prev) => prev + 1);
    };

    const decreaseQuantity = () => {
        if (quantity > 1) {
            setQuantity((prev) => prev - 1);
        }
    };
    const handleAddToCart = async () => {
        try {
            await addToCart(
                food._id,
                quantity
            );

            toast.success("Added To Cart");
        } catch (error) {
            toast.error(
                error.response?.data?.message ||
                "Failed to add to cart"
            );
        }
    };

    const handleWishlist =
        async () => {

            try {

                await addToWishlist(
                    food._id
                );

                toast.success(
                    "Added To Wishlist"
                );

            } catch (error) {

                toast.error(
                    error.response?.data
                        ?.message
                );
            }
        };

    if (loading) {
        return (
            <div className="text-center py-20">
                Loading...
            </div>
        );
    }

    if (!food) {
        return (
            <div className="text-center py-20">
                Food Not Found
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 py-10">

            <div className="grid md:grid-cols-2 gap-10">

                {/* Image */}

                <div>

                    <img
                        src={food.image}
                        alt={food.title}
                        className="w-full rounded-xl shadow-lg"
                    />

                </div>

                {/* Details */}

                <div>

                    <h1 className="text-4xl font-bold">
                        {food.title}
                    </h1>

                    <p className="mt-4 text-gray-600">
                        {food.description}
                    </p>

                    <div className="mt-6">

                        <span className="bg-orange-100 text-orange-600 px-4 py-2 rounded-full">
                            {
                                food.category
                                    ?.name
                            }
                        </span>

                    </div>

                    <div className="mt-6">

                        <h2 className="text-3xl font-bold text-orange-500">
                            ₹{food.price}
                        </h2>

                    </div>

                    <div className="mt-4">

                        <span className="text-green-600 font-medium">
                            Stock:
                            {" "}
                            {food.stock}
                        </span>

                    </div>

                    <div className="mt-4">

                        <span>
                            ⭐
                            {
                                food.rating
                            }
                            /5
                        </span>

                        <span className="ml-2 text-gray-500">
                            (
                            {
                                food.totalReviews
                            }
                            {" "}
                            Reviews)
                        </span>

                    </div>

                    <div className="mt-4">
                        <div className="flex items-center justify-center gap-4 mb-3">
                            <button
                                onClick={decreaseQuantity}
                                className="w-10 h-10 bg-gray-200 rounded-full text-xl"
                            >
                                -
                            </button>

                            <span className="text-lg font-bold">
                                {quantity}
                            </span>

                            <button
                                onClick={increaseQuantity}
                                className="w-10 h-10 bg-gray-200 rounded-full text-xl"
                            >
                                +
                            </button>
                        </div>

                        <div className="flex gap-2">
                            <button
                                onClick={handleAddToCart}
                                className="flex-1 bg-orange-500 text-white py-2 rounded-lg"
                            >
                                Add To Cart
                            </button>

                            <button
                                onClick={handleWishlist}
                                className="flex-1 border border-orange-500 text-orange-500 py-2 rounded-lg"
                            >
                                Wishlist
                            </button>
                        </div>
                    </div>
                </div>

            </div>

            {/* Reviews */}

            <div className="mt-16">

                <h2 className="text-2xl font-bold mb-6">
                    Customer Reviews
                </h2>

                {food.reviews &&
                    food.reviews.length >
                    0 ? (

                    <div className="space-y-4">

                        {food.reviews?.map(
                            (review) => (
                                <div
                                    key={review._id}
                                    className="bg-white shadow rounded-xl p-4"
                                >
                                    <div className="flex items-center justify-between">

                                        <div className="flex items-center gap-3">

                                            <img
                                                src={
                                                    review.user
                                                        ?.profileImage ||
                                                    `https://ui-avatars.com/api/?name=${review.user?.fullname}`
                                                }
                                                alt={
                                                    review.user
                                                        ?.fullname
                                                }
                                                className="w-12 h-12 rounded-full object-cover border"
                                            />

                                            <div>
                                                <h3 className="font-semibold">
                                                    {
                                                        review.user
                                                            ?.fullname
                                                    }
                                                </h3>

                                                <p className="text-sm text-gray-500">
                                                    Verified Customer
                                                </p>
                                            </div>

                                        </div>

                                        <div className="bg-yellow-100 px-3 py-1 rounded-full">

                                            ⭐ {review.rating}/5

                                        </div>

                                    </div>

                                    <p className="mt-4 text-gray-600">
                                        {review.comment}
                                    </p>
{review.images &&
  review.images.length > 0 && (

  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">

    {review.images.map(
      (image, index) => (

        <img
          key={index}
          src={image}
          alt={`Review ${index + 1}`}
          onClick={() =>
    setSelectedImage(image)
  }
          className="w-full h-28 object-cover rounded-lg border hover:scale-105 transition cursor-pointer"
        />

      )
    )}

  </div>

)}
                                    <div className="mt-2 text-xs text-gray-400">
                                        {new Date(
                                            review.createdAt
                                        ).toLocaleDateString()}
                                    </div>

                                </div>
                            )
                        )}

                    </div>

                ) : (

                    <p>
                        No Reviews Yet
                    </p>

                )}

            </div>
{selectedImage && (

  <div
    className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
    onClick={() =>
      setSelectedImage(null)
    }
  >

    <img
      src={selectedImage}
      alt=""
      className="max-w-[90%] max-h-[90%] rounded-lg"
    />

  </div>

)}
        </div>
    );
}