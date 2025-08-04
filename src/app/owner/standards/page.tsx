"use client";
import { useEffect, useState } from "react";
import { Button, Input, Table, message } from "antd";

interface Standard {
  id: number;
  name: string;
}

export default function StandardsPage() {
  const [standards, setStandards] = useState<Standard[]>([]);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchStandards = async () => {
    const res = await fetch("/api/standards");
    const data = await res.json();
    setStandards(data);
  };

  const addStandard = async () => {
    if (!name.trim()) return message.error("Name is required");
    setLoading(true);
    try {
      const res = await fetch("/api/standards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      if (res.ok) {
        message.success("Standard added successfully");
        setName("");
        fetchStandards();
      } else {
        const data = await res.json();
        message.error(data.error || "Failed to add standard");
      }
    } catch (err) {
      message.error("Server error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStandards();
  }, []);

  return (
    <div style={{ padding: 24, maxWidth: 600, margin: "0 auto" }}>
      <h2>Manage Standards</h2>

      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        <Input
          placeholder="Enter standard name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <Button type="primary" onClick={addStandard} loading={loading}>
          Add
        </Button>
      </div>

      <Table
        dataSource={standards}
        columns={[{ title: "Standard", dataIndex: "name", key: "name" }]}
        rowKey="id"
        pagination={false}
      />
    </div>
  );
}
