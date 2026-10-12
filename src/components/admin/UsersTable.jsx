import { Search } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const inputClassName =
  "border-white/10 bg-[#080e13] text-slate-100 placeholder:text-slate-600 focus-visible:ring-cyan-500/40";

const getInitials = (username = "") =>
  username
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

const UsersTable = ({ users, searchText, onSearchChange, onToggleStatus }) => {
  return (
    <>
      {/* Search */}
      <div className="border-b border-white/[0.06] p-4">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />

          <Input
            value={searchText}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search username, type, or user ID..."
            className={`${inputClassName} pl-9`}
            aria-label="Search users"
          />
        </div>
      </div>

      {/* Table */}
      <div className="w-full overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-white/[0.06] hover:bg-transparent">
              <TableHead className="min-w-[220px] px-5 text-xs uppercase tracking-wider text-slate-500">
                Username
              </TableHead>

              <TableHead className="text-xs uppercase tracking-wider text-slate-500">
                Type
              </TableHead>

              <TableHead className="text-xs uppercase tracking-wider text-slate-500">
                Status
              </TableHead>

              <TableHead className="text-xs uppercase tracking-wider text-slate-500">
                Date added
              </TableHead>

              <TableHead className="pr-5 text-right text-xs uppercase tracking-wider text-slate-500">
                Action
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {users.map((user) => (
              <TableRow
                key={user.id}
                className="border-white/[0.055] hover:bg-white/[0.02]"
              >
                <TableCell className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/[0.07] bg-slate-800 text-xs font-semibold text-slate-200">
                      {getInitials(user.username)}
                    </div>

                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-slate-100">
                        {user.username}
                      </p>

                      <p className="mt-1 text-xs text-slate-500">{user.id}</p>
                    </div>
                  </div>
                </TableCell>

                <TableCell>
                  <Badge className="border border-white/10 bg-white/[0.04] text-slate-300 hover:bg-white/[0.04]">
                    {user.type}
                  </Badge>
                </TableCell>

                <TableCell>
                  <Badge
                    className={
                      user.status === "active"
                        ? "border border-emerald-500/20 bg-emerald-500/[0.08] text-emerald-300"
                        : "border border-slate-500/20 bg-slate-500/[0.08] text-slate-400"
                    }
                  >
                    {user.status}
                  </Badge>
                </TableCell>

                <TableCell className="text-xs text-slate-500">
                  {user.joined}
                </TableCell>

                <TableCell className="pr-5 text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onToggleStatus(user.id)}
                    className={
                      user.status === "active"
                        ? "h-8 px-2 text-xs text-slate-400 hover:bg-rose-500/10 hover:text-rose-300"
                        : "h-8 px-2 text-xs text-emerald-300 hover:bg-emerald-500/10"
                    }
                  >
                    {user.status === "active" ? "Deactivate" : "Activate"}
                  </Button>
                </TableCell>
              </TableRow>
            ))}

            {users.length === 0 && (
              <TableRow className="border-white/[0.06] hover:bg-transparent">
                <TableCell
                  colSpan={5}
                  className="h-28 text-center text-sm text-slate-500"
                >
                  No users found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </>
  );
};

export default UsersTable;
