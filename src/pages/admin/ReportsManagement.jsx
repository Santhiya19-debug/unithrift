import React, { useEffect, useState } from 'react';

const ReportsManagement = () => {
  const [reports, setReports] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null); // State for the modal
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/contact');
        const data = await res.json();
        if (data.success) {
          // Filter only the items where isReport is true
          setReports(data.messages.filter(msg => msg.isReport));
        }
      } catch (err) {
        console.error("Error fetching reports:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  const closeModal = () => setSelectedReport(null);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-heading font-bold text-sage mb-6">Security & User Reports</h1>
      
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-[#F7F9F7] text-[10px] uppercase tracking-widest text-gray-400">
            <tr>
              <th className="px-6 py-4">Reporter</th>
              <th className="px-6 py-4">Issue Subject</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Action</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {reports.map(report => (
              <tr key={report._id} className="border-t border-gray-50 hover:bg-sage/5 transition-colors">
                <td className="px-6 py-4">
                  <div className="font-medium text-text-primary">{report.name}</div>
                  <div className="text-[10px] text-gray-400">{report.email}</div>
                </td>
                <td className="px-6 py-4 text-gray-500">{report.subject}</td>
                <td className="px-6 py-4">
                  <span className="px-3 py-1 bg-red-100 text-red-600 rounded-full text-[10px] font-bold uppercase">
                    {report.status || 'new'}
                  </span>
                </td>
                <td className="px-6 py-4">
                  {/* REVIEW BUTTON NOW SETS STATE */}
                  <button 
                    onClick={() => setSelectedReport(report)}
                    className="text-sage font-bold hover:underline transition-all"
                  >
                    Review
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {reports.length === 0 && !loading && (
          <div className="p-20 text-center text-gray-400 italic">No security reports found.</div>
        )}
      </div>

      {/* REPORT REVIEW MODAL */}
      {selectedReport && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden animate-fadeIn">
            <div className="p-8">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-heading font-bold text-text-primary">Report Details</h2>
                  <p className="text-xs text-sage font-bold uppercase tracking-widest mt-1">Status: {selectedReport.status}</p>
                </div>
                <button onClick={closeModal} className="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">From</label>
                  <p className="text-sm font-medium">{selectedReport.name} ({selectedReport.email})</p>
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Subject</label>
                  <p className="text-sm font-medium">{selectedReport.subject}</p>
                </div>

                <div className="bg-[#F7F9F7] p-6 rounded-2xl border border-gray-100">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 block mb-2">Detailed Description</label>
                  <p className="text-sm text-text-secondary leading-relaxed italic">
                    "{selectedReport.message}"
                  </p>
                </div>
              </div>

              <div className="mt-8 flex gap-3">
                <button 
                  onClick={closeModal}
                  className="flex-1 bg-sage text-white font-bold py-3 rounded-full hover:bg-green-dark transition-all"
                >
                  Mark as Resolved
                </button>
                <button 
                  onClick={closeModal}
                  className="px-6 py-3 border border-gray-200 text-gray-400 rounded-full hover:bg-gray-50 transition-all font-bold text-sm"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportsManagement;