import React from "react";

export function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#050A1F] via-[#0B1033] to-[#2A2F7A] text-white">
      
    {/* Navbar */}
<nav className="fixed top-0 w-full z-50 backdrop-blur-md bg-gradient-to-b from-black/60 to-black/30 border-b border-white/10">
  <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
    
    {/* Logo */}
    <span className="text-lg font-semibold tracking-tight text-gray-100">
      ApplySmart
    </span>

    {/* Links */}
    <div className="flex items-center gap-6 text-sm">
      <a
        href="/jobs"
        className="text-gray-300 hover:text-white transition"
      >
        Jobs
      </a>
      <a
        href="/login"
        className="text-gray-300 hover:text-white transition"
      >
        Login
      </a>
      <a
        href="/signup"
        className="px-4 py-2 rounded-md bg-indigo-600 hover:bg-indigo-500 transition text-white font-medium"
      >
        Signup
      </a>
    </div>

  </div>
</nav>


      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center px-6 text-center">
        <div className="max-w-3xl">
          <h1 className="text-5xl md:text-6xl font-bold leading-tight tracking-tight">
            Apply smarter.
            <br />
            Know your fit before you apply.
          </h1>

          <p className="mt-6 text-lg text-gray-300">
            ApplySmart compares your skills with job requirements and shows a
            clear match percentage — so you focus only on roles that truly fit
            you.
          </p>

          <div className="mt-10 flex justify-center gap-4">
            <a
              href="/signup"
              className="px-6 py-3 rounded-lg bg-indigo-600 hover:bg-indigo-500 transition font-medium"
            >
              Get started
            </a>
            <a
              href="/jobs"
              className="px-6 py-3 rounded-lg border border-indigo-400 text-indigo-300 hover:bg-white/5 transition"
            >
              Browse jobs
            </a>
          </div>
        </div>
      </section>

      {/* Value Proposition */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto grid gap-8 md:grid-cols-3">
          <div className="p-6 rounded-xl bg-white/5 backdrop-blur-sm">
            <h3 className="text-lg font-semibold mb-2">
              Skill Gap Visualizer
            </h3>
            <p className="text-sm text-gray-400">
              Instantly see which skills you already have and which ones you
              need to improve for each job.
            </p>
          </div>

          <div className="p-6 rounded-xl bg-white/5 backdrop-blur-sm">
            <h3 className="text-lg font-semibold mb-2">
              Match Percentage
            </h3>
            <p className="text-sm text-gray-400">
              Understand how well you fit a role with a clear and honest
              percentage before applying.
            </p>
          </div>

          <div className="p-6 rounded-xl bg-white/5 backdrop-blur-sm">
            <h3 className="text-lg font-semibold mb-2">
              Simple Dashboards
            </h3>
            <p className="text-sm text-gray-400">
              Track applications or applicants in a clean, distraction-free
              interface built for demos.
            </p>
          </div>
        </div>
      </section>

      {/* Job Seekers vs Employers */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto grid gap-10 md:grid-cols-2">

          <div className="p-8 rounded-xl bg-white/5 backdrop-blur-sm">
            <h3 className="text-xl font-semibold mb-4">
              For Job Seekers
            </h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>• See matched and missing skills instantly</li>
              <li>• Track all applications in one place</li>
              <li>• Apply confidently, not blindly</li>
            </ul>
          </div>

          <div className="p-8 rounded-xl bg-white/5 backdrop-blur-sm">
            <h3 className="text-xl font-semibold mb-4">
              For Employers
            </h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>• Post jobs with clear skill requirements</li>
              <li>• View applicants and resumes instantly</li>
              <li>• Perfect for MVP demos and portfolios</li>
            </ul>
          </div>

        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 text-center text-sm text-gray-400">
        Phase-1 MVP • Built for academic demo • ApplySmart
      </footer>
    </div>
  );
}
