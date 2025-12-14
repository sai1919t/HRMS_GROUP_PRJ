import { useEffect, useState } from "react";
import axios from "axios";

export default function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [form, setForm] = useState({
    title: "",
    location: "",
    experience: "",
    salary: "",
  });

  const fetchJobs = async () => {
    const res = await axios.get("http://localhost:3000/api/jobs");
    setJobs(res.data);
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const submitJob = async (e) => {
    e.preventDefault();
    await axios.post("http://localhost:3000/api/jobs", form);
    setForm({ title: "", location: "", experience: "", salary: "" });
    fetchJobs();
  };

  // ✅ DELETE JOB
  const deleteJob = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this job?"
    );

    if (!confirmDelete) return;

    try {
      await axios.delete(`http://localhost:3000/api/jobs/${id}`);
      fetchJobs();
    } catch (err) {
      alert("Failed to delete job");
    }
  };

  return (
    <div className="ml-8 p-8">
      <h1 className="text-2xl font-bold mb-4">Recruitment - Jobs</h1>

      {/* Create Job */}
      <form onSubmit={submitJob} className="bg-white p-4 rounded shadow mb-6">
        <h2 className="font-semibold mb-3">Create Job</h2>
        <div className="grid grid-cols-2 gap-4">
          <input
            placeholder="Job Title"
            value={form.title}
            onChange={(e) =>
              setForm({ ...form, title: e.target.value })
            }
            className="border p-2 rounded"
            required
          />
          <input
            placeholder="Location"
            value={form.location}
            onChange={(e) =>
              setForm({ ...form, location: e.target.value })
            }
            className="border p-2 rounded"
            required
          />
          <input
            placeholder="Experience"
            value={form.experience}
            onChange={(e) =>
              setForm({ ...form, experience: e.target.value })
            }
            className="border p-2 rounded"
            required
          />
          <input
            placeholder="Salary"
            value={form.salary}
            onChange={(e) =>
              setForm({ ...form, salary: e.target.value })
            }
            className="border p-2 rounded"
            required
          />
        </div>
        <button className="mt-4 bg-[#020839] text-white px-4 py-2 rounded hover:bg-[#1a2363] transition">
          Create Job
        </button>
      </form>

      {/* Job List */}
      <table className="w-full bg-white rounded shadow">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-3 text-left">Title</th>
            <th className="p-3 text-left">Location</th>
            <th className="p-3 text-left">Experience</th>
            <th className="p-3 text-left">Salary</th>
            <th className="p-3 text-left">Action</th>
          </tr>
        </thead>
        <tbody>
          {jobs.length === 0 ? (
            <tr>
              <td colSpan="5" className="p-4 text-center text-gray-400">
                No jobs found
              </td>
            </tr>
          ) : (
            jobs.map((job) => (
              <tr key={job.id} className="border-t hover:bg-gray-50">
                <td className="p-3">{job.title}</td>
                <td className="p-3">{job.location}</td>
                <td className="p-3">{job.experience}</td>
                <td className="p-3">{job.salary}</td>
                <td className="p-3">
                  <button
                    onClick={() => deleteJob(job.id)}
                    className="text-red-600 hover:text-red-800 font-medium"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
