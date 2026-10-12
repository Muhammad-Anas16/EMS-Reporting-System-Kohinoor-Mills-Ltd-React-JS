import { Users, ShieldCheck } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

const UserStats = ({ totalUsers, totalTypes }) => {
  return (
    <section className="grid gap-4 sm:grid-cols-2">
      {/* Total Users */}
      <Card className="border-white/[0.08] bg-[#0a1015] text-slate-100 shadow-none">
        <CardContent className="flex items-center justify-between p-5">
          <div>
            <p className="text-sm text-slate-400">Total users</p>

            <p className="mt-2 text-3xl font-semibold text-white">
              {totalUsers}
            </p>
          </div>

          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-300">
            <Users className="h-5 w-5" />
          </div>
        </CardContent>
      </Card>

      {/* Total Division Types */}
      <Card className="border-white/[0.08] bg-[#0a1015] text-slate-100 shadow-none">
        <CardContent className="flex items-center justify-between p-5">
          <div>
            <p className="text-sm text-slate-400">Total division types</p>

            <p className="mt-2 text-3xl font-semibold text-white">
              {totalTypes}
            </p>
          </div>

          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-500/10 text-violet-300">
            <ShieldCheck className="h-5 w-5" />
          </div>
        </CardContent>
      </Card>
    </section>
  );
};

export default UserStats;
