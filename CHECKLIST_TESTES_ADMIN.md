# ✅ CHECKLIST DE TESTES - PAINEL ADMINISTRATIVO

## 🚨 **PASSO CRÍTICO - APLICAR MIGRATION PRIMEIRO**

### ⚠️ ANTES DE TESTAR, APLIQUE A MIGRATION DE EMERGÊNCIA:

1. Acesse o Supabase SQL Editor:
   ```
   https://supabase.com/dashboard/project/lhosnclxjhbxjbnbktny/sql
   ```

2. Abra o arquivo:
   ```
   c:\Users\silva\Downloads\landtube-watch-earn-main\landtube-watch-earn-main\supabase\migrations\20251015140000_emergency_fix_policies.sql
   ```

3. Copie TODO o conteúdo do arquivo

4. Cole no SQL Editor do Supabase

5. Execute (clique em "Run" ou Ctrl+Enter)

6. Confirme se aparece a mensagem de sucesso

**MOTIVO:** Esta migration corrige o erro de login HTTP 500 e permite que o admin acesse o banco de dados.

---

## 📋 **CREDENCIAIS DE ACESSO**

- **URL Admin:** http://localhost:3002
- **Email Admin:** admin@landtube.com
- **Senha:** admin123 (ou a senha configurada)
- **UUID Admin:** 11ff1237-a42c-46a8-a368-71ae0786735d

---

## 🔐 **1. AUTENTICAÇÃO**

### Login
- [ ] Acessa http://localhost:3002
- [ ] Redireciona para /auth se não logado
- [ ] Login com email e senha funciona
- [ ] Valida se usuário é admin (is_admin = true)
- [ ] Bloqueia acesso de usuários não-admin
- [ ] Redireciona para dashboard após login bem-sucedido

### Logout
- [ ] Botão de logout visível
- [ ] Logout funciona corretamente
- [ ] Redireciona para /auth após logout

---

## 👥 **2. GERENCIAMENTO DE USUÁRIOS**

### Listagem
- [ ] Lista todos os usuários cadastrados
- [ ] Mostra informações básicas (email, nome, saldo, status)
- [ ] Paginação funciona (10 usuários por página)
- [ ] Ordem: usuários mais recentes primeiro

### Busca
- [ ] Busca por email funciona
- [ ] Busca por nome (display_name) funciona
- [ ] Busca por ID (user_id) funciona
- [ ] Resultados atualizam em tempo real

### Filtros
- [ ] Filtro "Todos" mostra todos os usuários
- [ ] Filtro "Ativos" mostra apenas não-bloqueados e não-admins
- [ ] Filtro "Admin" mostra apenas admins (is_admin = true)
- [ ] Filtro "Bloqueados" mostra apenas is_blocked = true

### Badges de Status
- [ ] Badge "Admin" aparece em roxo para admins
- [ ] Badge "Ativo" aparece em verde para usuários normais
- [ ] Badge "Bloqueado" aparece em vermelho para bloqueados

---

## 📊 **3. MODAL DE DETALHES DO USUÁRIO**

### Abertura
- [ ] Botão "👁️ Ver Detalhes" abre o modal
- [ ] Modal carrega dados do usuário selecionado
- [ ] Modal tem 3 abas: Visão Geral, Histórico de Reviews, Listas Completas

### Aba 1: Visão Geral
**Informações Exibidas:**
- [ ] Nome de exibição (display_name)
- [ ] Email
- [ ] User ID (UUID)
- [ ] Saldo atual (balance)
- [ ] Meta de saque (withdrawal_goal)
- [ ] Total de reviews (total_reviews)
- [ ] Reviews diários completados (daily_reviews_completed)
- [ ] Sequência de dias (current_streak)
- [ ] Status (Admin/Ativo/Bloqueado)
- [ ] Data de cadastro (created_at)

