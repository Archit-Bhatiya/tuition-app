"use client";
import { Card, Layout, Menu, Typography, Button } from "antd";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { LogoutOutlined } from "@ant-design/icons";

const { Header, Content, Sider } = Layout;
const { Title } = Typography;

export default function OwnerDashboard() {
  const router = useRouter();

  const [stats, setStats] = useState({
    students: null,
    batches: null,
    fees: null,
    messages: null,
  });

  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role !== "owner") router.push("/login");

    // Later we will fetch real stats from API
    // For now keeping null to show placeholders
  }, [router]);

  {
    /**  Route mapping for sidebar keys */
  }
  {
    /** You can add more routes here easily */
  }
  const routesMap: Record<string, string> = {
    "1": "/owner/dashboard",
    "2": "/owner/add-student",
    "3": "/owner/batches",
    "4": "/owner/assign-batches",
    "5": "/owner/fees",
    "6": "/owner/timetable",
  };

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
          onClick={({ key }) => {
            const path = routesMap[key];
            if (path) router.push(path);
          }}
          items={[
            { key: "1", label: "Dashboard" },
            { key: "2", label: "Add Students" },
            { key: "3", label: "Batches" },
            { key: "4", label: "Assign Batches" },
            { key: "5", label: "Fees" },
            { key: "6", label: "Timetable" },
          ]}
        />
      </Sider>

      <Layout>
        {/* Header */}
        <Header style={{ background: "#fff", padding: "0 24px" }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <Title level={3} style={{ marginTop: 10 }}>
              Owner Dashboard
            </Title>
            <Button
              icon={<LogoutOutlined />}
              onClick={() => {
                localStorage.removeItem("token");
                localStorage.removeItem("role");
                router.push("/login");
              }}
              style={{
                background: "#132454ff",
                borderColor: "#132454ff",
                color: "#fff",
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
            gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
          }}
        >
          <Card title="Total Students">
            {stats.students !== null ? stats.students : <p>No data yet.</p>}
          </Card>
          <Card title="Total Batches">
            {stats.batches !== null ? stats.batches : <p>No data yet.</p>}
          </Card>
          <Card title="Pending Fees">
            {stats.fees !== null ? `₹${stats.fees}` : <p>No data yet.</p>}
          </Card>
          <Card title="Messages Sent">
            {stats.messages !== null ? stats.messages : <p>No data yet.</p>}
          </Card>
        </Content>
      </Layout>
    </Layout>
  );
}
