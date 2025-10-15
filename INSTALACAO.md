# 🚀 Guia de Instalação Rápida - LandTube Admin

## 📋 Pré-requisitos

1. ✅ Projeto principal (landtube-watch-earn-main) funcionando
2. ✅ Supabase configurado com todas as migrations aplicadas
3. ✅ Node.js instalado (v18 ou superior)

## 🔧 Passo a Passo

### 1. Criar arquivo .env

```bash
cd landtube-admin
copy .env.example .env
```

### 2. Editar .env com suas credenciais do Supabase

Abra o arquivo `.env` e cole as **MESMAS** credenciais do projeto principal:

```env
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua-anon-key-aqui
```

**📍 Onde encontrar essas informações?**
- Copie do arquivo `.env` do projeto principal (landtube-watch-earn-main)
- Ou acesse: Supabase Dashboard → Settings → API

### 3. Instalar Dependências

```bash
npm install
```

### 4. Criar Usuário Administrador

Acesse o **SQL Editor** do Supabase e execute:

```sql
-- Substitua 'seu-email@example.com' e 'sua-senha-segura'
-- Este comando cria um usuário E marca como admin

-- 1. Primeiro, crie o usuário no Auth (Dashboard → Authentication → Add User)
-- Anote o USER_ID que será gerado

-- 2. Depois, execute este SQL (substitua o USER_ID)
UPDATE profiles 
SET is_admin = true 
WHERE user_id = 'COLE_O_USER_ID_AQUI';

-- 3. Verifique se funcionou:
SELECT user_id, email, is_admin 
FROM profiles 
WHERE is_admin = true;
```

### 5. Iniciar Servidor de Desenvolvimento

```bash
npm run dev
```

Acesse: **http://localhost:3001**

### 6. Fazer Login

Use as credenciais do usuário admin que você criou no passo 4.

## ✅ Verificação

Se tudo está funcionando, você deve ver:

1. ✅ Tela de login estilizada
2. ✅ Após login, redirecionamento para Dashboard
3. ✅ Dashboard com KPIs (Total de Usuários, Vídeos, etc.)
4. ✅ Gráficos carregando
5. ✅ Menu lateral com: Dashboard, Usuários, Vídeos, Configurações

## 🐛 Problemas Comuns

### "Acesso negado! Apenas administradores"

**Solução:** Verifique se o usuário tem `is_admin = true` no banco:

```sql
SELECT user_id, email, is_admin FROM profiles WHERE user_id = 'SEU_USER_ID';
```

### "Failed to fetch" ou erro de conexão

**Solução:** Verifique o arquivo `.env`:
- URL está correta?
- Anon Key está correta?
- Projeto Supabase está ativo?

### Gráficos não aparecem

**Solução:** Verifique se há dados no banco:

```sql
-- Deve retornar > 0
SELECT COUNT(*) FROM profiles;
SELECT COUNT(*) FROM videos;
SELECT COUNT(*) FROM reviews;
```

### Port 3001 já está em uso

**Solução:** Mate o processo ou mude a porta em `vite.config.ts`:

```ts
server: {
  host: "::",
  port: 3002, // Mude aqui
},
```

## 🎯 Próximos Passos

### Deploy no GitHub Pages

1. Crie novo repositório no GitHub: `landtube-admin`
2. Ajuste o `vite.config.ts`:
   ```ts
   base: mode === "production" ? "/landtube-admin/" : "/"
   ```
3. Push para GitHub:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/SEU_USUARIO/landtube-admin.git
   git branch -M main
   git push -u origin main
   ```
4. Ative GitHub Pages: Settings → Pages → Source: GitHub Actions

### Adicionar mais admins

```sql
UPDATE profiles 
SET is_admin = true 
WHERE email = 'novo-admin@example.com';
```

## 📞 Suporte

Se encontrar problemas:

1. Verifique os logs do console do navegador (F12)
2. Verifique os logs do terminal onde rodou `npm run dev`
3. Teste a conexão do Supabase no projeto principal primeiro
4. Confirme que todas as migrations foram aplicadas

## 🎉 Sucesso!

Se chegou até aqui e tudo está funcionando, parabéns! 

Você agora tem um painel administrativo completo rodando em:
- **Local:** http://localhost:3001
- **Produção:** (após deploy) https://seu-usuario.github.io/landtube-admin/

---

**📝 Nota:** Este painel é completamente isolado do projeto principal, mas usa o mesmo banco de dados. Alterações feitas aqui afetam os dados do projeto principal.
