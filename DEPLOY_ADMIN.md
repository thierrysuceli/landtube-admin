# 🚀 GUIA RÁPIDO DE DEPLOY - LANDTUBE ADMIN

## 📋 PRÉ-REQUISITOS

✅ Repositório criado no GitHub: `landtube-admin`
✅ Git configurado localmente
✅ Credenciais do GitHub prontas

---

## 🎯 COMANDOS PARA DEPLOY

### **1. Navegar para a pasta do admin:**
```powershell
cd c:\Users\silva\Downloads\landtube-watch-earn-main\landtube-admin
```

### **2. Configurar Git (se ainda não configurou):**
```powershell
git config --global user.name "thierrysuceli"
git config --global user.email "thierrysuceli2@gmail.com"
```

### **3. Inicializar repositório Git:**
```powershell
git init
```

### **4. Adicionar todos os arquivos:**
```powershell
git add .
```

### **5. Fazer o primeiro commit:**
```powershell
git commit -m "Initial commit: LandTube Admin Panel with real-time analytics"
```

### **6. Renomear branch para main:**
```powershell
git branch -M main
```

### **7. Conectar ao repositório remoto:**
```powershell
git remote add origin https://github.com/thierrysuceli/landtube-admin.git
```

### **8. Fazer push:**
```powershell
git push -u origin main
```

---

## ⚙️ ATIVAR GITHUB PAGES

### **1. Acesse as configurações do repositório:**
```
https://github.com/thierrysuceli/landtube-admin/settings/pages
```

### **2. Configure o GitHub Pages:**
- Em **"Source"** selecione: **"GitHub Actions"**
- Clique em **Save** (se houver botão)

### **3. Aguarde o deploy:**
- Vá para: https://github.com/thierrysuceli/landtube-admin/actions
- Aguarde o workflow terminar (~2-3 minutos)
- Procure pelo ícone verde ✅

### **4. Acesse o painel admin:**
```
https://thierrysuceli.github.io/landtube-admin/
```

---

## 🔐 SEGURANÇA IMPORTANTE

### **⚠️ ANTES DE FAZER PUSH:**

Certifique-se de que o arquivo `.env` NÃO será enviado:

```powershell
# Verificar se .env está no .gitignore
type .gitignore | Select-String ".env"
```

Deve aparecer: `.env`

**O arquivo `.env` contém credenciais sensíveis do Supabase e NÃO DEVE ir para o GitHub!**

---

## 📁 ARQUIVOS IMPORTANTES CRIADOS

✅ `.github/workflows/deploy.yml` - GitHub Actions workflow
✅ `public/404.html` - Redirecionamento SPA
✅ `index.html` - Atualizado com script de redirecionamento
✅ `vite.config.ts` - Base path configurado para `/landtube-admin/`
✅ `.gitignore` - Protege arquivos sensíveis

---

## 🎨 O QUE SERÁ DEPLOYADO

✅ Dashboard com 8 gráficos em tempo real
✅ Gerenciamento de usuários (busca, filtros, ações)
✅ Gerenciamento de vídeos (CRUD completo)
✅ Modal de detalhes com 3 abas
✅ Tema dark profissional Netflix
✅ 100% responsivo (mobile + desktop)
✅ Dados reais do Supabase (zero mockups)

---

## 🐛 TROUBLESHOOTING

### **Erro: remote origin already exists**
```powershell
git remote remove origin
git remote add origin https://github.com/thierrysuceli/landtube-admin.git
```

### **Erro: failed to push (rejected)**
```powershell
git push -u origin main --force
```

### **Erro: GitHub Pages não ativa**
- Certifique-se de selecionar "GitHub Actions" como source
- Não use "Deploy from branch"
- O workflow `.github/workflows/deploy.yml` deve existir

### **Deploy falhou no GitHub Actions**
1. Vá para Actions tab
2. Clique no workflow que falhou
3. Veja os logs de erro
4. Geralmente é:
   - Dependências faltando (resolve com `npm ci`)
   - Build error (teste local com `npm run build`)

---

## ✅ CHECKLIST PÓS-DEPLOY

- [ ] Push foi bem-sucedido (sem erros)
- [ ] GitHub Pages está ativado (Source: GitHub Actions)
- [ ] Workflow do Actions terminou com sucesso (ícone verde)
- [ ] Site acessível em: https://thierrysuceli.github.io/landtube-admin/
- [ ] Login funciona (admin@landtube.com)
- [ ] Dashboard carrega com dados reais
- [ ] Gráficos aparecem corretamente
- [ ] Menu lateral funciona
- [ ] Responsivo em mobile

---

## 📞 PRÓXIMOS PASSOS

Após deploy bem-sucedido:

1. **Teste todas as funcionalidades:**
   - Login
   - Dashboard
   - Gerenciamento de usuários
   - Gerenciamento de vídeos

2. **Configure domínio customizado (opcional):**
   - Settings → Pages → Custom domain
   - Adicione: `admin.landtube.com`

3. **Monitore o uso:**
   - GitHub Pages tem limite de 100GB/mês
   - Admin panel é leve, não deve ter problemas

---

## 🎉 RESUMO DO COMANDO ÚNICO

Se você quiser fazer tudo de uma vez (copie e cole):

```powershell
cd c:\Users\silva\Downloads\landtube-watch-earn-main\landtube-admin; git init; git add .; git commit -m "Initial commit: LandTube Admin Panel"; git branch -M main; git remote add origin https://github.com/thierrysuceli/landtube-admin.git; git push -u origin main
```

---

**Pronto! Seu painel administrativo estará no ar!** 🚀

**URL Final:** https://thierrysuceli.github.io/landtube-admin/
