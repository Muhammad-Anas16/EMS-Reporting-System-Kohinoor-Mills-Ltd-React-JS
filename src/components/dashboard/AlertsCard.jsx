import {
  AlertTriangle,
  Bell,
  BarChart3,
  Flame,
  WifiOff,
  Zap,
} from "lucide-react";

import Panel from "./Panel";

import { alerts } from "../../data/dashboardData";

const iconMap = {
  zap: Zap,
  flame: Flame,
  chart: BarChart3,
  "wifi-off": WifiOff,
};

const severityClass = {
  high: "border-red-400/30 bg-red-500/10 text-red-400",
  medium: "border-amber-400/30 bg-amber-500/10 text-amber-400",
  warning: "border-yellow-400/30 bg-yellow-500/10 text-yellow-400",
  offline: "border-sky-400/30 bg-sky-500/10 text-sky-400",
};

const AlertsCard = () => {
  return (
    <Panel className="overflow-hidden">
      <div className="flex items-center justify-between px-4 pt-4">
        <div className="flex items-center gap-2">
          <Bell size={17} className="text-slate-400" />

          <h3 className="text-sm font-semibold text-slate-100">Alerts</h3>

          <span className="rounded-full bg-red-500/15 px-2 py-0.5 text-[10px] font-semibold text-red-400">
            {alerts.length}
          </span>
        </div>
      </div>

      <div className="mt-2">
        {alerts.slice(0, 3).map((alert, index) => {
          const Icon = iconMap[alert.icon] || AlertTriangle;

          const iconClass =
            severityClass[alert.severity] || severityClass.warning;

          return (
            <div
              key={alert.id}
              className={`px-4 py-3 ${
                index !== 2 ? "border-b border-white/[0.05]" : ""
              }`}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border ${iconClass}`}
                >
                  <Icon size={15} />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <p className="truncate text-xs font-medium text-slate-200">
                      {alert.type}
                    </p>

                    <span className="shrink-0 text-[9px] text-slate-500">
                      {alert.time?.replace("Today, ", "")}
                    </span>
                  </div>

                  <p className="mt-0.5 truncate text-[10px] text-slate-500">
                    {alert.location}
                  </p>

                  <p className="mt-1 truncate text-[10px] text-slate-600">
                    {alert.description}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Panel>
  );
};

export default AlertsCard;
