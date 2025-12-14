import { useEffect, useState } from "react";
import axios from "axios";

export default function Interviews() {
  const [applications, setApplications] = useState([]);
  const [interviews, setInterviews] = useState([]);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    application_id: "",
    interview_date: "",
    interview_time: "",
    interviewer: "",
    mode: "Online",
  });

  // Fetch applications & interviews
  const fetchData = async () => {
    try {
      const appRes = await axios.get("http://localhost:3000/api/applications");
      setApplications(
        appRes.data.filter((a) =>
          ["APPLIED", "INTERVIEW"].includes(a.status)
        )
      );

      const intRes = await axios.get("http://localhost:3000/api/interviews");
      setInterviews(intRes.data);
    } catch (e) {
      console.log("API Error", e);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Schedule interview
  const scheduleInterview = async (e) => {
    e.preventDefault();

    // ❌ Block temporary candidates
    if (isNaN(Number(form.application_id))) {
      setError("Temporary candidate selected. Please select a real candidate.");
      return;
    }

    setError("");

    try {
      await axios.post("http://localhost:3000/api/interviews", {
        ...form,
        application_id: Number(form.application_id),
      });

      alert("Interview Scheduled Successfully");

      setForm({
        application_id: "",
        interview_date: "",
        interview_time: "",
        interviewer: "",
        mode: "Online",
      });

      fetchData();
    } catch (err) {
      console.error(err.response?.data || err.message);
      alert("Interview scheduling failed");
    }
  };

  return (
    <div>
      <div className="px-8 pt-6">
        <h1 className="text-2xl font-bold text-[#020839] mb-4">Recruitment</h1>
        <div className="flex gap-8">
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

      {/* CONTENT */}
      <div className="px-8 mt-10 pb-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* LEFT: FORM */}
        <div className="lg:col-span-1">
          <h2 className="text-xl font-bold mb-6 text-[#020839]">
            Schedule Interview
          </h2>

          <form
            onSubmit={scheduleInterview}
            className="bg-white p-6 rounded-lg shadow-sm border"
          >
            <div className="space-y-4">
              {/* Candidate */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Candidate
                </label>
                <select
                  value={form.application_id}
                  onChange={(e) =>
                    setForm({ ...form, application_id: e.target.value })
                  }
                  className="w-full border p-2 rounded"
                  required
                >
                  <option value="" >
                    -- Select Candidate --
                  </option>

                  {/* Real DB candidates */}
                  {applications.map((app) => (
                    <option key={app.id} value={app.id}>
                      {app.name}
                    </option>
                  ))}
                </select>

                {error && (
                  <p className="text-red-500 text-sm mt-1">{error}</p>
                )}
              </div>

              {/* Date & Time */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-sm font-medium mb-1">Date</label>
                  <input
                    type="date"
                    value={form.interview_date}
                    onChange={(e) =>
                      setForm({ ...form, interview_date: e.target.value })
                    }
                    className="w-full border p-2 rounded"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Time</label>
                  <input
                    type="time"
                    value={form.interview_time}
                    onChange={(e) =>
                      setForm({ ...form, interview_time: e.target.value })
                    }
                    className="w-full border p-2 rounded"
                    required
                  />
                </div>
              </div>

              {/* Interviewer */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Interviewer
                </label>
                <input
                  value={form.interviewer}
                  onChange={(e) =>
                    setForm({ ...form, interviewer: e.target.value })
                  }
                  placeholder="John Doe"
                  className="w-full border p-2 rounded"
                  required
                />
              </div>

              {/* Mode */}
              <div>
                <label className="block text-sm font-medium mb-1">Mode</label>
                <select
                  value={form.mode}
                  onChange={(e) =>
                    setForm({ ...form, mode: e.target.value })
                  }
                  className="w-full border p-2 rounded"
                >
                  <option>Online</option>
                  <option>Offline</option>
                </select>
              </div>

              <button className="w-full bg-[#020839] text-white py-2 rounded hover:bg-[#1a2363] transition">
                Schedule Interview
              </button>
            </div>
          </form>
        </div>

        {/* RIGHT: INTERVIEW LIST */}
        <div className="lg:col-span-2">
          <h2 className="text-xl font-bold mb-6 text-[#020839]">
            Upcoming Interviews
          </h2>

          <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
            {interviews.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                No interviews scheduled yet
              </div>
            ) : (
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="p-3 text-left">Candidate</th>
                    <th className="p-3 text-left">Date</th>
                    <th className="p-3 text-left">Time</th>
                    <th className="p-3 text-left">Interviewer</th>
                    <th className="p-3 text-left">Mode</th>
                  </tr>
                </thead>
                <tbody>
                  {interviews.map((intv, i) => (
                    <tr key={i} className="border-b hover:bg-gray-50">
                      <td className="p-3 font-medium">
                        {intv.candidate_name ||
                          `Candidate #${intv.application_id}`}
                      </td>
                      <td className="p-3">{intv.interview_date}</td>
                      <td className="p-3">{intv.interview_time}</td>
                      <td className="p-3">{intv.interviewer}</td>
                      <td className="p-3">
                        <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs">
                          {intv.mode}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