**Ações Disponíveis:**
- [ ] Botão "🔑 Resetar Senha" visível
- [ ] Botão "💰 Ajustar Saldo" visível
- [ ] Botão "🚫 Bloquear Usuário" ou "✅ Desbloquear Usuário" (conforme status)

### Aba 2: Histórico de Reviews
- [ ] Mostra últimos 50 reviews do usuário
- [ ] Exibe informações: Título do vídeo, Rating (estrelas), Comentário, Data
- [ ] Ordenação: mais recentes primeiro
- [ ] Mensagem "Nenhum review encontrado" se vazio

### Aba 3: Listas Completas
- [ ] Mostra últimas 30 listas diárias (daily_video_lists)
- [ ] Exibe: Data da lista, Vídeos completados, Status (Completa/Pendente)
- [ ] Badge verde "Completa ✓" se is_completed = true
- [ ] Badge amarelo "Pendente" se is_completed = false
- [ ] Ordenação: listas mais recentes primeiro
- [ ] Mensagem "Nenhuma lista encontrada" se vazio

---

## 🔧 **4. AÇÕES ADMINISTRATIVAS - USUÁRIOS**

### Resetar Senha
- [ ] Clica em "🔑 Resetar Senha" no modal
- [ ] Solicita confirmação
- [ ] Marca requires_password_change = true no banco
- [ ] Mostra toast de sucesso
- [ ] Usuário será forçado a mudar senha no próximo login

### Ajustar Saldo
- [ ] Clica em "💰 Ajustar Saldo"
- [ ] Abre modal com formulário
- [ ] Campo "Valor" aceita números positivos e negativos
- [ ] Campo "Motivo" (text area) obrigatório
- [ ] Botão "Adicionar" para valores positivos
- [ ] Botão "Subtrair" para valores negativos
- [ ] Executa função `admin_adjust_balance(user_id, amount, reason)`
- [ ] Atualiza saldo no perfil
- [ ] Registra ajuste no histórico (se implementado)
- [ ] Mostra toast de sucesso
- [ ] Atualiza dados do modal automaticamente

### Bloquear/Desbloquear Usuário
- [ ] Clica em "🚫 Bloquear" (se usuário ativo)
- [ ] Solicita confirmação
- [ ] Executa função `admin_toggle_user_block(user_id, true)`
- [ ] Marca is_blocked = true no banco
- [ ] Usuário não consegue mais fazer login
- [ ] Mostra toast de sucesso
- [ ] Badge muda para "Bloqueado" (vermelho)
- [ ] Botão muda para "✅ Desbloquear"

- [ ] Clica em "✅ Desbloquear" (se usuário bloqueado)
- [ ] Solicita confirmação
- [ ] Executa função `admin_toggle_user_block(user_id, false)`
- [ ] Marca is_blocked = false no banco
- [ ] Usuário pode fazer login novamente
- [ ] Mostra toast de sucesso
- [ ] Badge volta para "Ativo" (verde)

---

## 🎥 **5. GERENCIAMENTO DE VÍDEOS**

### Listagem
- [ ] Lista todos os vídeos cadastrados
- [ ] Mostra: Thumbnail, Título, URL, Valor de ganho, Status (Ativo/Inativo)
- [ ] Paginação funciona (10 vídeos por página)
- [ ] Ordem: vídeos mais recentes primeiro

### Busca
- [ ] Busca por título funciona
- [ ] Busca por ID do vídeo funciona
- [ ] Resultados atualizam em tempo real

### Adicionar Vídeo
- [ ] Clica em "➕ Adicionar Vídeo"
- [ ] Abre modal com formulário
- [ ] Campos obrigatórios:
  - [ ] Título do vídeo
  - [ ] URL do YouTube (valida formato)
  - [ ] Valor de ganho (earning_amount) - padrão $5.00
  - [ ] Status (Ativo/Inativo) - padrão Ativo
