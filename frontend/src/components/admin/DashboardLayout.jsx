import { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  LogOut, 
  Menu, 
  X,
  Shield,
  Home
} from 'lucide-react';
// import Button from '../ui/Button';

const DashboardLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Check if mobile and show fallback
  useEffect(() => {
    if (window.innerWidth < 768) {
      navigate('/admin/login');
    }
  }, [navigate]);

  const menuItems = [
    { icon: LayoutDashboard, label: 'Overview', path: '/admin/dashboard' },
    { icon: Users, label: 'Leads', path: '/admin/leads' },
    { icon: FileText, label: 'Generate Quote', path: '/admin/quotes' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-full bg-gradient-to-b from-white to-primary-200 text-white transition-all duration-300 ease-in-out z-50 shadow-2xl ${
          isSidebarOpen ? 'w-[20%] min-w-[250px]' : 'w-[5%] min-w-[80px]'
        }`}
      >
        {/* Logo & Toggle */}
        <div className={`flex items-center ${isSidebarOpen ? 'justify-between px-6' : 'justify-center px-4'} py-6 relative`}>
          {isSidebarOpen && (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center shadow-lg">
                <Shield className="w-6 h-6 text-gray-900" />
              </div>
              <div>
                <span className="text-xl font-bold block text-gray-900">SPORTS</span>
                <span className="text-xs text-gray-700">Admin Panel</span>
              </div>
            </div>
          )}
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className={`p-2 hover:bg-white/10 rounded-lg transition-all duration-200 ${
              !isSidebarOpen && 'mx-auto'
            }`}
            title={isSidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
          >
            {isSidebarOpen ? <X className="w-5 h-5 text-gray-900" /> : <Menu className="w-5 h-5 text-gray-900" />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-4 flex-1 overflow-y-auto">
          <ul className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <li key={item.path}>
                  <button
                    onClick={() => navigate(item.path)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group relative ${
                      active
                        ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/30'
                        : 'text-gray-800 hover:bg-white/10 hover:shadow-md'
                    } ${!isSidebarOpen && 'justify-center px-2'}`}
                    title={!isSidebarOpen ? item.label : ''}
                  >
                    <Icon className={`w-5 h-5 flex-shrink-0 ${active ? 'text-white' : 'text-gray-800'}`} />
                    {isSidebarOpen && <span className="font-medium text-sm">{item.label}</span>}
                    {!isSidebarOpen && (
                      <div className="absolute left-full ml-4 px-3 py-2 bg-dark-navy text-gray-900 text-sm rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap shadow-xl border border-gray-700 z-[60]">
                        {item.label}
                        <div className="absolute right-full top-1/2 -translate-y-1/2 w-0 h-0 border-[6px] border-transparent border-r-dark-navy"></div>
                      </div>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-gray-700/50 space-y-2">
          <button
            onClick={() => navigate('/')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-800 hover:bg-white/10 hover:shadow-md transition-all duration-200 group relative ${
              !isSidebarOpen && 'justify-center px-2'
            }`}
            title={!isSidebarOpen ? 'Home' : ''}
          >
            <Home className="w-5 h-5 flex-shrink-0" />
            {isSidebarOpen && <span className="font-medium text-sm">Home</span>}
            {!isSidebarOpen && (
              <div className="absolute left-full ml-4 px-3 py-2 bg-gray-100 text-gray-900 text-sm rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap shadow-xl border border-gray-700 z-[60]">
                Home
                <div className="absolute right-full top-1/2 -translate-y-1/2 w-0 h-0 border-[6px] border-transparent border-r-dark-navy"></div>
              </div>
            )}
          </button>
          <button
            onClick={handleLogout}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-900/30 hover:text-red-700 hover:shadow-md transition-all duration-200 group relative ${
              !isSidebarOpen && 'justify-center px-2'
            }`}
            title={!isSidebarOpen ? 'Logout' : ''}
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            {isSidebarOpen && <span className="font-medium text-sm">Logout</span>}
            {!isSidebarOpen && (
              <div className="absolute left-full ml-4 px-3 py-2 bg-gray-100 text-primary-600 text-sm rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap shadow-xl border border-red-900 z-[60]">
                Logout
                <div className="absolute right-full top-1/2 -translate-y-1/2 w-0 h-0 border-[6px] border-transparent border-r-dark-navy"></div>
              </div>
            )}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main
        className={`flex-1 transition-all duration-300 ease-in-out ${
          isSidebarOpen ? 'ml-[20%] w-[80%]' : 'ml-[5%] w-[95%]'
        }`}
      >
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40 backdrop-blur-sm bg-white/95">
          <div className="px-6 lg:px-8 py-4 flex items-center justify-between">
            <div className="flex-1">
              <h1 className="text-xl lg:text-2xl font-bold text-dark-navy">
                Sports Travel Admin
              </h1>
              <p className="text-xs lg:text-sm text-gray-600 mt-1">
                Manage your leads, events, and quotes
              </p>
            </div>
            <div className="flex items-center gap-3 lg:gap-4">
              <div className="text-right hidden sm:block">
                <p className="text-xs lg:text-sm font-medium text-dark-navy">Admin User</p>
                <p className="text-xs text-gray-500">Administrator</p>
              </div>
              <div className="w-9 h-9 lg:w-10 lg:h-10 bg-primary-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                A
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-4 lg:p-8 xl:p-8 max-w-full overflow-x-hidden">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
