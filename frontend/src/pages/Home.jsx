import { Link } from "react-router-dom";

export default function Home() {
return ( <div className="min-h-screen bg-gray-50">


 <section className="relative overflow-hidden bg-gradient-to-br from-orange-500 via-orange-600 to-red-500">

  <div className="absolute inset-0 opacity-10">
    <div className="absolute top-20 left-20 w-72 h-72 bg-white rounded-full blur-3xl" />
    <div className="absolute bottom-0 right-0 w-96 h-96 bg-yellow-300 rounded-full blur-3xl" />
  </div>

  <div className="relative max-w-7xl mx-auto px-6 py-24">

    <div className="grid lg:grid-cols-2 gap-12 items-center">

      <div>

        <span className="bg-white/20 backdrop-blur-md px-4 py-2 rounded-full text-sm">
          🚀 Fastest Food Delivery
        </span>

        <h1 className="mt-6 text-6xl font-black leading-tight text-white">
          Hungry?
          <br />
          We Deliver Happiness.
        </h1>

        <p className="mt-6 text-xl text-orange-100">
          Discover restaurants, order delicious meals,
          and get them delivered to your doorstep in minutes.
        </p>

        <div className="mt-8 flex gap-4">
          <Link
            to="/foods"
            className="bg-white text-orange-600 px-8 py-4 rounded-2xl font-bold shadow-lg hover:scale-105 transition"
          >
            Order Now
          </Link>

          <button className="border border-white/30 backdrop-blur-lg px-8 py-4 rounded-2xl text-white">
            Explore Menu
          </button>
        </div>

      </div>

      <div className="relative">

        <img
          src="https://images.unsplash.com/photo-1504674900247-0877df9cc836"
          className="rounded-[40px] shadow-2xl"
          alt=""
        />

      </div>

    </div>

  </div>

</section>

</div>


);
}
