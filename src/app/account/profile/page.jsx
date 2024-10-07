"use client";

import { useState, useEffect } from "react";
import FormChangeProfile from "@/components/FormChangeProfile";
import Loading from "@/components/Loading";

const AccountProfilePage = () => {
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
    <div className="account-profile fade-in">
      <div className="text">
        <h4>Display Name</h4>
        <p>Allows users to update their display name within the application.</p>
      </div>
      <FormChangeProfile />
    </div>
  );
};

export default AccountProfilePage;
