import { useMemo, useState, useEffect } from "react";

import {
  Activity,
  ArrowLeft,
  ArrowRight,
  BarChart3,
  Building2,
  CheckCircle2,
  Gauge,
  List,
  Radio,
  Zap,
} from "lucide-react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useLocation, useNavigate } from "react-router";

const DEFAULT_METERS = 8;

const ReportTable = ({
  data = {},
  showMeters = DEFAULT_METERS,
  headerAllow = false,
  pagiantionAllow = false,
}) => {
  const [currentPage, setCurrentPage] = useState(1);

  // --------------------------------
  // Display Limit
  // --------------------------------

  const metersPerPage = useMemo(() => {
    const value = Number(showMeters);

    if (!Number.isFinite(value) || value <= 0) {
      return DEFAULT_METERS;
    }

    return Math.floor(value);
  }, [showMeters]);

  // --------------------------------
  // Department Data
  // --------------------------------

  const departmentData = useMemo(() => {
    const departments = data?.departments?.data;

    if (
      !departments ||
      typeof departments !== "object" ||
      Array.isArray(departments)
    ) {
      return {};
    }

    return departments;
  }, [data]);

  // --------------------------------
  // Flatten All Meters
  // --------------------------------

  const allMeters = useMemo(() => {
    return Object.entries(departmentData).flatMap(([department, meters]) => {
      if (!Array.isArray(meters)) {
        return [];
      }

      return meters.map((meter, index) => ({
        ...meter,
        _department: department,
        _index: index,
      }));
    });
  }, [departmentData]);

  // --------------------------------
  // Total Meters
  // --------------------------------

  const totalMeters = allMeters.length;

  // --------------------------------
  // Department Count
  // --------------------------------

  const totalDepartments = Object.keys(departmentData).length;

  // --------------------------------
  // Pagination
  // --------------------------------

  const totalPages = Math.max(1, Math.ceil(totalMeters / metersPerPage));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (safeCurrentPage - 1) * metersPerPage;
  const endIndex = Math.min(startIndex + metersPerPage, totalMeters);

  const visibleMeters = pagiantionAllow
    ? allMeters.slice(startIndex, endIndex)
    : allMeters.slice(0, metersPerPage);

  // --------------------------------
  // Reset Page
  // --------------------------------

  useEffect(() => {
    setCurrentPage(1);
  }, [data, metersPerPage, pagiantionAllow]);

  // --------------------------------
  // Page Navigation
  // --------------------------------

  const goToPreviousPage = () => {
    setCurrentPage((page) => Math.max(1, page - 1));
  };

  const goToNextPage = () => {
    setCurrentPage((page) => Math.min(totalPages, page + 1));
  };

  // --------------------------------
  // Number Formatter
  // --------------------------------

  const formatNumber = (value) => {
    const numericValue = Number(value);

    if (!Number.isFinite(numericValue)) {
      return "—";
    }

    return numericValue.toLocaleString(undefined, {
      maximumFractionDigits: 2,
    });
  };

  // --------------------------------
  // Meter Status
  // --------------------------------

  const getMeterStatus = (meter) => {
    const status = String(meter?.status || meter?.state || "")
      .trim()
      .toLowerCase();

    if (status === "running" || status === "on" || status === "active") {
      return {
        label: "ACTIVE",
        className:
          "border-emerald-400/10 bg-emerald-400/[0.06] text-emerald-300",
        icon: CheckCircle2,
      };
    }

    if (status === "off" || status === "stopped" || status === "inactive") {
      return {
        label: "OFF",
        className: "border-slate-400/10 bg-slate-400/[0.05] text-slate-500",
        icon: Radio,
      };
    }

    return {
      label: "CONFIGURED",
      className: "border-cyan-400/10 bg-cyan-400/[0.05] text-cyan-300",
      icon: Radio,
    };
  };

  // --------------------------------
  // Value Resolver
  // --------------------------------

  const getMeterValue = (meter) => {
    const possibleValues = [
      meter?.value,
      meter?.reading,
      meter?.parameter,
      meter?.consumption,
      meter?.power,
    ];

    for (const value of possibleValues) {
      if (
        value !== null &&
        value !== undefined &&
        Number.isFinite(Number(value))
      ) {
        return Number(value);
      }
    }

    return null;
  };

  // --------------------------------
  // Meter List Alert
  // --------------------------------

  const navigate = useNavigate();
  const location = useLocation();

  const handleMeterList = () => {
    console.log(location.pathname);

    navigate(`${location.pathname}/list`);
  };

  return (
    <Card
      className="
        min-w-0
        overflow-hidden
        rounded-2xl
        border-white/[0.07]
        bg-[#090F15]/80
        text-white
        shadow-none
        backdrop-blur-xl
      "
    >
      {/* ===================================================== */}
      {/* HEADER */}
      {/* ===================================================== */}

      {headerAllow && (
        <CardHeader
          className="
            border-b
            border-white/[0.06]
            px-4
            py-4
            sm:px-5
          "
        >
          <div className="flex items-start justify-between gap-4">
            {/* Left */}
            <div className="flex min-w-0 items-start gap-3">
              <div
                className="
                  flex
                  h-10
                  w-10
                  shrink-0
                  items-center
                  justify-center
                  rounded-xl
                  border
                  border-cyan-400/10
                  bg-cyan-400/[0.05]
                "
              >
                <BarChart3
                  size={19}
                  strokeWidth={1.8}
                  className="text-cyan-400"
                />
              </div>

              <div className="min-w-0">
                <CardTitle className="text-sm font-semibold text-white">
                  Energy Meter Details
                </CardTitle>

                <CardDescription className="mt-1 text-[10px] text-slate-500">
                  Department-wise meter configuration
                </CardDescription>
              </div>
            </div>
          </div>

          {/* Summary */}
          <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
            {/* Total Meters */}
            <div
              className="
                rounded-xl
                border
                border-white/[0.05]
                bg-white/[0.015]
                px-3
                py-2.5
              "
            >
              <div className="flex items-center gap-2">
                <Gauge size={13} className="text-cyan-400/70" />

                <span className="text-[9px] uppercase tracking-[0.08em] text-slate-600">
                  Total Meters
                </span>
              </div>

              <div className="mt-1 text-lg font-semibold text-white">
                {totalMeters}
              </div>
            </div>

            {/* Departments */}
            <div
              className="
                rounded-xl
                border
                border-white/[0.05]
                bg-white/[0.015]
                px-3
                py-2.5
              "
            >
              <div className="flex items-center gap-2">
                <Building2 size={13} className="text-violet-400/70" />

                <span className="text-[9px] uppercase tracking-[0.08em] text-slate-600">
                  Departments
                </span>
              </div>

              <div className="mt-1 text-lg font-semibold text-white">
                {totalDepartments}
              </div>
            </div>

            {/* Showing */}
            <div
              className="
                hidden
                rounded-xl
                border
                border-white/[0.05]
                bg-white/[0.015]
                px-3
                py-2.5
                sm:block
              "
            >
              <div className="flex items-center gap-2">
                <Activity size={13} className="text-emerald-400/70" />

                <span className="text-[9px] uppercase tracking-[0.08em] text-slate-600">
                  Showing
                </span>
              </div>

              <div className="mt-1 text-sm font-semibold text-white">
                {totalMeters > 0
                  ? pagiantionAllow
                    ? `${startIndex + 1}-${endIndex}`
                    : `1-${Math.min(metersPerPage, totalMeters)}`
                  : "0"}

                <span className="ml-1 text-[10px] font-normal text-slate-600">
                  / {totalMeters}
                </span>
              </div>
            </div>
          </div>
        </CardHeader>
      )}

      {/* ===================================================== */}
      {/* TABLE */}
      {/* ===================================================== */}

      <CardContent className="p-0">
        <div className="w-full overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-white/[0.06] bg-white/[0.015] hover:bg-white/[0.015]">
                <TableHead className="min-w-[190px] px-4 text-[10px] uppercase tracking-[0.06em] text-slate-500">
                  Meter
                </TableHead>

                <TableHead className="min-w-[120px] text-[10px] uppercase tracking-[0.06em] text-slate-500">
                  Department
                </TableHead>

                <TableHead className="min-w-[150px] text-[10px] uppercase tracking-[0.06em] text-slate-500">
                  Sub Section
                </TableHead>

                <TableHead className="min-w-[100px] text-[10px] uppercase tracking-[0.06em] text-slate-500">
                  Status
                </TableHead>

                <TableHead className="min-w-[90px] text-right text-[10px] uppercase tracking-[0.06em] text-slate-500">
                  Value
                </TableHead>

                <TableHead className="min-w-[90px] text-right text-[10px] uppercase tracking-[0.06em] text-slate-500">
                  Code
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {visibleMeters.length === 0 ? (
                <TableRow className="border-white/[0.05] hover:bg-transparent">
                  <TableCell colSpan={6} className="h-40 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <div
                        className="
                          flex
                          h-10
                          w-10
                          items-center
                          justify-center
                          rounded-xl
                          border
                          border-white/[0.06]
                          bg-white/[0.02]
                        "
                      >
                        <Zap size={17} className="text-slate-600" />
                      </div>

                      <p className="mt-3 text-xs text-slate-500">
                        No meter data available
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                visibleMeters.map((meter, index) => {
                  const status = getMeterStatus(meter);
                  const StatusIcon = status.icon;

                  const value = getMeterValue(meter);

                  const meterName =
                    meter?.meter_name || meter?.name || `Meter ${index + 1}`;

                  const department =
                    meter?._department || meter?.department || "Not Defined";

                  const subSection = meter?.sub_section || "—";

                  const meterCode = meter?.meter_code ?? "—";

                  return (
                    <TableRow
                      key={`${department}-${meterCode}-${meter?._index ?? index}`}
                      className="
                        group
                        border-white/[0.05]
                        transition-colors
                        hover:bg-white/[0.025]
                      "
                    >
                      {/* Meter */}
                      <TableCell className="px-4 py-3">
                        <div className="flex min-w-0 items-center gap-3">
                          <div
                            className="
                              flex
                              h-8
                              w-8
                              shrink-0
                              items-center
                              justify-center
                              rounded-lg
                              border
                              border-cyan-400/[0.08]
                              bg-cyan-400/[0.035]
                            "
                          >
                            <Zap
                              size={14}
                              strokeWidth={1.8}
                              className="text-cyan-400/80"
                            />
                          </div>

                          <div className="min-w-0">
                            <p
                              className="
                                truncate
                                text-xs
                                font-medium
                                text-slate-200
                              "
                              title={meterName}
                            >
                              {meterName}
                            </p>

                            <p className="mt-0.5 text-[9px] text-slate-600">
                              {meter?.mode || "—"}
                            </p>
                          </div>
                        </div>
                      </TableCell>

                      {/* Department */}
                      <TableCell>
                        <span
                          className="
                            inline-flex
                            items-center
                            rounded-md
                            border
                            border-violet-400/10
                            bg-violet-400/[0.04]
                            px-2
                            py-1
                            text-[10px]
                            font-medium
                            text-violet-300
                          "
                        >
                          {department}
                        </span>
                      </TableCell>

                      {/* Sub Section */}
                      <TableCell className="text-xs text-slate-400">
                        <span
                          className="block max-w-[180px] truncate"
                          title={subSection}
                        >
                          {subSection}
                        </span>
                      </TableCell>

                      {/* Status */}
                      <TableCell>
                        <span
                          className={`
                            inline-flex
                            items-center
                            gap-1.5
                            rounded-md
                            border
                            px-2
                            py-1
                            text-[9px]
                            font-semibold
                            tracking-[0.04em]
                            ${status.className}
                          `}
                        >
                          <StatusIcon size={11} strokeWidth={2} />

                          {status.label}
                        </span>
                      </TableCell>

                      {/* Value */}
                      <TableCell className="text-right">
                        <span className="font-mono text-xs font-semibold text-slate-200">
                          {value !== null ? formatNumber(value) : "—"}
                        </span>
                      </TableCell>

                      {/* Code */}
                      <TableCell className="text-right">
                        <span className="font-mono text-[10px] text-slate-500">
                          {meterCode}
                        </span>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>

        {/* =================================================== */}
        {/* FOOTER */}
        {/* =================================================== */}

        {pagiantionAllow ? (
          totalMeters > 0 && (
            <div
              className="
                flex
                flex-col
                gap-3
                border-t
                border-white/[0.06]
                px-4
                py-3
                sm:flex-row
                sm:items-center
                sm:justify-between
                sm:px-5
              "
            >
              {/* Info */}
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-slate-600">Showing</span>

                <span className="text-[10px] font-medium text-slate-400">
                  {startIndex + 1}-{endIndex}
                </span>

                <span className="text-[10px] text-slate-700">of</span>

                <span className="text-[10px] font-medium text-slate-400">
                  {totalMeters}
                </span>

                <span className="text-[10px] text-slate-700">meters</span>
              </div>

              {/* Controls */}
              <div className="flex items-center justify-between gap-3 sm:justify-end">
                {/* Page */}
                <div
                  className="
                    flex
                    items-center
                    gap-1.5
                    rounded-lg
                    border
                    border-white/[0.06]
                    bg-white/[0.02]
                    px-2.5
                    py-1.5
                  "
                >
                  <span className="text-[10px] font-medium text-cyan-300">
                    {safeCurrentPage}
                  </span>

                  <span className="text-[10px] text-slate-700">/</span>

                  <span className="text-[10px] text-slate-500">
                    {totalPages}
                  </span>
                </div>

                {/* Buttons */}
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={goToPreviousPage}
                    disabled={safeCurrentPage === 1}
                    className="
                      flex
                      h-8
                      w-8
                      items-center
                      justify-center
                      rounded-lg
                      border
                      border-white/[0.06]
                      bg-white/[0.02]
                      text-slate-500
                      transition-all
                      hover:border-cyan-400/20
                      hover:bg-cyan-400/[0.05]
                      hover:text-cyan-300
                      disabled:cursor-not-allowed
                      disabled:opacity-30
                    "
                  >
                    <ArrowLeft size={14} strokeWidth={1.8} />
                  </button>

                  <button
                    type="button"
                    onClick={goToNextPage}
                    disabled={safeCurrentPage === totalPages}
                    className="
                      flex
                      h-8
                      w-8
                      items-center
                      justify-center
                      rounded-lg
                      border
                      border-white/[0.06]
                      bg-white/[0.02]
                      text-slate-500
                      transition-all
                      hover:border-cyan-400/20
                      hover:bg-cyan-400/[0.05]
                      hover:text-cyan-300
                      disabled:cursor-not-allowed
                      disabled:opacity-30
                    "
                  >
                    <ArrowRight size={14} strokeWidth={1.8} />
                  </button>
                </div>
              </div>
            </div>
          )
        ) : (
          /* Full Meter List Button */
          <div
            className="
              flex
              items-center
              justify-end
              border-t
              border-white/[0.06]
              px-4
              py-3
              sm:px-5
            "
          >
            <button
              type="button"
              onClick={handleMeterList}
              className="
                inline-flex
                items-center
                gap-2
                rounded-lg
                border
                border-cyan-400/15
                bg-cyan-400/[0.05]
                px-3
                py-2
                text-[10px]
                font-medium
                text-cyan-300
                transition-all
                duration-200
                hover:border-cyan-400/30
                hover:bg-cyan-400/[0.09]
                hover:text-cyan-200 cursor-pointer
              "
            >
              <List size={14} strokeWidth={1.8} />

              <span>View Full Meter List</span>

              <ArrowRight size={13} strokeWidth={1.8} />
            </button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ReportTable;
