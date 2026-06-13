import {
  Routes,
  Route,
} from "react-router-dom";

import Home from "../pages/Home";

import Login from "../pages/auth/Login";

import Register from "../pages/auth/Register";

import VerifyEmail from "../pages/auth/VerifyEmail";
import LoginOtp from "../pages/auth/LoginOtp";
import Profile from "../pages/Profile";
import Cart from "../pages/Cart";
import Wishlist from "../pages/Wishlist";
import Orders from "../pages/Orders";
import ProtectedRoute from "../components/ProtectedRoute";
import Foods from "../pages/Foods";
import Checkout from "../pages/Checkout";
import SingleFood from "../pages/SingleFood";
import Location from "../pages/Location";
import SingleOrder from "../pages/SingleOrder";
import ChangePassword from "../pages/auth/ChangePassword";
import ResetPassword from "../pages/auth/ResetPassword";
import ForgotPassword from "../pages/auth/ForgotPassword";
import NotFound from "../pages/NotFound";
import useOnlineStatus from "../hooks/useOnlineStatus";
import OfflinePage from "../pages/OfflinePage";

export default function AppRoutes() {
 const isOnline = useOnlineStatus();

  if (!isOnline) {
    return <OfflinePage />;
  }
  return (
    <Routes>

      <Route
        path="/"
        element={<Home />}
      />

      <Route
        path="/login"
        element={<Login />}
      />
      <Route
        path="/login-otp"
        element={<LoginOtp />}
      />
     
      <Route
        path="/foods"
        element={<Foods />}
      />
      <Route
        path="/location"
        element={<Location />}
      />
      <Route path="/forgot-password"
        element={<ForgotPassword />}
      />
      <Route path="/reset-password"
        element={<ResetPassword />}
      />
      <Route path="/foods/:id" element={<SingleFood />} />
      <Route
        path="/register"
        element={<Register />}
      />

      <Route
        path="/verify-email"
        element={
          <VerifyEmail />
        }
      />
      <Route path="/change-password"
        element={
          <ProtectedRoute> <ChangePassword /></ProtectedRoute>
       }
      />    
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />
      <Route
  path="/cart"
  element={
    <ProtectedRoute>
      <Cart />
    </ProtectedRoute>
  }
/>

<Route
  path="/wishlist"
  element={
    <ProtectedRoute>
      <Wishlist />
    </ProtectedRoute>
  }
/>

<Route
  path="/orders"
  element={
    <ProtectedRoute>
      <Orders />
    </ProtectedRoute>
  }
/>
<Route path="/orders/:id" element={
  <ProtectedRoute>
    <SingleOrder />
  </ProtectedRoute>
} />
<Route
  path="/checkout"
  element={
    <ProtectedRoute>
      <Checkout />
    </ProtectedRoute>
  }
/>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}