"use client";
import { useEffect, useState } from "react";
import { Card, Table, Button, Modal, Form, Input, message } from "antd";
import { useRouter } from "next/navigation";

interface Batch {
  id: number;
  name: string;
  startTime: string;
  endTime: string;
}

export default function BatchesPage() {
  const router = useRouter();

  const [batches, setBatches] = useState<Batch[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBatch, setEditingBatch] = useState<Batch | null>(null);

  const [form] = Form.useForm();

  const fetchBatches = async () => {
    const res = await fetch("/api/batches");
    const data = await res.json();
    setBatches(data);
  };

  useEffect(() => {
    fetchBatches();
  }, []);

  const handleSubmit = async (values: any) => {
    setLoading(true);
    const method = editingBatch ? "PUT" : "POST";
    const url = editingBatch
      ? `/api/batches/${editingBatch.id}`
      : "/api/batches";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });

    setLoading(false);
    setIsModalOpen(false);
    form.resetFields();
    setEditingBatch(null);

    if (!res.ok) {
      message.error("Failed to save batch");
      return;
    }
    message.success("Batch saved successfully");
    fetchBatches();
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure to delete?")) return;
    const res = await fetch(`/api/batches/${id}`, { method: "DELETE" });
    if (!res.ok) {
      message.error("Failed to delete batch");
      return;
    }
    message.success("Batch deleted");
    fetchBatches();
  };

  return (
    <div style={{ padding: 24 }}>
      <Button
        type="default"
        onClick={() => router.push("/owner/dashboard")}
        style={{ marginBottom: 16 }}
      >
        ← Back to Dashboard
      </Button>

      <Card
        title="Manage Batches"
        extra={
          <Button type="primary" onClick={() => setIsModalOpen(true)}>
            Add Batch
          </Button>
        }
      >
        <Table
          rowKey="id"
          dataSource={batches}
          columns={[
            { title: "Name", dataIndex: "name" },
            { title: "Start Time", dataIndex: "startTime" },
            { title: "End Time", dataIndex: "endTime" },
            {
              title: "Actions",
              render: (_, record) => (
                <>
                  <Button
                    onClick={() => {
                      setEditingBatch(record);
                      form.setFieldsValue(record);
                      setIsModalOpen(true);
                    }}
                    style={{ marginRight: 8 }}
                  >
                    Edit
                  </Button>
                  <Button danger onClick={() => handleDelete(record.id)}>
                    Delete
                  </Button>
                </>
              ),
            },
          ]}
        />
      </Card>

      <Modal
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false);
          setEditingBatch(null);
          form.resetFields();
        }}
        onOk={() => form.submit()}
        confirmLoading={loading}
        title={editingBatch ? "Edit Batch" : "Add Batch"}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            name="name"
            label="Batch Name"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="startTime"
            label="Start Time"
            rules={[{ required: true }]}
          >
            <Input placeholder="e.g. 8:00 AM" />
          </Form.Item>
          <Form.Item
            name="endTime"
            label="End Time"
            rules={[{ required: true }]}
          >
            <Input placeholder="e.g. 9:30 AM" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
