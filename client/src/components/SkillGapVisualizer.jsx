import React from 'react';

function normalizeSkills(str) {
  if (!str) return [];
  return str
    .split(',')
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
}

export function SkillGapVisualizer({ jobRequiredSkills, userSkills }) {
  const jobSkills = normalizeSkills(jobRequiredSkills);
  const seekerSkills = normalizeSkills(userSkills);

  const matched = jobSkills.filter((s) => seekerSkills.includes(s));
  const missing = jobSkills.filter((s) => !seekerSkills.includes(s));

  const matchPercent = jobSkills.length === 0 ? 0 : Math.round((matched.length / jobSkills.length) * 100);

  return (
    <div className="mt-4 p-4 border border-gray-200 rounded bg-white">
      <h3 className="font-semibold text-lg mb-2">Skill Gap Visualizer</h3>
      <p className="text-sm text-gray-700 mb-2">
        Match: <span className="font-semibold">{matchPercent}%</span>
      </p>
      <div className="w-full h-3 bg-gray-100 rounded mb-3 overflow-hidden">
        <div
          className="h-3 bg-green-500"
          style={{ width: `${matchPercent}%`, transition: 'width 0.3s ease' }}
        />
      </div>
      <div className="flex flex-wrap gap-2 mb-2">
        {matched.map((s) => (
          <span key={s} className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
            {s}
          </span>
        ))}
      </div>
      {missing.length > 0 && (
        <div>
          <p className="text-sm font-medium text-gray-700 mb-1">Skills to improve:</p>
          <div className="flex flex-wrap gap-2">
            {missing.map((s) => (
              <span key={s} className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800">
                {s}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
