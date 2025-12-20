import { useEffect, useState } from "react";
import axios from "axios";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import { Table, TableHeader, TableRow, TableHead, TableCell } from "../../components/ui/Table";
import Skeleton from "../../components/ui/Skeleton";
import EmptyState from "../../components/ui/EmptyState";

export default function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [form, setForm] = useState({
    title: "",
    location: "",
    experience: "",
    salary: "",
  });

  const [loading, setLoading] = useState(true);

  const fetchJobs = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/jobs");
      setJobs(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      const user = JSON.parse(userStr);
      setIsAdmin(user.role === 'Admin');
    }
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
    if (!isAdmin) return;
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

  if (!jobs) return null;

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-fadeIn">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Recruitment</h1>
      </div>

      {/* Create Job */}
      {isAdmin && (
        <Card>
          <h2 className="text-lg font-semibold mb-6 text-gray-900">Post a New Job</h2>
          <form onSubmit={submitJob}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Job Title</label>
                <input
                  placeholder="e.g. Senior Developer"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#020839] focus:border-transparent outline-none transition-all"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Location</label>
                <input
                  placeholder="e.g. Remote"
                  value={form.location}
                  onChange={(e) => setForm({ ...form, location: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#020839] focus:border-transparent outline-none transition-all"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Experience</label>
                <input
                  placeholder="e.g. 3-5 Years"
                  value={form.experience}
                  onChange={(e) => setForm({ ...form, experience: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#020839] focus:border-transparent outline-none transition-all"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Salary Range</label>
                <input
                  placeholder="e.g. $80k - $120k"
                  value={form.salary}
                  onChange={(e) => setForm({ ...form, salary: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#020839] focus:border-transparent outline-none transition-all"
                  required
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <Button type="submit">
                Create Job Posting
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Job List */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-900">Active Listings</h2>

        {loading ? (
          <Card className="p-0 overflow-hidden">
            <div className="p-4 border-b border-gray-200 bg-gray-50 flex justify-between">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-6 w-24" />
            </div>
            <div className="p-4 space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex justify-between items-center">
                  <div className="space-y-2">
                    <Skeleton className="h-5 w-48" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                  <Skeleton className="h-8 w-20" />
                </div>
              ))}
            </div>
          </Card>
        ) : jobs.length === 0 ? (
          <Card>
            <EmptyState
              title="No active job listings"
              description="Get started by creating a new job position above."
            />
          </Card>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Job Title</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Experience</TableHead>
                <TableHead>Salary</TableHead>
                {isAdmin && <TableHead className="text-right">Actions</TableHead>}
              </TableRow>
            </TableHeader>
            <tbody>
              {jobs.map((job) => (
                <TableRow key={job.id}>
                  <TableCell className="font-medium text-gray-900">{job.title}</TableCell>
                  <TableCell>{job.location}</TableCell>
                  <TableCell>{job.experience}</TableCell>
                  <TableCell>{job.salary}</TableCell>
                  {isAdmin && (
                    <TableCell className="text-right">
                      <button
                        onClick={() => deleteJob(job.id)}
                        className="text-red-500 hover:text-red-700 font-medium text-sm transition-colors"
                      >
                        Delete
                      </button>
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </tbody>
          </Table>
        )}
      </div>
    </div>
  );
}
