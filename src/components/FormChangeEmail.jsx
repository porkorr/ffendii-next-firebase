"use client";

import { useEffect, useState } from "react";
import { Form, Input, Button, message } from "antd";
import {
  updateEmail,
  sendEmailVerification,
  reload,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore";
import { auth, db } from "@/utils/firebase";
import { rulesEmail } from "@/utils/validationRules";
import useAuth from "@/hooks/useAuth";
import authError from "@/utils/authError";

const FormChangeEmail = ({ isVerified, setIsVerified }) => {
  const { user } = useAuth();
  const [form] = Form.useForm();
  const [email, setEmail] = useState(auth.currentUser.email || "");
  const [isChecking, setIsChecking] = useState(false);
  const [isDisabled, setIsDisabled] = useState(true);
  const [loading, setLoading] = useState(false);

  const updateEmailInFirestore = async (email) => {
    const currentUser = auth.currentUser;
    if (!currentUser) throw new Error("No user is currently logged in.");

    const userDocRef = doc(db, "users", currentUser.uid);
    await updateDoc(userDocRef, { email: email });
  };

  const handleChangeEmailOnValuesChange = async (changedValues, allValues) => {
    const { email } = allValues;
    const isEmailSame = email === auth.currentUser.email;
    setIsDisabled(isEmailSame);
  };

  const handleChangeEmail = async (values) => {
    const { email, password } = values;
    const currentUser = auth.currentUser;

    try {
      if (isVerified) {
        setLoading(true);

        if (email === auth.currentUser.email) {
          form.setFields([{ name: "email", errors: ["This email is already in use."] }]);
          setLoading(false);
          return;
        }

        const credential = EmailAuthProvider.credential(currentUser.email, password);
        await reauthenticateWithCredential(currentUser, credential);

        await updateEmail(currentUser, email);
        await updateEmailInFirestore(email);
        setIsVerified(false);
        setLoading(false);
        form.resetFields(["password"]);
        message.success("Your email has been updated successfully!", 5);
      } else {
        await sendEmailVerification(currentUser);
        setIsChecking(true);
        form.resetFields(["password"]);
        message.warning("Please check your inbox to verify your new email address.", 5);
      }
    } catch (error) {
      // console.log(error.code);
      const { message: errorMessage, field } = authError(error);
      form.setFields([{ name: field, errors: [errorMessage] }]);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isChecking) return;
    setLoading(true);

    const checkEmailVerification = async () => {
      const currentUser = auth.currentUser;
      if (currentUser) {
        await reload(currentUser);
        if (currentUser.emailVerified) {
          message.success("Your email has been verified!");
          setIsVerified(true);
          setIsChecking(false);
          setLoading(false);
        }
      }
    };

    const interval = setInterval(checkEmailVerification, 5000);
    return () => clearInterval(interval);
  }, [isChecking]);

  return (
    <Form
      form={form}
      onFinish={handleChangeEmail}
      onValuesChange={handleChangeEmailOnValuesChange}
      initialValues={{ email }}
    >
      <Form.Item name="email" rules={rulesEmail}>
        <Input
          placeholder="Enter your new email"
          autoComplete="off"
          size="large"
          readOnly={!isVerified}
          className="!bg-gray-20"
        />
      </Form.Item>
      {isVerified && (
        <Form.Item name="password">
          <Input.Password placeholder="Password" autoComplete="off" size="large" className="!bg-gray-20" />
        </Form.Item>
      )}
      <Form.Item>
        <Button
          htmlType="submit"
          size="large"
          loading={loading}
          disabled={isVerified ? isDisabled : isVerified}
          className={`mt-[5px] !bg-neongold ${isVerified && isDisabled && "opacity-50 !cursor-auto"}`}
        >
          {isVerified ? "Update" : loading ? "" : "Verify Email"}
        </Button>
      </Form.Item>
    </Form>
  );
};

export default FormChangeEmail;
