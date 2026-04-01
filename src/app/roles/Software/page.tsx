"use client";

import { useEffect, useState } from "react";
import { FaBell } from "react-icons/fa";
import { FaLinkedin, FaInstagram, FaYoutube } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

export default function SoftwareRole() {
  const [days, setDays] = useState<number | null>(null);
  const [submissions, setSubmissions] = useState<any>({});
  const [timeLeft, setTimeLeft] = useState("");
  const [timeLeft1, setTimeLeft1] = useState("");
  const [timeLeft2, setTimeLeft2] = useState("");
  const [notification, setNotification] = useState(false);

  const [text, setText] = useState("");
  const [file1, setFile1] = useState<File | null>(null);
  const [file2, setFile2] = useState<File | null>(null);
  const role ="Software";
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

    
    };

    fetchData();
  }, []);

  // ⏱️ TIMER
  useEffect(() => {
  if (days === null) return;

  const fetchStartDateAndRunTimer = async () => {
    const intern = await fetch(`/api/auth/get-internship?role=${role}`).then(r => r.json());

    const start = new Date(intern.internship.startDate);

    // ✅ FIXED END DATE (constant)
    const end = new Date(start);
    end.setDate(start.getDate() + 30);

    const interval = setInterval(() => {
      const now = new Date();
      const diff = end.getTime() - now.getTime();

      if (diff <= 0) {
        setTimeLeft1("0d 0h left");
        setTimeLeft2("0d 0h left");
        return;
      }

      const totalHours = Math.floor(diff / (1000 * 60 * 60));
      const d = Math.floor(totalHours / 24);
      const h = totalHours % 24;

      // Project 2
      setTimeLeft2(`${d}d ${h}h left`);

      // Project 1 (20 days total)
      const d1 = Math.max(d - 10, 0);
      setTimeLeft1(`${d1}d ${h}h left`);

    }, 1000);

    return () => clearInterval(interval);
  };

  fetchStartDateAndRunTimer();
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
    <div className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-gray-100 ">

     {/* NAVBAR */}
      <nav className="w-full flex items-center justify-between px-6 md:px-12 py-4 border-b bg-white/80 backdrop-blur sticky top-0 z-50">

        <div className="flex items-center gap-2 text-xl font-bold">
          <img
  src="/workhatchS.png"
  alt="Logo"
  className="w-8 h-8 rounded-full object-cover"
/>
          <span>
            Work<span className="text-green-600">Hatch</span>
          </span>
        </div>

        <div className="flex items-center gap-6">
          
 <div className="relative">
  <button className="text-xl text-black hover:text-green-500 transition">
    <FaBell />
  </button>

  {notification && (
    <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 border-2 border-white rounded-full"></span>
  )}
</div>
         <button
  onClick={() => {
    window.location.href = "/";
  }}
  className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition"
>
  Back
</button>
        </div>
      </nav>


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
                  {timeLeft1}
                </span>
              </div>

              <p className="mt-4 text-gray-600">
                Build a modern responsive landing page using Next.js.
              </p>

              <div className="mt-4 flex gap-6 text-sm">
                <a href="https://github.com/Bourhjoul/Mern-Ecommerce-website" className="text-green-600">GitHub Repo</a>
                <a href="/guidesheet.pdf" className="text-blue-600">View PDF Guide</a>
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
            <div className="mt-6 p-6 border rounded-2xl bg-white shadow-sm">
  <h3 className="text-xl font-semibold text-gray-800 mb-4">
    Submission Requirements
  </h3>

  <ul className="text-gray-600 leading-7 space-y-2">
    <li>
      <span className="font-semibold text-gray-800">GitHub Repository:</span>{" "}
      Submit the link to your repository containing the complete implementation of your work.
    </li>
    <li>
      <span className="font-semibold text-gray-800">Understanding Report (PDF):</span>{" "}
      Provide a document explaining your understanding of the given base code, including its architecture and workflow.
    </li>
    <li>
      <span className="font-semibold text-gray-800">Work Report (PDF):</span>{" "}
      Include a detailed report describing the tasks you completed, challenges encountered, and the solutions or technologies used.
    </li>
  </ul>

  {/* SUBMISSION */}
  <div className="mt-8 border-t pt-6">
    <input
      type="text"
      placeholder="Enter your GitHub repository link"
      className="w-full border border-gray-300 p-3 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-green-500"
      onChange={(e) => setText(e.target.value)}
    />

    <label className="block text-sm font-medium text-gray-700 mb-1">
      Upload Understanding Report (PDF)
    </label>
    <input
      type="file"
      onChange={(e) => setFile1(e.target.files?.[0] || null)}
      className="w-full mb-4"
    />

    <label className="block text-sm font-medium text-gray-700 mb-1">
      Upload Work Report (PDF)
    </label>
    <input
      type="file"
      onChange={(e) => setFile2(e.target.files?.[0] || null)}
      className="w-full mb-4"
    />

    <button
      disabled={submissions["project1"]}
      onClick={() => submitProject("project1")}
      className={`w-full py-3 rounded-xl font-medium transition ${
        submissions["project1"]
          ? "bg-gray-400 cursor-not-allowed"
          : "bg-green-600 text-white hover:bg-green-500"
      }`}
    >
      {submissions["project1"] ? "Submitted" : "Submit Project"}
    </button>
  </div>
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
                  {timeLeft2}
                </span>
              </div>

              <p className="mt-4 text-gray-600">
                Build a full stack application using Next.js + MongoDB.
              </p>
               <div className="mt-4 flex gap-6 text-sm">
                <a href="https://github.com/devmuhib/React-Car-Rental-Website" className="text-green-600">GitHub Repo</a>
                <a href="/guidesheet.pdf" className="text-blue-600">View PDF Guide</a>
              </div>

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

             <div className="mt-6 p-6 border rounded-2xl bg-white shadow-sm">
  <h3 className="text-xl font-semibold text-gray-800 mb-4">
    Submission Requirements
  </h3>

  <ul className="text-gray-600 leading-7 space-y-2">
    <li>
      <span className="font-semibold text-gray-800">GitHub Repository:</span>{" "}
      Submit the link to your repository containing the complete implementation of your work.
    </li>
    <li>
      <span className="font-semibold text-gray-800">Understanding Report (PDF):</span>{" "}
      Provide a document explaining your understanding of the given base code, including its architecture and workflow.
    </li>
    <li>
      <span className="font-semibold text-gray-800">Work Report (PDF):</span>{" "}
      Include a detailed report describing the tasks you completed, challenges encountered, and the solutions or technologies used.
    </li>
  </ul>

  {/* SUBMISSION */}
  <div className="mt-8 border-t pt-6">
    <input
      type="text"
      placeholder="Enter your GitHub repository link"
      className="w-full border border-gray-300 p-3 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-green-500"
      onChange={(e) => setText(e.target.value)}
    />

    <label className="block text-sm font-medium text-gray-700 mb-1">
      Upload Understanding Report (PDF)
    </label>
    <input
      type="file"
      onChange={(e) => setFile1(e.target.files?.[0] || null)}
      className="w-full mb-4"
    />

    <label className="block text-sm font-medium text-gray-700 mb-1">
      Upload Work Report (PDF)
    </label>
    <input
      type="file"
      onChange={(e) => setFile2(e.target.files?.[0] || null)}
      className="w-full mb-4"
    />

    <button
      disabled={submissions["project2"]}
      onClick={() => submitProject("project2")}
      className={`w-full py-3 rounded-xl font-medium transition ${
        submissions["project2"]
          ? "bg-gray-400 cursor-not-allowed"
          : "bg-green-600 text-white hover:bg-green-500"
      }`}
    >
      {submissions["project2"] ? "Submitted" : "Submit Project"}
    </button>
  </div>
</div>
            </div>
          )}
        </div>
      )}

       {/* FOOTER */}
<footer className="w-full bg-gray-900 text-white mt-10">
  <div className="max-w-6xl mx-auto px-6 py-12 text-center">

    {/* LOGO / NAME */}
    <h3 className="text-xl font-semibold mb-3">
      Work<span className="text-green-500">Hatch</span>
    </h3>

    <p className="text-gray-400 text-sm mb-6">
      Building real skills through real work.
    </p>

    {/* ICONS */}
    <div className="flex justify-center gap-6 text-xl mb-6">
      <a href="https://www.linkedin.com/company/workhatch/" className="hover:text-green-400"><FaLinkedin /></a>
               <a href="https://www.instagram.com/theworkhatch/" className="hover:text-green-400"><FaInstagram /></a>
      <a href="#" className="hover:text-green-400 transition"><FaXTwitter /></a>
      <a href="#" className="hover:text-green-400 transition"><FaYoutube /></a>
    </div>

    {/* DIVIDER */}
    <div className="border-t border-gray-700 pt-6 text-xs text-gray-500">
      © {new Date().getFullYear()} WorkHatch. All rights reserved.
    </div>

  </div>
</footer>


    </div>
  );
}