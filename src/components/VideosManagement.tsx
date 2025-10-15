import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Video } from '@/integrations/supabase/types';
import { toast } from 'sonner';
import { Search, Plus, Edit, Trash2 } from 'lucide-react';

interface VideoFormData {
  title: string;
  youtube_url: string;
  earning_amount: number;
  is_active: boolean;
}

const VideosManagement = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState<VideoFormData>({
    title: '',
    youtube_url: '',
    earning_amount: 5.0,
    is_active: true,
  });
  const rowsPerPage = 10;

  // Fetch videos
  const { data: videos, isLoading, refetch } = useQuery({
    queryKey: ['videos', currentPage, searchTerm],
    queryFn: async () => {
      let query = supabase
        .from('videos')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false });

      if (searchTerm) {
        query = query.or(`title.ilike.%${searchTerm}%,id.ilike.%${searchTerm}%`);
      }

      const { data, error, count } = await query
        .range((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage - 1);

      if (error) throw error;
      return { videos: data || [], total: count || 0 };
    },
  });

  const extractYouTubeId = (url: string): string | null => {
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/,
      /youtube\.com\/embed\/([^&\s]+)/,
    ];
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) return match[1];
    }
    return null;
  };

  const handleAddVideo = () => {
    setSelectedVideo(null);
    setFormData({
      title: '',
      youtube_url: '',
      earning_amount: 5.0,
      is_active: true,
    });
    setShowModal(true);
  };

  const handleEditVideo = (video: Video) => {
    setSelectedVideo(video);
    setFormData({
      title: video.title,
      youtube_url: video.youtube_url || '',
      earning_amount: video.earning_amount,
      is_active: video.is_active,
    });
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const youtubeId = extractYouTubeId(formData.youtube_url);
    if (!youtubeId) {
      toast.error('URL do YouTube inválida');
      return;
    }

    try {
      const videoData = {
        title: formData.title,
        youtube_url: `https://www.youtube.com/watch?v=${youtubeId}`,
        thumbnail_url: `https://i.ytimg.com/vi/${youtubeId}/mqdefault.jpg`,
        earning_amount: formData.earning_amount,
        is_active: formData.is_active,
      };

      if (selectedVideo) {
        // Update existing video
        const { error } = await supabase
          .from('videos')
          .update(videoData)
          .eq('id', selectedVideo.id);

        if (error) throw error;
        toast.success('Vídeo atualizado com sucesso!');
      } else {
        // Create new video
        const { error } = await supabase
          .from('videos')
          .insert([videoData]);

        if (error) throw error;
        toast.success('Vídeo adicionado com sucesso!');
      }

      setShowModal(false);
      refetch();
    } catch (error: any) {
      console.error('Error saving video:', error);
      toast.error(error.message || 'Erro ao salvar vídeo');
    }
  };

  const handleDeleteVideo = async (videoId: string) => {
    if (!confirm('Tem certeza que deseja remover este vídeo?')) return;

    try {
      const { error } = await supabase
        .from('videos')
        .delete()
        .eq('id', videoId);

      if (error) throw error;
      toast.success('Vídeo removido com sucesso!');
      refetch();
    } catch (error: any) {
      console.error('Error deleting video:', error);
      toast.error(error.message || 'Erro ao remover vídeo');
    }
  };

  const totalPages = Math.ceil((videos?.total || 0) / rowsPerPage);

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
        Gerenciamento de Vídeos
      </h2>

      {/* Filters */}
      <div className="card p-4 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="w-full sm:w-1/3 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
          <input
            type="text"
            placeholder="Buscar por título ou ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-[#121212] border border-[#2D2D2D] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#E50914]"
          />
        </div>
        <div className="flex items-center gap-4">
          <select className="bg-[#121212] border border-[#2D2D2D] rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#E50914]">
            <option>Filtrar por Status</option>
            <option>Ativo</option>
            <option>Inativo</option>
          </select>
          <button
            onClick={handleAddVideo}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Adicionar Vídeo
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="card overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-[#121212]">
            <tr>
              <th className="p-4">Thumbnail</th>
              <th className="p-4">Título do Vídeo</th>
              <th className="p-4">Ganho</th>
              <th className="p-4">Status</th>
              <th className="p-4">Data de Envio</th>
              <th className="p-4">Ações</th>
            </tr>
          </thead>
          <tbody>
            {videos?.videos.map((video) => (
              <tr
                key={video.id}
                className="border-b border-[#2D2D2D] hover:bg-[#1a1a1a] transition-colors"
              >
                <td className="p-2">
                  <img
                    src={video.thumbnail_url || '/placeholder.svg'}
                    alt={video.title}
                    className="w-24 rounded-md"
                    onError={(e) => {
                      e.currentTarget.src = '/placeholder.svg';
                    }}
                  />
                </td>
                <td className="p-4 font-semibold max-w-xs truncate">
                  {video.title}
                </td>
                <td className="p-4 text-green-400 font-semibold">
                  ${video.earning_amount.toFixed(2)}
                </td>
                <td className="p-4">
                  <span
                    className={`status-badge ${
                      video.is_active ? 'status-active' : 'status-inactive'
                    }`}
                  >
                    {video.is_active ? 'Ativo' : 'Inativo'}
                  </span>
                </td>
                <td className="p-4">
                  {new Date(video.created_at).toLocaleDateString('pt-BR')}
                </td>
                <td className="p-4">
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEditVideo(video)}
                      className="text-yellow-400 hover:text-yellow-300 transition-colors"
                      title="Editar"
                    >
                      <Edit className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDeleteVideo(video.id)}
                      className="text-red-500 hover:text-red-400 transition-colors"
                      title="Remover"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
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

      {/* Video Form Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="card w-full max-w-lg relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-white text-2xl"
            >
              &times;
            </button>
            <form onSubmit={handleSubmit} className="p-6">
              <h2 className="text-xl font-bold text-white mb-6">
                {selectedVideo ? 'Editar Vídeo' : 'Adicionar Novo Vídeo'}
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Título do Vídeo
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    required
                    className="w-full bg-[#121212] border border-[#2D2D2D] rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#E50914]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    URL do YouTube
                  </label>
                  <input
                    type="text"
                    value={formData.youtube_url}
                    onChange={(e) =>
                      setFormData({ ...formData, youtube_url: e.target.value })
                    }
                    required
                    placeholder="https://www.youtube.com/watch?v=..."
                    className="w-full bg-[#121212] border border-[#2D2D2D] rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#E50914]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Valor do Ganho ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.earning_amount}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        earning_amount: parseFloat(e.target.value),
                      })
                    }
                    required
                    className="w-full bg-[#121212] border border-[#2D2D2D] rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#E50914]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Status
                  </label>
                  <select
                    value={formData.is_active ? 'active' : 'inactive'}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        is_active: e.target.value === 'active',
                      })
                    }
                    className="w-full bg-[#121212] border border-[#2D2D2D] rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#E50914]"
                  >
                    <option value="active">Ativo</option>
                    <option value="inactive">Inativo</option>
                  </select>
                </div>
              </div>
              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-lg bg-[#2D2D2D] hover:bg-[#3D3D3D] font-semibold transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-[#E50914] hover:bg-[#b8070f] text-white font-semibold transition-colors"
                >
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideosManagement;
