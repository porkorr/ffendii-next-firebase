"use client";

import { useState, useEffect } from "react";
import { auth } from "@/utils/firebase";
import FormChangeEmail from "@/components/FormChangeEmail";
import Loading from "@/components/Loading";

const AccountChangeEmailPage = () => {
  const [loading, setLoading] = useState(true);
  const [isVerified, setIsVerified] = useState(auth.currentUser?.emailVerified || false);

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
    <div className="account-email fade-in">
      {isVerified ? (
        <div className="verified">
          <div>
            <h4>Your email is verified!</h4>
          </div>
          <div>
            <p>
              You’re all set to update your email address. Simply enter your new email below and hit update when you’re
              ready.
            </p>
          </div>
        </div>
      ) : (
        <div className="not-verified">
          <div>
            <h4>Your email isn’t verified yet.</h4>
          </div>
          <div>
            <p>
              Before you can update your email, please take a moment to verify your current one. Once verified, you’ll
              be able to proceed with updating it without any issues.
            </p>
          </div>
        </div>
      )}
      {/* <h4>Change Your Email Address</h4>
      <p>Users can update their email address for convenience and to keep their contact information up to date. </p> */}
      <FormChangeEmail isVerified={isVerified} setIsVerified={setIsVerified} />
    </div>
  );
};

export default AccountChangeEmailPage;
