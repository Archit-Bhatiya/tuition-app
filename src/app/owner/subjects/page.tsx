"use client";
import { useEffect, useState } from "react";
import { Button, Input, Table, message } from "antd";

interface Subject {
  id: number;
  name: string;
  createdAt: string;
}

export default function SubjectsPage() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(false);
  const [newName, setNewName] = useState("");

  const fetchSubjects = async () => {
    const res = await fetch("/api/subjects");
    const data = await res.json();
    setSubjects(data);
  };

  const addSubject = async () => {
    if (!newName.trim()) return message.error("Subject name is required");

    setLoading(true);
    const res = await fetch("/api/subjects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newName }),
    });

    if (res.ok) {
      message.success("Subject added");
      setNewName("");
      fetchSubjects();
    } else {
      const err = await res.json();
      message.error(err.error || "Failed to add subject");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchSubjects();
  }, []);

  return (
    <div style={{ maxWidth: 600, margin: "0 auto" }}>
      <h2>Subjects</h2>
      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        <Input
          placeholder="Enter subject name"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
        />
        <Button type="primary" onClick={addSubject} loading={loading}>
          Add
        </Button>
      </div>
      <Table
        dataSource={subjects}
        columns={[
          { title: "ID", dataIndex: "id" },
          { title: "Name", dataIndex: "name" },
          { title: "Created At", dataIndex: "createdAt" },
        ]}
        rowKey="id"
        pagination={false}
      />
    </div>
  );
}