- [ ] Extrai ID do YouTube da URL automaticamente
- [ ] Gera thumbnail_url automaticamente: `https://i.ytimg.com/vi/{ID}/mqdefault.jpg`
- [ ] Valida URL do YouTube (aceita formatos: youtube.com/watch?v=, youtu.be/, youtube.com/embed/)
- [ ] Insere vídeo no banco usando RLS com is_admin()
- [ ] Mostra toast de sucesso
- [ ] Fecha modal e atualiza lista

### Editar Vídeo
- [ ] Clica em "✏️ Editar" em um vídeo
- [ ] Abre modal com dados do vídeo preenchidos
- [ ] Permite editar todos os campos
- [ ] Valida URL se alterada
- [ ] Atualiza vídeo no banco
- [ ] Mostra toast de sucesso
- [ ] Atualiza lista automaticamente

### Deletar Vídeo
- [ ] Clica em "🗑️ Deletar" em um vídeo
- [ ] Solicita confirmação
- [ ] Deleta vídeo do banco (soft delete ou hard delete)
- [ ] Mostra toast de sucesso
- [ ] Remove vídeo da lista

### Status do Vídeo
- [ ] Badge "Ativo" aparece em verde se is_active = true
- [ ] Badge "Inativo" aparece em vermelho se is_active = false
- [ ] Pode alterar status ao editar vídeo

---

## 📈 **6. DASHBOARD/OVERVIEW**

### Estatísticas Gerais (se implementado)
- [ ] Total de usuários cadastrados
- [ ] Usuários ativos (não bloqueados)
- [ ] Total de vídeos disponíveis
- [ ] Reviews realizados (total)
- [ ] Gráficos de atividade (se implementado)

---

## 🗄️ **7. BANCO DE DADOS - FUNÇÕES RPC**

### Verificar Funções Criadas
Acesse Supabase SQL Editor e execute:
```sql
SELECT routine_name 
FROM information_schema.routines 
WHERE routine_schema = 'public' 
AND routine_name LIKE 'admin_%';
```

**Funções Esperadas:**
- [ ] `admin_reset_user_password(target_user_id UUID)`
- [ ] `admin_adjust_balance(target_user_id UUID, amount DECIMAL, reason TEXT)`
- [ ] `admin_toggle_user_block(target_user_id UUID, block_status BOOLEAN)`
- [ ] `is_admin()` (helper function)

### Testar Função is_admin()
```sql
-- Como admin logado
SELECT public.is_admin();
-- Deve retornar: true

-- Deslogar e tentar novamente (ou como usuário normal)
SELECT public.is_admin();
-- Deve retornar: false
```

---

## 🔒 **8. RLS (ROW LEVEL SECURITY) POLICIES**

### Verificar Policies Aplicadas
```sql
-- Ver todas as policies
SELECT schemaname, tablename, policyname 
FROM pg_policies 
WHERE schemaname = 'public'
ORDER BY tablename, policyname;
```

**Policies Esperadas (após migration de emergência):**

**Profiles (5 policies):**
- [ ] `profiles_select_own` - Usuários veem seu próprio perfil
- [ ] `profiles_update_own` - Usuários atualizam seu próprio perfil
- [ ] `profiles_insert_own` - Usuários criam seu perfil
- [ ] `profiles_select_admin` - Admins veem todos os perfis
- [ ] `profiles_update_admin` - Admins atualizam qualquer perfil

**Videos (5 policies):**
- [ ] `videos_select_active` - Todos veem vídeos ativos
- [ ] `videos_select_admin` - Admins veem todos os vídeos
- [ ] `videos_insert_admin` - Admins criam vídeos
- [ ] `videos_update_admin` - Admins editam vídeos
- [ ] `videos_delete_admin` - Admins deletam vídeos

**Reviews (3 policies):**
- [ ] `reviews_select_own` - Usuários veem seus reviews
- [ ] `reviews_insert_own` - Usuários criam reviews
- [ ] `reviews_select_admin` - Admins veem todos os reviews

