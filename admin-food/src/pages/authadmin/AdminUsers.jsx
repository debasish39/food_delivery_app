import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import {
  getUsers,
  updateRole,
  verifyUser,
  deleteUser,
  blockUser,
  unblockUser,
} from "../../services/authService";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] =
    useState([]);
  const [loading, setLoading] =
    useState(true);
  const [search, setSearch] =
    useState("");

  const fetchUsers = async () => {
    try {
      const { data } =
        await getUsers();

      setUsers(data.users || []);
      setFilteredUsers(
        data.users || []
      );
    } catch (error) {
      console.log(error);

      toast.error(
        "Failed to load users"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    const filtered =
      users.filter(
        (user) =>
          user.fullname
            ?.toLowerCase()
            .includes(
              search.toLowerCase()
            ) ||
          user.email
            ?.toLowerCase()
            .includes(
              search.toLowerCase()
            )
      );

    setFilteredUsers(filtered);
  }, [search, users]);

  const handleRoleChange =
    async (userId, role) => {
      try {
        await updateRole(
          userId,
          role
        );

        toast.success(
          "Role Updated"
        );

        fetchUsers();
      } catch (error) {
        toast.error(
          error.response?.data
            ?.message ||
            "Update Failed"
        );
      }
    };

  const handleVerify =
    async (userId) => {
      try {
        await verifyUser(userId);

        toast.success(
          "User Verified"
        );

        fetchUsers();
      } catch (error) {
        toast.error(
          error.response?.data
            ?.message ||
            "Verification Failed"
        );
      }
    };

  const handleDelete =
    async (userId) => {
      const confirmDelete =
        window.confirm(
          "Delete this user?"
        );

      if (!confirmDelete) return;

      try {
        await deleteUser(userId);

        toast.success(
          "User Deleted"
        );

        fetchUsers();
      } catch (error) {
        toast.error(
          error.response?.data
            ?.message ||
            "Delete Failed"
        );
      }
    };

  const handleBlock =
    async (userId) => {
      try {
        await blockUser(userId);

        toast.success(
          "User Blocked"
        );

        fetchUsers();
      } catch (error) {
        toast.error(
          error.response?.data
            ?.message ||
            "Failed to block user"
        );
      }
    };

  const handleUnblock =
    async (userId) => {
      try {
        await unblockUser(
          userId
        );

        toast.success(
          "User Unblocked"
        );

        fetchUsers();
      } catch (error) {
        toast.error(
          error.response?.data
            ?.message ||
            "Failed to unblock user"
        );
      }
    };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="grid md:grid-cols-4 gap-4">
          {[...Array(8)].map(
            (_, i) => (
              <div
                key={i}
                className="h-32 rounded-2xl bg-gray-200 animate-pulse"
              />
            )
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
      {/* Header */}

      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            User Management
          </h1>

          <p className="text-gray-500 mt-1">
            Manage users,
            verification,
            roles and access.
          </p>
        </div>

        <input
          type="text"
          placeholder="Search users..."
          value={search}
          onChange={(e) =>
            setSearch(
              e.target.value
            )
          }
          className="w-full lg:w-80 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
      </div>

      {/* Stats */}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-2xl shadow-sm border p-5">
          <p className="text-gray-500 text-sm">
            Total Users
          </p>

          <h2 className="text-3xl font-bold mt-2">
            {users.length}
          </h2>
        </div>

        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5">
          <p className="text-blue-600 text-sm">
            Admins
          </p>

          <h2 className="text-3xl font-bold text-blue-700 mt-2">
            {
              users.filter(
                (u) =>
                  u.role ===
                  "admin"
              ).length
            }
          </h2>
        </div>

        <div className="bg-green-50 border border-green-100 rounded-2xl p-5">
          <p className="text-green-600 text-sm">
            Verified
          </p>

          <h2 className="text-3xl font-bold text-green-700 mt-2">
            {
              users.filter(
                (u) =>
                  u.isVerified
              ).length
            }
          </h2>
        </div>

        <div className="bg-red-50 border border-red-100 rounded-2xl p-5">
          <p className="text-red-600 text-sm">
            Pending
          </p>

          <h2 className="text-3xl font-bold text-red-700 mt-2">
            {
              users.filter(
                (u) =>
                  !u.isVerified
              ).length
            }
          </h2>
        </div>
      </div>

      {/* Empty State */}

      {filteredUsers.length ===
        0 && (
        <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
          <h2 className="text-xl font-semibold">
            No Users Found
          </h2>

          <p className="text-gray-500 mt-2">
            Try a different
            search term.
          </p>
        </div>
      )}

      {/* Mobile Cards */}

      <div className="lg:hidden space-y-4">
        {filteredUsers.map(
          (user) => (
            <div
              key={user._id}
              className="bg-white rounded-2xl shadow-sm border p-4"
            >
              <div className="flex items-center gap-3">
                <img
                  src={
                    user.profileImage ||
                    "https://via.placeholder.com/100"
                  }
                  alt=""
                  className="w-14 h-14 rounded-full object-cover"
                />

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

              <div className="mt-4">
                <select
                  value={
                    user.role
                  }
                  onChange={(e) =>
                    handleRoleChange(
                      user._id,
                      e.target
                        .value
                    )
                  }
                  className="border rounded-lg p-2 w-full"
                >
                  <option value="user">
                    User
                  </option>

                  <option value="admin">
                    Admin
                  </option>
                </select>
              </div>

              <div className="flex flex-wrap gap-2 mt-4">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    user.isVerified
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {user.isVerified
                    ? "Verified"
                    : "Pending"}
                </span>

                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    user.isBlocked
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-blue-100 text-blue-700"
                  }`}
                >
                  {user.isBlocked
                    ? "Blocked"
                    : "Active"}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 mt-4">
                {!user.isVerified && (
                  <button
                    onClick={() =>
                      handleVerify(
                        user._id
                      )
                    }
                    className="bg-green-600 text-white rounded-lg py-2"
                  >
                    Verify
                  </button>
                )}

                {user.isBlocked ? (
                  <button
                    onClick={() =>
                      handleUnblock(
                        user._id
                      )
                    }
                    className="bg-blue-600 text-white rounded-lg py-2"
                  >
                    Unblock
                  </button>
                ) : (
                  <button
                    onClick={() =>
                      handleBlock(
                        user._id
                      )
                    }
                    className="bg-yellow-500 text-white rounded-lg py-2"
                  >
                    Block
                  </button>
                )}

                <button
                  onClick={() =>
                    handleDelete(
                      user._id
                    )
                  }
                  className="bg-red-600 text-white rounded-lg py-2"
                >
                  Delete
                </button>
              </div>
            </div>
          )
        )}
      </div>

      {/* Desktop Table */}

      <div className="hidden lg:block bg-white rounded-2xl shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-4 text-left">
                  User
                </th>
                <th className="p-4 text-left">
                  Phone
                </th>
                <th className="p-4 text-left">
                  Role
                </th>
                <th className="p-4 text-left">
                  Status
                </th>
                <th className="p-4 text-left">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {filteredUsers.map(
                (user) => (
                  <tr
                    key={
                      user._id
                    }
                    className="border-t"
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={
                            user.profileImage ||
                            "https://via.placeholder.com/100"
                          }
                          alt=""
                          className="w-12 h-12 rounded-full object-cover"
                        />

                        <div>
                          <p className="font-medium">
                            {
                              user.fullname
                            }
                          </p>

                          <p className="text-sm text-gray-500">
                            {
                              user.email
                            }
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="p-4">
                      {user.phone}
                    </td>

                    <td className="p-4">
                      <select
                        value={
                          user.role
                        }
                        onChange={(
                          e
                        ) =>
                          handleRoleChange(
                            user._id,
                            e
                              .target
                              .value
                          )
                        }
                        className="border rounded-lg px-3 py-2"
                      >
                        <option value="user">
                          User
                        </option>

                        <option value="admin">
                          Admin
                        </option>
                      </select>
                    </td>

                    <td className="p-4">
                      <div className="flex flex-wrap gap-2">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            user.isVerified
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {user.isVerified
                            ? "Verified"
                            : "Pending"}
                        </span>

                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            user.isBlocked
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-blue-100 text-blue-700"
                          }`}
                        >
                          {user.isBlocked
                            ? "Blocked"
                            : "Active"}
                        </span>
                      </div>
                    </td>

                    <td className="p-4">
                      <div className="flex flex-wrap gap-2">
                        {!user.isVerified && (
                          <button
                            onClick={() =>
                              handleVerify(
                                user._id
                              )
                            }
                            className="px-3 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white text-sm"
                          >
                            Verify
                          </button>
                        )}

                        {user.isBlocked ? (
                          <button
                            onClick={() =>
                              handleUnblock(
                                user._id
                              )
                            }
                            className="px-3 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm"
                          >
                            Unblock
                          </button>
                        ) : (
                          <button
                            onClick={() =>
                              handleBlock(
                                user._id
                              )
                            }
                            className="px-3 py-2 rounded-lg bg-yellow-500 hover:bg-yellow-600 text-white text-sm"
                          >
                            Block
                          </button>
                        )}

                        <button
                          onClick={() =>
                            handleDelete(
                              user._id
                            )
                          }
                          className="px-3 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-sm"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

