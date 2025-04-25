"use client";
import React, { useState, useEffect } from "react";
import { getRevenueSummary } from "@/ultis/revenueapi";
import { RevenueSummaryResponse } from "@/type/revenue";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

const RevenuePage: React.FC = () => {
  const [fromDate, setFromDate] = useState<string>("");
  const [toDate, setToDate] = useState<string>("");
  const [summary, setSummary] = useState<RevenueSummaryResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const setRange = (rangeType: string) => {
    const now = new Date();
    let from: Date;

    switch (rangeType) {
      case "7days":
        from = new Date();
        from.setDate(now.getDate() - 7);
        break;
      case "thisMonth":
        from = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      case "3months":
        from = new Date(now.getFullYear(), now.getMonth() - 2, 1);
        break;
      case "6months":
        from = new Date(now.getFullYear(), now.getMonth() - 5, 1);
        break;
      case "1year":
        from = new Date(now.getFullYear() - 1, now.getMonth(), 1);
        break;
      default:
        from = new Date();
        from.setDate(now.getDate() - 7);
        break;
    }

    const fromStr = from.toISOString().split("T")[0];
    const toStr = now.toISOString().split("T")[0];

    setFromDate(fromStr);
    setToDate(toStr);
    fetchSummary(fromStr, toStr);
  };

  useEffect(() => {
    setRange("7days");
  }, []);

  const fetchSummary = async (from: string, to: string) => {
    if (!from || !to) return;
    setLoading(true);
    setError("");
    try {
      const response = await getRevenueSummary({ from, to });
      setSummary(response);
    } catch (err) {
      setError("Lấy dữ liệu thất bại. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  const chartData = summary
    ? [
        { name: "Doanh thu (VND)", value: summary.data.totalRevenue },
        { name: "Đơn hàng", value: summary.data.totalOrders },
        { name: "Sản phẩm bán", value: summary.data.totalProductsSold },
      ]
    : [];

  return (
    <div className="p-8 bg-white min-h-screen font-sans">
      <div className="bg-black text-white px-6 py-4 rounded-t-2xl shadow-lg">
        <h1 className="text-2xl font-bold tracking-wide">📊 Thống kê doanh thu</h1>
      </div>

      <div className="bg-gray-50 border border-black rounded-b-2xl px-6 py-5 flex flex-wrap gap-4 items-end shadow-sm">
        <div className="flex flex-col">
          <label className="text-sm font-medium text-black mb-1">Từ ngày</label>
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="border border-gray-400 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
          />
        </div>
        <div className="flex flex-col">
          <label className="text-sm font-medium text-black mb-1">Đến ngày</label>
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="border border-gray-400 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
          />
        </div>
        <button
          onClick={() => fetchSummary(fromDate, toDate)}
          disabled={loading || !fromDate || !toDate}
          className="bg-black text-white px-5 py-2 rounded-lg hover:bg-gray-900 transition disabled:opacity-50"
        >
          {loading ? "Đang tải..." : " Lấy dữ liệu"}
        </button>

        <div className="flex flex-wrap gap-2 ml-auto">
          <button onClick={() => setRange("7days")} className="px-4 py-1.5 border border-black rounded-lg text-sm hover:bg-black hover:text-white transition">7 ngày</button>
          <button onClick={() => setRange("thisMonth")} className="px-4 py-1.5 border border-black rounded-lg text-sm hover:bg-black hover:text-white transition">Tháng này</button>
          <button onClick={() => setRange("3months")} className="px-4 py-1.5 border border-black rounded-lg text-sm hover:bg-black hover:text-white transition">3 tháng</button>
          <button onClick={() => setRange("6months")} className="px-4 py-1.5 border border-black rounded-lg text-sm hover:bg-black hover:text-white transition">6 tháng</button>
          <button onClick={() => setRange("1year")} className="px-4 py-1.5 border border-black rounded-lg text-sm hover:bg-black hover:text-white transition">1 năm</button>
        </div>
      </div>

      {error && (
        <div className="text-red-600 mt-4 font-medium text-center">{error}</div>
      )}

      {summary && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="p-5 bg-white rounded-xl border border-black shadow-md">
            <h2 className="text-base font-medium text-black mb-1">Tổng doanh thu</h2>
            <p className="text-2xl font-extrabold text-black">
              {summary.data.totalRevenue.toLocaleString("vi-VN")} VND
            </p>
          </div>
          <div className="p-5 bg-white rounded-xl border border-black shadow-md">
            <h2 className="text-base font-medium text-black mb-1">Tổng đơn hàng</h2>
            <p className="text-2xl font-extrabold text-black">
              {summary.data.totalOrders}
            </p>
          </div>
          <div className="p-5 bg-white rounded-xl border border-black shadow-md">
            <h2 className="text-base font-medium text-black mb-1">Tổng sản phẩm bán</h2>
            <p className="text-2xl font-extrabold text-black">
              {summary.data.totalProductsSold}
            </p>
          </div>
        </div>
      )}

      {summary && (
        <div className="p-6 mt-8 bg-white rounded-xl border border-black shadow-md">
          <h2 className="text-lg font-bold text-black mb-4">📈 Biểu đồ tóm tắt</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" tick={{ fill: "#000" }} />
              <YAxis tick={{ fill: "#000" }} />
              <Tooltip />
              <Bar dataKey="value" fill="#000" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default RevenuePage;
