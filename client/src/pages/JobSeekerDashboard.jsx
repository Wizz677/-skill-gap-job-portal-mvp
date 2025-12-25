import React, { useEffect, useState } from 'react';
import { api } from '../api';

export function JobSeekerDashboard() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [skills, setSkills] = useState('');
  const [profileMessage, setProfileMessage] = useState('');
  const [profileError, setProfileError] = useState('');
  const [savingProfile, setSavingProfile] = useState(false);
  const [uploadingResume, setUploadingResume] = useState(false);

  useEffect(() => {
    setLoading(true);
    Promise.all([api.me(), api.jobSeekerApplications()])
      .then(([meData, appsData]) => {
        setSkills(meData.user.skills || '');
        setApplications(appsData.applications || []);
      })
      .catch((err) => setError(err.message || 'Failed to load dashboard'))
      .finally(() => setLoading(false));
  }, []);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setProfileMessage('');
    setProfileError('');
    setSavingProfile(true);
    try {
      await api.updateProfile({ skills });
      setProfileMessage('Profile updated');
    } catch (err) {
      setProfileError(err.message || 'Failed to update profile');
    } finally {
      setSavingProfile(false);
    }
  };

  const handleResumeChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setProfileMessage('');
    setProfileError('');
    setUploadingResume(true);
    try {
      await api.uploadResume(file);
      setProfileMessage('Resume uploaded');
    } catch (err) {
      setProfileError(err.message || 'Failed to upload resume');
    } finally {
      setUploadingResume(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-8">
      <section>
        <h2 className="text-2xl font-semibold mb-4">My Profile</h2>
        <form onSubmit={handleSaveProfile} className="space-y-4 border border-gray-200 rounded p-4 bg-white">
          <div>
            <label className="block text-sm font-medium mb-1">Skills (comma-separated)</label>
            <input
              type="text"
              className="w-full border rounded px-3 py-2"
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
              placeholder="JavaScript, React, SQL"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Resume (PDF)</label>
            <input
              type="file"
              accept="application/pdf"
              onChange={handleResumeChange}
              className="text-sm"
            />
          </div>
          {profileError && <p className="text-sm text-red-600">{profileError}</p>}
          {profileMessage && <p className="text-sm text-green-600">{profileMessage}</p>}
          <button
            type="submit"
            disabled={savingProfile}
            className="px-4 py-2 rounded bg-indigo-600 text-white font-medium hover:bg-indigo-700 disabled:opacity-60"
          >
            {savingProfile ? 'Saving...' : 'Save Profile'}
          </button>
          {uploadingResume && <p className="text-xs text-gray-500 mt-1">Uploading resume...</p>}
        </form>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">My Applications</h2>
        {loading && <p>Loading...</p>}
        {error && <p className="text-sm text-red-600 mb-4">{error}</p>}
        <div className="space-y-3">
          {applications.map((app) => (
            <div key={app.id} className="border border-gray-200 rounded p-3 bg-white">
              <h3 className="font-semibold">{app.title}</h3>
              <p className="text-sm text-gray-700">{app.company_name}</p>
              <p className="text-xs text-gray-500 mt-1">
                Applied at: {new Date(app.applied_at).toLocaleString()}
              </p>
            </div>
          ))}
          {!loading && applications.length === 0 && (
            <p className="text-sm text-gray-600">You haven&apos;t applied to any jobs yet.</p>
          )}
        </div>
      </section>
    </div>
  );
}
