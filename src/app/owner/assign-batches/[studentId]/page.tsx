"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, Checkbox, Button, Spin, message } from "antd";

interface Batch {
  id: number;
  name: string;
  startTime: string;
  endTime: string;
}

export default function AssignBatchesToStudent() {
  const params = useParams();
  const router = useRouter();
  const studentId = params.studentId as string;

  const [batches, setBatches] = useState<Batch[]>([]);
  const [selectedBatchIds, setSelectedBatchIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch all batches
        const batchRes = await fetch("/api/batches");
        const batchData = await batchRes.json();

        // Fetch student's assigned batches
        const assignedRes = await fetch(`/api/students/${studentId}/batches`);
        const assignedData = await assignedRes.json();

        setBatches(batchData.batches || []);
        setSelectedBatchIds(assignedData.batchIds || []);
      } catch (err) {
        console.error(err);
        message.error("Failed to load data");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [studentId]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch(`/api/students/${studentId}/batches`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ batchIds: selectedBatchIds }),
      });
      if (res.ok) {
        message.success("Batches updated successfully");
        router.push("/owner/assign-batches");
      } else {
        const data = await res.json();
        message.error(data.error || "Failed to update batches");
      }
    } catch (err) {
      console.error(err);
      message.error("Server error");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: 24, textAlign: "center" }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div style={{ padding: 24, maxWidth: 600, margin: "0 auto" }}>
      <Button
        onClick={() => router.push("/owner/assign-batches")}
        style={{ marginBottom: 16 }}
      >
        ← Back
      </Button>

      <Card title="Assign Batches">
        <Checkbox.Group
          value={selectedBatchIds}
          onChange={(checkedValues) =>
            setSelectedBatchIds(checkedValues as number[])
          }
          style={{ display: "flex", flexDirection: "column", gap: 8 }}
        >
          {batches.map((batch) => (
            <Checkbox key={batch.id} value={batch.id}>
              {batch.name} ({batch.startTime} - {batch.endTime})
            </Checkbox>
          ))}
        </Checkbox.Group>

        <Button
          type="primary"
          style={{ marginTop: 16, background: "#132454ff" }}
          onClick={handleSave}
          loading={saving}
          block
        >
          Save Changes
        </Button>
      </Card>
    </div>
  );
}