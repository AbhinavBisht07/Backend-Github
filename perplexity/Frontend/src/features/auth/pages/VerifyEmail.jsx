import { useSearchParams } from "react-router";
import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router";

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [status, setStatus] = useState("loading");

  useEffect(() => {
    const verify = async () => {
      try {
        await axios.get(`http://localhost:3000/api/auth/verify-email?token=${token}`);
        setStatus("verified");
      } catch (err) {
        setStatus("error");
      }
    };

    if (token) verify();
  }, [token]);

  return (
    <section className="min-h-screen bg-zinc-950 px-4 py-10 text-zinc-100">
      <div className="mx-auto flex min-h-[85vh] w-full max-w-5xl items-center justify-center">
        
        <div className="w-full max-w-md rounded-2xl border border-[#31b8c6]/40 bg-zinc-900/70 p-8 shadow-2xl shadow-black/50 backdrop-blur text-center">

          {/* LOADING */}
          {status === "loading" && (
            <>
              <div className="mx-auto mb-5 h-12 w-12 animate-spin rounded-full border-4 border-[#31b8c6] border-t-transparent"></div>

              <h1 className="text-2xl font-bold text-[#31b8c6]">
                Verify Your Email
              </h1>

              <p className="mt-2 text-sm text-zinc-300">
                A verification link has been sent to your email.
              </p>

              <p className="mt-1 text-sm text-zinc-400">
                Please check your inbox and verify your account.
              </p>
            </>
          )}

          {/* VERIFIED */}
          {status === "verified" && (
            <>
              <div className="mb-4 text-5xl">✅</div>

              <h1 className="text-green-400 text-2xl font-bold">
                You are verified
              </h1>

              <p className="mt-2 text-sm text-zinc-300">
                Your email has been successfully verified.
              </p>

              <Link
                to="/login"
                className="mt-6 inline-block rounded-lg bg-[#31b8c6] px-5 py-3 font-semibold text-zinc-950 transition hover:bg-[#45c7d4]"
              >
                Go to Login
              </Link>
            </>
          )}

          {/* ERROR */}
          {status === "error" && (
            <>
              <div className="mb-4 text-5xl">❌</div>

              <h1 className="text-red-400 text-2xl font-bold">
                Invalid or expired link
              </h1>

              <p className="mt-2 text-sm text-zinc-300">
                Please try registering again.
              </p>

              <Link
                to="/register"
                className="mt-6 inline-block rounded-lg bg-[#31b8c6] px-5 py-3 font-semibold text-zinc-950 transition hover:bg-[#45c7d4]"
              >
                Register Again
              </Link>
            </>
          )}

        </div>
      </div>
    </section>
  );
};

export default VerifyEmail;