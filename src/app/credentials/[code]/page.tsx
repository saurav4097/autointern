"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

type Credential = {
  name: string;
  details: string;
  role: string;
  credentialType: string;
  credentialId: string;
  duration: string;
  startDate: string;
  endDate: string;
  issueDate: string;
};

function Row({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex justify-between border-b pb-3">
      <span className="font-medium text-gray-500">
        {label}
      </span>

      <span className="font-semibold text-gray-900 text-right">
        {value}
      </span>
    </div>
  );
}

export default function CredentialPage() {
  const params = useParams();

  const code = params.code as string;

  const [credential, setCredential] =
    useState<Credential | null>(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!code) return;

    const fetchCredential = async () => {
      try {
        const res = await fetch(`/api/credentials/${code}`);

        if (!res.ok) {
          setCredential(null);
        } else {
          const data = await res.json();
          setCredential(data);
        }
      } catch (err) {
        console.error(err);
        setCredential(null);
      } finally {
        setLoading(false);
      }
    };

    fetchCredential();
  }, [code]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-lg font-medium">
        Loading...
      </div>
    );
  }

  if (!credential) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6">
        <h1 className="text-3xl font-bold text-red-600">
          Credential Not Found
        </h1>

        <p className="mt-3 text-gray-600 text-center">
          The credential you are looking for does not exist or may have been removed.
        </p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-100 flex items-center justify-center p-6">

      <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full p-8">

        <h1 className="text-3xl font-bold text-center text-blue-600">
          OROVE Credential Verification
        </h1>

        <div className="mt-6 bg-green-100 text-green-700 rounded-xl py-3 text-center font-semibold">
          ✅ Credential Verified
        </div>

        <div className="mt-8 space-y-4">

          <Row
            label="Name"
            value={credential.name}
          />

          <Row
            label="Credential Type"
            value={credential.credentialType}
          />

          <Row
            label="Role"
            value={credential.role}
          />

          <Row
            label="Duration"
            value={credential.duration}
          />

          <Row
            label="Start Date"
            value={new Date(
              credential.startDate
            ).toLocaleDateString("en-GB")}
          />

          <Row
            label="Completion Date"
            value={new Date(
              credential.endDate
            ).toLocaleDateString("en-GB")}
          />

          <Row
            label="Issue Date"
            value={new Date(
              credential.issueDate
            ).toLocaleDateString("en-GB")}
          />

          <Row
            label="Credential ID"
            value={credential.credentialId}
          />

        </div>

        <div className="mt-8">

          <h2 className="font-semibold text-lg mb-2">
            Description
          </h2>

          <p className="text-gray-600 leading-7">
            {credential.details}
          </p>

        </div>

        <button
          onClick={() =>
            window.open(
              `/api/certificategenerate/${credential.credentialId}`,
              "_blank"
            )
          }
          className="mt-8 w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold transition"
        >
          Download Certificate
        </button>

      </div>

    </main>
  );
}