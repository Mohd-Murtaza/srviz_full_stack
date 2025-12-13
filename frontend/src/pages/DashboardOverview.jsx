import { useState, useEffect } from 'react';
import { Line, Doughnut, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { 
  Users, 
  FileText, 
  TrendingUp, 
  DollarSign,
  Calendar,
  Activity,
  ArrowUp,
  ArrowDown
} from 'lucide-react';
import { leadsAPI, quotesAPI, eventsAPI } from '../services/api';
import Card from '../components/ui/Card';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const DashboardOverview = () => {
  const [stats, setStats] = useState({
    totalLeads: 0,
    newLeads: 0,
    quotesGenerated: 0,
    activeEvents: 0,
  });
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [leadsResponse, eventsResponse] = await Promise.all([
        leadsAPI.getAll(),
        eventsAPI.getAll(),
      ]);

      if (leadsResponse.success) {
        const leadsData = leadsResponse.data;
        setLeads(leadsData);
        
        setStats({
          totalLeads: leadsData.length,
          newLeads: leadsData.filter(l => l.status === 'new').length,
          quotesGenerated: leadsData.filter(l => l.status === 'quote_sent').length,
          activeEvents: eventsResponse.data?.length || 0,
        });
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Calculate status distribution
  const statusCounts = leads.reduce((acc, lead) => {
    acc[lead.status] = (acc[lead.status] || 0) + 1;
    return acc;
  }, {});

  // Charts configuration
  const doughnutData = {
    labels: Object.keys(statusCounts),
    datasets: [
      {
        label: 'Leads by Status',
        data: Object.values(statusCounts),
        backgroundColor: [
          'rgba(220, 38, 38, 0.8)',
          'rgba(59, 130, 246, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(251, 191, 36, 0.8)',
          'rgba(139, 92, 246, 0.8)',
          'rgba(236, 72, 153, 0.8)',
        ],
        borderColor: [
          'rgba(220, 38, 38, 1)',
          'rgba(59, 130, 246, 1)',
          'rgba(16, 185, 129, 1)',
          'rgba(251, 191, 36, 1)',
          'rgba(139, 92, 246, 1)',
          'rgba(236, 72, 153, 1)',
        ],
        borderWidth: 2,
      },
    ],
  };

  const lineData = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    datasets: [
      {
        label: 'New Leads',
        data: [12, 19, 15, stats.newLeads],
        fill: true,
        backgroundColor: 'rgba(220, 38, 38, 0.1)',
        borderColor: 'rgba(220, 38, 38, 1)',
        tension: 0.4,
      },
    ],
  };

  const barData = {
    labels: ['Wimbledon', 'NBA Finals', 'F1 Japan'],
    datasets: [
      {
        label: 'Leads per Event',
        data: [
          leads.filter(l => l.event?.name?.includes('Wimbledon')).length,
          leads.filter(l => l.event?.name?.includes('NBA')).length,
          leads.filter(l => l.event?.name?.includes('F1')).length,
        ],
        backgroundColor: 'rgba(220, 38, 38, 0.8)',
        borderColor: 'rgba(220, 38, 38, 1)',
        borderWidth: 2,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
      },
    },
  };

  const statCards = [
    {
      icon: Users,
      label: 'Total Leads',
      value: stats.totalLeads,
      change: '+12%',
      isPositive: true,
      color: 'bg-blue-500',
    },
    {
      icon: Activity,
      label: 'New Leads',
      value: stats.newLeads,
      change: '+8%',
      isPositive: true,
      color: 'bg-green-500',
    },
    {
      icon: FileText,
      label: 'Quotes Generated',
      value: stats.quotesGenerated,
      change: '+15%',
      isPositive: true,
      color: 'bg-yellow-500',
    },
    {
      icon: Calendar,
      label: 'Active Events',
      value: stats.activeEvents,
      change: '0%',
      isPositive: true,
      color: 'bg-purple-500',
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-red"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-medium">{stat.label}</p>
                  <h3 className="text-3xl font-bold text-dark-navy mt-2">
                    {stat.value}
                  </h3>
                  <div className="flex items-center gap-1 mt-2">
                    {stat.isPositive ? (
                      <ArrowUp className="w-4 h-4 text-green-600" />
                    ) : (
                      <ArrowDown className="w-4 h-4 text-red-600" />
                    )}
                    <span
                      className={`text-sm font-medium ${
                        stat.isPositive ? 'text-green-600' : 'text-red-600'
                      }`}
                    >
                      {stat.change}
                    </span>
                    <span className="text-sm text-gray-500">vs last month</span>
                  </div>
                </div>
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Leads Trend */}
        <Card className="p-6">
          <h3 className="text-lg font-bold text-dark-navy mb-4">Leads Trend</h3>
          <div className="h-64">
            <Line data={lineData} options={chartOptions} />
          </div>
        </Card>

        {/* Status Distribution */}
        <Card className="p-6">
          <h3 className="text-lg font-bold text-dark-navy mb-4">Lead Status Distribution</h3>
          <div className="h-64">
            <Doughnut data={doughnutData} options={chartOptions} />
          </div>
        </Card>
      </div>

      {/* Leads by Event */}
      <Card className="p-6">
        <h3 className="text-lg font-bold text-dark-navy mb-4">Leads by Event</h3>
        <div className="h-64">
          <Bar data={barData} options={chartOptions} />
        </div>
      </Card>

      {/* Recent Leads */}
      <Card className="p-6">
        <h3 className="text-lg font-bold text-dark-navy mb-4">Recent Leads</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Name</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Email</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Event</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Status</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Date</th>
              </tr>
            </thead>
            <tbody>
              {leads.slice(0, 5).map((lead) => (
                <tr key={lead._id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 text-sm text-gray-900">{lead.name}</td>
                  <td className="py-3 px-4 text-sm text-gray-600">{lead.email}</td>
                  <td className="py-3 px-4 text-sm text-gray-600">{lead.event?.name || 'N/A'}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
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
                      {lead.status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600">
                    {new Date(lead.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default DashboardOverview;
