# ✅ Checklist Completo - Teste de Funcionalidades Admin

## 🎯 ANTES DE COMEÇAR

1. [ ] Aplicar migration `20251015130000_fix_admin_policies_recursion.sql` no Supabase SQL Editor
2. [ ] Reiniciar servidor admin: `cd landtube-admin && npm run dev`
3. [ ] Fazer logout e login novamente em http://localhost:3002

---

## 📊 DASHBOARD (/)

### KPIs (Cards no topo)
- [ ] **Total de Usuários**: Mostra número correto (não apenas 1)
- [ ] **Total de Vídeos**: Mostra todos os vídeos cadastrados
- [ ] **Avaliações Hoje**: Mostra reviews do dia atual
- [ ] **Total Avaliações**: Mostra total de reviews

### Gráficos
- [ ] **Gráfico de Crescimento**: Linha vermelha mostra evolução
- [ ] **Distribuição de Status**: Gráfico de pizza com cores
- [ ] **Atividade de Avaliações**: Barras vermelhas por dia da semana

**Status**: ⬜ Não testado | ✅ Funcionando | ❌ Com erro

---

## 👥 USUÁRIOS (/users)

### Listagem
- [ ] Mostra **MAIS de 1 usuário** (não só o admin)
- [ ] Tabela exibe: Nome, Email, Saldo, Reviews, Sequência, Status, Data
- [ ] Paginação funciona (se houver mais de 10 usuários)
- [ ] Status badges aparecem coloridos:
  - [ ] 🟣 Admin (roxo)
  - [ ] 🔴 Bloqueado (vermelho)
  - [ ] 🟢 Ativo (verde)

### Busca e Filtros
- [ ] **Busca por email** funciona
- [ ] **Busca por nome** funciona
- [ ] **Filtro "Todos"** mostra todos os usuários
- [ ] **Filtro "Ativos"** mostra apenas usuários não-bloqueados e não-admins
- [ ] **Filtro "Admins"** mostra apenas admins
- [ ] **Filtro "Bloqueados"** mostra apenas usuários bloqueados

### Modal de Detalhes
- [ ] Botão "👁️ Ver Detalhes" abre modal
- [ ] **Aba "Visão Geral"**:
  - [ ] Mostra nome do usuário e email
  - [ ] Mostra saldo atual em verde
  - [ ] 4 cards de estatísticas aparecem
  - [ ] Informações da conta (ID, data de cadastro, etc.)
  
- [ ] **Aba "Histórico de Reviews"**:
  - [ ] Lista reviews do usuário (até 50)
  - [ ] Mostra thumbnail, título do vídeo, nota (estrelas), data, valor
  - [ ] Se usuário não tem reviews, mostra mensagem "Nenhum review encontrado"
  
- [ ] **Aba "Listas Completas"**:
  - [ ] Mostra listas diárias do usuário (até 30)
  - [ ] Exibe data da lista, progresso (X/5 vídeos), status, ganho
  - [ ] Barra de progresso visual funciona
  - [ ] Badge "Completa" (verde) ou "Pendente" (amarelo)
  - [ ] Se usuário não tem listas, mostra mensagem "Nenhuma lista encontrada"

### Ações Administrativas

#### 🔑 Resetar Senha
- [ ] Botão "Resetar Senha" abre modal de confirmação
- [ ] Modal explica o que vai acontecer
- [ ] Botão "Confirmar" executa a ação
- [ ] Toast de sucesso aparece
- [ ] Perfil é atualizado (requires_password_change = true)
- [ ] Modal fecha após sucesso

#### 💰 Ajustar Saldo
- [ ] Botão "Ajustar Saldo" abre modal
- [ ] Campo "Valor do Ajuste" aceita números positivos
- [ ] Campo "Valor do Ajuste" aceita números negativos (ex: -5.00)
- [ ] Campo "Motivo do Ajuste" é obrigatório
- [ ] Botão "Aplicar Ajuste" funciona
- [ ] Toast mostra novo saldo
- [ ] Saldo é atualizado na listagem
- [ ] Modal fecha após sucesso

**Teste prático**: Ajuste +10.00, depois -5.00, verifique saldo final

#### 🚫 Bloquear/Desbloquear
- [ ] Botão "Bloquear" (vermelho com ícone Ban) aparece para usuários ativos
- [ ] Botão "Desbloquear" (verde com ícone CheckCircle) aparece para usuários bloqueados
- [ ] Confirmação é solicitada
- [ ] Ação executa com sucesso
- [ ] Toast de confirmação aparece
- [ ] Status badge muda na tabela
- [ ] Listagem atualiza automaticamente

**Status**: ⬜ Não testado | ✅ Funcionando | ❌ Com erro

---

## 🎬 VÍDEOS (/videos)

### Listagem
- [ ] Mostra todos os vídeos cadastrados
- [ ] Tabela exibe: Thumbnail, Título, Ganho, Status, Data
- [ ] Paginação funciona (se houver mais de 10 vídeos)
- [ ] Thumbnails do YouTube carregam corretamente
- [ ] Status badges aparecem:
  - [ ] 🟢 Ativo
  - [ ] 🔴 Inativo

