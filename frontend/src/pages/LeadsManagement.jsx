import { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Edit2, 
  Eye, 
  Trash2,
  Download,
  RefreshCw,
  ChevronDown
} from 'lucide-react';
import { leadsAPI } from '../services/api';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import toast from 'react-hot-toast';

const LeadsManagement = () => {
  const [leads, setLeads] = useState([]);
  const [filteredLeads, setFilteredLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedLead, setSelectedLead] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  const statuses = ['All', 'new', 'contacted', 'quote_sent', 'qualified', 'converted', 'lost'];
  
  // Status display mapping
  const statusLabels = {
    'new': 'New',
    'contacted': 'Contacted',
    'quote_sent': 'Quote Sent',
    'qualified': 'Qualified',
    'converted': 'Converted',
    'lost': 'Lost'
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  useEffect(() => {
    filterLeads();
  }, [leads, searchTerm, statusFilter]);

  const fetchLeads = async () => {
    try {
      setLoading(true);
      const response = await leadsAPI.getAll();
      if (response.success) {
        setLeads(response.data);
      }
    } catch (error) {
      toast.error('Failed to fetch leads');
      console.error('Error fetching leads:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterLeads = () => {
    let filtered = [...leads];

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (lead) =>
          lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          lead.phone.includes(searchTerm)
      );
    }

    // Filter by status
    if (statusFilter !== 'All') {
      filtered = filtered.filter((lead) => lead.status === statusFilter);
    }

    setFilteredLeads(filtered);
  };

  const handleStatusUpdate = async (leadId, newStatus) => {
    try {
      const response = await leadsAPI.updateStatus(leadId, { status: newStatus });
      if (response.success) {
        toast.success('Status updated successfully');
        fetchLeads();
        setIsModalOpen(false);
      }
    } catch (error) {
      toast.error('Failed to update status');
      console.error('Error updating status:', error);
    }
  };

  const handleViewLead = (lead) => {
    setSelectedLead(lead);
    setIsEditMode(false);
    setIsModalOpen(true);
  };

  const handleEditLead = (lead) => {
    setSelectedLead(lead);
    setIsEditMode(true);
    setIsModalOpen(true);
  };

  const exportToCSV = () => {
    const headers = ['Name', 'Email', 'Phone', 'Event', 'Status', 'Created At'];
    const rows = filteredLeads.map((lead) => [
      lead.name,
      lead.email,
      lead.phone,
      lead.event?.name || 'N/A',
      lead.status,
      new Date(lead.createdAt).toLocaleDateString(),
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map((row) => row.join(',')),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `leads-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success('Leads exported successfully');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-red"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-dark-navy">Leads Management</h2>
          <p className="text-gray-600 mt-1">Manage and track all your leads</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="ghost" onClick={fetchLeads}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button variant="primary" onClick={exportToCSV}>
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, email, or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-red focus:border-transparent"
            />
          </div>

          {/* Status Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-red focus:border-transparent appearance-none bg-white"
            >
              {statuses.map((status) => (
                <option key={status} value={status}>
                  {status === 'All' ? 'All Status' : statusLabels[status] || status}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
          </div>
        </div>

        {/* Stats */}
        <div className="mt-4 flex items-center gap-6 text-sm">
          <span className="text-gray-600">
            Total: <strong className="text-dark-navy">{leads.length}</strong>
          </span>
          <span className="text-gray-600">
            Filtered: <strong className="text-dark-navy">{filteredLeads.length}</strong>
          </span>
        </div>
      </Card>

      {/* Leads Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-3 px-6 text-sm font-semibold text-gray-700">Name</th>
                <th className="text-left py-3 px-6 text-sm font-semibold text-gray-700">Email</th>
                <th className="text-left py-3 px-6 text-sm font-semibold text-gray-700">Phone</th>
                <th className="text-left py-3 px-6 text-sm font-semibold text-gray-700">Event</th>
                <th className="text-left py-3 px-6 text-sm font-semibold text-gray-700">Status</th>
                <th className="text-left py-3 px-6 text-sm font-semibold text-gray-700">Date</th>
                <th className="text-left py-3 px-6 text-sm font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredLeads.map((lead) => (
                <tr key={lead._id} className="hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-6 text-sm font-medium text-gray-900">{lead.name}</td>
                  <td className="py-4 px-6 text-sm text-gray-600">{lead.email}</td>
                  <td className="py-4 px-6 text-sm text-gray-600">{lead.phone}</td>
                  <td className="py-4 px-6 text-sm text-gray-600">
                    {lead.event?.name || 'N/A'}
                  </td>
                  <td className="py-4 px-6">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                        lead.status === 'new'
                          ? 'bg-blue-100 text-blue-800'
                          : lead.status === 'contacted'
                          ? 'bg-yellow-100 text-yellow-800'
                          : lead.status === 'quote_sent'
                          ? 'bg-purple-100 text-purple-800'
                          : lead.status === 'qualified'
                          ? 'bg-orange-100 text-orange-800'
                          : lead.status === 'converted'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {statusLabels[lead.status] || lead.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-sm text-gray-600">
                    {new Date(lead.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleViewLead(lead)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleEditLead(lead)}
                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        title="Edit Status"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredLeads.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">No leads found</p>
            </div>
          )}
        </div>
      </Card>

      {/* View/Edit Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={isEditMode ? 'Edit Lead Status' : 'Lead Details'}>
        {selectedLead && (
          <div className="space-y-4">
            {!isEditMode ? (
              // View Mode
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <p className="text-gray-900">{selectedLead.name}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <p className="text-gray-900">{selectedLead.email}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <p className="text-gray-900">{selectedLead.phone}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Event</label>
                  <p className="text-gray-900">{selectedLead.event?.name || 'N/A'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                      selectedLead.status === 'New'
                        ? 'bg-blue-100 text-blue-800'
                        : selectedLead.status === 'Contacted'
                        ? 'bg-yellow-100 text-yellow-800'
                        : selectedLead.status === 'Quote Sent'
                        ? 'bg-purple-100 text-purple-800'
                        : selectedLead.status === 'Interested'
                        ? 'bg-green-100 text-green-800'
                        : selectedLead.status === 'Closed Won'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {selectedLead.status}
                  </span>
                </div>
                {selectedLead.message && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                    <p className="text-gray-900 whitespace-pre-wrap">{selectedLead.message}</p>
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Created At</label>
                  <p className="text-gray-900">{new Date(selectedLead.createdAt).toLocaleString()}</p>
                </div>
              </>
            ) : (
              // Edit Mode
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Update Status
                  </label>
                  <div className="space-y-2">
                    {statuses.filter(s => s !== 'All').map((status) => (
                      <button
                        key={status}
                        onClick={() => handleStatusUpdate(selectedLead._id, status)}
                        className={`w-full text-left px-4 py-3 rounded-lg border-2 transition-all ${
                          selectedLead.status === status
                            ? 'border-primary-red bg-red-50 text-primary-red font-medium'
                            : 'border-gray-200 hover:border-gray-300 text-gray-700'
                        }`}
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default LeadsManagement;
