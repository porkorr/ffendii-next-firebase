"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import useAuth from "@/hooks/useAuth";
import Link from "next/link";
import "@/styles/dashboard.css";

const DashboardPage = ({ children }) => {
  const { user } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (user?.role !== "admin") {
      router.push("/");
    }
  }, [user, pathname]);

  return (
    <main className="fade-in">
      <div className="dashboard">
        <div className="dashboard-title">
          <h2>Dashboard</h2>
        </div>
        <div className="dashboard-content">
          <div className="dashboard-menu">
            <ul>
              <li>
                <Link href="/dashboard/request" className={pathname === "/dashboard/request" ? "active" : null}>
                  Request
                </Link>
              </li>
              <li>
                <Link href="/dashboard/users" className={pathname === "/dashboard/users" ? "active" : null}>
                  Users
                </Link>
              </li>
              <li>
                <Link href="/dashboard/settings" className={pathname === "/dashboard/settings" ? "active" : null}>
                  Settings
                </Link>
              </li>
            </ul>
          </div>
          {children}
        </div>
      </div>
    </main>
  );
};

export default DashboardPage;
