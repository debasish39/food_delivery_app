import {
  useParams,
} from "react-router-dom";

import {
  useEffect,
  useState,
} from "react";

import toast from "react-hot-toast";
import { createReview } from "../services/reviewService";
import API from "../api/axios";

export default function SingleOrder() {

  const { id } =
    useParams();

  const [order,
    setOrder] =
    useState(null);
const [reviews, setReviews] =
  useState({});

const [ratings, setRatings] =
  useState({});

const [reviewImages,
  setReviewImages] =
  useState({});
  const handleReviewSubmit =
  async (foodId) => {

    try {

     const formData =
  new FormData();

formData.append(
  "foodId",
  foodId
);

formData.append(
  "rating",
  ratings[foodId]
);

formData.append(
  "comment",
  reviews[foodId]
);

if (
  reviewImages[foodId]
) {
  formData.append(
    "images",
    reviewImages[foodId]
  );
}

await createReview(
  formData
);

      toast.success(
        "Review Added"
      );

      setReviews({
        ...reviews,
        [foodId]: "",
      });

      setRatings({
        ...ratings,
        [foodId]: "",
      });

      setReviewImages({
        ...reviewImages,
        [foodId]: "",
      });

    } catch (error) {

  console.log(error);

  console.log(
    error.response?.data
  );

  toast.error(
    error.response?.data?.message ||
    "Error Adding Review"
  );
}
  };
  useEffect(() => {

    const fetchOrder =
      async () => {

        const { data } =
          await API.get(
            `/orders/${id}`
          );

        setOrder(
          data.order
        );
      };

    fetchOrder();

  }, [id]);

  if (!order)
    return <p>Loading...</p>;

  return (
    <div className="max-w-5xl mx-auto p-5">

      <h1 className="text-3xl font-bold mb-6">
        Order Details
      </h1>

      <div className="bg-white rounded-xl shadow p-5">

        <h2>
          Order ID:
          {order._id}
        </h2>

        <p>
          Status:
          {order.orderStatus}
        </p>

        <p>
          Payment:
          {order.paymentStatus}
        </p>

        <p>
          Amount:
          ₹{order.finalPrice}
        </p>

      </div>
      <div className="mt-8">

  <h2 className="text-xl font-bold mb-4">
    Ordered Foods
  </h2>

  {order.items.map(
    (item) => (

      <div
        key={item._id}
        className="border rounded-xl p-4 mb-4"
      >

      <div className="flex flex-col md:flex-row gap-5">

    <img
      src={item.image}
      alt={item.title}
      className="w-32 h-32 object-cover rounded-lg"
    />

    <div className="flex-1">

      <h3 className="text-xl font-bold">
        {item.title}
      </h3>

      <div className="mt-2 space-y-1">

        <p>
          Quantity:
          <span className="font-semibold ml-2">
            {item.quantity}
          </span>
        </p>

        <p>
          Price:
          <span className="font-semibold ml-2">
            ₹{item.price}
          </span>
        </p>

        <p>
          Total:
          <span className="font-semibold ml-2 text-green-600">
            ₹
            {item.price *
              item.quantity}
          </span>
        </p>

      </div>

      <div className="mt-3 flex gap-3">

        <span className="px-3 py-1 bg-orange-100 text-orange-600 rounded-full text-sm">
          {order.orderStatus}
        </span>

        <span className="px-3 py-1 bg-green-100 text-green-600 rounded-full text-sm">
          {order.paymentStatus}
        </span>

      </div>

    </div>

  </div>
{order.orderStatus ===
  "Out For Delivery" &&
  order.deliveryInfo && (

  <div className="bg-green-50 border border-green-200 rounded-xl p-5 mt-5">

    <h2 className="text-xl font-bold mb-4 text-green-700">
      🚴 Delivery Partner Details
    </h2>

    <div className="space-y-2">

      <p>
        <strong>Name:</strong>
        {" "}
        {
          order.deliveryInfo
            .deliveryPartner
        }
      </p>

      <p>
        <strong>Phone:</strong>
        {" "}
        <a
          href={`tel:${order.deliveryInfo.deliveryPartnerPhone}`}
          className="text-blue-600"
        >
          {
            order.deliveryInfo
              .deliveryPartnerPhone
          }
        </a>
      </p>

      <p>
        <strong>Vehicle:</strong>
        {" "}
        {
          order.deliveryInfo
            .vehicleNumber
        }
      </p>

      <p>
        <strong>Delivery Charge:</strong>
        {" "}
        ₹
        {
          order.deliveryInfo
            .deliveryCharge
        }
      </p>

      <p>
        <strong>Arriving In:</strong>
        {" "}
        {
          order.deliveryInfo
            .estimatedArrivalTime
        }
      </p>

    </div>

    <div className="mt-4 flex gap-3">

      <a
        href={`tel:${order.deliveryInfo.deliveryPartnerPhone}`}
        className="bg-green-600 text-white px-4 py-2 rounded-lg"
      >
        📞 Call Rider
      </a>

      <a
        href={`https://wa.me/91${order.deliveryInfo.deliveryPartnerPhone}`}
        target="_blank"
        rel="noreferrer"
        className="bg-green-500 text-white px-4 py-2 rounded-lg"
      >
        WhatsApp
      </a>

    </div>

  </div>

)}
        {order.orderStatus ===
          "Delivered" && (

          <div className="mt-5 border-t pt-4">

            <h4 className="font-semibold mb-2">
              Write Review
            </h4>

            <select
              className="border p-2 rounded w-full mb-2"
              value={
                ratings[
                  item.food
                ] || ""
              }
              onChange={(e) =>
                setRatings({
                  ...ratings,
                  [item.food]:
                    e.target.value,
                })
              }
            >
              <option value="">
                Rating
              </option>

              <option value="1">
                ⭐ 1
              </option>

              <option value="2">
                ⭐ 2
              </option>

              <option value="3">
                ⭐ 3
              </option>

              <option value="4">
                ⭐ 4
              </option>

              <option value="5">
                ⭐ 5
              </option>

            </select>

            <textarea
              rows="3"
              placeholder="Write review..."
              className="w-full border p-2 rounded"
              value={
                reviews[
                  item.food
                ] || ""
              }
              onChange={(e) =>
                setReviews({
                  ...reviews,
                  [item.food]:
                    e.target.value,
                })
              }
            />

          <input
  type="file"
  accept="image/*"
  capture="environment"
  onChange={(e) =>
    setReviewImages({
      ...reviewImages,
      [item.food]:
        e.target.files[0],
    })
  }
/>

            {
  reviewImages[
    item.food
  ] && (
    <img
      src={URL.createObjectURL(
        reviewImages[
          item.food
        ]
      )}
      alt=""
      className="w-32 h-32 object-cover rounded mt-2"
    />
  )
}
            <button
              onClick={() =>
                handleReviewSubmit(
                  item.food
                )
              }
              className="mt-3 bg-green-600 text-white px-4 py-2 rounded"
            >
              Submit Review
            </button>

          </div>

        )}

      </div>
    )
  )}

</div>
    </div>
  );
}