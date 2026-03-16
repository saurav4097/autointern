"use client";

import { useRouter } from "next/navigation";
export default function Home() {
const router = useRouter();

const handleClick = async (role: string) => {
  const res = await fetch("/api/auth/check");

  if (res.ok) {
    router.push(`/roles/${role}`);
  } else {
    router.push("/login");
  }
};

  return (
    <main className="min-h-screen bg-white text-black flex flex-col items-center">
      <button
  onClick={async () => {
    await fetch("/api/auth/logout");
    window.location.reload();
  }}
  className="bg-red-500 text-white px-4 py-2 rounded"
>
  Logout
</button>

      {/* Hero Section */}
      <section className="w-full max-w-6xl px-6 pt-32 pb-20 text-center">

        {/* Brand Name */}
        <h1 className="text-6xl md:text-8xl font-extrabold tracking-tight leading-tight">
          auto<span className="text-green-600">intern</span>
        </h1>

        {/* Tagline Big Stylish */}
        <div className="mt-12 space-y-6">
          <p className="text-3xl md:text-5xl font-semibold leading-snug">
            Get Real Internship Experience
          </p>

          <p className="text-2xl md:text-4xl font-light text-gray-700">
            Without Rejections. Without Referrals.
          </p>

          <p className="text-xl md:text-2xl text-gray-500">
            Just Skills. Just Growth. Just Results.
          </p>
        </div>

        {/* Buttons Section */}
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
    className="w-72 py-4 rounded-2xl bg-green-600 hover:bg-green-500 text-white font-semibold text-lg transition duration-300 shadow-md hover:scale-105"
  >
    {role.name}
  </button>
))}


        </div>

      </section>

      {/* Footer */}
      <footer className="w-full text-center py-10 text-gray-500 border-t mt-20">
        © {new Date().getFullYear()} autointern — Built for ambitious students.
      </footer>

    </main>
  );
}
