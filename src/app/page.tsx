"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { FaLinkedin, FaInstagram, FaYoutube } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import Image from 'next/image'
export default function Home() {
  const router = useRouter();

  const [showPopup, setShowPopup] = useState(false);
  const [selectedRole, setSelectedRole] = useState("");

  const handleClick = async (role: string) => {
    const res = await fetch("/api/auth/check");

    if (!res.ok) {
      router.push("/login");
      return;
    }

    const internshipRes = await fetch(`/api/auth/check-internship?role=${role}`);
    const data = await internshipRes.json();

    if (data.enrolled) {
      router.push(`/roles/${role}`);
    } else {
      setSelectedRole(role);
      setShowPopup(true);
    }
  };

  const confirmInternship = async () => {
    await fetch("/api/auth/start", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ role: selectedRole }),
    });

    router.push(`/roles/${selectedRole}`);
  };

  return (
    <main className="min-h-screen bg-white text-gray-900 flex flex-col">

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
          <button
          onClick={() => router.push("/contact")}
           className="text-gray-600 hover:text-black font-medium">
            About Us
          </button>

          <button
            onClick={async () => {
              await fetch("/api/auth/logout");
              window.location.reload();
            }}
            className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition"
          >
            Logout
          </button>
        </div>
      </nav>

      {/* HERO */}
      <section className="flex flex-col items-center text-center px-6 pt-20 pb-12">

        {/* BIG BRAND */}
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight">
          Work<span className="text-green-600">Hatch</span>
        </h1>

        <h2 className="mt-6 text-3xl md:text-5xl font-bold leading-tight max-w-3xl">
          Hatch Your Career with <span className="text-green-600">Real Work</span>
        </h2>

        <p className="mt-4 text-lg md:text-xl text-gray-600 max-w-2xl">
          Work on real company projects, build proof of skills, and get hired —
          without rejections or referrals.
        </p>

      </section>

      {/* ROLES */}
      <section className="px-6 md:px-12 pb-20">

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-5xl mx-auto">

          {[
            { name: "AI / ML", slug: "ai" },
            { name: "Web Development", slug: "web" },
            { name: "Data Analyst + Data Science", slug: "analyst" },
            { name: "Software Engineering", slug: "Software" },
            { name: "UI/UX Design", slug: "uiux" }
          ].map((role, index) => (
            <div
              key={index}
              onClick={() => handleClick(role.slug)}
              className="relative cursor-pointer border-2 border-green-500 rounded-2xl p-6 h-40 hover:shadow-xl hover:scale-[1.03] transition bg-white flex flex-col justify-between"
            >
              {/* Top Tag */}
              <span className="absolute top-3 right-3 text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                30 Days
              </span>

              <h3 className="text-xl font-semibold">
                {role.name}
              </h3>

              {/* Bottom Tag */}
              <span className="text-xs text-green-600 font-medium self-end">
                Internship
              </span>
            </div>
          ))}

        </div>

      </section>

      {/* POPUP */}
      {showPopup && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center px-4">

          <div className="bg-white w-full max-w-md p-8 rounded-2xl shadow-2xl text-center">

            <h2 className="text-2xl font-bold mb-4">
              Confirm Internship
            </h2>

            <p className="text-gray-600 mb-6">
              This internship runs for <b>30 days</b> with real tasks and hands-on experience.
            </p>

            <p className="mb-6 text-gray-500">
              Role: <b>{selectedRole}</b>
            </p>

            <div className="flex justify-center gap-4">

              <button
                onClick={() => setShowPopup(false)}
                className="px-5 py-2 border rounded-lg hover:bg-gray-100"
              >
                Back
              </button>

              <button
                onClick={confirmInternship}
                className="px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-500"
              >
                Start
              </button>

            </div>

          </div>
        </div>
      )}

      {/* FOOTER */}
      <footer className="w-full bg-gray-900 text-white py-10 px-6 text-center">

        <h3 className="text-lg font-semibold mb-4">
          Work<span className="text-green-500">Hatch</span>
        </h3>

        <p className="mb-6 text-sm text-gray-400">
          Building real skills through real work.
        </p>

        {/* ICONS */}
        <div className="flex justify-center gap-6 text-xl">

          <a href="#" className="hover:text-green-400"><FaLinkedin /></a>
          <a href="#" className="hover:text-green-400"><FaInstagram /></a>
          <a href="#" className="hover:text-green-400"><FaXTwitter /></a>
          <a href="#" className="hover:text-green-400"><FaYoutube /></a>

        </div>

        <p className="mt-6 text-xs text-gray-500">
          © {new Date().getFullYear()} WorkHatch. All rights reserved.
        </p>

      </footer>

    </main>
  );
}