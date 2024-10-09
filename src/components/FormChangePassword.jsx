"use client";

import { useState } from "react";
import { Form, Input, Button, message } from "antd";
import { updatePassword, reauthenticateWithCredential, EmailAuthProvider } from "firebase/auth";
import { auth } from "@/utils/firebase";
import { rulesPassword } from "@/utils/validationRules";
import authError from "@/utils/authError";

const FormChangePassword = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleChangePassword = async (values) => {
    const { password, newPassword, confirmNewPassword } = values;

    if (password === newPassword) {
      form.setFields([
        { name: "newPassword", errors: ["New password should not be the same as the current password."] },
      ]);
      return;
    }

    if (newPassword !== confirmNewPassword) {
      message.error("New password and confirm password do not match.");
      form.setFields([
        { name: "newPassword", errors: ["New password and confirm password do not match."] },
        { name: "confirmNewPassword", errors: ["New password and confirm password do not match."] },
      ]);
      return;
    }

    setLoading(true);

    try {
      const currentUser = auth.currentUser;
      if (!currentUser) throw new Error("No user is currently logged in.");
      // ทำการยืนยันตัวตนใหม่ (reauthenticate) ก่อนเปลี่ยนรหัสผ่าน
      const credential = EmailAuthProvider.credential(currentUser.email, password);
      await reauthenticateWithCredential(currentUser, credential);
      // อัปเดตรหัสผ่านใหม่
      await updatePassword(currentUser, newPassword);

      message.success("Password updated successfully!", 5);
      form.resetFields();
    } catch (error) {
      const { message: errorMessage, field } = authError(error);
      form.setFields([{ name: field, errors: [errorMessage] }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Form form={form} onFinish={handleChangePassword}>
        <Form.Item name="password" rules={rulesPassword}>
          <Input.Password placeholder="Current password" autoComplete="off" size="large" className="!bg-gray-20" />
        </Form.Item>
        <Form.Item name="newPassword" rules={rulesPassword}>
          <Input.Password placeholder="New password" autoComplete="off" size="large" className="!bg-gray-20" />
        </Form.Item>
        <Form.Item name="confirmNewPassword">
          <Input.Password placeholder="Confirm new password" autoComplete="off" size="large" className="!bg-gray-20" />
        </Form.Item>
        <Form.Item>
          <Button htmlType="submit" size="large" loading={loading} className="mt-[5px] !bg-neongold">
            {!loading ? "Update Password" : ""}
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};

export default FormChangePassword;
