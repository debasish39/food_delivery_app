import {
  Routes,
  Route,
} from "react-router-dom";


import Login from "../pages/auth/Login";

import Register from "../pages/auth/Register";

import VerifyEmail from "../pages/auth/VerifyEmail";
import LoginOtp from "../pages/auth/LoginOtp";
import Profile from "../pages/Profile";



import ProtectedRoute from "../components/ProtectedRoute";
import Foods from "../pages/food/Foods";
import SingleFood from "../pages/SingleFood";
import Location from "../pages/Location";
import SingleOrder from "../pages/SingleOrder";
import ChangePassword from "../pages/auth/ChangePassword";
import ResetPassword from "../pages/auth/ResetPassword";
import ForgotPassword from "../pages/auth/ForgotPassword";
import CreateCategory from "../pages/category/CreateCategory";
import EditCategory from "../pages/category/EditCategory";
import Categories from "../pages/category/Categories";
import CreateFood from "../pages/food/CreateFood";
import UpdateFood from "../pages/food/UpdateFood";
import OrderDetail from "../pages/orders/OrderDetail";
import Orders from "../pages/orders/Orders";
import AdminCoupon from "../pages/coupon/AdminCoupon";
import Payments from "../pages/payment/Payments";
import AdminUsers from "../pages/authadmin/AdminUsers";

export default function AppRoutes() {

  return (
    <Routes>



      <Route
        path="/login"
        element={<Login />}
      />
      <Route
        path="/login-otp"
        element={<LoginOtp />}
      />
      <Route path="/admin/categories" element={<ProtectedRoute><Categories /></ProtectedRoute>} />
      <Route path="/admin/categories/create" element={<ProtectedRoute><CreateCategory /></ProtectedRoute>} />
      <Route path="/admin/categories/edit/:id" element={<ProtectedRoute><EditCategory /></ProtectedRoute>} />
      <Route path="/admin/foods" element={<ProtectedRoute><Foods /></ProtectedRoute>} />
      <Route path="/admin/users" element={<ProtectedRoute><AdminUsers /></ProtectedRoute>} />

      <Route path="/admin/foods/create" element={<ProtectedRoute><CreateFood /></ProtectedRoute>} />
      <Route path="/admin/foods/edit/:id" element={<ProtectedRoute><UpdateFood /></ProtectedRoute>} />
      <Route
        path="/"
        element={<Foods />}
      />
      <Route path="/admin/coupons" element={<ProtectedRoute><AdminCoupon /></ProtectedRoute>} />
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
        path="/admin/orders"
        element={
          <ProtectedRoute>
            <Orders />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/orders/:id"
        element={
          <ProtectedRoute>
            <OrderDetail />
          </ProtectedRoute>
        }
      />
      <Route path="/admin/payments" element={<ProtectedRoute><Payments /></ProtectedRoute>} />


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

    </Routes>
  );
}