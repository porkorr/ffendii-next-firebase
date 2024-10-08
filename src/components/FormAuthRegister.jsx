"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input, Button, Form, message } from "antd";
import { rulesDisplayName, rulesEmail, rulesPassword, rulesConfirmPassword } from "@/utils/validationRules";
import { doc, setDoc, getDocs, collection, query, where } from "firebase/firestore";
import { db } from "@/utils/firebase";
import useAuth from "@/hooks/useAuth";
import authError from "@/utils/authError";

const FormRegister = () => {
  const { register } = useAuth();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const checkDisplayNameExists = async (displayName) => {
    const users = collection(db, "users");
    const q = query(users, where("displayName", "==", displayName));
    const querySnapshot = await getDocs(q);

    return !querySnapshot.empty;
  };

  const handleRegister = async (values) => {
    setLoading(true);

    const { displayName, email, password } = values;
    const isDisplayNameTaken = await checkDisplayNameExists(displayName);

    if (isDisplayNameTaken) {
      form.setFields([{ name: "displayName", errors: ["This display name is already taken"] }]);
      setLoading(false);
      return;
    }

    try {
      const userCredential = await register(email, password);
      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        email: user.email,
        displayName: displayName || "",
        photoURL: user.photoURL || "",
        phoneNumber: user.phoneNumber || "",
        providers: user.providerData,
        createdAt: new Date(),
        lastSignIn: user.metadata.lastSignInTime,
        gender: "",
        role: "user",
        subscription: false,
        isBanned: false,
        lastTimeRequest: "",
      });
      message.success("Register successfully");
      router.push("/");
    } catch (error) {
      const { message: errorMessage, field } = authError(error);
      form.setFields([{ name: field, errors: [errorMessage] }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form form={form} onFinish={handleRegister}>
      <Form.Item name="displayName" rules={rulesDisplayName}>
        <Input placeholder="Display Name" maxLength={20} autoComplete="off" size="large" className="!bg-gray-20" />
      </Form.Item>
      <Form.Item name="email" rules={rulesEmail}>
        <Input placeholder="Email" autoComplete="off" size="large" className="!bg-gray-20" />
      </Form.Item>
      <Form.Item name="password" rules={rulesPassword}>
        <Input.Password placeholder="Password" autoComplete="off" size="large" className="!bg-gray-20" />
      </Form.Item>
      <Form.Item name="confirmPassword" rules={rulesConfirmPassword}>
        <Input.Password placeholder="Confirm Password" autoComplete="off" size="large" className="!bg-gray-20" />
      </Form.Item>
      <Form.Item>
        <Button
          style={{ width: "100%" }}
          htmlType="submit"
          size="large"
          loading={loading}
          className="my-[15px] !bg-neongold"
        >
          {!loading ? "Let's Go" : ""}
        </Button>
      </Form.Item>
    </Form>
  );
};

export default FormRegister;
