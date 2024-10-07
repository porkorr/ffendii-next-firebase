"use client";

import { useState } from "react";
import FormAuthForgotPassword from "@/components/FormAuthForgotPassword";
import Link from "next/link";

const LoginPage = () => {
  const [title, setTitle] = useState("Forgot password");
  const [subTitle, setSubTitle] = useState(
    "Please enter your email, and we'll send you a link to reset your password."
  );

  return (
    <>
      <div className="text-header">
        <h2>{title}</h2>
        <p>{subTitle}</p>
      </div>
      <FormAuthForgotPassword />
      <div className="text-footer">
        <p>
          Go back to <Link href="/auth/login">Login</Link>
        </p>
      </div>
    </>
  );
};

export default LoginPage;
