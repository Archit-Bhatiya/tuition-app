"use client";
import { useEffect, useState } from "react";
import { Card, Select, Button, Spin, message, Form } from "antd";

const { Option } = Select;

interface Standard {
  id: number;
  name: string;
}

interface Subject {
  id: number;
  name: string;
}

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export default function TimetablePage() {
  const [standards, setStandards] = useState<Standard[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [selectedStandard, setSelectedStandard] = useState<number | null>(null);
  const [timetable, setTimetable] = useState<Record<string, number[]>>({});
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [ form ] = Form.useForm();

  // Fetch standards & subjects
  useEffect(() => {
    async function fetchData() {
      const stdRes = await fetch("/api/standards");
      const subRes = await fetch("/api/subjects");
      const stdData = await stdRes.json();
      const subData = await subRes.json();
      setStandards(stdData || []);
      setSubjects(subData || []);
    }
    fetchData();
  }, []);

  // Fetch timetable for selected standard
  useEffect(() => {
    if (!selectedStandard) return;
    setLoading(true);
    async function fetchTimetable() {
      const res = await fetch(`/api/timetable/${selectedStandard}`);
      const data = await res.json();
      if (res.ok) {
        // Convert subject names to IDs
        const daySubjectMap: Record<string, number[]> = {};
        DAYS.forEach((day) => {
          daySubjectMap[day] = [];
        });
        setTimetable(daySubjectMap);
      } else {
        message.error(data.error || "Failed to fetch timetable");
      }
      setLoading(false);
    }
    fetchTimetable();
  }, [selectedStandard]);

  const handleSubjectChange = (day: string, values: number[]) => {
    setTimetable((prev) => ({
      ...prev,
      [day]: values,
    }));
  };

  const handleSave = async () => {
    if (!selectedStandard) {
      message.error("Please select a standard first");
      return;
    }
    setSaving(true);
    const payload = DAYS.map((day) => ({
      day,
      subjectIds: timetable[day] || [],
    }));
    const res = await fetch(`/api/timetable/${selectedStandard}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    setSaving(false);
    if (res.ok) {
      message.success("Timetable saved successfully");
      form.resetFields();
    } else {
      message.error(data.error || "Failed to save timetable");
    }
  };

  return (
    <div style={{ padding: 24 }}>
      <Card title="Create Timetable" style={{ maxWidth: 800, margin: "0 auto" }}>
        <div style={{ marginBottom: 16 }}>
          <label><strong>Select Standard:</strong></label>
          <Select
            style={{ width: "100%", marginTop: 8 }}
            placeholder="Select a Standard"
            onChange={setSelectedStandard}
            value={selectedStandard || undefined}
          >
            {standards.map((std) => (
              <Option key={std.id} value={std.id}>{std.name}</Option>
            ))}
          </Select>
        </div>

        {loading && <Spin size="large" />}
        {!loading && selectedStandard && (
          <div>
            {DAYS.map((day) => (
              <div key={day} style={{ marginBottom: 16 }}>
                <strong>{day}</strong>
                <Select
                  mode="multiple"
                  style={{ width: "100%", marginTop: 8 }}
                  placeholder="Select Subjects"
                  value={timetable[day] || []}
                  onChange={(values) => handleSubjectChange(day, values)}
                >
                  {subjects.map((subj) => (
                    <Option key={subj.id} value={subj.id}>{subj.name}</Option>
                  ))}
                </Select>
              </div>
            ))}

            <Button
              type="primary"
              style={{ marginTop: 16, background: "#132454ff" }}
              loading={saving}
              onClick={handleSave}
              block
            >
              Save Timetable
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
}