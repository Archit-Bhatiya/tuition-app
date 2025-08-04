"use client";
import { Layout, Menu, Typography, Button } from "antd";
import { useRouter, usePathname } from "next/navigation";
import { LogoutOutlined } from "@ant-design/icons";
import { ReactNode } from "react";

const { Header, Content, Sider } = Layout;
const { Title } = Typography;

const routesMap: Record<string, string> = {
  "1": "/owner/dashboard",
  "2": "/owner/add-student",
  "3": "/owner/batches",
  "4": "/owner/assign-batches",
  "5": "/owner/fees",
  "6": "/owner/timetable",
  "7": "/owner/standards",
  "8": "/owner/subjects",
};

export default function OwnerLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  // Auto-select sidebar item based on URL
  const selectedKey =
    Object.keys(routesMap).find((key) => pathname.startsWith(routesMap[key])) ||
    "1";

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
          selectedKeys={[selectedKey]}
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
            { key: "7", label: "Standard" },
            { key: "8", label: "Subjects" },

          ]}
        />
      </Sider>

      <Layout>
        {/* Header */}
        <Header style={{ background: "#fff", padding: "0 24px" }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <Title level={3} style={{ marginTop: 10 }}>
              Owner Panel
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
        <Content style={{ margin: "24px" }}>{children}</Content>
      </Layout>
    </Layout>
  );
}