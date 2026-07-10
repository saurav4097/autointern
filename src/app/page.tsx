"use client";
import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { FaLinkedin, FaInstagram, FaYoutube } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
function HomeContent() {
  const router = useRouter();
const searchParams = useSearchParams();
  const [showPopup, setShowPopup] = useState(false);
const [selectedRole, setSelectedRole] = useState("");
const [loading, setLoading] = useState(false);

useEffect(() => {
  const ref = searchParams.get("ref");

  if (ref) {
    const data = {
      code: ref,
      expiry: Date.now() + 30 * 24 * 60 * 60 * 1000, // 30 days
    };

    localStorage.setItem("oroveReferral", JSON.stringify(data));
  }
}, [searchParams]);

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
  

  const proceedToPayment = async () => {
    setLoading(true);
    let referralCode = "orovenew";

const storedReferral = localStorage.getItem("oroveReferral");

if (storedReferral) {
  const parsed = JSON.parse(storedReferral);

  if (parsed.expiry > Date.now()) {
    referralCode = parsed.code;
  } else {
    localStorage.removeItem("oroveReferral");
  }
}
  try {
    const response = await fetch("/api/payment/create-order", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
     body: JSON.stringify({
  role: selectedRole,
  referralCode,
}),
    });

    const data = await response.json();

    if (!data.success) {
  setLoading(false);
  alert("Failed to create payment order.");
  return;
}

    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,

      amount: data.order.amount,

      currency: data.order.currency,

      name: "OROVE",

      description: `${selectedRole} Internship`,

      image: "/orove.png",

      order_id: data.order.id,

      theme: {
        color: "#2563EB",
      },

     handler: async function (response: any) {
  const verifyRes = await fetch("/api/payment/verify", {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify({
      razorpay_order_id: response.razorpay_order_id,

      razorpay_payment_id: response.razorpay_payment_id,

      razorpay_signature: response.razorpay_signature,

      role: selectedRole,
      referralCode,
    }),
  });

  const result = await verifyRes.json();

  if (result.success) {
  setLoading(false);

  setShowPopup(false);

  router.push(`/roles/${selectedRole}`);
} else {
    setLoading(false);
    alert(result.message);
  }
},
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.on("payment.failed", function () {
  setLoading(false);

  alert("Payment failed or cancelled.");
});

    paymentObject.open();
  } catch (error) {
    console.error(error);
 setLoading(false);
    alert("Something went wrong.");
  }
};

  return (
    <main className="min-h-screen bg-white text-gray-900 flex flex-col">

      {/* NAVBAR */}
      <nav className="w-full flex items-center justify-between px-6 md:px-12 py-4 border-b bg-white/80 backdrop-blur sticky top-0 z-50">

        <div className="flex items-center gap-2 text-xl font-bold">
          <img
  src="/orove.png"
  alt="Logo"
  className="w-8 h-8 rounded-full object-cover"
/>
          <span className="text-blue-600">
           OROVE
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
          <span className="text-blue-600">OROVE</span>
        </h1>

        <h2 className="mt-6 text-3xl md:text-5xl font-bold leading-tight max-w-4xl">
  Become <span className="text-blue-600">Work Ready</span> Before Your First Job
</h2>

        <p className="mt-4 text-lg md:text-xl text-gray-600 max-w-3xl">
  Learn beyond courses through structured work simulation programs designed around real industry workflows, deadlines, reviews, and professional collaboration. Build confidence, gain practical experience, and prepare yourself for the expectations of your first job.
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
              className="relative cursor-pointer border-2 border-blue-500 rounded-2xl p-6 h-40 hover:shadow-xl hover:scale-[1.03] transition bg-white flex flex-col justify-between"
            >
              {/* Top Tag */}
              <span className="absolute top-3 right-3 text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                30 Days
              </span>

              <h3 className="text-xl font-semibold">
                {role.name}
              </h3>

              {/* Bottom Tag */}
              <span className="text-xs text-blue-600 font-medium self-end">
                Experience Program
              </span>
            </div>
          ))}

        </div>

      </section>

      {/* POPUP */}
      {showPopup && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center px-4">

          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden">

  {/* Offer Banner */}
  <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-center py-3">
    <p className="text-sm font-semibold">
       Launch Offer • Save ₹200
    </p>
  </div>

  <div className="p-6">

    <h2 className="text-2xl font-bold text-center">
      Join the Program
    </h2>

    <p className="text-gray-500 text-center mt-1">
      30-Day Industry Experience Program
    </p>

    <p className="text-center text-gray-500 mt-2">
      Gain confidence by working through realistic projects, deadlines, and reviews.
    </p>

    {/* Price */}
    <div className="flex justify-center items-center gap-3 mt-5">
      <span className="text-xl text-gray-400 line-through">
        ₹999
      </span>

      <span className="text-4xl font-extrabold text-blue-600">
        ₹799
      </span>
    </div>

    <p className="text-center text-green-600 text-sm font-medium mt-1">
      Limited Time Price
    </p>

    {/* Role */}
    <div className="bg-blue-50 rounded-xl py-3 mt-5 text-center">
      <p className="text-xs text-gray-500">
        Selected Program
      </p>

      <p className="font-semibold text-blue-700">
        {selectedRole} Experience Program
      </p>
    </div>

    {/* Benefits */}
    <ul className="mt-5 space-y-2 text-sm text-gray-700">
      <li>✅ Program Completion Certificate</li>
      <li>✅ Letter of Recommendation (Performance Based)</li>
      <li>✅ Professional Workflow Simulation</li>
      <li>✅ Top Performers May Receive Hiring Opportunities</li>
    </ul>

    {/* Buttons */}
    <div className="flex gap-3 mt-6">

      <button
        onClick={() => setShowPopup(false)}
        className="flex-1 border rounded-xl py-2.5 hover:bg-gray-100 transition"
      >
        Back
      </button>

      <button
        onClick={proceedToPayment}
        disabled={loading}
        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white rounded-xl py-2.5 font-semibold transition disabled:opacity-60"
      >
        {loading ? "Creating..." : "Enroll • ₹799"}
      </button>

    </div>
    <p className="text-xs text-gray-400 text-center mt-5">
      Secure payment powered by Razorpay.
    </p>

  </div>

</div>
        </div>
      )}

      {/* FOOTER */}
      <footer className="w-full bg-gray-900 text-white py-10 px-6 text-center">

        <h3 className="text-lg font-semibold mb-4">
          OROVE
        </h3>

        <p className="mb-6 text-sm text-gray-400">
          Learn. Practice. Build Confidence.
        </p>

        {/* ICONS */}
        <div className="flex justify-center gap-6 text-xl">

          <a href="#" className="hover:text-blue-400"><FaLinkedin /></a>
          <a href="#" className="hover:text-blue-400"><FaInstagram /></a>
          <a href="#" className="hover:text-blue-400"><FaXTwitter /></a>
          <a href="#" className="hover:text-blue-400"><FaYoutube /></a>

        </div>

        <p className="mt-6 text-xs text-gray-500">
          © {new Date().getFullYear()} OROVE. All rights reserved.
        </p>

      </footer>

    </main>
  );
}
export default function Home() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          Loading...
        </div>
      }
    >
      <HomeContent />
    </Suspense>
  );
}