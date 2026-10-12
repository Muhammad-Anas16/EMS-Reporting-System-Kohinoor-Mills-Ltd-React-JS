import { Plus } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Button } from "@/components/ui/button";

import UsersTable from "./UsersTable";

const UserManagement = ({
  users,
  searchText,
  onSearchChange,
  onToggleStatus,
  onCreateClick,
}) => {
  return (
    <Card className="overflow-hidden border-white/[0.08] bg-[#0a1015] text-slate-100 shadow-none">
      <CardHeader className="flex flex-col gap-4 border-b border-white/[0.06] sm:flex-row sm:items-center sm:justify-between">
        <CardTitle className="text-base font-semibold text-white">
          User management
        </CardTitle>

        <Button
          onClick={onCreateClick}
          className="bg-cyan-500 text-slate-950 hover:bg-cyan-400"
        >
          <Plus className="mr-2 h-4 w-4" />
          Create user
        </Button>
      </CardHeader>

      <CardContent className="p-0">
        <UsersTable
          users={users}
          searchText={searchText}
          onSearchChange={onSearchChange}
          onToggleStatus={onToggleStatus}
        />
      </CardContent>
    </Card>
  );
};

export default UserManagement;
