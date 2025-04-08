"use client";

import React from 'react';
import StatsCard from '@/components/StatCard';
import { FaUsers, FaDollarSign, FaUserPlus, FaChartLine } from 'react-icons/fa';

export default function DashboardPage() {
  const colors = ["#f0f0f0", "#ffffff"]; // Mảng màu trắng và xám

  return (
    <div>
      {/* MAIN CONTENT */}
      <main className="p-4 md:p-6 lg:p-8">
        {/* Dòng thống kê */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatsCard
            title="Today's Money"
            value="$53,000"
            percentage="55%"
            icon={<FaDollarSign className="w-5 h-5" />}
            bgColor={colors[0]} // Màu nền xám
          />
          <StatsCard
            title="Today's Users"
            value="2,300"
            percentage="3%"
            icon={<FaUsers className="w-5 h-5" />}
            bgColor={colors[1]} // Màu nền trắng
          />
          <StatsCard
            title="New Clients"
            value="+3,462"
            percentage="2%"
            icon={<FaUserPlus className="w-5 h-5" />}
            bgColor={colors[0]} // Màu nền xám
          />
          <StatsCard
            title="Sales"
            value="$103,430"
            percentage="5%"
            icon={<FaChartLine className="w-5 h-5" />}
            bgColor={colors[1]} // Màu nền trắng
          />
        </div>

        {/* Row nội dung: ví dụ 2 card */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow p-4">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              Build by developers
            </h3>
            <p className="text-sm text-gray-600">
              Soft UI Dashboard <strong>From colors, cards, typography</strong> to complex
              elements, you will find the full documentation.
            </p>
          </div>
          <div className="bg-white rounded-xl shadow p-4">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              Work with the rockets
            </h3>
            <p className="text-sm text-gray-600">
              Wealth creation is an evolutionary recent positive-sum game.
              It is all about who takes the opportunity first.
            </p>
          </div>
        </div>

        {/* Chart / Sales Overview placeholder */}
        <div className="bg-white rounded-xl shadow p-4 mb-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            Sales Overview
          </h3>
          <p className="text-sm text-gray-600">
            <strong>+4% more</strong> in 2021
          </p>
          <div className="mt-4 h-48 bg-gray-100 flex items-center justify-center">
            {/* Chart placeholder */}
            <span className="text-gray-400">[Chart Placeholder]</span>
          </div>
        </div>

      </main>
    </div>
  );
}