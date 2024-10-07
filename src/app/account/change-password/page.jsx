"use client";

import { useState, useEffect } from "react";
import FormChangePassword from "@/components/FormChangePassword";
import Loading from "@/components/Loading";

const AccountChangePasswordPage = () => {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <Loading className="loading w-full full" />;
  }

  return (
    <div className="account-password fade-in">
      <div className="text">
        <h4>Change Your Password</h4>
        <p>Allows users to modify the password used for logging into their account.</p>
      </div>
      <FormChangePassword />
    </div>
  );
};

export default AccountChangePasswordPage;
