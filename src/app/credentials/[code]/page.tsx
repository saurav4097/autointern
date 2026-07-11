"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  FaLinkedin,
  FaGlobe,
  FaCheckCircle,
  FaDownload,
} from "react-icons/fa";

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

function InfoCard({
  title,
  value,
}: {
  title: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4">
      <p className="text-sm text-gray-500">
        {title}
      </p>

      <p className="mt-1 font-semibold text-gray-900 break-words">
        {value}
      </p>
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>

          <p className="mt-5 text-gray-600 font-medium">
            Verifying Credential...
          </p>
        </div>
      </div>
    );
  }

  if (!credential) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
        <div className="bg-white rounded-2xl shadow-lg p-10 max-w-lg w-full text-center">

          <div className="text-6xl mb-4">
            ❌
          </div>

          <h1 className="text-3xl font-bold text-red-600">
            Credential Not Found
          </h1>

          <p className="mt-4 text-gray-600 leading-7">
            The credential you are looking for
            does not exist or may have been removed.
          </p>

        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-100 py-12 px-6">

      <div className="max-w-4xl mx-auto">

        {/* HEADER */}

        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">

          <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-10 py-10">

            <p className="uppercase tracking-[4px] text-blue-100 text-sm">
              Official Verification Portal
            </p>

            <h1 className="text-4xl font-bold mt-2">
              OROVE Credential Verification
            </h1>

            <div className="mt-6 inline-flex items-center gap-3 bg-white/15 backdrop-blur px-5 py-3 rounded-full">

              <FaCheckCircle className="text-green-300 text-xl" />

              <span className="font-semibold">
                Verified Digital Credential
              </span>

            </div>

          </div>

          {/* BODY */}

          <div className="p-10">

            <div className="text-center">

              <h2 className="text-4xl font-bold text-gray-900">
                {credential.name}
              </h2>

              <p className="mt-3 text-xl text-blue-600 font-semibold">
                {credential.role}
              </p>

              <p className="mt-2 text-gray-500">
                {credential.credentialType}
              </p>

            </div>

            {/* INFO GRID */}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-10">

              <InfoCard
                title="Credential Type"
                value={credential.credentialType}
              />

              <InfoCard
                title="Program"
                value={credential.role}
              />

              <InfoCard
                title="Duration"
                value={credential.duration}
              />

              <InfoCard
                title="Start Date"
                value={new Date(
                  credential.startDate
                ).toLocaleDateString("en-GB")}
              />

              <InfoCard
                title="Completion Date"
                value={new Date(
                  credential.endDate
                ).toLocaleDateString("en-GB")}
              />

              <InfoCard
                title="Issue Date"
                value={new Date(
                  credential.issueDate
                ).toLocaleDateString("en-GB")}
              />

            </div>

            {/* Credential ID */}

            <div className="mt-8 rounded-2xl border bg-gray-50 p-6">

              <p className="text-sm uppercase tracking-wide text-gray-500">
                Credential ID
              </p>

              <p className="mt-3 text-lg font-mono font-semibold break-all">
                {credential.credentialId}
              </p>

            </div>

            {/* Description */}

            <div className="mt-8 rounded-2xl border p-7">

              <h3 className="text-xl font-semibold">
                Credential Details
              </h3>

              <p className="mt-4 text-gray-600 leading-8">
                {credential.details}
              </p>
            </div>
                        {/* DOWNLOAD BUTTON */}

            <div className="mt-10 flex justify-center">

              <button
                onClick={() =>
                  window.open(
                    `/api/certificategenerate/${credential.credentialId}`,
                    "_blank"
                  )
                }
                className="
                  flex items-center gap-3
                  bg-blue-600
                  hover:bg-blue-700
                  text-white
                  px-10
                  py-4
                  rounded-2xl
                  font-semibold
                  text-lg
                  shadow-lg
                  transition
                  hover:scale-[1.02]
                "
              >

                <FaDownload />

                Download Certificate

              </button>

            </div>


            {/* TRUST SECTION */}

            <div className="mt-12 border-t pt-8">

              <h3 className="text-center text-lg font-semibold text-gray-800">
                Trusted & Verified By OROVE
              </h3>


              <p className="text-center mt-3 text-gray-500 leading-7 max-w-2xl mx-auto">
                This digital credential has been issued by OROVE
                and can be independently verified using the
                credential ID provided above.
              </p>


              <div className="flex justify-center gap-6 mt-6">


                <a
                  href="https://orove.xyz"
                  target="_blank"
                  className="
                    flex items-center gap-2
                    text-gray-600
                    hover:text-blue-600
                    transition
                  "
                >

                  <FaGlobe />

                  Official Website

                </a>



                <a
                href="https://www.linkedin.com/company/orove/"
                  target="_blank"
                  className="
                    flex items-center gap-2
                    text-gray-600
                    hover:text-blue-600
                    transition
                  "
                >

                  <FaLinkedin />

                  LinkedIn

                </a>


              </div>

            </div>


          </div>


          {/* FOOTER */}

          <footer
            className="
              bg-gray-900
              text-gray-400
              text-center
              py-5
              px-6
            "
          >

            <p className="text-sm">
              © {new Date().getFullYear()} OROVE. All rights reserved.
            </p>

            <p className="text-xs mt-2">
              Authentic digital credential verification system.
            </p>

          </footer>


        </div>

      </div>

    </main>
  );
}
// Deployment trigger