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
        className="absolute top-4 right-4 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg transition"
      >
        Back
      </button>

      {/* Header */}
      <header className="text-center max-w-3xl mb-10">
        <h1 className="text-4xl font-bold mb-4">
          <span className="text-blue-600">OROVE</span>
        </h1>
        <p className="text-lg text-gray-600 leading-7">
  OROVE helps students and aspiring professionals gain real industry experience through structured Internship Experience Programs inspired by the workflows of modern companies. Instead of completing random practice assignments, participants work on realistic projects, solve practical business problems, and develop the skills companies expect from job-ready candidates.
</p>
      </header>

      {/* About Section */}
     <section className="bg-gray-100 shadow-lg rounded-2xl p-6 max-w-3xl w-full mb-10">
  <h2 className="text-2xl font-semibold text-blue-600 mb-4">
    What We Do
  </h2>

  <p className="text-gray-700 leading-7 mb-4">
    Every Internship Experience Program at OROVE is designed to simulate how real engineering and product teams work. Participants receive structured project tasks, requirements, deadlines, and professional workflows that closely resemble those used in modern companies.
  </p>

  <p className="text-gray-700 leading-7 mb-4">
    Rather than spending weeks on artificial exercises, participants build practical skills by working on realistic projects that strengthen technical knowledge, problem-solving, communication, and professional thinking.
  </p>

  <p className="text-gray-700 leading-7">
    Upon successful completion, participants receive an Internship Certificate of Completion that reflects their project-based learning experience, helping them strengthen their resume and prepare confidently for future internship and job opportunities.
  </p>
</section>

      {/* Opportunities Section */}
      <section className="bg-gray-100 shadow-lg rounded-2xl p-6 max-w-3xl w-full mb-10">
  <h2 className="text-2xl font-semibold text-blue-600 mb-4">
    Opportunities & Impact
  </h2>

  <ul className="space-y-3 text-gray-700">
    <li>• Experience internship programs inspired by real company workflows</li>
    <li>• Complete practical projects instead of theoretical assignments</li>
    <li>• Develop industry-ready technical and problem-solving skills</li>
    <li>• Build a portfolio through meaningful project work</li>
    <li>• Earn an Internship Certificate of Completion</li>
    <li>• Prepare confidently for future internships and full-time job opportunities</li>
  </ul>
</section>

      {/* Contact Section */}
     <section className="bg-gray-100 shadow-lg rounded-2xl p-6 max-w-3xl w-full">
  <h2 className="text-2xl font-semibold text-blue-600 mb-4">
    Contact & Support
  </h2>

  <p className="text-gray-700 mb-6 leading-7">
    Have questions about our Internship Experience Programs, certificates, project workflows, or anything else? Send us your query, and our team will get back to you as soon as possible.
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
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-500 transition"
          >
            Submit Query
          </button>
        </form>

        {status && (
          <p className="mt-4 text-center text-sm text-gray-600">{status}</p>
        )}

        {/* Socials */}
        <div className="flex gap-6 justify-center mt-6">
          <a href="https://www.instagram.com/orove/" target="_blank">
            <FaInstagram className="text-pink-500 text-2xl hover:scale-110 transition" />
          </a>
          <a href="https://www.linkedin.com/company/orove/" target="_blank">
            <FaLinkedin className="text-blue-600 text-2xl hover:scale-110 transition" />
          </a>
        </div>
      </section>
    </div>
  );
}