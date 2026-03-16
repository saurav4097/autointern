"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");

  const handleLogin = async () => {
    try {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

     const text = await res.text();
    const data = text ? JSON.parse(text) : {};

        if (res.ok) {
      router.push("/");
    } else {
      alert(data.message || "Login failed");
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
          Login to <span className="text-green-600">AutoIntern</span>
        </h1>

        <input
          type="email"
          placeholder="Email"
          className="w-full border p-3 rounded mb-6"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <button
          onClick={handleLogin}
          className="w-full bg-green-600 hover:bg-green-500 text-white py-3 rounded font-semibold"
        >
          Login
        </button>

        <p className="text-center mt-5 text-sm">
          Don’t have an account?{" "}
          <span
            onClick={() => router.push("/signup")}
            className="text-green-600 cursor-pointer"
          >
            Sign Up
          </span>
        </p>

      </div>

    </div>
  );
}
