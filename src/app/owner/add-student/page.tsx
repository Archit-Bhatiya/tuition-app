"use client";
import { useState, useEffect } from "react";
import { Form, Input, Button, Card, Select, message } from "antd";
import { useRouter } from "next/navigation";

const { Option } = Select;

interface Standard {
  id: number;
  name: string;
}

export default function AddStudentPage() {
  const [loading, setLoading] = useState(false);
  const [batches, setBatches] = useState<any[]>([]);
  const router = useRouter();
  const [form] = Form.useForm();
  const [standards, setStandards] = useState<Standard[]>([]);

  useEffect(() => {
    async function fetchBatches() {
      const res = await fetch("/api/batches");
      const data = await res.json();
      setBatches(data);
    }

    async function fetchStandards() {
      const res = await fetch("/api/standards");
      const data = await res.json();
      setStandards(data);
    }

    fetchStandards();
    fetchBatches();
  }, []);

  const onFinish = async (values: any) => {
    setLoading(true);
    const res = await fetch("/api/students/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...values,
        batchIds: values.batchIds || [], // send array of batch IDs
      }),
    });
    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      message.error(data.error || "Failed to add student");
      return;
    }

    message.success("Student added successfully!");
    form.resetFields();
  };

  return (
    <div style={{ padding: 24, display: "flex", flexDirection: "column", alignItems: "center" }}> 
      <Card title="Add Student" style={{ maxWidth: 600, width: "100%" }}>
        <Form layout="vertical" onFinish={onFinish} form={form}>
          <Form.Item name="studentName" label="Student Name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="parentName" label="Parent Name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="parentEmail" label="Parent Email" rules={[{ required: true, type: "email" }]}>
            <Input />
          </Form.Item>
          <Form.Item name="password" label="Parent Password" rules={[{ required: true }]}>
            <Input.Password />
          </Form.Item>
          <Form.Item name="standardId" label="Standard" rules={[{ required: true }]}>
            <Select placeholder="Select a Standard">
              {standards.map((std) => (
                <Option key={std.id} value={std.id}>
                  {std.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="medium" label="Medium" rules={[{ required: true }]}>
            <Select>
              <Option value="English">English</Option>
              <Option value="Gujarati">Gujarati</Option>
              <Option value="Gujlish">Gujlish</Option>
            </Select>
          </Form.Item>
          <Form.Item name="schoolName" label="School Name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="lastStandardMarks" label="Last Standard Marks">
            <Input />
          </Form.Item>
          <Form.Item name="schoolTiming" label="School Timing">
            <Input />
          </Form.Item>

          {/* Multi-select batches */}
          <Form.Item name="batchIds" label="Assign Batches">
            <Select
              mode="multiple"
              placeholder="Select one or more batches"
              allowClear
            >
              {batches.map((batch) => (
                <Option key={batch.id} value={batch.id}>
                  {batch.name} ({batch.startTime} - {batch.endTime})
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item name="contactNumber" label="Contact Number" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="address" label="Address">
            <Input.TextArea rows={2} />
          </Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} block style={{ background: "#132454ff" }}>
            Add Student
          </Button>
        </Form>
      </Card>
    </div>
  );
}
