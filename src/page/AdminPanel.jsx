import { useEffect, useMemo, useState } from "react";

import CreateUserDialog from "@/components/admin/CreateUserDialog";
import UserManagement from "@/components/admin/UserManagement";
import UserStats from "@/components/admin/UserStats";

import { CreateUser, GetAllUser } from "@/api/api";

const getFormattedDate = (dateValue) => {
  if (!dateValue) {
    return new Date().toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }

  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return String(dateValue);
  }

  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

// Convert backend user data into the format used by the UI.
const normalizeUser = (user) => {
  const rawId =
    user.id ?? user.ID ?? user.PRIMARYKEY ?? user.userId ?? user.user_id;

  const rawUsername = user.username ?? user.USERNAME ?? user.name ?? "";

  const rawType =
    user.type ?? user.TYPE ?? user.user_type ?? user.USER_TYPE ?? "user";

  const rawStatus = user.status ?? user.STATUS;

  const isActive =
    user.active ?? user.ACTIVE ?? user.isActive ?? user.is_active;

  let status = "active";

  if (typeof isActive === "boolean" || typeof isActive === "number") {
    status = isActive ? "active" : "inactive";
  } else if (typeof isActive === "string") {
    status = ["1", "true", "active"].includes(isActive.toLowerCase())
      ? "active"
      : "inactive";
  } else if (rawStatus !== undefined && rawStatus !== null) {
    status = ["active", "1", "true"].includes(String(rawStatus).toLowerCase())
      ? "active"
      : "inactive";
  }

  return {
    id: String(rawId ?? ""),
    username: String(rawUsername),
    type: String(rawType).trim() || "user",
    status,
    joined: getFormattedDate(
      user.joined ??
        user.created_at ??
        user.CREATED_AT ??
        user.createdAt ??
        user.created_at_timestamp,
    ),
  };
};

// Support common API response formats.
const extractUsers = (response) => {
  const candidates = [
    response?.data?.users,
    response?.data?.data?.users,
    response?.users,
    response?.data?.data,
    response?.data,
    response,
  ];

  for (const candidate of candidates) {
    if (Array.isArray(candidate)) {
      return candidate;
    }
  }

  return null;
};

const getErrorMessage = (error, fallback) =>
  error?.response?.data?.message ||
  error?.response?.data?.error ||
  error?.message ||
  fallback;

