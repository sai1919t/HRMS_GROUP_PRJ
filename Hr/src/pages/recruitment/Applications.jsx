import { useEffect, useState } from "react";
import axios from "axios";

export default function Applications() {
  const [applications, setApplications] = useState([]);

  const fetchApplications = async () => {
    // Mocking response for demo if API fails, otherwise use your API
    try {
      const res = await axios.get("http://localhost:3000/api/applications");
      setApplications(res.data);
    } catch (e) {
      console.log("API not ready yet");
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const updateStatus = async (id, status) => {
    try {
      await axios.patch(`http://localhost:3000/api/applications/${id}/status`, {
        status,
      });
      fetchApplications();
    } catch (e) {
      console.error(e);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "SELECTED":
        return "bg-green-100 text-green-800 border-green-200";
      case "REJECTED":
        return "bg-red-100 text-red-800 border-red-200";
      case "INTERVIEW":
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div>
      <div class="px-8 pt-6">
        <h1 class="text-2xl font-bold text-[#020839] mb-4">Recruitment</h1>
        <div class="flex gap-8">
          <a
            aria-current="page"
            class="pb-3 px-1 font-semibold text-sm uppercase tracking-wide border-b-2 transition-all duration-300
     border-[#020839] text-[#020839]"
            href="/recruitment"
            data-discover="true"
          >
            Jobs
          </a>
          <a
            class="pb-3 px-1 font-semibold text-sm uppercase tracking-wide border-b-2 transition-all duration-300
     border-transparent text-gray-400 hover:text-[#020839] hover:border-gray-300"
            href="/recruitment/applications"
            data-discover="true"
          >
            Applications
          </a>
          <a
            class="pb-3 px-1 font-semibold text-sm uppercase tracking-wide border-b-2 transition-all duration-300
     border-transparent text-gray-400 hover:text-[#020839] hover:border-gray-300"
            href="/recruitment/interviews"
            data-discover="true"
          >
            Interviews
          </a>
          <a
            class="pb-3 px-1 font-semibold text-sm uppercase tracking-wide border-b-2 transition-all duration-300
     border-transparent text-gray-400 hover:text-[#020839] hover:border-gray-300"
            href="/recruitment/offers"
            data-discover="true"
          >
            Offers
          </a>
        </div>
      </div>
      <div className="px-8 pb-8 mt-20">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-[#020839]">Applications</h1>
          <span className="text-gray-500 text-sm">
            Total: {applications.length}
          </span>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="p-4 text-left text-sm font-semibold text-gray-600">
                  Candidate
                </th>
                <th className="p-4 text-left text-sm font-semibold text-gray-600">
                  Job ID
                </th>
                <th className="p-4 text-left text-sm font-semibold text-gray-600">
                  Status
                </th>
                <th className="p-4 text-left text-sm font-semibold text-gray-600">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {applications.map((app) => (
                <tr
                  key={app.id}
                  className="border-b hover:bg-gray-50 transition"
                >
                  <td className="p-4">
                    <div className="font-medium text-[#020839]">{app.name}</div>
                    <div className="text-xs text-gray-500">{app.email}</div>
                  </td>
                  <td className="p-4 text-gray-600">#{app.job_id}</td>
                  <td className="p-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusBadge(
                        app.status
                      )}`}
                    >
                      {app.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <select
                      value={app.status}
                      onChange={(e) => updateStatus(app.id, e.target.value)}
                      className="border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:border-[#020839]"
                    >
                      <option value="APPLIED">Applied</option>
                      <option value="INTERVIEW">Interview</option>
                      <option value="SELECTED">Selected</option>
                      <option value="REJECTED">Rejected</option>
                    </select>
                  </td>
                </tr>
              ))}
              {applications.length === 0 && (
                <tr>
                  <td colSpan="4" className="p-4 text-center text-gray-400">
                    No applications found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
