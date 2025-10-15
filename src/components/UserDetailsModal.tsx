import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Profile } from '@/integrations/supabase/types';
import { toast } from 'sonner';
import {
  X,
  User,
  DollarSign,
  Calendar,
  TrendingUp,
  Lock,
  Ban,
  CheckCircle,
  History,
  Video,
} from 'lucide-react';

interface UserDetailsModalProps {
  user: Profile;
  onClose: () => void;
  onUpdate: () => void;
}

interface Review {
  id: string;
  video_id: string;
  rating: number;
  earning_amount: number;
  completed_at: string;
  videos: {
    title: string;
    thumbnail_url: string | null;
  } | null;
}

interface VideoList {
  id: string;
  list_date: string;
  videos_watched: number;
  total_videos: number;
  completed: boolean;
  earnings_gained: number;
  created_at: string;
}

const UserDetailsModal = ({ user, onClose, onUpdate }: UserDetailsModalProps) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'history' | 'lists'>('overview');
  const [showPasswordReset, setShowPasswordReset] = useState(false);
  const [showBalanceAdjust, setShowBalanceAdjust] = useState(false);
  const [balanceAdjustment, setBalanceAdjustment] = useState('');
  const [adjustmentReason, setAdjustmentReason] = useState('');

  // Fetch user reviews history
  const { data: reviews, isLoading: reviewsLoading } = useQuery({
    queryKey: ['user-reviews', user.user_id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('reviews')
        .select(`
          id,
          video_id,
          rating,
          earning_amount,
          completed_at,
          videos!inner (
            title,
            thumbnail_url
          )
        `)
        .eq('user_id', user.user_id)
        .order('completed_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      return (data || []) as unknown as Review[];
    },
    enabled: activeTab === 'history',
  });

  // Fetch user video lists history
  const { data: videoLists, isLoading: listsLoading } = useQuery({
    queryKey: ['user-lists', user.user_id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('daily_video_lists')
        .select('*')
        .eq('user_id', user.user_id)
        .order('created_at', { ascending: false })
        .limit(30);

      if (error) throw error;
      return data as VideoList[];
    },
    enabled: activeTab === 'lists',
  });

  const handleResetPassword = async () => {
    if (!confirm('Tem certeza que deseja resetar a senha deste usuário?')) return;

    try {
      const { data, error } = await supabase.rpc('admin_reset_user_password', {
        target_user_id: user.user_id,
        new_password: 'temp123', // Temporary password
      });

      if (error) throw error;

      toast.success('Senha resetada! Usuário deve alterar no próximo login.');
      setShowPasswordReset(false);
      onUpdate();
    } catch (error: any) {
      console.error('Error resetting password:', error);
      toast.error(error.message || 'Erro ao resetar senha');
    }
  };

  const handleAdjustBalance = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const adjustment = parseFloat(balanceAdjustment);
    if (isNaN(adjustment) || adjustment === 0) {
      toast.error('Digite um valor válido');
      return;
    }

    if (!adjustmentReason.trim()) {
      toast.error('Digite um motivo para o ajuste');
      return;
    }

    try {
      const { data, error } = await supabase.rpc('admin_adjust_balance', {
        target_user_id: user.user_id,
        adjustment_amount: adjustment,
        adjustment_reason: adjustmentReason,
      });

      if (error) throw error;

      toast.success(`Saldo ajustado! Novo saldo: $${data.new_balance}`);
      setShowBalanceAdjust(false);
      setBalanceAdjustment('');
      setAdjustmentReason('');
      onUpdate();
    } catch (error: any) {
      console.error('Error adjusting balance:', error);
      toast.error(error.message || 'Erro ao ajustar saldo');
    }
  };

  const handleToggleBlock = async () => {
    const action = user.is_blocked ? 'desbloquear' : 'bloquear';
    if (!confirm(`Tem certeza que deseja ${action} este usuário?`)) return;

    try {
      const { error } = await supabase.rpc('admin_toggle_user_block', {
        target_user_id: user.user_id,
        block_status: !user.is_blocked,
      });

      if (error) throw error;

      toast.success(`Usuário ${action}ado com sucesso!`);
      onUpdate();
    } catch (error: any) {
      console.error('Error toggling block:', error);
      toast.error(error.message || `Erro ao ${action} usuário`);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="card w-full max-w-4xl my-8 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Header */}
        <div className="p-6 border-b border-[#2D2D2D]">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-r from-[#E50914] to-[#b8070f] flex items-center justify-center">
              <User className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-white">
                {user.display_name || 'Usuário'}
              </h2>
              <p className="text-gray-400 text-sm">{user.email}</p>
              <div className="flex gap-2 mt-2">
                {user.is_admin && (
                  <span className="px-2 py-1 bg-purple-500 text-white text-xs rounded-full font-semibold">
                    Admin
                  </span>
                )}
                {user.is_blocked && (
                  <span className="px-2 py-1 bg-red-500 text-white text-xs rounded-full font-semibold">
                    Bloqueado
                  </span>
                )}
                {!user.is_blocked && !user.is_admin && (
                  <span className="px-2 py-1 bg-green-500 text-white text-xs rounded-full font-semibold">
                    Ativo
                  </span>
                )}
              </div>
            </div>
            <div className="text-right">
              <p className="text-gray-400 text-sm">Saldo Atual</p>
              <p className="text-3xl font-bold text-green-400">
                ${user.balance.toFixed(2)}
              </p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-[#2D2D2D]">
          <div className="flex gap-4 px-6">
            <button
              onClick={() => setActiveTab('overview')}
              className={`py-3 px-4 font-semibold transition-colors relative ${
                activeTab === 'overview'
                  ? 'text-[#E50914]'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Visão Geral
              {activeTab === 'overview' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#E50914]" />
              )}
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`py-3 px-4 font-semibold transition-colors relative ${
                activeTab === 'history'
                  ? 'text-[#E50914]'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Histórico de Reviews
              {activeTab === 'history' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#E50914]" />
              )}
            </button>
            <button
              onClick={() => setActiveTab('lists')}
              className={`py-3 px-4 font-semibold transition-colors relative ${
                activeTab === 'lists'
                  ? 'text-[#E50914]'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Listas Completas
              {activeTab === 'lists' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#E50914]" />
              )}
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-[#121212] p-4 rounded-lg">
                  <DollarSign className="w-5 h-5 text-green-400 mb-2" />
                  <p className="text-gray-400 text-sm">Meta de Saque</p>
                  <p className="text-xl font-bold text-white">
                    ${user.withdrawal_goal.toFixed(2)}
                  </p>
                </div>
                <div className="bg-[#121212] p-4 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-blue-400 mb-2" />
                  <p className="text-gray-400 text-sm">Total Reviews</p>
                  <p className="text-xl font-bold text-white">
                    {user.total_reviews}
                  </p>
                </div>
                <div className="bg-[#121212] p-4 rounded-lg">
                  <Calendar className="w-5 h-5 text-yellow-400 mb-2" />
                  <p className="text-gray-400 text-sm">Dias em Sequência</p>
                  <p className="text-xl font-bold text-white">
                    {user.current_streak}
                  </p>
                </div>
                <div className="bg-[#121212] p-4 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-purple-400 mb-2" />
                  <p className="text-gray-400 text-sm">Reviews Hoje</p>
                  <p className="text-xl font-bold text-white">
                    {user.daily_reviews_completed}/1
                  </p>
                </div>
              </div>

              {/* Account Info */}
              <div className="bg-[#121212] p-4 rounded-lg">
                <h3 className="font-semibold text-white mb-3">Informações da Conta</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-400">ID do Usuário</p>
                    <p className="font-mono text-xs text-white break-all">{user.user_id}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Data de Cadastro</p>
                    <p className="text-white">
                      {new Date(user.created_at).toLocaleDateString('pt-BR', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                      })}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400">Último Review</p>
                    <p className="text-white">
                      {user.last_review_date
                        ? new Date(user.last_review_date).toLocaleDateString('pt-BR')
                        : 'Nunca'}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400">Última Atualização</p>
                    <p className="text-white">
                      {new Date(user.updated_at).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                </div>
              </div>

              {/* Admin Actions */}
              <div className="bg-[#121212] p-4 rounded-lg">
                <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
                  <Lock className="w-4 h-4" />
                  Ações Administrativas
                </h3>
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => setShowPasswordReset(true)}
                    className="bg-yellow-600 hover:bg-yellow-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors flex items-center gap-2"
                  >
                    <Lock className="w-4 h-4" />
                    Resetar Senha
                  </button>
                  <button
                    onClick={() => setShowBalanceAdjust(true)}
                    className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors flex items-center gap-2"
                  >
                    <DollarSign className="w-4 h-4" />
                    Ajustar Saldo
                  </button>
                  <button
                    onClick={handleToggleBlock}
                    className={`${
                      user.is_blocked
                        ? 'bg-green-600 hover:bg-green-700'
                        : 'bg-red-600 hover:bg-red-700'
                    } text-white font-semibold py-2 px-4 rounded-lg transition-colors flex items-center gap-2`}
                  >
                    {user.is_blocked ? (
                      <>
                        <CheckCircle className="w-4 h-4" />
                        Desbloquear
                      </>
                    ) : (
                      <>
                        <Ban className="w-4 h-4" />
                        Bloquear
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Password Reset Modal */}
              {showPasswordReset && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                  <div className="bg-[#1E1E1E] border border-[#2D2D2D] rounded-lg p-6 max-w-md w-full">
                    <h3 className="text-xl font-bold text-white mb-4">
                      Resetar Senha
                    </h3>
                    <p className="text-gray-400 mb-4">
                      O usuário será marcado para trocar a senha no próximo login.
                      Uma senha temporária será enviada por e-mail.
                    </p>
                    <div className="flex gap-3">
                      <button
                        onClick={() => setShowPasswordReset(false)}
                        className="flex-1 bg-[#2D2D2D] hover:bg-[#3D3D3D] text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                      >
                        Cancelar
                      </button>
                      <button
                        onClick={handleResetPassword}
                        className="flex-1 bg-yellow-600 hover:bg-yellow-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                      >
                        Confirmar
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Balance Adjust Modal */}
              {showBalanceAdjust && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                  <div className="bg-[#1E1E1E] border border-[#2D2D2D] rounded-lg p-6 max-w-md w-full">
                    <h3 className="text-xl font-bold text-white mb-4">
                      Ajustar Saldo
                    </h3>
                    <form onSubmit={handleAdjustBalance} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">
                          Valor do Ajuste ($)
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          value={balanceAdjustment}
                          onChange={(e) => setBalanceAdjustment(e.target.value)}
                          placeholder="Ex: 10.00 ou -5.00"
                          className="w-full bg-[#121212] border border-[#2D2D2D] rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                          required
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          Use valores negativos para subtrair
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">
                          Motivo do Ajuste
                        </label>
                        <textarea
                          value={adjustmentReason}
                          onChange={(e) => setAdjustmentReason(e.target.value)}
                          placeholder="Ex: Correção de erro, bônus especial..."
                          className="w-full bg-[#121212] border border-[#2D2D2D] rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
                          rows={3}
                          required
                        />
                      </div>
                      <div className="flex gap-3">
                        <button
                          type="button"
                          onClick={() => {
                            setShowBalanceAdjust(false);
                            setBalanceAdjustment('');
                            setAdjustmentReason('');
                          }}
                          className="flex-1 bg-[#2D2D2D] hover:bg-[#3D3D3D] text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                        >
                          Cancelar
                        </button>
                        <button
                          type="submit"
                          className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                        >
                          Aplicar Ajuste
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'history' && (
            <div className="space-y-4">
              {reviewsLoading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#E50914]"></div>
                </div>
              ) : reviews && reviews.length > 0 ? (
                reviews.map((review) => (
                  <div
                    key={review.id}
                    className="bg-[#121212] p-4 rounded-lg flex items-center gap-4 hover:bg-[#1a1a1a] transition-colors"
                  >
                    <img
                      src={review.videos?.thumbnail_url || '/placeholder.svg'}
                      alt={review.videos?.title || 'Vídeo'}
                      className="w-24 h-16 rounded object-cover"
                      onError={(e) => {
                        e.currentTarget.src = '/placeholder.svg';
                      }}
                    />
                    <div className="flex-1">
                      <h4 className="font-semibold text-white">
                        {review.videos?.title || 'Vídeo não disponível'}
                      </h4>
                      <div className="flex items-center gap-4 mt-1 text-sm">
                        <span className="text-yellow-400">
                          {'⭐'.repeat(review.rating)}
                        </span>
                        <span className="text-gray-400">
                          {new Date(review.completed_at).toLocaleDateString('pt-BR', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-green-400 font-bold">
                        +${review.earning_amount.toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12">
                  <History className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                  <p className="text-gray-400">Nenhum review encontrado</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'lists' && (
            <div className="space-y-4">
              {listsLoading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#E50914]"></div>
                </div>
              ) : videoLists && videoLists.length > 0 ? (
                videoLists.map((list) => (
                  <div
                    key={list.id}
                    className="bg-[#121212] p-4 rounded-lg hover:bg-[#1a1a1a] transition-colors"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <Video className="w-5 h-5 text-[#E50914]" />
                        <div>
                          <p className="font-semibold text-white">
                            Lista de {new Date(list.list_date).toLocaleDateString('pt-BR')}
                          </p>
                          <p className="text-sm text-gray-400">
                            {list.videos_watched}/{list.total_videos} vídeos assistidos
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        {list.completed ? (
                          <span className="px-3 py-1 bg-green-500 text-white text-xs rounded-full font-semibold">
                            Completa
                          </span>
                        ) : (
                          <span className="px-3 py-1 bg-yellow-500 text-white text-xs rounded-full font-semibold">
                            Pendente
                          </span>
                        )}
                        <p className="text-green-400 font-bold mt-1">
                          +${list.earnings_gained.toFixed(2)}
                        </p>
                      </div>
                    </div>
                    {/* Progress Bar */}
                    <div className="w-full bg-[#2D2D2D] rounded-full h-2 mt-3">
                      <div
                        className="bg-[#E50914] h-2 rounded-full transition-all"
                        style={{
                          width: `${(list.videos_watched / list.total_videos) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12">
                  <Video className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                  <p className="text-gray-400">Nenhuma lista encontrada</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#2D2D2D] flex justify-end">
          <button
            onClick={onClose}
            className="bg-[#2D2D2D] hover:bg-[#3D3D3D] text-white font-semibold py-2 px-6 rounded-lg transition-colors"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserDetailsModal;
