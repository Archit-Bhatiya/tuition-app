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
  // const routesMap: Record<string, string> = {
  //   "1": "/owner/dashboard",
  //   "2": "/owner/add-student",
  //   "3": "/owner/batches",
  //   "4": "/owner/assign-batches",
  //   "5": "/owner/fees",
  //   "6": "/owner/timetable",
  // };

  return (
    <Layout style={{ minHeight: "100vh" }}>
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
  );
}
