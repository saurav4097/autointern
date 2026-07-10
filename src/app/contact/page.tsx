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
   OROVE is a professional experience platform designed to help students and aspiring professionals become work-ready. Through structured experience programs, participants complete realistic projects, follow professional workflows, meet deadlines, receive feedback, and develop the confidence needed before entering their first internship or full-time job.
</p>
      </header>
      

      {/* About Section */}
     <section className="bg-gray-100 shadow-lg rounded-2xl p-6 max-w-3xl w-full mb-10">
      <h2 className="text-2xl font-semibold text-blue-600 mb-4">
Why OROVE?
</h2>

<p className="text-gray-700 leading-7">
Many people finish courses with strong technical knowledge but little understanding of how work actually happens inside professional teams. OROVE bridges that gap by providing structured experience programs where participants practice collaborating, solving problems, meeting deadlines, documenting their work, and delivering projects in a realistic environment. It's a place to learn from mistakes, improve continuously, and build confidence before stepping into a real workplace.
</p>
</section>
<section className="bg-gray-100 shadow-lg rounded-2xl p-6 max-w-3xl w-full mb-10">
  <h2 className="text-2xl font-semibold text-blue-600 mb-4">
    What We Do
  </h2>

  <p className="text-gray-700 leading-7 mb-4">
     Every OROVE Experience Program is designed around how professional engineering and product teams operate. Participants receive project briefs, technical requirements, milestones, deadlines, and structured workflows that simulate a real working environment.
  </p>

  <p className="text-gray-700 leading-7 mb-4">
    Instead of learning through isolated exercises, participants gain experience by solving realistic challenges, improving existing projects, documenting their work, and making decisions similar to those expected in professional teams.
  </p>

  <p className="text-gray-700 leading-7">
   Upon successful completion, participants receive a Program Completion Certificate recognizing their practical project experience. The program helps strengthen portfolios, improve confidence, and prepare participants for future internships and full-time career opportunities.
  </p>
</section>

      {/* Opportunities Section */}
      <section className="bg-gray-100 shadow-lg rounded-2xl p-6 max-w-3xl w-full mb-10">
  <h2 className="text-2xl font-semibold text-blue-600 mb-4">
    Opportunities & Impact
  </h2>

  <ul className="space-y-3 text-gray-700">
    <li>• Experience realistic professional workflows before joining a company</li>
    <li>•Work on structured projects with milestones and deadlines</li>
    <li>• Build a portfolio through practical project work</li>
    <li>• Receive a Program Completion Certificate</li>
    <li>• Become more confident and prepared for internships and full-time roles</li>
    <li>• Outstanding participants may be considered for future opportunities through WorkHatch</li>
  </ul>
</section>

      {/* Contact Section */}
     <section className="bg-gray-100 shadow-lg rounded-2xl p-6 max-w-3xl w-full">
  <h2 className="text-2xl font-semibold text-blue-600 mb-4">
    Contact & Support
  </h2>

  <p className="text-gray-700 mb-6 leading-7">
   Have questions about our experience programs, project workflows, certificates, enrollment process, or anything else? Send us your message and our team will be happy to help.
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