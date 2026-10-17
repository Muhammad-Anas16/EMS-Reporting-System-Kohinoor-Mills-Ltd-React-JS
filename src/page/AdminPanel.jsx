import { useCallback, useEffect, useMemo, useState } from "react";

import CreateUserDialog from "@/components/admin/CreateUserDialog";
import UserManagement from "@/components/admin/UserManagement";
import UserStats from "@/components/admin/UserStats";
import ServerConfigurationCard from "@/components/admin/ServerConfigurationCard";

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

const normalizeUser = (user = {}) => {
  const rawId =
    user.id ?? user.ID ?? user.PRIMARYKEY ?? user.userId ?? user.user_id;

  const rawUsername = user.username ?? user.USERNAME ?? user.name ?? "";

  const rawType =
    user.type ?? user.TYPE ?? user.user_type ?? user.USER_TYPE ?? "user";

  const rawActive =
    user.active ?? user.ACTIVE ?? user.isActive ?? user.is_active;

  const rawStatus = user.status ?? user.STATUS;

  let status = "active";

  if (rawActive !== undefined && rawActive !== null) {
    status = [true, 1, "1", "true", "active"].includes(
      typeof rawActive === "string" ? rawActive.toLowerCase() : rawActive,
    )
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

const extractUsers = (response) => {
  const candidates = [
    response?.data?.users,
    response?.data?.data?.users,
    response?.users,
    response?.data?.data,
    response?.data,
    response,
  ];

  return candidates.find(Array.isArray) ?? null;
};

const getErrorMessage = (error, fallback) =>
  error?.response?.data?.message ||
  error?.response?.data?.error ||
  error?.message ||
  fallback;

const isFailedResponse = (response) =>
  response?.success === false || response?.status === "error";

const AdminPanel = () => {
  const [users, setUsers] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [notice, setNotice] = useState("");
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [creatingUser, setCreatingUser] = useState(false);

  const loadUsers = useCallback(async () => {
    setLoadingUsers(true);

    try {
      const response = await GetAllUser();

      if (isFailedResponse(response)) {
        throw new Error(
          response?.message ||
            response?.data?.message ||
            "Failed to load users.",
        );
      }

      const usersList = extractUsers(response);

      if (!usersList) {
        throw new Error("The server returned an unexpected users response.");
      }

      setUsers(usersList.map(normalizeUser));
      setNotice("");
    } catch (error) {
      console.error("GetAllUser error:", error);
      setNotice(
        getErrorMessage(error, "Something went wrong while loading users."),
      );
    } finally {
      setLoadingUsers(false);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    const initialize = async () => {
      try {
        const response = await GetAllUser();

        if (cancelled) return;

        if (isFailedResponse(response)) {
          throw new Error(
            response?.message ||
              response?.data?.message ||
              "Failed to load users.",
          );
        }

        const usersList = extractUsers(response);

        if (!usersList) {
          throw new Error("The server returned an unexpected users response.");
        }

        setUsers(usersList.map(normalizeUser));
        setNotice("");
      } catch (error) {
        if (!cancelled) {
          console.error("GetAllUser error:", error);
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

    initialize();

    return () => {
      cancelled = true;
    };
  }, []);

  const totalTypes = useMemo(
    () =>
      new Set(
        users.map((user) => user.type.trim().toLowerCase()).filter(Boolean),
      ).size,
    [users],
  );

  const filteredUsers = useMemo(() => {
    const query = searchText.trim().toLowerCase();

    if (!query) return users;

    return users.filter(
      (user) =>
        user.username.toLowerCase().includes(query) ||
        user.id.toLowerCase().includes(query) ||
        user.type.toLowerCase().includes(query),
    );
  }, [users, searchText]);

  const handleCreateUser = async (formData) => {
    const username = String(formData?.username ?? "").trim();
    const password = String(formData?.password ?? "");
    const type = String(formData?.type ?? "")
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

    if (
      users.some(
        (user) => user.username.toLowerCase() === username.toLowerCase(),
      )
    ) {
      setNotice("A user with this username already exists.");
      return;
    }

    setCreatingUser(true);

    try {
      const response = await CreateUser(username, password, type);

      if (isFailedResponse(response)) {
        throw new Error(
          response?.message ||
            response?.data?.message ||
            "Failed to create user.",
        );
      }

      // Refresh from the backend so we don't invent a user ID.
      const refreshResponse = await GetAllUser();

      if (isFailedResponse(refreshResponse)) {
        setCreateDialogOpen(false);
        setNotice(
          "The create request succeeded, but refreshing users failed. Reload the page to verify.",
        );
        return;
      }

      const refreshedUsers = extractUsers(refreshResponse);

      if (!refreshedUsers) {
        setCreateDialogOpen(false);
        setNotice(
          "The create request succeeded, but the refreshed users response was unexpected.",
        );
        return;
      }

      setUsers(refreshedUsers.map(normalizeUser));
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
    } finally {
      setCreatingUser(false);
    }
  };

  // Local display only. This does not persist status to the backend.
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
    <main className="min-h-screen bg-[#070b0e] px-4 py-6 text-slate-100 sm:px-6 xl:px-8">
      <div className="mx-auto w-full max-w-[1700px] space-y-6">
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

        <ServerConfigurationCard />

        <UserStats totalUsers={users.length} totalTypes={totalTypes} />

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

        <CreateUserDialog
          open={createDialogOpen}
          onOpenChange={setCreateDialogOpen}
          onSubmit={handleCreateUser}
          loading={creatingUser}
        />
      </div>
    </main>
  );
};

export default AdminPanel;
