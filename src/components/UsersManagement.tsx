import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Profile } from '@/integrations/supabase/types';
import { toast } from 'sonner';
import { Search, Plus, Eye, Edit, Ban, CheckCircle, Filter } from 'lucide-react';
import UserDetailsModal from '@/components/UserDetailsModal';

const UsersManagement = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'blocked' | 'admin'>('all');
  const [selectedUser, setSelectedUser] = useState<Profile | null>(null);
  const [showModal, setShowModal] = useState(false);
  const rowsPerPage = 10;

  // Fetch users
  const { data: users, isLoading, refetch } = useQuery({
    queryKey: ['users', currentPage, searchTerm, statusFilter],
    queryFn: async () => {
      let query = supabase
        .from('profiles')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false });

      if (searchTerm) {
        query = query.or(`email.ilike.%${searchTerm}%,user_id.ilike.%${searchTerm}%,display_name.ilike.%${searchTerm}%`);
      }

      // Apply status filter
      if (statusFilter === 'admin') {
        query = query.eq('is_admin', true);
      } else if (statusFilter === 'blocked') {
        query = query.eq('is_blocked', true);
      } else if (statusFilter === 'active') {
        query = query.eq('is_blocked', false).eq('is_admin', false);
      }

      const { data, error, count } = await query
        .range((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage - 1);

      if (error) throw error;
      return { users: data || [], total: count || 0 };
    },
  });

  const getStatusBadge = (user: Profile) => {
    if (user.is_admin) return { class: 'bg-purple-500 text-white', text: 'Admin' };
    if (user.is_blocked) return { class: 'bg-red-500 text-white', text: 'Bloqueado' };
    return { class: 'bg-green-500 text-white', text: 'Ativo' };
  };

  const handleViewDetails = (user: Profile) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  const handleBlockUser = async (userId: string, currentBlockStatus: boolean) => {
    const action = currentBlockStatus ? 'desbloquear' : 'bloquear';
    if (!confirm(`Tem certeza que deseja ${action} este usuário?`)) return;
    
    try {
      const { error } = await supabase.rpc('admin_toggle_user_block', {
        target_user_id: userId,
        block_status: !currentBlockStatus,
      });

      if (error) throw error;
      toast.success(`Usuário ${action}ado com sucesso!`);
      refetch();
    } catch (error: any) {
      console.error('Error toggling block:', error);
      toast.error(error.message || `Erro ao ${action} usuário`);
    }
  };

  const totalPages = Math.ceil((users?.total || 0) / rowsPerPage);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#E50914]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl sm:text-3xl font-bold text-white">
        Gerenciamento de Usuários
      </h2>

      {/* Filters */}
      <div className="card p-4 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="w-full sm:w-1/3 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
          <input
            type="text"
            placeholder="Buscar por e-mail ou ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-[#121212] border border-[#2D2D2D] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#E50914]"
          />
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="pl-9 bg-[#121212] border border-[#2D2D2D] rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#E50914]"
            >
              <option value="all">Todos</option>
              <option value="active">Ativos</option>
              <option value="admin">Admins</option>
              <option value="blocked">Bloqueados</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="card overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-[#121212]">
            <tr>
              <th className="p-4">Usuário</th>
              <th className="p-4">Email</th>
              <th className="p-4">Saldo</th>
              <th className="p-4">Reviews</th>
              <th className="p-4">Sequência</th>
              <th className="p-4">Status</th>
              <th className="p-4">Cadastro</th>
              <th className="p-4">Ações</th>
            </tr>
          </thead>
          <tbody>
            {users?.users.map((user) => {
              const status = getStatusBadge(user);
              return (
                <tr
                  key={user.user_id}
                  className="border-b border-[#2D2D2D] hover:bg-[#1a1a1a] transition-colors"
                >
                  <td className="p-4">
                    <div>
                      <p className="font-semibold text-white">
                        {user.display_name || 'Usuário'}
                      </p>
                      <p className="text-xs text-gray-500 font-mono">
                        {user.user_id.slice(0, 8)}...
                      </p>
                    </div>
                  </td>
                  <td className="p-4">{user.email || 'N/A'}</td>
                  <td className="p-4 text-green-400 font-semibold">
                    ${user.balance.toFixed(2)}
                  </td>
                  <td className="p-4 text-center">
                    <div className="text-white">{user.total_reviews}</div>
                    <div className="text-xs text-gray-400">
                      {user.daily_reviews_completed} hoje
                    </div>
                  </td>
                  <td className="p-4 text-center">
                    <span className="text-yellow-400 font-semibold">
                      {user.current_streak} 🔥
                    </span>
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${status.class}`}>
                      {status.text}
                    </span>
                  </td>
                  <td className="p-4 text-sm">
                    {new Date(user.created_at).toLocaleDateString('pt-BR', {
                      day: '2-digit',
                      month: '2-digit',
                      year: '2-digit',
                    })}
                  </td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleViewDetails(user)}
                        className="text-blue-400 hover:text-blue-300 transition-colors"
                        title="Ver Detalhes Completos"
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleBlockUser(user.user_id, user.is_blocked || false)}
                        className={`${
                          user.is_blocked
                            ? 'text-green-500 hover:text-green-400'
                            : 'text-red-500 hover:text-red-400'
                        } transition-colors`}
                        title={user.is_blocked ? 'Desbloquear' : 'Bloquear'}
                      >
                        {user.is_blocked ? <CheckCircle className="w-5 h-5" /> : <Ban className="w-5 h-5" />}
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`px-3 py-1 rounded-lg font-semibold transition-colors ${
                page === currentPage
                  ? 'bg-[#E50914] text-white'
                  : 'bg-[#2D2D2D] hover:bg-[#3D3D3D] text-gray-300'
              }`}
            >
              {page}
            </button>
          ))}
        </div>
      )}

      {/* User Details Modal */}
      {showModal && selectedUser && (
        <UserDetailsModal
          user={selectedUser}
          onClose={() => setShowModal(false)}
          onUpdate={refetch}
        />
      )}
    </div>
  );
};

export default UsersManagement;
