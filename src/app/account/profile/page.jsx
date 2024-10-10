"use client";

import FormChangeProfile from "@/components/FormChangeProfile";

const AccountProfilePage = () => {
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
