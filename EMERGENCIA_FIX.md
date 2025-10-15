# 🚨 CORREÇÃO EMERGENCIAL - Login Quebrado

## ❌ PROBLEMA

**Sintoma**: Usuários não conseguem mais fazer login
**Erro**: HTTP 500 nas requisições para `/profiles`
**Causa**: Conflito entre políticas RLS antigas e novas (múltiplas políticas para mesma ação)

## ✅ SOLUÇÃO RÁPIDA

### 1️⃣ Aplicar Migration de Emergência

**No Supabase SQL Editor:**

1. Acesse: https://supabase.com/dashboard/project/lhosnclxjhbxjbnbktny/sql
2. Cole TODO o conteúdo de:
   ```
   supabase/migrations/20251015140000_emergency_fix_policies.sql
   ```
3. Clique em **RUN** (Ctrl+Enter)
4. Aguarde mensagem de sucesso

**O que essa migration faz:**
- ✅ Remove TODAS as políticas antigas (limpa conflitos)
- ✅ Recria políticas limpas e sem conflito
- ✅ Mantém função `is_admin()` para verificação de admin
- ✅ Restaura acesso de usuários normais
- ✅ Mantém acesso total de admins

### 2️⃣ Testar Login Imediatamente

**Projeto USER (landtube-watch-earn-main):**
1. Acesse: http://localhost:5173 (ou porta do seu projeto user)
2. Tente fazer login com usuário normal
3. ✅ Deve funcionar normalmente

**Projeto ADMIN (landtube-admin):**
1. Acesse: http://localhost:3002
2. Faça login com `admin@landtube.com`
3. ✅ Deve ver todos os usuários
4. ✅ Deve conseguir adicionar vídeos

## 📋 ESTRUTURA FINAL DE POLÍTICAS

### PROFILES (5 políticas)
```
✅ profiles_select_own       → Usuário vê próprio perfil
✅ profiles_update_own       → Usuário edita próprio perfil
✅ profiles_insert_own       → Usuário cria próprio perfil
✅ profiles_select_admin     → Admin vê TODOS os perfis
✅ profiles_update_admin     → Admin edita TODOS os perfis
```

### VIDEOS (5 políticas)
```
✅ videos_select_active      → Todos veem vídeos ativos
✅ videos_select_admin       → Admin vê TODOS os vídeos
✅ videos_insert_admin       → Admin cria vídeos
✅ videos_update_admin       → Admin edita vídeos
✅ videos_delete_admin       → Admin deleta vídeos
```

### REVIEWS (3 políticas)
```
✅ reviews_select_own        → Usuário vê próprios reviews
✅ reviews_insert_own        → Usuário cria próprios reviews
✅ reviews_select_admin      → Admin vê TODOS os reviews
```

### DAILY_VIDEO_LISTS (5 políticas)
```
✅ lists_select_own          → Usuário vê próprias listas
✅ lists_insert_own          → Usuário cria próprias listas
✅ lists_update_own          → Usuário atualiza próprias listas
✅ lists_select_admin        → Admin vê TODAS as listas
✅ lists_update_admin        → Admin atualiza TODAS as listas
```

## 🔍 VERIFICAÇÃO

### Teste 1: Login de Usuário Normal ✅
```
1. Acesse projeto user
2. Faça login
3. Deve entrar no dashboard normalmente
4. Deve ver apenas seus próprios dados
```

### Teste 2: Login de Admin ✅
```
1. Acesse localhost:3002
2. Login: admin@landtube.com
3. Deve ver TODOS os usuários na lista
4. Deve conseguir adicionar/editar vídeos
```

### Teste 3: Isolamento de Dados ✅
```
1. Usuário A não vê dados do Usuário B
2. Admin vê dados de todos os usuários
```

## 🆘 SE AINDA NÃO FUNCIONAR

### Erro 500 persiste
```sql
-- Execute no Supabase SQL Editor:
SELECT tablename, policyname 
FROM pg_policies 
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- Deve mostrar apenas as políticas listadas acima
-- Se houver duplicatas, execute novamente a migration
```

### Usuário ainda não consegue login
```sql
-- Verifique se RLS está ativo:
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public';

-- Todos devem ter rowsecurity = true
```

### Admin não vê todos os usuários
```sql
-- Verifique se is_admin está true:
SELECT user_id, email, is_admin 
FROM profiles 
WHERE email = 'admin@landtube.com';

-- Se is_admin = false, corrija:
UPDATE profiles 
SET is_admin = true 
WHERE user_id = '11ff1237-a42c-46a8-a368-71ae0786735d';
```

## 📝 O QUE ESTAVA ERRADO

**Antes (ERRO):**
- ❌ Políticas duplicadas: "Users can view" + "admin_view_all"
- ❌ Múltiplas políticas para mesma ação (SELECT, UPDATE, etc.)
- ❌ Postgres tentava aplicar todas e entrava em conflito
- ❌ Resultado: HTTP 500

**Agora (CORRETO):**
- ✅ Uma política para cada ação de usuários normais
- ✅ Uma política separada para cada ação de admins
- ✅ Nomes únicos sem conflito
- ✅ Sem recursão, sem duplicatas
- ✅ Resultado: Tudo funciona

## ⚠️ LIÇÃO APRENDIDA

**NUNCA:**
- ❌ Criar políticas com nomes duplicados
- ❌ Ter múltiplas políticas FOR SELECT/UPDATE na mesma tabela sem diferenciação clara
- ❌ Usar subqueries recursivas em políticas RLS

**SEMPRE:**
- ✅ Dar nomes únicos e descritivos
- ✅ Usar funções helper (como `is_admin()`) para evitar recursão
- ✅ Testar após cada alteração de política
- ✅ Manter políticas simples e claras

---

**APLIQUE A MIGRATION AGORA E TESTE O LOGIN! 🚀**
