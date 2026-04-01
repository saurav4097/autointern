"use client";

import { useState } from "react";
import { FaInstagram, FaLinkedin } from "react-icons/fa";
import { useRouter } from "next/navigation";

export default function WorkHatchPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [status, setStatus] = useState("");
  const router = useRouter();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("Sending...");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        setStatus("Your query has been sent successfully.");
        setForm({ name: "", email: "", message: "" });
      } else {
        setStatus("Failed to send. Please try again.");
      }
    } catch (error) {
      console.error(error);
      setStatus("Something went wrong.");
    }
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 flex flex-col items-center p-6 relative">
      
      {/* Back Button */}
      <button
        onClick={() => router.back()}
        className="absolute top-4 right-4 bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-lg transition"
      >
        Back
      </button>

      {/* Header */}
      <header className="text-center max-w-3xl mb-10">
        <h1 className="text-4xl font-bold mb-4">
          <span className="text-black">Work</span>
          <span className="text-green-600">Hatch</span>
        </h1>
        <p className="text-lg text-gray-600 leading-7">
          WorkHatch is a platform designed to bridge the gap between students and real-world opportunities.
          We provide structured internship experiences where participants work on actual industry-level projects,
          gain practical skills, and showcase their abilities through real work.
        </p>
      </header>

      {/* About Section */}
      <section className="bg-gray-100 shadow-lg rounded-2xl p-6 max-w-3xl w-full mb-10">
        <h2 className="text-2xl font-semibold text-green-600 mb-4">
          What We Do
        </h2>
        <p className="text-gray-700 leading-7 mb-4">
          At WorkHatch, we collaborate with startups and companies to bring real projects to learners.
          Instead of theoretical learning, users work on existing systems, understand real codebases,
          and contribute by solving meaningful problems.
        </p>

        <p className="text-gray-700 leading-7 mb-4">
          Each participant is assigned structured tasks, similar to real internship workflows,
          helping them gain hands-on experience in a professional environment.
        </p>

        <p className="text-gray-700 leading-7">
          The completed work is reviewed and shared with companies, allowing them to identify
          talented individuals based on actual performance rather than just resumes.
        </p>
      </section>

      {/* Opportunities Section */}
      <section className="bg-gray-100 shadow-lg rounded-2xl p-6 max-w-3xl w-full mb-10">
        <h2 className="text-2xl font-semibold text-green-600 mb-4">
          Opportunities & Impact
        </h2>

        <ul className="space-y-3 text-gray-700">
          <li>• Work on real-world projects used by startups and companies</li>
          <li>• Build practical skills through hands-on experience</li>
          <li>• Showcase your work directly to companies</li>
          <li>• Get recognized based on performance, not just qualifications</li>
          <li>• Potential opportunities for internships and full-time roles</li>
        </ul>
      </section>

      {/* Contact Section */}
      <section className="bg-gray-100 shadow-lg rounded-2xl p-6 max-w-3xl w-full">
        <h2 className="text-2xl font-semibold text-green-600 mb-4">
          Contact & Support
        </h2>

        <p className="text-gray-700 mb-6 leading-7">
          If you have any questions regarding the internship, projects, or platform,
          feel free to reach out. Our team will review your query and get back to you.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Your Name"
            required
            className="w-full p-3 rounded-lg border border-gray-300"
          />

          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Your Email"
            required
            className="w-full p-3 rounded-lg border border-gray-300"
          />

          <textarea
            name="message"
            value={form.message}
            onChange={handleChange}
            placeholder="Write your query here..."
            required
            rows={5}
            className="w-full p-3 rounded-lg border border-gray-300"
          />

          <button
            type="submit"
            className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-500 transition"
          >
            Submit Query
          </button>
        </form>

        {status && (
          <p className="mt-4 text-center text-sm text-gray-600">{status}</p>
        )}

        {/* Socials */}
        <div className="flex gap-6 justify-center mt-6">
          <a href="#" target="_blank">
            <FaInstagram className="text-pink-500 text-2xl hover:scale-110 transition" />
          </a>
          <a href="#" target="_blank">
            <FaLinkedin className="text-blue-600 text-2xl hover:scale-110 transition" />
          </a>
        </div>
      </section>
    </div>
  );
}