import {
  Link,
  NavLink,
  useNavigate,
} from "react-router-dom";

import {
  Menu,
  X,
  MapPin,
  User,
  LogOut,
  Users,
  ShoppingBag,
  Ticket,
  IndianRupee,
  LayoutGrid,
} from "lucide-react";

import {
  useState,
  useEffect,
} from "react";

import useAuth from "../hooks/useAuth";
import Location from "../pages/Location";

export default function Navbar() {
  const [menuOpen, setMenuOpen] =
    useState(false);

  const [showLocationModal, setShowLocationModal] =
    useState(false);

  const [savedLocation, setSavedLocation] =
    useState({});

  const navigate =
    useNavigate();

  const { user, logout } =
    useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  useEffect(() => {
    const location = JSON.parse(
      localStorage.getItem(
        "deliveryLocation"
      ) || "{}"
    );

    setSavedLocation(location);
  }, []);

  useEffect(() => {
    const updateLocation = () => {
      const location =
        JSON.parse(
          localStorage.getItem(
            "deliveryLocation"
          ) || "{}"
        );

      setSavedLocation(location);
    };

    window.addEventListener(
      "locationChanged",
      updateLocation
    );

    return () =>
      window.removeEventListener(
        "locationChanged",
        updateLocation
      );
  }, []);

  const adminLinks = [
    {
      name: "Categories",
      path: "/admin/categories",
      icon: LayoutGrid,
    },
    
    {
      name: "Orders",
      path: "/admin/orders",
      icon: ShoppingBag,
    },
    {
      name: "Coupons",
      path: "/admin/coupons",
      icon: Ticket,
    },
    {
      name: "Users",
      path: "/admin/users",
      icon: Users,
    },
    {
      name: "Payments",
      path: "/admin/payments",
      icon: IndianRupee,
    },
  ];

  return (
    <>
      {/* NAVBAR */}

      <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 border-b border-gray-200">

        <div className="max-w-7xl mx-auto px-4">

          <div className="h-16 flex items-center justify-between">

            {/* LOGO */}

            <Link
              to="/"
              className="text-3xl font-black bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 bg-clip-text text-transparent"
            >
              FoodHub
            </Link>

            {/* LOCATION */}

            <button
              onClick={() =>
                setShowLocationModal(
                  true
                )
              }
              className="hidden lg:flex items-center gap-3 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-2xl transition"
            >
              <MapPin
                size={18}
                className="text-orange-500"
              />

              <div className="text-left">

                <p className="font-semibold text-sm">
                  {savedLocation.city ||
                    "Select Location"}
                </p>

                <p className="text-xs text-gray-500 truncate max-w-[180px]">
                  {savedLocation.address ||
                    "Delivery Address"}
                </p>

              </div>

            </button>

            {/* DESKTOP MENU */}

            <div className="hidden md:flex items-center gap-3">

              {user?.role ===
                "admin" &&
                adminLinks.map(
                  (item) => (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      className={({
                        isActive,
                      }) =>
                        `px-4 py-2 rounded-xl text-sm font-medium transition ${
                          isActive
                            ? "bg-orange-500 text-white"
                            : "hover:bg-orange-50 hover:text-orange-600"
                        }`
                      }
                    >
                      {item.name}
                    </NavLink>
                  )
                )}

              {user && (
                <>
                  <NavLink
                    to="/profile"
                    className="p-2 rounded-xl hover:bg-gray-100"
                  >
                    <User
                      size={22}
                    />
                  </NavLink>

                  <button
                    onClick={
                      handleLogout
                    }
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl transition"
                  >
                    Logout
                  </button>
                </>
              )}

              {!user && (
                <>
                  <Link
                    to="/login"
                    className="bg-orange-500 text-white px-4 py-2 rounded-xl"
                  >
                    Login
                  </Link>

                  <Link
                    to="/register"
                    className="border border-orange-500 text-orange-500 px-4 py-2 rounded-xl"
                  >
                    Register
                  </Link>
                </>
              )}

            </div>

            {/* MOBILE */}

            <div className="md:hidden flex items-center gap-3">

              <button
                onClick={() =>
                  setShowLocationModal(
                    true
                  )
                }
                className="bg-orange-50 p-2 rounded-xl"
              >
                <MapPin
                  size={20}
                />
              </button>

              <button
                onClick={() =>
                  setMenuOpen(
                    true
                  )
                }
              >
                <Menu
                  size={28}
                />
              </button>

            </div>

          </div>

        </div>

      </header>

      {/* MOBILE SIDEBAR */}

      <div
        className={`fixed inset-0 z-[999] transition-all duration-300 ${
          menuOpen
            ? "visible"
            : "invisible"
        }`}
      >

        <div
          onClick={() =>
            setMenuOpen(false)
          }
          className={`absolute inset-0 bg-black/40 transition-opacity ${
            menuOpen
              ? "opacity-100"
              : "opacity-0"
          }`}
        />

        <div
          className={`absolute right-0 top-0 h-full w-72 bg-white shadow-2xl transition-transform duration-300 ${
            menuOpen
              ? "translate-x-0"
              : "translate-x-full"
          }`}
        >

          {/* HEADER */}

          <div className="flex items-center justify-between p-5 border-b">

            <h2 className="font-bold text-xl">
              Menu
            </h2>

            <button
              onClick={() =>
                setMenuOpen(false)
              }
            >
              <X />
            </button>

          </div>

          {/* USER */}

          {user && (
            <div className="p-5 border-b">

              <div className="flex items-center gap-3">

                <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center">
                  <User />
                </div>

                <div>

                  <h3 className="font-semibold">
                    {
                      user.fullname
                    }
                  </h3>

                  <p className="text-sm text-gray-500">
                    {user.email}
                  </p>

                </div>

              </div>

            </div>
          )}

          {/* LINKS */}

          <div className="p-4 flex flex-col gap-2">

            {user?.role ===
              "admin" &&
              adminLinks.map(
                (item) => {
                  const Icon =
                    item.icon;

                  return (
                    <NavLink
                      key={
                        item.path
                      }
                      to={
                        item.path
                      }
                      onClick={() =>
                        setMenuOpen(
                          false
                        )
                      }
                      className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-orange-50"
                    >
                      <Icon
                        size={
                          18
                        }
                      />

                      {
                        item.name
                      }
                    </NavLink>
                  );
                }
              )}

            {user && (
              <NavLink
                to="/profile"
                className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-orange-50"
              >
                <User
                  size={18}
                />
                Profile
              </NavLink>
            )}

            {user ? (
              <button
                onClick={
                  handleLogout
                }
                className="flex items-center gap-3 px-4 py-3 rounded-xl bg-red-500 text-white mt-4"
              >
                <LogOut
                  size={18}
                />
                Logout
              </button>
            ) : (
              <>
                <Link
                  to="/login"
                  className="bg-orange-500 text-white text-center py-3 rounded-xl"
                >
                  Login
                </Link>

                <Link
                  to="/register"
                  className="border border-orange-500 text-orange-500 text-center py-3 rounded-xl"
                >
                  Register
                </Link>
              </>
            )}

          </div>

        </div>

      </div>

      {/* LOCATION MODAL */}

      {showLocationModal && (
        <div className="fixed inset-0 z-[9999] bg-black/50 flex justify-center items-center p-4">

          <div className="bg-white w-full max-w-5xl h-[90vh] rounded-3xl overflow-hidden shadow-2xl">

            <div className="flex justify-between items-center p-5 border-b">

              <h2 className="font-bold text-xl">
                Select Delivery Location
              </h2>

              <button
                onClick={() =>
                  setShowLocationModal(
                    false
                  )
                }
                className="text-3xl"
              >
                ×
              </button>

            </div>

            <div className="h-[calc(90vh-80px)] overflow-y-auto">

              <Location
                onClose={() =>
                  setShowLocationModal(
                    false
                  )
                }
              />

            </div>

          </div>

        </div>
      )}
    </>
  );
}