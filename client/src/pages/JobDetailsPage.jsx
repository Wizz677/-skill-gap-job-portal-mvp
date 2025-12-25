import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../api';
import { useAuth } from '../context/AuthContext';
import { SkillGapVisualizer } from '../components/SkillGapVisualizer';

export function JobDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [applyError, setApplyError] = useState('');
  const [applySuccess, setApplySuccess] = useState('');
  const [applying, setApplying] = useState(false);

  useEffect(() => {
    setLoading(true);
    api
      .getJob(id)
      .then((data) => setJob(data.job))
      .catch((err) => setError(err.message || 'Failed to load job'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleApply = async () => {
    setApplyError('');
    setApplySuccess('');

    if (!user) {
      navigate('/login');
      return;
    }

    setApplying(true);
    try {
      await api.applyToJob(id);
      setApplySuccess('Application submitted successfully');
    } catch (err) {
      setApplyError(err.message || 'Failed to apply');
    } finally {
      setApplying(false);
    }
  };

  if (loading) return <div className="p-4">Loading job...</div>;
  if (error) return <div className="p-4 text-red-600">{error}</div>;
  if (!job) return <div className="p-4">Job not found</div>;

  const userSkills = user?.skills || '';

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-semibold mb-1">{job.title}</h2>
      <p className="text-sm text-gray-700 mb-1">{job.company_name}</p>
      <p className="text-sm text-gray-600 mb-4">{job.location}</p>
      <h3 className="font-semibold mb-1">Job Description</h3>
      <p className="text-gray-800 mb-4 whitespace-pre-line">{job.description}</p>
      <h3 className="font-semibold mb-1">Required Skills</h3>
      <p className="text-gray-800 mb-2">{job.required_skills}</p>

      <SkillGapVisualizer jobRequiredSkills={job.required_skills} userSkills={userSkills} />

      <div className="mt-4">
        <button
          onClick={handleApply}
          disabled={applying}
          className="px-4 py-2 rounded bg-indigo-600 text-white font-medium hover:bg-indigo-700 disabled:opacity-60"
        >
          {applying ? 'Applying...' : 'Apply to this job'}
        </button>
        {applyError && <p className="text-sm text-red-600 mt-2">{applyError}</p>}
        {applySuccess && <p className="text-sm text-green-600 mt-2">{applySuccess}</p>}
      </div>
    </div>
  );
}
