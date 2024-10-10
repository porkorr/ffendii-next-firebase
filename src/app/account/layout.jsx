"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import useAuth from "@/hooks/useAuth";
import Link from "next/link";
import "@/styles/account.css";

const AccountPage = ({ children }) => {
  const { user } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push("/");
    }
  }, [user, pathname]);

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
