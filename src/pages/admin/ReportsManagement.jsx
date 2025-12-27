import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/common/Button';

const ReportsManagement = () => {
  const navigate = useNavigate();

  // Mock reports data
  const [reports, setReports] = useState([
    { 
      id: 1, 
      type: 'listing', 
      targetName: 'Gaming Mouse', 
      targetId: 3,
      reporter: 'User123', 
      reason: 'Misleading information', 
      description: 'Price seems too good to be true',
      status: 'pending', 
      created: '2024-12-21T10:30:00' 
    },
    { 
      id: 2, 
      type: 'listing', 
      targetName: 'Suspicious Item', 
      targetId: 5,
      reporter: 'User456', 
      reason: 'Scam or fraud', 
      description: 'Seller not responding, seems fake',
      status: 'pending', 
      created: '2024-12-21T09:15:00' 
    },
    { 
      id: 3, 
      type: 'user', 
      targetName: 'Spammer Account', 
      targetId: 8,
      reporter: 'User789', 
      reason: 'Spam', 
      description: 'Sending unsolicited messages',
      status: 'pending', 
      created: '2024-12-20T16:45:00' 
    },
    { 
      id: 4, 
      type: 'listing', 
      targetName: 'Old Laptop', 
      targetId: 12,
      reporter: 'User321', 
      reason: 'Already sold', 
      description: 'Item sold but listing still active',
      status: 'resolved', 
      created: '2024-12-19T14:20:00',
      resolvedAt: '2024-12-20T09:00:00'
    },
    { 
      id: 5, 
      type: 'listing', 
      targetName: 'Broken Phone', 
      targetId: 15,
      reporter: 'User654', 
      reason: 'Misleading information', 
      description: 'Listed as "like new" but actually broken',
      status: 'resolved', 
      created: '2024-12-18T11:30:00',
      resolvedAt: '2024-12-19T10:15:00'
    }
  ]);

  const [filterStatus, setFilterStatus] = useState('pending');
  const [selectedReport, setSelectedReport] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [actionType, setActionType] = useState('');

  // Filter reports
  const filteredReports = reports.filter(report => 
    filterStatus === 'all' || report.status === filterStatus
  );

  const handleViewDetail = (report) => {
    setSelectedReport(report);
    setShowDetailModal(true);
  };

  const handleAction = (action) => {
    setActionType(action);
    setShowConfirmDialog(true);
  };

  const confirmAction = () => {
    if (actionType === 'resolve') {
      setReports(reports.map(r => 
        r.id === selectedReport.id 
          ? { ...r, status: 'resolved', resolvedAt: new Date().toISOString() } 
          : r
      ));
    } else if (actionType === 'remove-target') {
      setReports(reports.map(r => 
        r.id === selectedReport.id 
          ? { ...r, status: 'resolved', resolvedAt: new Date().toISOString() } 
          : r
      ));
      // In real app, also remove the reported listing/user
    }
    
    setShowConfirmDialog(false);
    setShowDetailModal(false);
    setSelectedReport(null);
  };

  const StatusBadge = ({ status }) => {
    const styles = {
      pending: 'bg-text-muted bg-opacity-10 text-text-muted',
      resolved: 'bg-success bg-opacity-10 text-success'
    };

    return (
      <span className={`px-2 py-1 rounded text-xs font-medium ${styles[status]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const getTimeAgo = (timestamp) => {
    const now = new Date();
    const past = new Date(timestamp);
    const diffMs = now - past;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins} mins ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    return `${diffDays} days ago`;
  };

  return (
    <div className="min-h-screen bg-off-white">
      <div className="container-custom py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-heading text-3xl font-medium text-text-primary mb-2">
            Reports Management
          </h1>
          <p className="text-text-secondary">
            Review and resolve user reports
          </p>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-lg shadow-card p-6 mb-6">
          <div className="flex items-center justify-between">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="input-field md:w-48"
            >
              <option value="all">All Reports</option>
              <option value="pending">Pending</option>
              <option value="resolved">Resolved</option>
            </select>

            <span className="text-sm text-text-secondary">
              {filteredReports.length} {filteredReports.length === 1 ? 'report' : 'reports'}
            </span>
          </div>

          {reports.filter(r => r.status === 'pending').length > 0 && (
            <div className="mt-4 p-3 bg-error bg-opacity-10 rounded-lg">
              <p className="text-sm text-error">
                ⚠️ {reports.filter(r => r.status === 'pending').length} pending {reports.filter(r => r.status === 'pending').length === 1 ? 'report' : 'reports'} require attention
              </p>
            </div>
          )}
        </div>

        {/* Reports Table */}
        <div className="bg-white rounded-lg shadow-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-off-white">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                    Target
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                    Reason
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                    Reporter
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-text-secondary uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-soft">
                {filteredReports.map(report => (
                  <tr 
                    key={report.id} 
                    className={`hover:bg-off-white transition-colors duration-card ${
                      report.status === 'pending' ? 'bg-error bg-opacity-5' : ''
                    }`}
                  >
                    <td className="px-6 py-4">
                      <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                        report.type === 'listing' 
                          ? 'bg-sage bg-opacity-10 text-sage' 
                          : 'bg-green-dark bg-opacity-10 text-green-dark'
                      }`}>
                        {report.type.charAt(0).toUpperCase() + report.type.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-medium text-text-primary">{report.targetName}</p>
                    </td>
                    <td className="px-6 py-4 text-text-secondary">
                      {report.reason}
                    </td>
                    <td className="px-6 py-4 text-text-secondary">
                      {report.reporter}
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={report.status} />
                    </td>
                    <td className="px-6 py-4 text-text-secondary text-sm">
                      {getTimeAgo(report.created)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleViewDetail(report)}
                        className="text-sm text-sage hover:underline"
                      >
                        Review
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredReports.length === 0 && (
            <div className="text-center py-12">
              <p className="text-text-secondary">No reports found</p>
            </div>
          )}
        </div>
      </div>

      {/* Detail Modal */}
      {showDetailModal && selectedReport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h3 className="font-heading text-xl font-medium text-text-primary mb-4">
              Report Details
            </h3>

            <div className="space-y-4 mb-6">
              <div>
                <label className="text-sm font-medium text-text-secondary">Type</label>
                <p className="text-text-primary">{selectedReport.type.charAt(0).toUpperCase() + selectedReport.type.slice(1)}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-text-secondary">Target</label>
                <p className="text-text-primary font-medium">{selectedReport.targetName}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-text-secondary">Reported by</label>
                <p className="text-text-primary">{selectedReport.reporter}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-text-secondary">Reason</label>
                <p className="text-text-primary">{selectedReport.reason}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-text-secondary">Description</label>
                <p className="text-text-primary">{selectedReport.description}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-text-secondary">Reported</label>
                <p className="text-text-primary">{new Date(selectedReport.created).toLocaleString()}</p>
              </div>

              {selectedReport.status === 'resolved' && (
                <div>
                  <label className="text-sm font-medium text-text-secondary">Resolved</label>
                  <p className="text-text-primary">{new Date(selectedReport.resolvedAt).toLocaleString()}</p>
                </div>
              )}
            </div>

            {selectedReport.status === 'pending' ? (
              <div className="flex gap-3">
                <Button 
                  variant="secondary" 
                  onClick={() => setShowDetailModal(false)} 
                  className="flex-1"
                >
                  Close
                </Button>
                <Button 
                  variant="secondary"
                  onClick={() => navigate(`/${selectedReport.type}/${selectedReport.targetId}`)} 
                  className="flex-1"
                >
                  View Target
                </Button>
                <Button 
                  onClick={() => handleAction('resolve')} 
                  className="flex-1"
                >
                  Resolve
                </Button>
                <button
                  onClick={() => handleAction('remove-target')}
                  className="flex-1 px-6 py-3 bg-error text-white rounded-xl font-medium hover:bg-opacity-90 transition-colors duration-card"
                >
                  Remove Target
                </button>
              </div>
            ) : (
              <Button 
                variant="secondary" 
                onClick={() => setShowDetailModal(false)} 
                className="w-full"
              >
                Close
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Confirmation Dialog */}
      {showConfirmDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="font-heading text-xl font-medium text-text-primary mb-4">
              Confirm Action
            </h3>
            <p className="text-text-secondary mb-6">
              {actionType === 'resolve' ? (
                <>Mark this report as resolved without taking action?</>
              ) : (
                <>
                  Remove <strong>"{selectedReport?.targetName}"</strong> and resolve this report?
                  <br />
                  This action cannot be undone.
                </>
              )}
            </p>
            <div className="flex gap-3">
              <Button 
                variant="secondary" 
                onClick={() => setShowConfirmDialog(false)} 
                className="flex-1"
              >
                Cancel
              </Button>
              <Button 
                onClick={confirmAction} 
                className="flex-1"
              >
                Confirm
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportsManagement;