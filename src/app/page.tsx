"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

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
    <main className="min-h-screen bg-white text-black flex flex-col items-center">

      {/* Logout */}
      <button
        onClick={async () => {
          await fetch("/api/auth/logout");
          window.location.reload();
        }}
        className="bg-red-500 text-white px-4 py-2 rounded mt-6"
      >
        Logout
      </button>

      {/* Hero */}
      <section className="w-full max-w-6xl px-6 pt-32 pb-20 text-center">

        <h1 className="text-6xl md:text-8xl font-extrabold">
          auto<span className="text-green-600">intern</span>
        </h1>

        <div className="mt-12 space-y-6">
          <p className="text-3xl md:text-5xl font-semibold">
            Get Real Internship Experience
          </p>

          <p className="text-2xl md:text-4xl font-light text-gray-700">
            Without Rejections. Without Referrals.
          </p>

          <p className="text-xl md:text-2xl text-gray-500">
            Just Skills. Just Growth. Just Results.
          </p>
        </div>

        {/* Buttons */}
        <div className="mt-20 flex flex-col items-center gap-6">

          {[
            { name: "AI / ML Role", slug: "ai" },
            { name: "Web Development", slug: "web" },
            { name: "App Development", slug: "app" },
            { name: "Coding Role", slug: "coding" },
            { name: "Cloud Role", slug: "cloud" }
          ].map((role, index) => (
            <button
              key={index}
              onClick={() => handleClick(role.slug)}
              className="w-72 py-4 rounded-2xl bg-green-600 hover:bg-green-500 text-white font-semibold text-lg transition shadow-md hover:scale-105"
            >
              {role.name}
            </button>
          ))}

        </div>

      </section>

      {/* Popup Modal */}
      {showPopup && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">

          <div className="bg-white w-125 p-10 rounded-2xl shadow-xl text-center">

            <h2 className="text-2xl font-bold mb-6">
              Confirm Your Internship
            </h2>

            <p className="text-gray-600 mb-6">
              This internship will run for <b>30 days</b>.
              You will receive real tasks, learning resources,
              and practical experience to simulate a real
              company environment.
            </p>

            <p className="mb-8 text-gray-500">
              Role Selected: <b>{selectedRole}</b>
            </p>

            <div className="flex justify-center gap-6">

              <button
                onClick={() => setShowPopup(false)}
                className="px-6 py-3 border rounded-lg"
              >
                Back
              </button>

              <button
                onClick={confirmInternship}
                className="px-6 py-3 bg-green-600 text-white rounded-lg"
              >
                Yes Start
              </button>

            </div>

          </div>

        </div>
      )}

      <footer className="w-full text-center py-10 text-gray-500 border-t mt-20">
        © {new Date().getFullYear()} autointern
      </footer>

    </main>
  );
}