import React, { useEffect, useState } from 'react';
import { getTasks } from '../../services/taskService.js';

const ProfileTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        const res = await getTasks();
        if (!mounted) return;
        setTasks(res.data || []);
      } catch (err) {
        setError(err?.message || 'Failed to load tasks');
      } finally {
        setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">My Tasks</h2>
      {loading && <div className="p-4"> <div className="w-6 h-6 border-2 border-t-transparent rounded-full animate-spin" /> Loading tasks...</div>}
      {error && <div className="p-4 text-red-600">{error}</div>}

      <div className="space-y-3">
        {tasks.length === 0 && !loading && <div className="text-gray-600">No tasks assigned</div>}
        {tasks.map(t => (
          <div key={t.id} className="p-3 bg-white rounded shadow flex justify-between">
            <div>
              <div className="font-semibold">{t.title}</div>
              <div className="text-xs text-gray-500">Assigned by: {t.created_by_name || '—'}</div>
              <div className="text-xs text-gray-500">Due: {t.due_date ? new Date(t.due_date).toLocaleDateString() : '—'}</div>
            </div>
            <div className="flex flex-col items-end gap-2">
              <div className="text-sm font-semibold">{t.percent_completed ? `${t.percent_completed}%` : '—'}</div>
              <div className={`text-xs px-2 py-0.5 rounded ${t.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>{t.status}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProfileTasks;
