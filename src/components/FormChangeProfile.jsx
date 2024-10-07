"use client";

import { useState } from "react";
import { Form, Input, Button, message } from "antd";
import { rulesDisplayName } from "@/utils/validationRules";
import { updateProfile } from "firebase/auth";
import { doc, updateDoc, collection, query, getDocs, where } from "firebase/firestore";
import { auth, db } from "@/utils/firebase";
import useAuth from "@/hooks/useAuth";

const FormChangeProfile = () => {
  const { user } = useAuth();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [displayName, setDisplayName] = useState(user?.displayName);
  const [newDisplayName, setNewDisplayName] = useState(user?.displayName);

  const checkDisplayNameExists = async (newDisplayName) => {
    const users = collection(db, "users");
    const q = query(users, where("displayName", "==", newDisplayName));
    const querySnapshot = await getDocs(q);

    return !querySnapshot.empty;
  };

  const handleChangeProfile = async (values) => {
    const { newDisplayName } = values;
    const isDisplayNameTaken = await checkDisplayNameExists(newDisplayName);

    if (isDisplayNameTaken) {
      form.setFields([
        {
          name: "newDisplayName",
          errors: ["This display name is already taken"],
        },
      ]);
      return;
    }

    try {
      setLoading(true);
      const currentUser = auth.currentUser;
      if (currentUser) {
        await updateProfile(currentUser, { displayName: newDisplayName });

        const userDocRef = doc(db, "users", currentUser.uid);
        await updateDoc(userDocRef, {
          displayName: newDisplayName,
        });

        message.success("Display name updated successfully");
        setDisplayName(newDisplayName);
        setLoading(false);
      }
    } catch (error) {
      // console.error("Error updating profile: ", error);
      message.error("Failed to update display name");
    }
  };

  return (
    <Form
      form={form}
      onFinish={handleChangeProfile}
      // onValuesChange={handleFormOnValuesChange}
      initialValues={{ newDisplayName }}
    >
      <Form.Item name="newDisplayName" rules={rulesDisplayName}>
        <Input placeholder="Enter new display name" autoComplete="off" size="large" className="!bg-gray-20" />
      </Form.Item>
      <Form.Item>
        <Button htmlType="submit" size="large" loading={loading} className="mt-[5px] !bg-neongold">
          {!loading ? "Update" : ""}
        </Button>
      </Form.Item>
    </Form>
  );
};

export default FormChangeProfile;