### Busca e Filtros
- [ ] **Busca por título** funciona
- [ ] **Filtro "Todos"** mostra todos os vídeos
- [ ] **Filtro "Ativo"** mostra apenas vídeos ativos
- [ ] **Filtro "Inativo"** mostra apenas vídeos inativos

### Adicionar Novo Vídeo
- [ ] Botão "➕ Adicionar Vídeo" abre modal
- [ ] Campo "Título do Vídeo" aceita texto
- [ ] Campo "URL do YouTube" aceita URLs do YouTube
- [ ] Campo "Valor do Ganho" aceita números decimais
- [ ] Campo "Status" tem opções Ativo/Inativo
- [ ] Botão "Salvar" funciona
- [ ] Thumbnail é extraída automaticamente da URL
- [ ] Toast de sucesso aparece
- [ ] Novo vídeo aparece na listagem
- [ ] Modal fecha após sucesso

**Teste prático**: 
1. Copie URL de vídeo do YouTube (ex: https://www.youtube.com/watch?v=dQw4w9WgXcQ)
2. Cole no campo URL
3. Preencha título e valor (ex: $5.00)
4. Salve e verifique se aparece na lista

### Editar Vídeo
- [ ] Botão "✏️ Editar" (amarelo) abre modal com dados preenchidos
- [ ] Todos os campos podem ser alterados
- [ ] Botão "Salvar" atualiza o vídeo
- [ ] Toast de sucesso aparece
- [ ] Alterações refletem na listagem
- [ ] Modal fecha após sucesso

### Deletar Vídeo
- [ ] Botão "🗑️ Deletar" (vermelho) solicita confirmação
- [ ] Confirmação explica a ação
- [ ] Botão "Confirmar" executa a exclusão
- [ ] Toast de sucesso aparece
- [ ] Vídeo desaparece da listagem

**⚠️ ATENÇÃO**: Deletar vídeo pode quebrar reviews existentes. Prefira desativar.

**Status**: ⬜ Não testado | ✅ Funcionando | ❌ Com erro

---

## ⚙️ CONFIGURAÇÕES (/settings)

- [ ] Página mostra mensagem "Em breve..."
- [ ] Ícone de engrenagem aparece

**Status**: ⬜ Não testado | ✅ Em desenvolvimento

---

## 🔐 SEGURANÇA

### Teste de Isolamento
1. [ ] Criar usuário normal (não-admin) no projeto user
2. [ ] Tentar acessar dados de outros usuários via API
3. [ ] Verificar que RLS bloqueia acesso

### Teste de Permissões Admin
- [ ] Admin consegue ver todos os usuários
- [ ] Admin consegue ver todos os reviews
- [ ] Admin consegue ver todas as listas
- [ ] Admin consegue criar/editar/deletar vídeos
- [ ] Admin consegue ajustar saldo de qualquer usuário
- [ ] Admin consegue bloquear qualquer usuário

### Teste de Usuário Normal
- [ ] Usuário normal só vê seus próprios dados
- [ ] Usuário normal não consegue acessar `/admin`
- [ ] Usuário normal não consegue executar funções admin

**Status**: ⬜ Não testado | ✅ Funcionando | ❌ Com erro

---

## 🐛 PROBLEMAS CONHECIDOS E SOLUÇÕES

### ❌ Ainda mostra só 1 usuário
**Solução**:
1. Verifique se aplicou a migration `20251015130000_fix_admin_policies_recursion.sql`
2. Faça logout e login novamente
3. Limpe cache do navegador (Ctrl+Shift+R)

### ❌ Erro "infinite recursion"
**Solução**: Aplicar migration que cria função `is_admin()`

### ❌ Não consegue adicionar vídeos
**Solução**:
```sql
-- No Supabase SQL Editor:
UPDATE profiles SET is_admin = true 
WHERE user_id = '11ff1237-a42c-46a8-a368-71ae0786735d';
```

### ❌ "Function is_admin() does not exist"
**Solução**: Aplicar migration `20251015130000_fix_admin_policies_recursion.sql`

### ❌ Histórico de reviews/listas não carrega
**Solução**: Verificar se políticas `admin_view_all_reviews` e `admin_view_all_lists` foram criadas

---

## 📊 RESUMO DOS TESTES

### Dashboard
- Total testado: ____ / 7
- Funcionando: ____ ✅
- Com erro: ____ ❌

### Usuários
- Total testado: ____ / 20
- Funcionando: ____ ✅
- Com erro: ____ ❌

### Vídeos
- Total testado: ____ / 12
- Funcionando: ____ ✅
- Com erro: ____ ❌

### Segurança
- Total testado: ____ / 9
- Funcionando: ____ ✅
- Com erro: ____ ❌

---

## ✅ QUANDO TUDO FUNCIONAR

Você terá um painel admin completo com:

✅ **Gestão Total de Usuários**: Ver, buscar, filtrar, histórico, resetar senha, ajustar saldo, bloquear  
✅ **Gestão Completa de Vídeos**: Adicionar, editar, deletar, ativar/desativar  
✅ **Dashboard com Estatísticas**: KPIs e gráficos em tempo real  
✅ **Segurança RLS**: Apenas admins acessam, usuários isolados  
✅ **Histórico Completo**: Reviews e listas de cada usuário  
✅ **Zero Impacto**: Projeto user não foi tocado  

---

**Marque os itens conforme for testando e reporte qualquer problema! 🚀**
