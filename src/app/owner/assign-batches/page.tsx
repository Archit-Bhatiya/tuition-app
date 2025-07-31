"use client";
import { Table, Button, Card } from "antd";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Student {
  id: number;
  studentName: string;
  parentName: string;
  standard: string;
}

export default function AssignBatchList() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function fetchStudents() {
      const res = await fetch("/api/students");
      const data = await res.json();
      setStudents(data.students || []);
      setLoading(false);
    }
    fetchStudents();
  }, []);

  const columns = [
    { title: "Student Name", dataIndex: "studentName", key: "studentName" },
    { title: "Parent Name", dataIndex: "parentName", key: "parentName" },
    { title: "Standard", dataIndex: "standard", key: "standard" },
    {
      title: "Action",
      key: "action",
      render: (_: any, record: Student) => (
        <Button
          type="primary"
          style={{ background: "#132454ff" }}
          onClick={() => router.push(`/owner/assign-batches/${record.id}`)}
        >
          Assign
        </Button>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <Card title="Assign Batches to Students">
        <Table
          dataSource={students}
          columns={columns}
          loading={loading}
          rowKey="id"
          pagination={{ pageSize: 5 }}
        />
      </Card>
    </div>
  );
}