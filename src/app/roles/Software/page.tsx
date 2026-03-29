"use client";

import { useEffect, useState } from "react";

export default function WebDevelopment() {
  const [days, setDays] = useState<number | null>(null);
  const [submissions, setSubmissions] = useState<any>({});
  const [timeLeft, setTimeLeft] = useState("");
  const [showWeeklyPopup, setShowWeeklyPopup] = useState(false);
  const [notification, setNotification] = useState(false);

  const [text, setText] = useState("");
  const [file1, setFile1] = useState<File | null>(null);
  const [file2, setFile2] = useState<File | null>(null);
  const role ="coding";
  // 🔹 FETCH DATA
  useEffect(() => {
    const fetchData = async () => {
      const intern = await fetch(`/api/auth/get-internship?role=${role}`).then(r => r.json());
      const subs = await fetch(`/api/auth/get-submissions?role=${role}`).then(r => r.json());

      const start = new Date(intern.internship.startDate);
      const today = new Date();

      const diff = Math.floor(
        (today.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
      );

      setDays(diff);

      const map: any = {};
      subs.submissions.forEach((s: any) => {
        map[s.task] = true;
      });

      setSubmissions(map);

      if (diff === 15) setNotification(true);

      if ([7, 14, 21, 28].includes(diff)) {
        const key = `weekly-${diff}`;
        if (!localStorage.getItem(key)) {
          setShowWeeklyPopup(true);
        }
      }
    };

    fetchData();
  }, []);

  // ⏱️ TIMER
  useEffect(() => {
    if (days === null) return;

    const interval = setInterval(() => {
      const end = new Date();
      end.setDate(end.getDate() + (30 - days));

      const now = new Date();
      const diff = end.getTime() - now.getTime();

      const d = Math.floor(diff / (1000 * 60 * 60 * 24));
      const h = Math.floor((diff / (1000 * 60 * 60)) % 24);

      setTimeLeft(`${d}d ${h}h left`);
    }, 1000);

    return () => clearInterval(interval);
  }, [days]);

  // 🟢 SUBMIT PROJECT
  const submitProject = async (project: string) => {
    if (submissions[project]) return;

    const formData = new FormData();
    formData.append("role", "Software");
    formData.append("task", project);
    formData.append("text", text);
    if (file1) formData.append("file1", file1);
    if (file2) formData.append("file2", file2);

    await fetch("/api/auth/submit-task", {
      method: "POST",
      body: formData,
    });

    setSubmissions((prev: any) => ({ ...prev, [project]: true }));
    alert("Project Submitted 🚀");
  };

  if (days === null) return <div className="p-10">Loading...</div>;

  if (days >= 30) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6 bg-white">
        <h1 className="text-5xl font-bold">🎓 Internship Completed</h1>
        <button
  onClick={() => {
    window.open("/api/auth/certificate", "_blank");
  }}
  className="bg-green-600 text-white px-6 py-3 rounded-xl shadow-lg"
>
  Download Certificate
</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-gray-100 p-8">

      {/* NAVBAR */}
      <div className="flex justify-between items-center mb-12">
        <h1 className="text-3xl font-extrabold tracking-tight">
          auto<span className="text-green-600">intern</span>
        </h1>

        <div className="relative">
          <button className="text-2xl">🔔</button>
          {notification && (
            <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full"></span>
          )}
        </div>
      </div>

      {/* PROJECT CARD COMPONENT */}
      {(days < 20 || days >= 15) && (
        <div className="max-w-4xl mx-auto space-y-10">

          {/* PROJECT 1 */}
          {days < 20 && (
            <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100">

              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">
                  🚀 Project 1: e-commerce codebase
                </h2>
                <span className="text-sm text-red-500 font-semibold">
                  {timeLeft}
                </span>
              </div>

              <p className="mt-4 text-gray-600">
                Build a modern responsive landing page using Next.js.
              </p>

              <div className="mt-4 flex gap-6 text-sm">
                <a href="#" className="text-green-600">GitHub Repo</a>
                <a href="#" className="text-blue-600">View PDF Guide</a>
              </div>

              {/* TASK STEPS */}
              <div className="mt-6 space-y-3">
                {["Refactor Controllers", "Optimize Database Queries", "Add Caching Layer"].map((t, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-green-500 text-white flex items-center justify-center text-sm">
                      {i + 1}
                    </div>
                    <p>{t}</p>
                  </div>
                ))}
              </div>

              {/* SUBMISSION */}
              <div className="mt-8 border-t pt-6">
                <textarea
                  placeholder="Write your project details..."
                  className="w-full border p-3 rounded-lg mb-4"
                  onChange={(e) => setText(e.target.value)}
                />

                <input
                  type="file"
                  onChange={(e) => setFile1(e.target.files?.[0] || null)}
                  className="mb-2"
                />

                <input
                  type="file"
                  onChange={(e) => setFile2(e.target.files?.[0] || null)}
                  className="mb-4"
                />

                <button
                  disabled={submissions["project1"]}
                  onClick={() => submitProject("project1")}
                  className={`w-full py-3 rounded-xl ${
                    submissions["project1"]
                      ? "bg-gray-400"
                      : "bg-green-600 text-white hover:bg-green-500"
                  }`}
                >
                  {submissions["project1"] ? "Submitted" : "Submit Project"}
                </button>
              </div>
            </div>
          )}

          {/* PROJECT 2 */}
          {days >= 15 && days < 30 && (
            <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100">

              <div className="flex justify-between">
                <h2 className="text-2xl font-bold">
                  💻 Project 2:Car Rental project
                </h2>
                <span className="text-sm text-red-500 font-semibold">
                  {timeLeft}
                </span>
              </div>

              <p className="mt-4 text-gray-600">
                Build a full stack application using Next.js + MongoDB.
              </p>

              <div className="mt-6 space-y-3">
                {["Refactor Data Handling (Remove Static Data Dependency)", "Performance Optimization", "Add Error Boundaries + Fallback UI"].map((t, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-green-500 text-white flex items-center justify-center text-sm">
                      {i + 1}
                    </div>
                    <p>{t}</p>
                  </div>
                ))}
              </div>

              <div className="mt-8 border-t pt-6">
                <textarea
                  placeholder="Explain your project..."
                  className="w-full border p-3 rounded-lg mb-4"
                  onChange={(e) => setText(e.target.value)}
                />

                <input type="file" className="mb-2" />
                <input type="file" className="mb-4" />

                <button
                  disabled={submissions["project2"]}
                  onClick={() => submitProject("project2")}
                  className={`w-full py-3 rounded-xl ${
                    submissions["project2"]
                      ? "bg-gray-400"
                      : "bg-green-600 text-white hover:bg-green-500"
                  }`}
                >
                  {submissions["project2"] ? "Submitted" : "Submit Project"}
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* WEEKLY POPUP */}
      {showWeeklyPopup && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">

          <div className="bg-white p-8 rounded-2xl w-125 shadow-xl">

            <h2 className="text-xl font-bold mb-4">
              Weekly Discussion
            </h2>

            <textarea
              className="w-full border p-3 mb-4"
              placeholder="Write your progress..."
            />

            <button
              onClick={() => {
                localStorage.setItem(`weekly-${days}`, "done");
                setShowWeeklyPopup(false);
              }}
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              Submit (Required)
            </button>

          </div>

        </div>
      )}

    </div>
  );
}