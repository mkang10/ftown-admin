"use client";

import { ReactNode, useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";

interface AuthGuardProps {
  children: ReactNode;
}

const publicRoutes = ["/", "/unauthorized", "/register"];

const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");

    // Check lại sau khi pathname chắc chắn có giá trị
    const isPublic = publicRoutes.includes(pathname);
    if (isPublic) {
      setChecked(true);
      return;
    }

    if (!token) {
      toast.error("Bạn không có quyền truy cập vào trang web");
      router.replace("/unauthorized");
    } else {
      setChecked(true);
    }
  }, [pathname, router]);

  if (!checked) return null;

  return (
    <>
      {children}
    </>
  );
};

export default AuthGuard;
