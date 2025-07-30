"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Form, Input, Button, Card, Typography, message } from "antd";
import Image from "next/image";

const { Title } = Typography;

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: any) => {
    setLoading(true);
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      message.error(data.error || "Registration failed");
      return;
    }

    message.success("Registered successfully! Please login.");
    router.push("/login");
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        background: "#f5f5f5",
      }}
    >
      <Card className="auth-card" style={{ width: 400, padding: 24 }}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            marginBottom: 16,
          }}
        >
          <Image
            src="/logo.png"
            alt="Universal Classes Logo"
            width={80}
            height={80}
          />
          <h2 style={{ color: "#1E3A8A", fontWeight: 700, marginTop: 8 }}>
            Universal Classes
          </h2>
        </div>

        <Title level={3} className="auth-title" style={{ textAlign: "center", marginBottom: 24, color: "#132454ff" }}>
          Parent Registration
        </Title>

        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: "Please enter your name" }]}
          >
            <Input placeholder="Enter full name" />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, type: "email", message: "Enter a valid email" },
            ]}
          >
            <Input placeholder="Enter email address" />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[
              {
                required: true,
                min: 6,
                message: "Password must be at least 6 characters",
              },
            ]}
          >
            <Input.Password placeholder="Enter password" />
          </Form.Item>

          <Button
            type="primary"
            htmlType="submit"
            block
            loading={loading}
            className="auth-button"
            style={{ background: "#132454ff" }}
          >
            Register
          </Button>
          <Button
            type="link"
            block
            onClick={() => router.push("/login")}
            style={{ marginTop: 8 }}
          >
            Already have an account? Login
          </Button>
        </Form>
      </Card>
    </div>
  );
}
