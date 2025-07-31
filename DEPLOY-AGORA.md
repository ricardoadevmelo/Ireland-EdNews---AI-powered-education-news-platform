# 🚀 GUIA PASSO-A-PASSO PARA DEPLOY

## ✅ **STATUS ATUAL**
- ✅ Build funcionando perfeitamente
- ✅ Todas as APIs testadas e funcionais  
- ✅ Variáveis de ambiente locais configuradas
- ⚠️ Precisa fazer login no Vercel

---

## 🎯 **PRÓXIMOS PASSOS - FAÇA AGORA:**

### **1. 🔐 LOGIN NO VERCEL**
```bash
# Execute este comando:
vercel login

# Escolha uma opção (recomendado GitHub):
# > Continue with GitHub
```

### **2. 🚀 DEPLOY APÓS LOGIN**
```bash
# Depois do login, execute:
vercel --prod

# OU use nosso script:
npm run deploy:vercel
```

### **3. 📝 CONFIGURAR VARIÁVEIS NO VERCEL**
Após o deploy, você receberá uma URL como: `https://ireland-ednews-xxxx.vercel.app`

**Acesse o Dashboard do Vercel:**
1. https://vercel.com/dashboard
2. Clique no seu projeto `ireland-ednews`
3. Vá em **Settings** > **Environment Variables**
4. Adicione estas variáveis:

```env
NEWS_API_KEY = 46d0d7d4de634cc3abd0f37f5a813416
GEMINI_API_KEY = AIzaSyDVB7Y9UfG-3dyWVCo6cKCCqc_ke1uV1vU  
UNSPLASH_ACCESS_KEY = PUlrVgDSq0B7R0MOQOFkUmb0X6NQz1AmaQrgxmxsEa8
NEXT_PUBLIC_BASE_URL = https://sua-url-do-vercel.vercel.app
```

**(Para cada variável: Name + Value + Select "Production, Preview, Development" + Save)**

### **4. 🔄 REDEPLOY COM VARIÁVEIS**
Após adicionar as variáveis:
1. Vá em **Deployments**
2. Clique em **Redeploy** no último deployment
3. Aguarde o rebuild

---

## 🔗 **CONFIGURAÇÃO GITHUB (OPCIONAL MAS RECOMENDADO)**

Se você quiser automação diária, configure os segredos no GitHub:

1. **https://github.com/seu-usuario/ireland-ednews/settings/secrets/actions**
2. **New repository secret** para cada um:
   - `NEWS_API_KEY` = `46d0d7d4de634cc3abd0f37f5a813416`
   - `GEMINI_API_KEY` = `AIzaSyDVB7Y9UfG-3dyWVCo6cKCCqc_ke1uV1vU`

---

## 📱 **CONFIGURAÇÃO SLACK (OPCIONAL)**

Se quiser notificações:
1. https://api.slack.com/apps
2. **Create New App** > **From scratch** 
3. Nome: `Ireland EdNews Bot`
4. **Incoming Webhooks** > **Activate**
5. **Add New Webhook to Workspace**
6. Copie a URL e adicione como `SLACK_WEBHOOK_URL` no GitHub

---

## ✅ **CHECKLIST FINAL**

- [ ] `vercel login` executado
- [ ] `vercel --prod` executado com sucesso
- [ ] Site carregando na URL do Vercel
- [ ] Variáveis configuradas no Vercel Dashboard
- [ ] Redeploy feito após configurar variáveis
- [ ] Site funcionando com APIs ativas
- [ ] (Opcional) Segredos configurados no GitHub
- [ ] (Opcional) Slack configurado
- [ ] (Opcional) Workflow testado manualmente

---

## 🎉 **RESULTADO FINAL**

Quando tudo estiver pronto, você terá:

✅ **Site em produção**: https://seu-projeto.vercel.app  
✅ **RSS Feed**: https://seu-projeto.vercel.app/api/rss  
✅ **Newsletter funcionando** na página inicial  
✅ **Geração automática** de conteúdo (se GitHub configurado)  
✅ **Monitoramento** via Slack (se configurado)  

**🇮🇪 Seu Ireland EdNews estará 100% operacional!**

---

## 🚨 **COMECE AGORA:**

```bash
# 1. Faça login no Vercel
vercel login

# 2. Deploy para produção  
vercel --prod
```

**Depois siga os passos de configuração das variáveis! 🚀**