const AdminPanel = () => {
  const [users, setUsers] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [notice, setNotice] = useState("");
  const [loadingUsers, setLoadingUsers] = useState(true);

  // Fetch all users when the AdminPanel mounts.
  useEffect(() => {
    let cancelled = false;

    const fetchUsers = async () => {
      setLoadingUsers(true);

      try {
        const response = await GetAllUser();
        console.log(response?.data);

        if (cancelled) {
          return;
        }

        // Handle unsuccessful API responses.
        if (response?.success === false) {
          setNotice(
            response?.message ||
              response?.data?.message ||
              "Failed to load users.",
          );
          setUsers([]);
          return;
        }

        const usersList = extractUsers(response);

        if (!usersList) {
          console.error("Unexpected GetAllUser response:", response);

          setUsers([]);
          setNotice("The server returned an unexpected users response.");
          return;
        }

        setUsers(usersList.map(normalizeUser));
        setNotice("");
      } catch (error) {
        console.error("GetAllUser error:", error);

        if (!cancelled) {
          setUsers([]);
          setNotice(
            getErrorMessage(error, "Something went wrong while loading users."),
          );
        }
      } finally {
        if (!cancelled) {
          setLoadingUsers(false);
        }
      }
    };

    fetchUsers();

    return () => {
      cancelled = true;
    };
  }, []);

  // Count unique user types.
  const totalTypes = useMemo(() => {
    return new Set(
      users.map((user) => user.type.trim().toLowerCase()).filter(Boolean),
    ).size;
  }, [users]);

  // Search by username, ID, or type.
  const filteredUsers = useMemo(() => {
    const query = searchText.trim().toLowerCase();

    if (!query) {
      return users;
    }

    return users.filter(
      (user) =>
        user.username.toLowerCase().includes(query) ||
        user.id.toLowerCase().includes(query) ||
        user.type.toLowerCase().includes(query),
    );
  }, [users, searchText]);

  // Create a user through the backend API.
  const handleCreateUser = async (formData) => {
    const username = String(formData.username ?? "").trim();
    const password = String(formData.password ?? "");
    const type = String(formData.type ?? "")
      .trim()
      .toLowerCase();

    setNotice("");

    if (!username || !password || !type) {
      setNotice("Please complete all fields.");
      return;
    }

    if (password.length < 8) {
      setNotice("Password must contain at least 8 characters.");
      return;
    }

    const usernameExists = users.some(
      (user) => user.username.toLowerCase() === username.toLowerCase(),
    );

    if (usernameExists) {
      setNotice("A user with this username already exists.");
      return;
    }

    try {
      // IMPORTANT: Send type as the third argument.
      const response = await CreateUser(username, password, type);

      if (response?.success === false || response?.status === "error") {
        setNotice(
          response?.message ||
            response?.data?.message ||
            "Failed to create user. Please try again.",
        );
        return;
      }

      const createdUser =
        response?.data?.user ??
        response?.data?.data?.user ??
        response?.user ??
        response?.data?.data ??
        response?.data;

      // If the API does not return the created user,
      // reload users from the backend instead of inventing an ID.
      if (
        !createdUser ||
        typeof createdUser !== "object" ||
        Array.isArray(createdUser) ||
        !(
          createdUser.id ??
          createdUser.ID ??
          createdUser.PRIMARYKEY ??
          createdUser.userId ??
          createdUser.user_id
        )
      ) {
        const refreshedResponse = await GetAllUser();

        if (refreshedResponse?.success === false) {
          setNotice(
            "User may have been created, but refreshing the list failed. Reload the page to verify.",
          );
          return;
        }

        const refreshedUsers = extractUsers(refreshedResponse);

        if (!refreshedUsers) {
          setNotice(
            "User may have been created, but the refreshed users response was unexpected. Reload the page to verify.",
          );
          return;
        }

        setUsers(refreshedUsers.map(normalizeUser));
      } else {
        const newUser = normalizeUser({
          ...createdUser,
          username: createdUser.username ?? createdUser.USERNAME ?? username,
          type: createdUser.type ?? createdUser.TYPE ?? type,
        });

        setUsers((currentUsers) => [
          newUser,
          ...currentUsers.filter((user) => user.id !== newUser.id),
        ]);
      }

      setCreateDialogOpen(false);
      setNotice(
        response?.message ||
          response?.data?.message ||
          "User created successfully.",
      );
    } catch (error) {
      console.error("Create user error:", error);

      setNotice(
        getErrorMessage(error, "Something went wrong while creating the user."),
      );
    }
  };

  // This changes only the local UI.
  // Connect it to a backend status-update API to persist changes.
  const toggleUserStatus = (userId) => {
    setUsers((currentUsers) =>
      currentUsers.map((user) =>
        user.id === String(userId)
          ? {
              ...user,
              status: user.status === "active" ? "inactive" : "active",
            }
          : user,
      ),
    );
  };

  return (
    <div className="min-h-screen bg-[#070b0e] px-4 py-6 text-slate-100 sm:px-6 xl:px-8">
      <div className="mx-auto w-full max-w-[1700px] space-y-6">
        {/* Notification */}
        {notice && (
          <div
            role="status"
            className="flex items-center justify-between gap-3 rounded-lg border border-white/10 bg-[#0a1015] px-4 py-3 text-sm text-slate-300"
          >
            <span>{notice}</span>

            <button
              type="button"
              onClick={() => setNotice("")}
              className="text-slate-400 hover:text-white"
              aria-label="Dismiss message"
            >
              ×
            </button>
          </div>
        )}

        {/* Overview cards */}
        <UserStats totalUsers={users.length} totalTypes={totalTypes} />

        {/* User management */}
        {loadingUsers ? (
          <div
            role="status"
            className="rounded-lg border border-white/10 bg-[#0a1015] px-4 py-8 text-center text-sm text-slate-400"
          >
            Loading users...
          </div>
        ) : (
          <UserManagement
            users={filteredUsers}
            searchText={searchText}
            onSearchChange={setSearchText}
            onToggleStatus={toggleUserStatus}
            onCreateClick={() => {
              setNotice("");
              setCreateDialogOpen(true);
            }}
          />
        )}
      </div>

      {/* Create user dialog */}
      <CreateUserDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onSubmit={handleCreateUser}
      />
    </div>
  );
};

export default AdminPanel;
