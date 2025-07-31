# 🚀 Guia Completo de Deploy - Ireland EdNews

Este guia te levará passo a passo através do processo completo de deploy e configuração do Ireland EdNews.

## 📋 Pré-requisitos

- ✅ Conta no GitHub
- ✅ Conta no Vercel
- ✅ Chaves de API (NewsAPI, Gemini)
- ✅ Workspace do Slack (opcional)

## 🏁 Passo 1: Deploy no Vercel

### 1.1 Instalar Vercel CLI (se necessário)
```bash
npm install -g vercel
```

### 1.2 Deploy Automático
```bash
# Execute o script de deploy
npm run deploy:vercel

# OU manualmente:
vercel --prod
```

### 1.3 Configurar Variáveis de Ambiente no Vercel
1. Acesse [vercel.com](https://vercel.com)
2. Vá para seu projeto > Settings > Environment Variables
3. Adicione as seguintes variáveis:

| Nome | Valor | Ambiente |
|------|-------|----------|
| `NEWS_API_KEY` | sua_chave_newsapi | Production, Preview, Development |
| `GEMINI_API_KEY` | sua_chave_gemini | Production, Preview, Development |
| `UNSPLASH_ACCESS_KEY` | sua_chave_unsplash | Production, Preview, Development |
| `NEXT_PUBLIC_BASE_URL` | https://seu-projeto.vercel.app | Production |

## 🔐 Passo 2: Configurar Segredos do GitHub

### 2.1 Acessar Configurações do Repositório
1. Vá para seu repositório no GitHub
2. Clique em **Settings** > **Secrets and variables** > **Actions**

### 2.2 Adicionar Segredos Obrigatórios
```
NEWS_API_KEY=sua_chave_newsapi_aqui
GEMINI_API_KEY=sua_chave_gemini_aqui
```

### 2.3 Adicionar Segredos Opcionais
```
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/...
UNSPLASH_ACCESS_KEY=sua_chave_unsplash
```

## 📱 Passo 3: Configurar Slack (Opcional)

### 3.1 Criar Webhook no Slack
1. Acesse [api.slack.com/apps](https://api.slack.com/apps)
2. Clique em **Create New App** > **From scratch**
3. Nomeie como "Ireland EdNews Bot"
4. Selecione seu workspace

### 3.2 Configurar Incoming Webhooks
1. No app criado, vá para **Incoming Webhooks**
2. Ative **Activate Incoming Webhooks**
3. Clique em **Add New Webhook to Workspace**
4. Selecione o canal (ex: `#ireland-ednews`)
5. Copie a **Webhook URL**

### 3.3 Adicionar URL no GitHub
- Nome do segredo: `SLACK_WEBHOOK_URL`
- Valor: a URL copiada do Slack

## 🔔 Passo 4: Testar o Sistema

### 4.1 Teste Manual do Workflow
1. Vá para **Actions** no seu repositório GitHub
2. Selecione **Daily Content Generation**
3. Clique em **Run workflow**
4. Aguarde a conclusão

### 4.2 Verificar Notificações
- ✅ Verificar se chegou notificação no Slack
- ✅ Verificar se o site está funcionando
- ✅ Verificar se novos artigos foram gerados

### 4.3 Testar APIs
```bash
# Testar API de conteúdo
curl https://seu-projeto.vercel.app/api/content

# Testar RSS Feed
curl https://seu-projeto.vercel.app/api/rss

# Testar Newsletter
curl -X POST https://seu-projeto.vercel.app/api/newsletter \
  -H "Content-Type: application/json" \
  -d '{"email":"teste@exemplo.com","name":"Teste"}'
```

## 📊 Passo 5: Monitoramento

### 5.1 Configurar Alertas
O sistema enviará notificações automáticas para:
- ✅ **Sucesso**: Quando novos artigos são gerados
- ⚠️ **Aviso**: Quando nenhum conteúdo novo é encontrado
- ❌ **Erro**: Quando há falhas no processo

### 5.2 Verificar Logs
- **Vercel**: Functions > Ver logs de execução
- **GitHub**: Actions > Ver logs detalhados
- **Slack**: Verificar mensagens no canal

### 5.3 Health Check Manual
```bash
# Executar verificação de saúde
npm run health:check
```

## 🔄 Passo 6: Automação Diária

### 6.1 Cronograma
- **Horário**: 7:00 AM UTC (8:00 AM Irish Time)
- **Frequência**: Diária
- **Trigger**: Automático via GitHub Actions

### 6.2 O que Acontece Automaticamente
1. 🔍 Busca notícias na NewsAPI
2. 🤖 Processa com IA (Gemini)
3. 📝 Gera arquivos MDX
4. 💾 Commit no repositório
5. 🚀 Deploy automático no Vercel
6. 📱 Notificação no Slack

## 📈 Passo 7: Recursos Adicionais

### 7.1 RSS Feed
- **URL**: `https://seu-projeto.vercel.app/api/rss`
- **Uso**: Adicionar ao seu leitor de RSS favorito

### 7.2 Newsletter
- **Inscrição**: Componente na página inicial
- **Dados**: Armazenados em `data/subscribers.json`
- **API**: `/api/newsletter` (POST para inscrever, GET para stats)

### 7.3 Categorias de Conteúdo
1. 🛠️ Platforms & Learning Tools
2. 🎓 Courses & Certifications
3. 🚀 Trends & Innovations
4. 🌍 International Students Support
5. 📚 Professional Development
6. 👶 K-12 Online Education
7. 🔧 Teaching Technologies
8. 📰 Sector News & Updates
9. 🧠 Online Learning Psychology
10. 🇮🇪 Ireland Education

## 🛠️ Solução de Problemas

### ❌ Erro: "API Key inválida"
**Solução**: Verificar se as chaves estão corretas nos segredos do GitHub/Vercel

### ❌ Erro: "Nenhum conteúdo gerado"
**Possíveis causas**:
- Limite da API atingido
- Sem notícias relevantes no dia
- Filtros muito restritivos

### ❌ Erro: "Deploy falhou"
**Solução**: Verificar logs no Vercel e corrigir erros de build

### ❌ Notificações não chegam no Slack
**Solução**: Verificar se `SLACK_WEBHOOK_URL` está configurado corretamente

## 📞 Suporte

- 📧 **Issues**: [GitHub Issues](https://github.com/seu-usuario/ireland-ednews/issues)
- 📱 **Slack**: Canal #ireland-ednews
- 📖 **Documentação**: README.md do projeto

---

## ✅ Checklist Final

- [ ] ✅ Deploy no Vercel concluído
- [ ] 🔐 Segredos configurados no GitHub
- [ ] 📱 Slack configurado e testado
- [ ] 🔄 Workflow testado manualmente
- [ ] 📊 Monitoramento funcionando
- [ ] 📈 RSS Feed acessível
- [ ] 📧 Newsletter funcionando
- [ ] 🎉 **Sistema 100% operacional!**

🇮🇪 **Parabéns! Seu Ireland EdNews está agora completamente automatizado e rodando em produção!**
