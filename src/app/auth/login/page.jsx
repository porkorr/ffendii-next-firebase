"use client";

import { useState, useEffect } from "react";
import { loginTexts } from "@/utils/authTexts";
import { randomText } from "@/utils/utils";
import FormAuthLogin from "@/components/FormAuthLogin";
import Link from "next/link";

const LoginPage = () => {
  const [title, setTitle] = useState("");
  const [subTitle, setSubTitle] = useState("");

  useEffect(() => {
    setTitle(randomText(loginTexts.titleArray));
    setSubTitle(randomText(loginTexts.subTitleArray));
  }, []);

  return (
    <>
      <div className="text-header">
        <h2>{title}</h2>
        <p>{subTitle}</p>
      </div>
      <FormAuthLogin />
      <div className="text-footer">
        <p>
          <Link href="/auth/forgot-password">Forgot your password?</Link>
        </p>
        <p>
          Don't have an account? <Link href="/auth/register">Sign up for free</Link>
        </p>
      </div>
    </>
  );
};

export default LoginPage;
