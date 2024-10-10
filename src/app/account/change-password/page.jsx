"use client";

import FormChangePassword from "@/components/FormChangePassword";

const AccountChangePasswordPage = () => {
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
