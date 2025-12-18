import React, { useState } from 'react';
import { ArrowLeft, Trash2, Download } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const initialFiles = [
  { id: 'a1', name: 'resume.pdf', size: '120KB' },
  { id: 'b2', name: 'cv.docx', size: '90KB' },
];

const ProfileUploads = () => {
  const navigate = useNavigate();
  const [files, setFiles] = useState(initialFiles);

  const remove = (id) => setFiles(prev => prev.filter(f => f.id !== id));

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center mb-6 mt-5">
        <button onClick={() => navigate(-1)} className="p-2 mr-4 rounded-md hover:bg-gray-100">
          <ArrowLeft />
        </button>
        <h1 className="text-2xl font-semibold">My Uploads</h1>
      </div>

      <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
        {files.length === 0 ? (
          <p className="text-gray-600">No files uploaded yet.</p>
        ) : (
          <div className="space-y-3">
            {files.map(f => (
              <div key={f.id} className="flex items-center justify-between">
                <div>
                  <div className="font-medium">{f.name}</div>
                  <div className="text-sm text-gray-500">{f.size}</div>
                </div>
                <div className="flex items-center gap-3">
                  <button className="p-2 hover:bg-gray-100 rounded-md"><Download /></button>
                  <button className="p-2 hover:bg-red-50 text-red-600 rounded-md" onClick={() => remove(f.id)}><Trash2 /></button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileUploads;
