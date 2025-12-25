import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api';

export function JobListPage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [skills, setSkills] = useState('');
  const [location, setLocation] = useState('');

  const loadJobs = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await api.getJobs({ search, skills, location });
      setJobs(data.jobs || []);
    } catch (err) {
      setError(err.message || 'Failed to load jobs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadJobs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    loadJobs();
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-semibold mb-1 bg-gradient-to-r from-indigo-500 to-sky-400 bg-clip-text text-transparent">
        Tech job search
      </h2>
      <p className="text-sm text-gray-600 mb-4">
        Filter roles by title, skills, and location. The Skill Gap Visualizer will highlight how well you match
        on each job&apos;s details page.
      </p>
      <form onSubmit={handleSearch} className="flex flex-wrap gap-3 mb-6">
        <input
          type="text"
          placeholder="Search by title"
          className="flex-1 min-w-[180px] border rounded px-3 py-2"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <input
          type="text"
          placeholder="Filter by skills"
          className="flex-1 min-w-[180px] border rounded px-3 py-2"
          value={skills}
          onChange={(e) => setSkills(e.target.value)}
        />
        <input
          type="text"
          placeholder="Filter by location"
          className="flex-1 min-w-[180px] border rounded px-3 py-2"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
        <button
          type="submit"
          className="px-4 py-2 rounded bg-indigo-600 text-white font-medium hover:bg-indigo-700"
        >
          Search
        </button>
      </form>
      {loading && <p>Loading jobs...</p>}
      {error && <p className="text-sm text-red-600 mb-4">{error}</p>}
      <div className="space-y-4">
        {jobs.map((job) => (
          <Link
            key={job.id}
            to={`/jobs/${job.id}`}
            className="block border border-gray-200 rounded-xl p-4 bg-white/80 backdrop-blur-sm hover:border-indigo-300 hover:shadow-md hover:-translate-y-0.5 transition-transform transition-shadow"
          >
            <h3 className="font-semibold text-lg mb-1">{job.title}</h3>
            <p className="text-sm text-gray-700 mb-1">{job.company_name}</p>
            <p className="text-sm text-gray-600 mb-2">{job.location}</p>
            <p className="text-xs text-gray-500">Required skills: {job.required_skills}</p>
          </Link>
        ))}
        {!loading && jobs.length === 0 && <p className="text-sm text-gray-600">No jobs found.</p>}
      </div>
    </div>
  );
}
