import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#0a0b0e] text-white px-4">

      {/* Big 404 */}
      <h1 className="text-[90px] font-extrabold leading-none text-orange-500 drop-shadow-lg">
        404
      </h1>

      {/* Message */}
      <h2 className="text-xl font-semibold mt-2">
        Page Not Found
      </h2>

      <p className="text-gray-500 text-sm mt-2 text-center max-w-md">
        The page you are looking for doesn’t exist or has been moved.
      </p>

      {/* Button */}
      <Link
        to="/"
        className="mt-6 px-6 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 text-white font-medium shadow-lg hover:opacity-90 transition"
      >
        Go Back Home
      </Link>

      {/* subtle glow */}
      <div className="absolute w-72 h-72 bg-orange-500/10 blur-3xl rounded-full -z-10" />
    </div>
  );
}