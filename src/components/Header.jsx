"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { message } from "antd";
import { IoHomeSharp } from "react-icons/io5";
import { MdDashboardCustomize } from "react-icons/md";
import { FaUserAstronaut } from "react-icons/fa";
import { RiPlayListAddLine } from "react-icons/ri";
import { FaPowerOff } from "react-icons/fa6";
import { RiMoneyDollarCircleLine } from "react-icons/ri";
import useAuth from "@/hooks/useAuth";
import Link from "next/link";

const Header = () => {
  const { user, logout } = useAuth();
  const [isMounted, setIsMounted] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const pathname = usePathname();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleLogout = () => {
    logout();
    message.success("See you later!");
  };

  if (!isMounted) {
    return null;
  }

  return (
    <header className={`${scrollY >= 50 ? "active" : ""}`.trim()}>
      <div className="header-container">
        <div>
          <Link href="/" className="logo">
            <IoHomeSharp size={18} />
          </Link>
        </div>
        <div>
          {user?.role && (
            <div className="menu-hamber">
              <div>
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          )}
          {user?.role === "admin" ? (
            <nav className="login">
              <ul>
                <li>
                  <Link href="/request" className="normal">
                    <RiPlayListAddLine size={20} />
                    Request
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard" className="normal">
                    <MdDashboardCustomize size={20} />
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link href="/account" className="normal">
                    <FaUserAstronaut size={20} />
                    {user?.displayName}
                  </Link>
                </li>
                <li>
                  <a className="logout" onClick={handleLogout}>
                    <FaPowerOff size={18} />
                  </a>
                </li>
              </ul>
            </nav>
          ) : user?.role === "member" ? (
            <nav className="login">
              <ul>
                <li>
                  <Link href="/request" className="normal">
                    <RiPlayListAddLine size={20} />
                    Request
                  </Link>
                </li>
                <li>
                  <Link href="https://easydonate.app/ffendii" className="normal" target="_blank">
                    <RiMoneyDollarCircleLine size={24} />
                    Donate
                  </Link>
                </li>
                <li>
                  <Link href="/account" className="normal">
                    <FaUserAstronaut size={20} />
                    {user?.displayName}
                  </Link>
                </li>
                <li>
                  <a className="logout" onClick={handleLogout}>
                    <FaPowerOff size={18} />
                  </a>
                </li>
              </ul>
            </nav>
          ) : (
            <nav className="no-login">
              <ul>
                {pathname !== "/auth/login" && (
                  <li>
                    <Link href="/auth/login" className="normal">
                      Login
                    </Link>
                  </li>
                )}
                {pathname !== "/auth/register" && (
                  <li>
                    <Link href="/auth/register" className="normal">
                      Register
                    </Link>
                  </li>
                )}
              </ul>
            </nav>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
