"use client";

import { useState, useEffect } from "react";
import { registerTexts } from "@/utils/authTexts";
import { randomText } from "@/utils/utils";
import FormAuthRegister from "@/components/FormAuthRegister";
import Link from "next/link";

const RegisterPage = () => {
  const [title, setTitle] = useState("");
  const [subTitle, setSubTitle] = useState("");

  useEffect(() => {
    setTitle(randomText(registerTexts.titleArray));
    setSubTitle(randomText(registerTexts.subTitleArray));
  }, []);

  return (
    <>
      <div className="text-header">
        <h2>{title}</h2>
        <p>{subTitle}</p>
      </div>
      <FormAuthRegister />
      <div className="text-footer">
        <p>
          Already have an account?{" "}
          <Link href="/auth/login" className="text-[#acb0b9]">
            Login
          </Link>
        </p>
      </div>
    </>
  );
};

export default RegisterPage;
