"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const handleSignup = async () => {
    try {
    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email }),
    });

   const text = await res.text();
    const data = text ? JSON.parse(text) : {};

     if (res.ok) {
      router.push("/");
    } else {
      alert(data.message || "signup failed");
    }
  } catch (error) {
    console.error(error);
    alert("Something went wrong");
  }
};
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">

      <div className="w-96 border rounded-xl p-8 shadow">

        <h1 className="text-3xl font-bold mb-6 text-center">
          Signup to <span className="text-green-600">AutoIntern</span>
        </h1>

        <input
          type="text"
          placeholder="Name"
          className="w-full border p-3 rounded mb-4"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="email"
          placeholder="Email"
          className="w-full border p-3 rounded mb-6"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <button
          onClick={handleSignup}
          className="w-full bg-green-600 hover:bg-green-500 text-white py-3 rounded font-semibold"
        >
          Sign Up
        </button>

        <p className="text-center mt-5 text-sm">
          Already have an account?{" "}
          <span
            onClick={() => router.push("/login")}
            className="text-green-600 cursor-pointer"
          >
            Login
          </span>
        </p>

      </div>

    </div>
  );
}
