"use client";

import { useCallback, useEffect, useState } from "react";
import { api } from "@/lib/api";
import UsersTable from "@/components/common/UsersTable";
import UsersFilters from "@/components/UsersFilters";
import Pagination from "@/components/common/Pagination";
import AdminLayout from "@/components/AdminLayout";
import { FiUsers } from "react-icons/fi";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<"new" | "old">("new");
  const [range, setRange] = useState<"7d" | "30d" | undefined>();
  const [updatingUserId, setUpdatingUserId] = useState<number | null>(null);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get("/admin/users", {
        params: {
          page,
          limit,
          search: search || undefined,
          sort,
          range,
        },
      });

      setUsers(res.data.data);
      setTotalPages(res.data.meta.totalPages);
    } catch (err: any) {
      console.error("Failed to fetch users:", err);
      setError(err.response?.data?.message || "Failed to fetch users");
    } finally {
      setLoading(false);
    }
  }, [page, limit, search, sort, range]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const updateUserBlock = async (userId: number, shouldBlock: boolean) => {
    if (shouldBlock && !confirm("Block this user from logging in?")) return;
    if (!shouldBlock && !confirm("Unblock this user and reset failed login attempts?")) return;

    setUpdatingUserId(userId);
    setError(null);
    try {
      const res = await api.patch(`/admin/users/${userId}/${shouldBlock ? "block" : "unblock"}`);
      setUsers((current) => current.map((user) => (user.id === userId ? res.data : user)));
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to update user status");
    } finally {
      setUpdatingUserId(null);
    }
  };

  return (
    <AdminLayout>
      <div className="admin-page">
        <div className="admin-hero">
          <div>
            <h1 className="admin-hero-title">
              User <span className="text-brandRed">Management</span>
            </h1>
            <p className="admin-hero-subtitle">
              View, search, and manage registered customers.
            </p>
          </div>
          <div className="admin-dark-button pointer-events-none">
            <FiUsers size={16} /> Customers
          </div>
        </div>

        <div className="admin-table">
          <div className="p-5 border-b border-white/10 bg-white/5">
            <UsersFilters
              search={search}
              setSearch={setSearch}
              sort={sort}
              setSort={setSort}
              range={range}
              setRange={setRange}
              onReset={() => {
                setSearch("");
                setSort("new");
                setRange(undefined);
                setPage(1);
              }}
            />
          </div>

          {error && (
            <div className="m-6 p-4 bg-brandRed/10 border-l-4 border-brandRed rounded-md flex items-center gap-3">
              <span className="text-brandRed font-black">!</span>
              <p className="text-red-300 font-bold text-sm">{error}</p>
            </div>
          )}

          <div className="min-h-[400px]">
            <UsersTable
              users={users}
              loading={loading}
              updatingUserId={updatingUserId}
              onBlockChange={updateUserBlock}
            />
          </div>

          {!loading && users.length > 0 && (
            <div className="p-6 border-t border-white/5 flex justify-center">
              <Pagination
                page={page}
                totalPages={totalPages}
                onPageChange={setPage}
              />
            </div>
          )}

          {!loading && users.length === 0 && !error && (
            <div className="py-20 text-center">
              <p className="text-[10px] font-black uppercase tracking-widest text-brandGray">
                No users found matching your criteria.
              </p>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