**Daily_video_lists (5 policies):**
- [ ] `lists_select_own` - Usuários veem suas listas
- [ ] `lists_insert_own` - Usuários criam listas
- [ ] `lists_update_own` - Usuários atualizam suas listas
- [ ] `lists_select_admin` - Admins veem todas as listas
- [ ] `lists_update_admin` - Admins atualizam qualquer lista

---

## 🐛 **9. TESTES DE ERRO**

### Erro 1: Login com Usuário Não-Admin
- [ ] Tenta login com usuário normal (is_admin = false)
- [ ] Sistema bloqueia acesso
- [ ] Mostra mensagem: "Acesso negado. Apenas administradores."
- [ ] Redireciona para tela de login

### Erro 2: Tentar Adicionar Vídeo com URL Inválida
- [ ] Clica em "Adicionar Vídeo"
- [ ] Insere URL inválida (ex: "www.google.com")
- [ ] Sistema valida e mostra erro
- [ ] Não permite salvar

### Erro 3: Buscar Usuário Inexistente
- [ ] Busca por email que não existe
- [ ] Sistema mostra: "Nenhum usuário encontrado"
- [ ] Não quebra a aplicação

### Erro 4: Deletar Vídeo em Uso
- [ ] Tenta deletar vídeo que já tem reviews
- [ ] Sistema pode: bloquear com erro OU fazer soft delete
- [ ] Não quebra banco de dados (foreign key constraints)

### Erro 5: Ações sem Migration Aplicada
- [ ] Se migration NÃO aplicada: erro HTTP 500 ou "infinite recursion"
- [ ] Se migration aplicada: tudo funciona

---

## ✅ **10. CHECKLIST FINAL - RESUMO**

### Antes de Usar em Produção:
- [ ] Migration `20251015140000_emergency_fix_policies.sql` aplicada
- [ ] Usuário admin criado (UUID: 11ff1237-a42c-46a8-a368-71ae0786735d)
- [ ] Admin consegue fazer login
- [ ] Admin vê TODOS os usuários (não apenas 1)
- [ ] Admin consegue adicionar/editar/deletar vídeos
- [ ] Ações administrativas funcionam (resetar senha, ajustar saldo, bloquear)
- [ ] Modal de detalhes mostra todas as 3 abas
- [ ] Busca e filtros funcionam
- [ ] RLS policies protegem dados (usuários normais não veem dados de outros)
- [ ] Sem erros HTTP 500 no console

### Performance e UX:
- [ ] Carregamento rápido (<2 segundos)
- [ ] Toasts de sucesso/erro aparecem
- [ ] Modais abrem e fecham suavemente
- [ ] Paginação funciona sem travar
- [ ] Responsivo (funciona em mobile e desktop)

---

## 📞 **SUPORTE**

### Em Caso de Erro:

1. **Erro HTTP 500 / Login não funciona**
   - Aplicar migration de emergência

2. **Admin não vê todos os usuários**
   - Verificar se `is_admin()` function existe
   - Verificar RLS policies com query acima

3. **Não consegue adicionar vídeos**
   - Verificar policy `videos_insert_admin`
   - Confirmar que usuário tem is_admin = true

4. **Ações administrativas falham**
   - Verificar se funções RPC existem: `admin_reset_user_password`, `admin_adjust_balance`, `admin_toggle_user_block`
   - Ver logs no Supabase Dashboard

5. **Modal de detalhes não carrega histórico**
   - Verificar policies de `reviews` e `daily_video_lists`
   - Confirmar que admin tem permissão SELECT em todas as tabelas

---

## 🎯 **PRÓXIMOS PASSOS**

Depois de completar este checklist:

1. ✅ Todos os itens marcados = Admin pronto para produção
2. ❌ Algum item falhando = Reportar erro com detalhes
3. 📝 Documentar customizações adicionais necessárias
4. 🚀 Deploy do admin (se necessário)

---

**Data do Checklist:** 15/10/2025  
**Versão do Admin:** 1.0.0  
**Status Migration:** ⚠️ PENDENTE (aplicar antes de testar)
