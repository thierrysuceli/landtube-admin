import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Users, Video, Star, TrendingUp, Calendar, DollarSign, Activity, Shield } from 'lucide-react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
  RadialBarChart,
  RadialBar,
} from 'recharts';

const DashboardOverview = () => {
  const [dateFilter, setDateFilter] = useState<'7d' | '30d' | '90d' | 'all'>('30d');

  // Fetch Real KPIs
  const { data: stats } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      const today = new Date().toISOString().split('T')[0];
      
      const [
        usersRes,
        videosRes,
        reviewsRes,
        todayReviewsRes,
        activeUsersRes,
        blockedUsersRes,
        adminUsersRes,
        activeVideosRes,
        listsRes,
        completedListsRes,
        totalBalanceRes,
      ] = await Promise.all([
        supabase.from('profiles').select('*', { count: 'exact', head: true }),
        supabase.from('videos').select('*', { count: 'exact', head: true }),
        supabase.from('reviews').select('*', { count: 'exact', head: true }),
        supabase.from('reviews').select('*', { count: 'exact', head: true }).gte('completed_at', today),
        supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('is_blocked', false).eq('is_admin', false),
        supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('is_blocked', true),
        supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('is_admin', true),
        supabase.from('videos').select('*', { count: 'exact', head: true }).eq('is_active', true),
        supabase.from('daily_video_lists').select('*', { count: 'exact', head: true }),
        supabase.from('daily_video_lists').select('*', { count: 'exact', head: true }).eq('is_completed', true),
        supabase.from('profiles').select('balance'),
      ]);

      const totalBalance = totalBalanceRes.data?.reduce((sum, profile) => sum + (profile.balance || 0), 0) || 0;

      return {
        totalUsers: usersRes.count || 0,
        totalVideos: videosRes.count || 0,
        totalReviews: reviewsRes.count || 0,
        reviewsToday: todayReviewsRes.count || 0,
        activeUsers: activeUsersRes.count || 0,
        blockedUsers: blockedUsersRes.count || 0,
        adminUsers: adminUsersRes.count || 0,
        activeVideos: activeVideosRes.count || 0,
        totalLists: listsRes.count || 0,
        completedLists: completedListsRes.count || 0,
        totalBalance: totalBalance,
      };
    },
  });

  // Fetch User Growth Data (Real)
  const { data: userGrowthData } = useQuery({
    queryKey: ['user-growth', dateFilter],
    queryFn: async () => {
      const days = dateFilter === '7d' ? 7 : dateFilter === '30d' ? 30 : dateFilter === '90d' ? 90 : 365;
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      const { data } = await supabase
        .from('profiles')
        .select('created_at')
        .gte('created_at', startDate.toISOString())
        .order('created_at', { ascending: true });

      // Group by date
      const grouped: { [key: string]: number } = {};
      data?.forEach((profile) => {
        const date = new Date(profile.created_at).toISOString().split('T')[0];
        grouped[date] = (grouped[date] || 0) + 1;
      });

      // Fill missing dates and cumulative
      const result = [];
      let cumulative = 0;
      for (let i = days - 1; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        cumulative += grouped[dateStr] || 0;
        result.push({
          date: date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
          usuarios: cumulative,
          novos: grouped[dateStr] || 0,
        });
      }
      return result;
    },
  });

  // Fetch Review Activity by Day (Real)
  const { data: reviewActivityData } = useQuery({
    queryKey: ['review-activity', dateFilter],
    queryFn: async () => {
      const days = dateFilter === '7d' ? 7 : dateFilter === '30d' ? 30 : dateFilter === '90d' ? 90 : 365;
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      const { data } = await supabase
        .from('reviews')
        .select('completed_at')
        .gte('completed_at', startDate.toISOString());

      const grouped: { [key: string]: number } = {};
      data?.forEach((review) => {
        const date = new Date(review.completed_at).toISOString().split('T')[0];
        grouped[date] = (grouped[date] || 0) + 1;
      });

      const result = [];
      for (let i = Math.min(days, 30) - 1; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        result.push({
          date: date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
          reviews: grouped[dateStr] || 0,
        });
      }
      return result;
    },
  });

  // Fetch Video Performance (Real)
  const { data: videoPerformanceData } = useQuery({
    queryKey: ['video-performance'],
    queryFn: async () => {
      const { data: reviews } = await supabase
        .from('reviews')
        .select('video_id, rating');

      const videoStats: { [key: string]: { count: number; totalRating: number } } = {};
      reviews?.forEach((review) => {
        if (!videoStats[review.video_id]) {
          videoStats[review.video_id] = { count: 0, totalRating: 0 };
        }
        videoStats[review.video_id].count++;
        videoStats[review.video_id].totalRating += review.rating;
      });

      const { data: videos } = await supabase
        .from('videos')
        .select('id, title')
        .in('id', Object.keys(videoStats));

      return videos?.map((video) => ({
        video: video.title.substring(0, 30) + '...',
        reviews: videoStats[video.id]?.count || 0,
        avgRating: videoStats[video.id]?.totalRating / videoStats[video.id]?.count || 0,
      })).sort((a, b) => b.reviews - a.reviews).slice(0, 10) || [];
    },
  });

  // Fetch Rating Distribution (Real)
  const { data: ratingDistData } = useQuery({
    queryKey: ['rating-distribution'],
    queryFn: async () => {
      const { data } = await supabase.from('reviews').select('rating');
      const counts = [0, 0, 0, 0, 0];
      data?.forEach((review) => {
        if (review.rating >= 1 && review.rating <= 5) {
          counts[review.rating - 1]++;
        }
      });
      return counts.map((count, index) => ({
        rating: `${index + 1} ⭐`,
        quantidade: count,
      }));
    },
  });

  // User Status Distribution (Real)
  const statusData = stats ? [
    { name: 'Ativos', value: stats.activeUsers, color: '#10b981' },
    { name: 'Admins', value: stats.adminUsers, color: '#8b5cf6' },
    { name: 'Bloqueados', value: stats.blockedUsers, color: '#ef4444' },
  ] : [];

  // List Completion Rate (Real)
  const listCompletionData = stats ? [
    { name: 'Completas', value: stats.completedLists, fill: '#10b981' },
    { name: 'Pendentes', value: stats.totalLists - stats.completedLists, fill: '#f59e0b' },
  ] : [];

  const kpiCards = [
    {
      title: 'Total de Usuários',
      value: stats?.totalUsers || 0,
      subtitle: `${stats?.activeUsers || 0} ativos`,
      icon: Users,
      color: 'text-blue-500',
      bg: 'bg-blue-500/10',
    },
    {
      title: 'Total de Vídeos',
      value: stats?.totalVideos || 0,
      subtitle: `${stats?.activeVideos || 0} ativos`,
      icon: Video,
      color: 'text-purple-500',
      bg: 'bg-purple-500/10',
    },
    {
      title: 'Avaliações Hoje',
      value: stats?.reviewsToday || 0,
      subtitle: `${stats?.totalReviews || 0} total`,
      icon: Star,
      color: 'text-yellow-500',
      bg: 'bg-yellow-500/10',
    },
    {
      title: 'Taxa de Conclusão',
      value: stats ? `${((stats.completedLists / stats.totalLists) * 100 || 0).toFixed(1)}%` : '0%',
      subtitle: `${stats?.completedLists || 0}/${stats?.totalLists || 0} listas`,
      icon: Activity,
      color: 'text-green-500',
      bg: 'bg-green-500/10',
    },
    {
      title: 'Saldo Total Sistema',
      value: `$${(stats?.totalBalance || 0).toFixed(2)}`,
      subtitle: 'Todos os usuários',
      icon: DollarSign,
      color: 'text-emerald-500',
      bg: 'bg-emerald-500/10',
    },
    {
      title: 'Usuários Bloqueados',
      value: stats?.blockedUsers || 0,
      subtitle: `${stats?.adminUsers || 0} admins`,
      icon: Shield,
      color: 'text-red-500',
      bg: 'bg-red-500/10',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header with Filter */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl sm:text-3xl font-bold text-white">Dashboard Analytics</h2>
        <div className="flex gap-2">
          {(['7d', '30d', '90d', 'all'] as const).map((period) => (
            <button
              key={period}
              onClick={() => setDateFilter(period)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                dateFilter === period
                  ? 'bg-[#E50914] text-white'
                  : 'bg-[#2D2D2D] text-gray-400 hover:bg-[#3D3D3D]'
              }`}
            >
              {period === 'all' ? 'Tudo' : period}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {kpiCards.map((kpi, index) => (
          <div key={index} className={`card p-5 ${kpi.bg}`}>
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm text-gray-400">{kpi.title}</p>
                <p className="text-2xl sm:text-3xl font-bold text-white mt-1">
                  {typeof kpi.value === 'string' ? kpi.value : kpi.value.toLocaleString('pt-BR')}
                </p>
                <p className="text-xs text-gray-500 mt-1">{kpi.subtitle}</p>
              </div>
              <kpi.icon className={`w-10 h-10 ${kpi.color} opacity-80`} />
            </div>
          </div>
        ))}
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* User Growth Chart */}
        <div className="lg:col-span-2 card p-5">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-500" />
            Crescimento de Usuários
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={userGrowthData || []}>
              <defs>
                <linearGradient id="colorUsuarios" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#2D2D2D" />
              <XAxis dataKey="date" stroke="#666" style={{ fontSize: '12px' }} />
              <YAxis stroke="#666" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1E1E1E',
                  border: '1px solid #2D2D2D',
                  borderRadius: '8px',
                }}
              />
              <Legend />
              <Area
                type="monotone"
                dataKey="usuarios"
                stroke="#3b82f6"
                strokeWidth={2}
                fill="url(#colorUsuarios)"
                name="Total Acumulado"
              />
              <Line
                type="monotone"
                dataKey="novos"
                stroke="#10b981"
                strokeWidth={2}
                name="Novos por Dia"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Status Distribution Pie */}
        <div className="card p-5">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Users className="w-5 h-5 text-purple-500" />
            Distribuição de Usuários
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={90}
                dataKey="value"
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 space-y-2">
            {statusData.map((item, index) => (
              <div key={index} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                  <span className="text-gray-400">{item.name}</span>
                </div>
                <span className="text-white font-semibold">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Reviews Activity Bar Chart */}
      <div className="card p-5">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Star className="w-5 h-5 text-yellow-500" />
          Atividade de Avaliações
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={reviewActivityData || []}>
            <CartesianGrid strokeDasharray="3 3" stroke="#2D2D2D" />
            <XAxis dataKey="date" stroke="#666" style={{ fontSize: '12px' }} />
            <YAxis stroke="#666" />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1E1E1E',
                border: '1px solid #2D2D2D',
                borderRadius: '8px',
              }}
            />
            <Legend />
            <Bar dataKey="reviews" fill="#eab308" name="Reviews por Dia" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Bottom Row: Video Performance + Rating Distribution + List Completion */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top 10 Videos */}
        <div className="lg:col-span-2 card p-5">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Video className="w-5 h-5 text-purple-500" />
            Top 10 Vídeos Mais Avaliados
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={videoPerformanceData || []} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#2D2D2D" />
              <XAxis type="number" stroke="#666" />
              <YAxis dataKey="video" type="category" stroke="#666" width={150} style={{ fontSize: '11px' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1E1E1E',
                  border: '1px solid #2D2D2D',
                  borderRadius: '8px',
                }}
              />
              <Legend />
              <Bar dataKey="reviews" fill="#8b5cf6" name="Total Reviews" radius={[0, 8, 8, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* List Completion Rate */}
        <div className="card p-5">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5 text-green-500" />
            Taxa de Conclusão de Listas
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={listCompletionData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={5}
                dataKey="value"
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
              >
                {listCompletionData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 space-y-2">
            {listCompletionData.map((item, index) => (
              <div key={index} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.fill }}></div>
                  <span className="text-gray-400">{item.name}</span>
                </div>
                <span className="text-white font-semibold">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Rating Distribution */}
      <div className="card p-5">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Star className="w-5 h-5 text-yellow-500" />
          Distribuição de Avaliações por Nota
        </h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={ratingDistData || []}>
            <CartesianGrid strokeDasharray="3 3" stroke="#2D2D2D" />
            <XAxis dataKey="rating" stroke="#666" />
            <YAxis stroke="#666" />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1E1E1E',
                border: '1px solid #2D2D2D',
                borderRadius: '8px',
              }}
            />
            <Bar dataKey="quantidade" name="Quantidade">
              {ratingDistData?.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={['#ef4444', '#f97316', '#eab308', '#84cc16', '#22c55e'][index]}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default DashboardOverview;
