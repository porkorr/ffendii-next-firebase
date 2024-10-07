import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input, Button, Form, message } from "antd";
import { rulesEmail } from "@/utils/validationRules";
import useAuth from "@/hooks/useAuth";
import authError from "@/utils/authError";

const FormLogin = () => {
  const { resetPassword } = useAuth();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleForgotPassword = async (values) => {
    setLoading(true);
    const { email } = values;
    try {
      await resetPassword(email);
      message.success("Check your inbox for further instructions.");
      form.resetFields();
      router.push("/login");
    } catch (error) {
      const { message: errorMessage, field } = authError(error);
      form.setFields([{ name: field, errors: [errorMessage] }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form form={form} onFinish={handleForgotPassword}>
      <Form.Item name="email" rules={rulesEmail}>
        <Input placeholder="Email" autoComplete="off" size="large" className="!bg-gray-20" />
      </Form.Item>
      <Form.Item>
        <Button
          style={{ width: "100%" }}
          htmlType="submit"
          size="large"
          loading={loading}
          className="my-[15px] !bg-neongold"
        >
          {!loading ? "Reset Password" : ""}
        </Button>
      </Form.Item>
    </Form>
  );
};

export default FormLogin;
