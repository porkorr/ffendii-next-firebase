"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import Loading from "@/components/Loading";
import useAuth from "@/hooks/useAuth";
import Image from "next/image";
import "@/styles/authentication.css";

const AuthPage = ({ children }) => {
  const { user, isLoading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && user) {
      router.push("/");
    }
  }, [user, isLoading, pathname]);

  if (isLoading) {
    return <Loading className="loading fixed top-0 w-screen h-screen" />;
  }

  return (
    <div className="authentication">
      <div className="image">
        <Image src="/images/DSC07337.png" alt="Picture of the author" width={250} height={333} />
      </div>
      <div className="modal fade-in">{children}</div>
    </div>
  );
};

export default AuthPage;
