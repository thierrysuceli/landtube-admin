# 🔐 ADICIONAR SECRETS DO SUPABASE NO GITHUB

## ⚠️ PROBLEMA IDENTIFICADO

O deploy está falhando porque o arquivo `.env` não vai para o GitHub (está no `.gitignore` por segurança).

O erro mostra:
```
your-project.supabase.co/auth/v1/token
```

Isso significa que o build está usando valores placeholder ao invés das credenciais reais do Supabase!

---

## ✅ SOLUÇÃO: GitHub Secrets

Você precisa adicionar as credenciais do Supabase como **secrets** no repositório do GitHub.

---

## 📋 PASSO A PASSO

### **1. Acesse as configurações de Secrets:**

```
https://github.com/thierrysuceli/landtube-admin/settings/secrets/actions
```

Ou manualmente:
1. Vá para: https://github.com/thierrysuceli/landtube-admin
2. Clique em **Settings** (Configurações)
3. No menu lateral, clique em **Secrets and variables** → **Actions**

---

### **2. Adicionar o primeiro secret: VITE_SUPABASE_URL**

1. Clique no botão **"New repository secret"**
2. **Name:** `VITE_SUPABASE_URL`
3. **Secret:** `https://lhosnclxjhbxjbnbktny.supabase.co`
4. Clique em **"Add secret"**

---

### **3. Adicionar o segundo secret: VITE_SUPABASE_ANON_KEY**

1. Clique novamente em **"New repository secret"**
2. **Name:** `VITE_SUPABASE_ANON_KEY`
3. **Secret:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxob3NuY2x4amhieGpibmJrdG55Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA0NDAzNjYsImV4cCI6MjA3NjAxNjM2Nn0.CpyuU5jpUscU4EQQ1CNWFTaZqc03OjSBrKrpkk7Lj8Y`
4. Clique em **"Add secret"**

---

## 🎯 VALORES EXATOS DOS SECRETS

### **Secret 1:**
- **Name:** `VITE_SUPABASE_URL`
- **Value:** 
```
https://lhosnclxjhbxjbnbktny.supabase.co
```

### **Secret 2:**
- **Name:** `VITE_SUPABASE_ANON_KEY`
- **Value:**
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxob3NuY2x4amhieGpibmJrdG55Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA0NDAzNjYsImV4cCI6MjA3NjAxNjM2Nn0.CpyuU5jpUscU4EQQ1CNWFTaZqc03OjSBrKrpkk7Lj8Y
```

---

## 🔄 DEPOIS DE ADICIONAR OS SECRETS

### **Opção 1: Aguardar próximo commit (Recomendado)**

O próximo push vai disparar automaticamente o workflow com os secrets.

### **Opção 2: Rodar manualmente agora**

1. Vá para: https://github.com/thierrysuceli/landtube-admin/actions
2. Clique em **"Deploy to GitHub Pages"** (workflow mais recente)
3. Clique em **"Re-run jobs"** → **"Re-run all jobs"**
4. Aguarde 2-3 minutos

---

## ✅ COMO VERIFICAR SE DEU CERTO

Depois que o workflow terminar com sucesso (ícone verde ✅):

1. Acesse: https://thierrysuceli.github.io/landtube-admin/
2. Você deve ver a **tela de login** (não mais tela preta)
3. Console do navegador **NÃO deve** mostrar erro `your-project.supabase.co`
4. Login deve funcionar com: `admin@landtube.com` / `admin123`

---

## 🐛 TROUBLESHOOTING

### **Erro: Secret não encontrado**

Se o workflow falhar dizendo que o secret não existe:
- Verifique se o **nome está exatamente** como mostrado acima (case-sensitive)
- `VITE_SUPABASE_URL` (não `vite_supabase_url`)
- `VITE_SUPABASE_ANON_KEY` (não `VITE_SUPABASE_KEY`)

### **Ainda aparece "your-project.supabase.co"**

Significa que os secrets não foram aplicados no build:
1. Limpe o cache do navegador (Ctrl + Shift + Delete)
2. Force um novo deploy (push um commit vazio ou re-run workflow)
3. Aguarde o novo build terminar
4. Acesse novamente

### **Erro de CORS ou "Failed to fetch"**

Se os secrets estiverem corretos mas ainda falhar:
- Verifique se o projeto Supabase está ativo
- Confirme se a URL está acessível: https://lhosnclxjhbxjbnbktny.supabase.co
- Teste no projeto principal primeiro (landtube-watch-earn)

---

## 📝 RESUMO DOS SECRETS ADICIONADOS

Depois de adicionar, você terá 2 secrets:

| Nome | Descrição |
|------|-----------|
| `VITE_SUPABASE_URL` | URL do projeto Supabase |
| `VITE_SUPABASE_ANON_KEY` | Chave anônima (pública) do Supabase |

Esses secrets são **seguros** e ficam criptografados no GitHub. O workflow usa eles apenas durante o build.

---

## 🎯 PRÓXIMA AÇÃO

**AGORA FAÇA:**

1. Acesse: https://github.com/thierrysuceli/landtube-admin/settings/secrets/actions
2. Adicione os 2 secrets conforme instruído acima
3. Re-rode o workflow: https://github.com/thierrysuceli/landtube-admin/actions
4. Aguarde o deploy terminar
5. Teste: https://thierrysuceli.github.io/landtube-admin/

---

**Após adicionar os secrets, me avisa que eu te ajudo a verificar se funcionou!** 🚀
