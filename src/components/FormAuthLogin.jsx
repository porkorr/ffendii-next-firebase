import { useState } from "react";
import { Input, Button, Form, message } from "antd";
import { rulesEmail } from "@/utils/validationRules";
import useAuth from "@/hooks/useAuth";
import authError from "@/utils/authError";

const FormLogin = () => {
  const { login } = useAuth();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleLogin = async (value) => {
    const { email, password } = value;
    try {
      await login(email, password);
      message.success("All set! Let’s go!");
    } catch (error) {
      const { message: errorMessage, field } = authError(error);
      form.setFields([{ name: field, errors: [errorMessage] }]);
    }
  };

  return (
    <Form form={form} onFinish={handleLogin}>
      <Form.Item name="email" rules={rulesEmail}>
        <Input placeholder="Email" autoComplete="off" size="large" className="!bg-gray-20" />
      </Form.Item>
      <Form.Item name="password">
        <Input.Password placeholder="Password" autoComplete="off" size="large" className="!bg-gray-20" />
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

export default FormLogin;
