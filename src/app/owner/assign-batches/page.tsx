"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Table, Button, Spin, message } from "antd";
import { text } from "stream/consumers";

interface Student {
  id: number;
  studentName: string;
  parentName: string;
  standard: string | null;
}

export default function AssignBatchesPage() {
  const router = useRouter();
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStudents() {
      try {
        const res = await fetch("/api/students");
        const data = await res.json();
        setStudents(data.students || []);
      } catch (err) {
        console.error(err);
        message.error("Failed to load students");
      } finally {
        setLoading(false);
      }
    }
    fetchStudents();
  }, []);

  if (loading) {
    return (
      <div style={{ padding: 24, textAlign: "center" }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div style={{ padding: 24 }}>
      <h2>Assign Batches to Students</h2>

      <Table
        dataSource={students}
        rowKey="id"
        columns={[
          { title: "Student Name", dataIndex: "studentName" },
          { title: "Parent Name", dataIndex: "parentName" },
          { title: "Standard", dataIndex: "standardName", render: (text) => text || "N/A", },
          {
            title: "Action",
            render: (_, student) => (
              <Button
                type="primary"
                onClick={() => router.push(`/owner/assign-batches/${student.id}`)}
              >
                Assign
              </Button>
            ),
          },
        ]}
      />
    </div>
  );
}