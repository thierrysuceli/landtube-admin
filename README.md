# LandTube Admin Panel

Painel administrativo isolado do projeto principal LandTube Watch & Earn.

## 🎯 Características

- ✅ **100% Isolado** - Projeto completamente separado
- ✅ **Mesma API** - Conecta no mesmo Supabase do projeto principal
- ✅ **Dashboard Completo** - KPIs, gráficos e estatísticas em tempo real
- ✅ **Gerenciamento de Usuários** - Visualizar, editar, bloquear usuários
- ✅ **Gerenciamento de Vídeos** - Adicionar, editar, remover vídeos
- ✅ **Autenticação Segura** - Apenas administradores (is_admin = true)
- ✅ **Responsivo** - Funciona perfeitamente em desktop e mobile

## 🚀 Instalação

```bash
# 1. Instalar dependências
npm install

# 2. Configurar variáveis de ambiente
cp .env.example .env

# 3. Editar .env com as credenciais do Supabase
# (As mesmas do projeto principal!)

# 4. Iniciar servidor de desenvolvimento
npm run dev
```

## 📋 Pré-requisitos

1. **Ter o projeto principal** (landtube-watch-earn-main) configurado
2. **Supabase configurado** com todas as migrations aplicadas
3. **Usuário admin** no banco de dados com `is_admin = true`

## 🔐 Criar Usuário Admin

Execute no SQL Editor do Supabase:

```sql
-- 1. Criar usuário via Supabase Auth (Dashboard > Authentication > Add User)
-- Anote o USER_ID gerado

-- 2. Atualizar profile para admin
UPDATE profiles 
SET is_admin = true 
WHERE user_id = 'SEU_USER_ID_AQUI';
```

## 📦 Deploy

```bash
# Build para produção
npm run build

# Preview do build
npm run preview
```

## 🌐 Deploy no GitHub Pages (Separado do projeto principal)

1. Criar repositório novo: `landtube-admin`
2. Atualizar `vite.config.ts` com o nome do repo:
   ```ts
   base: mode === "production" ? "/landtube-admin/" : "/"
   ```
3. Push para GitHub
4. Ativar GitHub Pages no repositório

## 📱 Acesso

- **Local**: http://localhost:3002
- **Produção**: https://thierrysuceli.github.io/landtube-admin/

## 🎯 Credenciais de Acesso

- **Email**: admin@landtube.com
- **Senha**: admin123 (ou a senha configurada)
- **UUID Admin**: 11ff1237-a42c-46a8-a368-71ae0786735d

## 🔒 Segurança

- ✅ Rota protegida com verificação de `is_admin`
- ✅ Redirecionamento automático para login se não autenticado
- ✅ Verificação no backend via RLS (Row Level Security)
- ✅ Tokens de autenticação gerenciados pelo Supabase

## 📊 Funcionalidades

### Dashboard
- Total de usuários, vídeos, avaliações
- Gráficos de crescimento
- Distribuição de status
- Atividade de avaliações

### Usuários
- Lista paginada de todos os usuários
- Busca por email ou ID
- Visualizar detalhes completos
- Editar saldo
- Bloquear/desbloquear
- Resetar senha

### Vídeos
- Lista paginada de todos os vídeos
- Adicionar novos vídeos
- Editar vídeos existentes
- Ativar/desativar
- Remover vídeos

## 🛠️ Tecnologias

- **React 18** + TypeScript
- **Vite** - Build tool
- **TailwindCSS** - Estilização
- **Supabase** - Backend
- **React Query** - Cache e estado
- **Recharts** - Gráficos
- **Lucide React** - Ícones
- **Sonner** - Notificações

## 📝 Estrutura de Pastas

```
landtube-admin/
├── src/
│   ├── components/         # Componentes reutilizáveis
│   │   ├── DashboardOverview.tsx
│   │   ├── UsersManagement.tsx
│   │   ├── VideosManagement.tsx
│   │   └── ProtectedRoute.tsx
│   ├── pages/             # Páginas principais
│   │   ├── AdminLogin.tsx
│   │   └── AdminDashboard.tsx
│   ├── integrations/      # Integrações externas
│   │   └── supabase/
│   │       ├── client.ts
│   │       └── types.ts
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── public/
├── index.html
├── package.json
├── vite.config.ts
├── tailwind.config.ts
└── README.md
```

## 🔗 Relação com Projeto Principal

- **Mesmo Supabase** - Ambos usam o mesmo banco
- **Mesmas tabelas** - profiles, videos, reviews, daily_video_lists
- **Funções compartilhadas** - RPC functions disponíveis
- **Deploy separado** - Repositórios e URLs independentes

## 🐛 Troubleshooting

**Erro de autenticação?**
- Verifique se o usuário tem `is_admin = true`
- Confirme as credenciais do .env
- Limpe o localStorage e tente novamente

**Gráficos não aparecem?**
- Verifique se há dados no banco
- Abra o console para ver erros
- Teste as queries diretamente no Supabase

**Erro ao conectar no Supabase?**
- Confirme URL e Anon Key no .env
- Verifique se o projeto Supabase está ativo
- Teste a conexão no projeto principal primeiro

## 📧 Suporte

Para problemas ou dúvidas, abra uma issue no GitHub do projeto principal.

## 📄 Licença

Projeto privado - Todos os direitos reservados.
