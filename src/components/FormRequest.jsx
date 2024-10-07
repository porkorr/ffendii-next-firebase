import { useState, useEffect } from "react";
import { Form, Input, Button, message } from "antd";
import { rulesTitleSong } from "@/utils/validationRules";
import { db } from "@/utils/firebase";
import { collection, addDoc, getDocs, doc, updateDoc } from "firebase/firestore";
import useAuth from "@/hooks/useAuth";
import useFirestore from "@/hooks/useFirestore";

const FormRequest = ({ isBlurForm }) => {
  const { user } = useAuth();
  const { settings } = useFirestore();
  const [form] = Form.useForm();
  const [isDisabled, setIsDisabled] = useState(false);
  const [remainingTime, setRemainingTime] = useState(0);
  const [nextTimeRequest, setNextTimeRequest] = useState(null);

  const setTimeCooldown = settings.requestCooldown ? parseInt(settings.requestCooldownSeconds) : 0;

  useEffect(() => {
    if (user) {
      const lastTimeRequest = user.lastTimeRequest
        ? new Date(user.lastTimeRequest.seconds * 1000 + user.lastTimeRequest.nanoseconds / 1000000)
        : new Date(0); // ตั้งค่าเริ่มต้นเป็นวันที่ 1 มกราคม 1970

      const nextRequestTime = new Date(lastTimeRequest.getTime() + setTimeCooldown * 1000);
      setNextTimeRequest(nextRequestTime);
    }
  }, [user, setTimeCooldown]);

  useEffect(() => {
    if (nextTimeRequest) {
      setIsDisabled(true);
      const interval = setInterval(() => {
        const currentTime = new Date();
        const remainingMilliseconds = nextTimeRequest - currentTime;
        const remainingSeconds = Math.floor(remainingMilliseconds / 1000);

        setRemainingTime(remainingSeconds);

        if (remainingSeconds <= 0) {
          clearInterval(interval);
          setIsDisabled(false);
          setRemainingTime(0);
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [nextTimeRequest]);

  const handleRequest = async (values) => {
    if (isDisabled) return;

    if (isBlurForm) {
      try {
        const userRef = doc(db, "users", user.uid);
        const requestOrder = (await getDocs(collection(db, "requests"))).docs.length + 1;

        const request = await addDoc(collection(db, "requests"), {
          order: requestOrder,
          title: values.title,
          url: values.url,
          message: "",
          createdAt: new Date(),
          updatedAt: new Date(),
          sender: userRef,
        });

        if (request.id) {
          await updateDoc(userRef, {
            lastTimeRequest: new Date(),
          });
          form.resetFields();
          message.success("Request sent successfully");
        } else {
          // console.error("Error: request not added successfully");
        }
      } catch (e) {
        // console.error("Error adding document: ", e);
      }
    }
  };

  const formatToTwoDigits = (num) => String(num).padStart(2, "0");

  return (
    <Form form={form} onFinish={handleRequest}>
      <Form.Item name="title" rules={rulesTitleSong}>
        <Input placeholder="ยื้อ - ปรีชา ปัดภัย" autoComplete="off" size="large" className="!bg-gray-50" />
      </Form.Item>
      <Form.Item name="url">
        <Input
          placeholder="https://www.youtube.com/watch?v=7zMd3OXwkV0"
          autoComplete="off"
          size="large"
          className="!bg-gray-50"
        />
      </Form.Item>
      <Form.Item>
        <Button
          htmlType="submit"
          size="large"
          disabled={isDisabled}
          className={`mt-[15px] !bg-neongold ${isDisabled && "opacity-50 !cursor-auto"}`}
        >
          {remainingTime <= 0
            ? `send request`
            : `${formatToTwoDigits(Math.floor(remainingTime / 60))} : ${formatToTwoDigits(remainingTime % 60)}`}
        </Button>
      </Form.Item>
    </Form>
  );
};

export default FormRequest;
