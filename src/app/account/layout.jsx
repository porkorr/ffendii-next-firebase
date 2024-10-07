"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import useAuth from "@/hooks/useAuth";
import Loading from "@/components/Loading";
import Link from "next/link";
import "@/styles/account.css";

const AccountPage = ({ children }) => {
  const { user, isLoading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/");
    }
  }, [user, isLoading, pathname]);

  if (isLoading) {
    return <Loading className="loading w-screen h-screen" />;
  }

  return (
    <main className="fade-in">
      <div className="account">
        <div className="account-title">
          <h2>Manage Accounts</h2>
        </div>
        <div className="account-content">
          <div className="account-menu">
            <ul>
              <li>
                <Link href="/account/profile" className={pathname === "/account/profile" ? "active" : null}>
                  Profile
                </Link>
              </li>
              <li>
                <Link href="/account/change-email" className={pathname === "/account/change-email" ? "active" : null}>
                  Change Email
                </Link>
              </li>
              <li>
                <Link
                  href="/account/change-password"
                  className={pathname === "/account/change-password" ? "active" : null}
                >
                  Change Password
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

export default AccountPage;
