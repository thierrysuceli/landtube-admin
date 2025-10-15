import { useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import {
  Youtube,
  LayoutDashboard,
  Users,
  Video,
  Settings,
  LogOut,
  Menu,
  X,
} from 'lucide-react';
import DashboardOverview from '@/components/DashboardOverview';
import UsersManagement from '@/components/UsersManagement';
import VideosManagement from '@/components/VideosManagement';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentView, setCurrentView] = useState('dashboard');

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast.success('Logout realizado com sucesso!');
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Erro ao fazer logout');
    }
  };

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '' },
    { id: 'users', label: 'Usuários', icon: Users, path: 'users' },
    { id: 'videos', label: 'Vídeos', icon: Video, path: 'videos' },
    { id: 'settings', label: 'Configurações', icon: Settings, path: 'settings' },
  ];

  return (
    <div className="flex min-h-screen bg-[#0a0a0a]">
      {/* Sidebar Overlay Mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 transform ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 transition-transform duration-300 ease-in-out w-64 bg-[#181818] p-4 flex flex-col justify-between z-40`}
      >
        <div>
          {/* Logo */}
          <div className="text-center mb-10">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Youtube className="w-8 h-8 text-[#E50914]" />
              <h1 className="text-2xl font-bold text-white">LandTube</h1>
            </div>
            <p className="text-xs text-gray-500">Admin Panel</p>
          </div>

          {/* Navigation */}
          <nav className="space-y-2">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setCurrentView(item.id);
                  setSidebarOpen(false);
                  navigate(`/dashboard/${item.path}`);
                }}
                className={`sidebar-link w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${
                  currentView === item.id
                    ? 'bg-[#E50914] text-white'
                    : 'text-gray-300 hover:bg-[#2D2D2D]'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="sidebar-link w-full flex items-center gap-3 p-3 rounded-lg text-red-500 hover:bg-red-900 hover:text-white transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span>Sair</span>
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8">
        {/* Header Mobile */}
        <header className="lg:hidden flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <Youtube className="w-6 h-6 text-[#E50914]" />
            <h1 className="text-xl font-bold text-white">LandTube Admin</h1>
          </div>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-white text-2xl"
          >
            {sidebarOpen ? <X /> : <Menu />}
          </button>
        </header>

        {/* Routes */}
        <Routes>
          <Route path="/" element={<DashboardOverview />} />
          <Route path="/users" element={<UsersManagement />} />
          <Route path="/videos" element={<VideosManagement />} />
          <Route
            path="/settings"
            element={
              <div className="text-center py-20">
                <Settings className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-white">Configurações</h2>
                <p className="text-gray-400 mt-2">Em breve...</p>
              </div>
            }
          />
        </Routes>
      </main>
    </div>
  );
};

export default AdminDashboard;
