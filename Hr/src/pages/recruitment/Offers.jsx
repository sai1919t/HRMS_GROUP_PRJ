import { useEffect, useState } from "react";
import axios from "axios";
export default function Offers() {
  const [candidates, setCandidates] = useState([]);
  const [offers, setOffers] = useState([]);
  const [form, setForm] = useState({
    application_id: "",
    position: "",
    ctc: "",
    joining_date: ""
  });
  

  const fetchData = async () => {
    try {
        const appRes = await axios.get("http://localhost:3000/api/applications");
        // Only show candidates who are SELECTED
        setCandidates(appRes.data.filter(a => a.status === "SELECTED"));
        
        const offerRes = await axios.get("http://localhost:3000/api/offers");
        setOffers(offerRes.data);
    } catch(e) { console.log("API Error") }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const createOffer = async (e) => {
    e.preventDefault();
    await axios.post("http://localhost:3000/api/offers", {
        ...form,
        status: "Pending" 
    });
    setForm({ application_id: "", position: "", ctc: "", joining_date: "" });
    fetchData();
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
    <div className="px-8 mt-10 pb-8">
      <h1 className="text-2xl font-bold mb-6 text-[#020839]">Offer Management</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Create Offer */}
        <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h2 className="font-semibold text-lg mb-4 text-gray-800">Generate Offer</h2>
                <form onSubmit={createOffer} className="space-y-4">
                    <div>
                        <label className="block text-sm text-gray-600 mb-1">Select Candidate</label>
                        <select 
                            className="w-full border p-2 rounded focus:border-[#020839] outline-none"
                            value={form.application_id}
                            onChange={e => setForm({...form, application_id: e.target.value})}
                            required
                        >
                            <option value="">-- Only Selected Candidates --</option>
                            {candidates.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm text-gray-600 mb-1">Position / Title</label>
                        <input className="w-full border p-2 rounded focus:border-[#020839] outline-none" 
                            value={form.position} onChange={e => setForm({...form, position: e.target.value})} required />
                    </div>
                    <div>
                        <label className="block text-sm text-gray-600 mb-1">Annual CTC</label>
                        <input className="w-full border p-2 rounded focus:border-[#020839] outline-none" 
                            placeholder="e.g. 12 LPA"
                            value={form.ctc} onChange={e => setForm({...form, ctc: e.target.value})} required />
                    </div>
                    <div>
                        <label className="block text-sm text-gray-600 mb-1">Joining Date</label>
                        <input type="date" className="w-full border p-2 rounded focus:border-[#020839] outline-none" 
                            value={form.joining_date} onChange={e => setForm({...form, joining_date: e.target.value})} required />
                    </div>
                    <button className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded shadow-sm transition">Generate & Send Offer</button>
                </form>
            </div>
        </div>

        {/* Offer List */}
        <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b">
                        <tr>
                            <th className="p-3 text-left">Candidate ID</th>
                            <th className="p-3 text-left">Position</th>
                            <th className="p-3 text-left">CTC</th>
                            <th className="p-3 text-left">Joining</th>
                            <th className="p-3 text-left">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {offers.map((offer, i) => (
                            <tr key={i} className="border-b">
                                <td className="p-3 font-medium">#{offer.application_id}</td>
                                <td className="p-3">{offer.position}</td>
                                <td className="p-3">{offer.ctc}</td>
                                <td className="p-3">{offer.joining_date}</td>
                                <td className="p-3"><span className="text-yellow-600 bg-yellow-100 px-2 py-1 rounded text-xs font-bold">Pending</span></td>
                            </tr>
                        ))}
                         {offers.length === 0 && (
                            <tr><td colSpan="5" className="p-4 text-center text-gray-400">No offers released yet</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
      </div>
    </div>
   </div>
  )
}