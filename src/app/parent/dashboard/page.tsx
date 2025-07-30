"use client";
import { Card, Layout, Menu, Typography, Button } from "antd";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { LogoutOutlined } from "@ant-design/icons";

const { Header, Content, Sider } = Layout;
const { Title } = Typography;

export default function ParentDashboard() {
  const router = useRouter();
  const [student, setStudent] = useState<any>(null); // state for student data
  const [batch, setBatch] = useState<any>(null);
  const [fees, setFees] = useState<any>(null);
  const [messages, setMessages] = useState<string[]>([]);

  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role !== "parent") router.push("/login");

    // Later you will fetch data from API
    // For now keeping them null to show placeholders
  }, [router]);

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {/* Sidebar */}
      <Sider theme="dark" style={{ background: "#132454ff" }}>
        <div
          style={{
            color: "white",
            textAlign: "center",
            padding: 16,
            fontWeight: "bold",
            fontSize: 18,
          }}
        >
          Universal Classes
        </div>
        <Menu
          theme="dark"
          mode="inline"
          style={{ background: "#132454ff" }}
          items={[
            { key: "1", label: "Dashboard" },
            { key: "2", label: "Add Student" },
            { key: "3", label: "Messages" },
            { key: "4", label: "Fee Details" },
            { key: "5", label: "Timetable" },
            { key: "6", label: "Profile" },
          ]}
        />
      </Sider>

      <Layout>
        {/* Header */}
        <Header style={{ background: "#fff", padding: "0 24px" }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <Title level={3} style={{ marginTop: 10 }}>
              Parent Dashboard
            </Title>
            <Button
              type="primary"
              icon={<LogoutOutlined />}
              onClick={() => {
                localStorage.removeItem("token");
                localStorage.removeItem("role");
                router.push("/login");
              }}
              style={{
                background: "#132454ff",
                borderColor: "#132454ff",
                marginTop: 10,
              }}
            >
              Logout
            </Button>
          </div>
        </Header>

        {/* Content */}
        <Content
          style={{
            margin: "24px",
            display: "grid",
            gap: "24px",
            gridTemplateColumns: "repeat(auto-fit,minmax(250px,1fr))",
          }}
        >
          <Card title="Student Info">
            {student ? (
              <>
                <p><b>Name:</b> {student.name}</p>
                <p><b>Standard:</b> {student.standard}</p>
                <p><b>School:</b> {student.school}</p>
                <p><b>Batch:</b> {student.batch}</p>
              </>
            ) : (
              <p>No student info added yet.</p>
            )}
          </Card>

          <Card title="Batch Info">
            {batch ? (
              <>
                <p><b>Medium:</b> {batch.medium}</p>
                <p><b>Subjects:</b> {batch.subjects.join(", ")}</p>
              </>
            ) : (
              <p>No batch assigned yet.</p>
            )}
          </Card>

          <Card title="Fee Summary">
            {fees ? (
              <>
                <p><b>Paid:</b> ₹{fees.paid}</p>
                <p><b>Pending:</b> ₹{fees.pending}</p>
              </>
            ) : (
              <p>No fee details available.</p>
            )}
          </Card>

          <Card title="Latest Messages">
            {messages.length > 0 ? (
              messages.map((msg, idx) => <p key={idx}>{msg}</p>)
            ) : (
              <p>No new messages.</p>
            )}
          </Card>
        </Content>
      </Layout>
    </Layout>
  );
}
