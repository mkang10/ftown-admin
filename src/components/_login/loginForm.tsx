"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import toast, { Toaster } from "react-hot-toast";
import { loginUser } from "@/ultis/AuthAPI";
import { LoginResponse } from "@/type/auth";

export default function LoginPage() {
  const router = useRouter();
  const [email, setemail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // Hiệu ứng chuyển đổi logo/tiêu đề (giữ nguyên UI)
  const [showLogo, setShowLogo] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);
  useEffect(() => {
    const interval = setInterval(() => {
      setFadeOut(true);
      setTimeout(() => {
        setShowLogo((prev) => !prev);
        setFadeOut(false);
      }, 1250);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  // Xử lý đăng nhập: gọi API qua loginUser và hiển thị toast
  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const credentials = { email: email, password: password };
    try {
      const response: LoginResponse = await loginUser(credentials);
      if (response.status) {
        toast.success(response.message || "Login successful!", {
          duration: 4000,
          style: {
            borderRadius: "12px",
            background: "linear-gradient(90deg, #2152ff, #21d4fd)",
            color: "#fff",
            fontWeight: 500,
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.15)",
          },
          iconTheme: {
            primary: "#4ade80",
            secondary: "#fff",
          },
        });
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("account", JSON.stringify(response.data.account));
        setTimeout(() => {
          router.push("/dashboard");
        }, 2000);
      } else {
        toast.error(response.message || "Login failed!", {
          duration: 4000,
          style: {
            borderRadius: "12px",
            background: "#ff4d4d",
            color: "#fff",
            fontWeight: 500,
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.15)",
          },
          iconTheme: {
            primary: "#ff0000",
            secondary: "#fff",
          },
        });
      }
    } catch (error: any) {
      console.error("Login error:", error);
      toast.error(
        error.response?.data?.message ||
          "An error occurred during login. Please try again later.",
        {
          duration: 4000,
          style: {
            borderRadius: "12px",
            background: "#ff4d4d",
            color: "#fff",
            fontWeight: 500,
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.15)",
          },
          iconTheme: {
            primary: "#ff0000",
            secondary: "#fff",
          },
        }
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen w-full bg-white">
      {/* NAVBAR */}
      <nav className="w-full bg-white shadow">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="text-lg font-bold text-gray-700">Ftown Admin</div>
        </div>
      </nav>

      {/* BANNER (50vh, margin, bo góc) */}
      <div
        className="relative w-11/12 mx-auto mt-8 h-[50vh] bg-cover bg-center rounded-xl shadow-lg overflow-hidden"
        style={{ backgroundImage: "url('/assets/pexels-steve-29599682.avif')" }}
      >
        {/* Overlay tối nhẹ */}
        <div className="absolute inset-0 bg-black/30"></div>
        {/* Nội dung banner */}
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center text-white px-4">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Welcome Back!</h1>
          <p className="text-sm md:text-base max-w-md">
            Enter your email and password to login
          </p>
        </div>
      </div>

      {/* FORM chồng lên banner (dùng margin-top âm) */}
      <div className="container mx-auto px-4">
        <div className="relative -mt-16 w-full max-w-md mx-auto bg-white rounded-xl shadow-lg p-6 md:p-8">
          {/* Tiêu đề form */}
          <h2 className="text-center text-xl font-bold text-gray-700 mb-4">Login</h2>
          {/* Form đăng nhập */}
          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 mb-1">
              email
              </label>
              <input
                type="text"
                placeholder="email"
                value={email}
                onChange={(e) => setemail(e.target.value)}
                className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            {/* Nút LOG IN */}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg py-2.5 text-sm font-bold uppercase text-white shadow-md transition-all hover:opacity-90"
              style={{
                background: "linear-gradient(310deg, #2152ff 0%, #21d4fd 100%)",
              }}
            >
              {loading ? "Logging in..." : "LOG IN"}
            </button>
          </form>
        </div>
      </div>

      {/* FOOTER */}
      <footer className="mt-52 border-t border-gray-100 py-6">
        <div className="container mx-auto flex flex-col items-center">
          <div className="text-sm text-gray-500">2025 © by Kang .</div>
        </div>
      </footer>

      {/* Toaster for react-hot-toast */}    
      <Toaster />
      </div>
      
  );
}
