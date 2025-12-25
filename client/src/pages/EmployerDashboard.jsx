import React, { useEffect, useState } from 'react';
import { api } from '../api';

export function EmployerDashboard() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedJobId, setSelectedJobId] = useState(null);
  const [applicants, setApplicants] = useState([]);
  const [applicantsError, setApplicantsError] = useState('');
  const [form, setForm] = useState({ title: '', description: '', requiredSkills: '', location: '' });
  const [creating, setCreating] = useState(false);

  const loadJobs = () => {
    setLoading(true);
    api
      .employerJobs()
      .then((data) => setJobs(data.jobs || []))
      .catch((err) => setError(err.message || 'Failed to load jobs'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadJobs();
  }, []);

  const loadApplicants = (jobId) => {
    setSelectedJobId(jobId);
    setApplicants([]);
    setApplicantsError('');
    api
      .employerApplicants(jobId)
      .then((data) => setApplicants(data.applicants || []))
      .catch((err) => setApplicantsError(err.message || 'Failed to load applicants'));
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCreateJob = async (e) => {
    e.preventDefault();
    setCreating(true);
    setError('');
    try {
      await api.createJob(form);
      setForm({ title: '', description: '', requiredSkills: '', location: '' });
      loadJobs();
    } catch (err) {
      setError(err.message || 'Failed to create job');
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 grid gap-8 md:grid-cols-[2fr,1.5fr]">
      <div>
        <h2 className="text-2xl font-semibold mb-4">My Jobs</h2>
        <form onSubmit={handleCreateJob} className="space-y-3 mb-6 border border-gray-200 rounded p-4 bg-white">
          <h3 className="font-semibold mb-1">Post a new job</h3>
          <div>
            <label className="block text-sm font-medium mb-1">Title</label>
            <input
              name="title"
              className="w-full border rounded px-3 py-2"
              value={form.title}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Location</label>
            <input
              name="location"
              className="w-full border rounded px-3 py-2"
              value={form.location}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Required Skills (comma-separated)</label>
            <input
              name="requiredSkills"
              className="w-full border rounded px-3 py-2"
              value={form.requiredSkills}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              name="description"
              rows={4}
              className="w-full border rounded px-3 py-2"
              value={form.description}
              onChange={handleChange}
              required
            />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button
            type="submit"
            disabled={creating}
            className="px-4 py-2 rounded bg-indigo-600 text-white font-medium hover:bg-indigo-700 disabled:opacity-60"
          >
            {creating ? 'Creating...' : 'Create Job'}
          </button>
        </form>
        {loading && <p>Loading jobs...</p>}
        <div className="space-y-3">
          {jobs.map((job) => (
            <button
              key={job.id}
              onClick={() => loadApplicants(job.id)}
              className={`w-full text-left border rounded p-3 bg-white hover:border-indigo-300 ${
                selectedJobId === job.id ? 'border-indigo-500' : 'border-gray-200'
              }`}
            >
              <h3 className="font-semibold">{job.title}</h3>
              <p className="text-sm text-gray-700">{job.location}</p>
              <p className="text-xs text-gray-500 mt-1">Required skills: {job.required_skills}</p>
            </button>
          ))}
          {!loading && jobs.length === 0 && (
            <p className="text-sm text-gray-600">You haven&apos;t posted any jobs yet.</p>
          )}
        </div>
      </div>
      <div>
        <h2 className="text-2xl font-semibold mb-4">Applicants</h2>
        {selectedJobId == null ? (
          <p className="text-sm text-gray-600">Select a job to view applicants.</p>
        ) : (
          <div className="space-y-3">
            {applicantsError && <p className="text-sm text-red-600">{applicantsError}</p>}
            {applicants.map((a) => (
              <div key={a.id} className="border border-gray-200 rounded p-3 bg-white">
                <h3 className="font-semibold">{a.name}</h3>
                <p className="text-xs text-gray-600 mb-1">
                  Applied at: {new Date(a.applied_at).toLocaleString()}
                </p>
                {a.resume_path && (
                  <a
                    href={a.resume_path}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm text-indigo-600 underline"
                  >
                    View Resume
                  </a>
                )}
              </div>
            ))}
            {applicants.length === 0 && !applicantsError && (
              <p className="text-sm text-gray-600">No applicants for this job yet.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
