# 🔐 Configuração de Segredos do GitHub

Este guia te ajudará a configurar os segredos necessários para o workflow do GitHub Actions.

## 📋 Segredos Necessários

Você precisa configurar os seguintes segredos no seu repositório GitHub:

### 1. **NEWS_API_KEY**
- **Descrição**: Chave da API do NewsAPI para buscar notícias
- **Como obter**: 
  1. Acesse [newsapi.org](https://newsapi.org)
  2. Crie uma conta gratuita
  3. Copie sua API key do dashboard

### 2. **GEMINI_API_KEY**
- **Descrição**: Chave da API do Google Gemini para resumos com IA
- **Como obter**:
  1. Acesse [Google AI Studio](https://makersuite.google.com)
  2. Faça login com sua conta Google
  3. Crie uma nova API key
  4. Copie a chave gerada

### 3. **SLACK_WEBHOOK_URL** (Opcional)
- **Descrição**: URL do webhook para notificações no Slack
- **Como obter**:
  1. Acesse seu workspace do Slack
  2. Vá para Apps > Incoming Webhooks
  3. Crie um novo webhook
  4. Copie a URL gerada

## 🛠️ Como Configurar os Segredos

### Passo 1: Acesse as Configurações do Repositório
1. Vá para o seu repositório no GitHub
2. Clique em **Settings** (Configurações)
3. No menu lateral, clique em **Secrets and variables** > **Actions**

### Passo 2: Adicione os Segredos
Para cada segredo:

1. Clique em **New repository secret**
2. Digite o nome do segredo exatamente como listado acima
3. Cole o valor correspondente
4. Clique em **Add secret**

## ✅ Verificação

Após configurar todos os segredos, você deve ver:

- ✅ **NEWS_API_KEY**
- ✅ **GEMINI_API_KEY**  
- ✅ **SLACK_WEBHOOK_URL** (se configurado)

## 🔄 Testando o Workflow

Após configurar os segredos:

1. Faça um commit no repositório
2. Vá para a aba **Actions** no GitHub
3. Verifique se o workflow **Daily Content Generation** está funcionando
4. Se houver erros, verifique os logs e as configurações dos segredos

## 🚨 Dicas de Segurança

- ⚠️ **Nunca** compartilhe suas chaves de API
- 🔄 Rotacione as chaves periodicamente
- 📝 Use nomes descritivos para os segredos
- 🔍 Monitore o uso das APIs para detectar atividades suspeitas

## 📞 Suporte

Se você encontrar problemas:
1. Verifique se os nomes dos segredos estão corretos
2. Confirme se as chaves são válidas
3. Consulte os logs do GitHub Actions
4. Entre em contato através das issues do repositório
