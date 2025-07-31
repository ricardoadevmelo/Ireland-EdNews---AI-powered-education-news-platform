# 🚀 DEPLOY VIA GITHUB - AGORA QUE ESTÁ CONECTADO

## ✅ **GITHUB CONECTADO AO VERCEL - PRÓXIMOS PASSOS**

### **OPÇÃO A: CRIAR REPOSITÓRIO NO GITHUB (RECOMENDADO)**

#### **1. Criar Repositório no GitHub:**
1. Acesse: https://github.com/new
2. **Repository name:** `ireland-ednews`
3. **Description:** `🇮🇪 Ireland EdNews - AI-powered education news platform`
4. Marque ✅ **Public** (ou Private se preferir)
5. ❌ **NÃO** marque "Add a README file" (já temos)
6. Clique **Create repository**

#### **2. Conectar Repositório Local ao GitHub:**
```bash
# Adicionar remote
git remote add origin https://github.com/SEU_USUARIO/ireland-ednews.git

# Push do código
git branch -M main
git push -u origin main
```

#### **3. Import no Vercel:**
1. Volte para o Vercel: https://vercel.com/new
2. Na seção **"Importar repositório Git"**
3. Você verá `ireland-ednews` listado
4. Clique **Import**

---

### **OPÇÃO B: UPLOAD DIRETO (MAIS RÁPIDO AGORA)**

#### **1. Na tela do Vercel que você está:**
1. Role para baixo
2. Procure por **"Ou, faça upload de arquivos"**
3. Clique em **Browse** ou arraste a pasta

#### **2. Selecionar Arquivos:**
- Vá para: `C:\Users\User\Documents\Ireland EdNews\ireland-ednews`
- Selecione TODOS os arquivos (Ctrl+A)
- Arraste para o Vercel OU faça ZIP e upload

---

### **🎯 CONFIGURAÇÃO NO VERCEL:**

#### **Environment Variables (OBRIGATÓRIO):**
```env
NEWS_API_KEY = 46d0d7d4de634cc3abd0f37f5a813416
GEMINI_API_KEY = AIzaSyDVB7Y9UfG-3dyWVCo6cKCCqc_ke1uV1vU
UNSPLASH_ACCESS_KEY = PUlrVgDSq0B7R0MOQOFkUmb0X6NQz1AmaQrgxmxsEa8
NEXT_PUBLIC_BASE_URL = https://ireland-ednews.vercel.app
```

#### **Build Settings:**
```bash
Framework: Next.js (auto-detectado)
Build Command: npm run build
Output Directory: .next
Install Command: npm install
Root Directory: ./
```

---

### **📋 QUAL OPÇÃO ESCOLHER?**

#### **🚀 OPÇÃO A (GitHub)** - SE VOCÊ QUER:
- ✅ Deploy automático a cada mudança
- ✅ Controle de versão completo
- ✅ Colaboração em equipe
- ✅ GitHub Actions funcionando

#### **⚡ OPÇÃO B (Upload)** - SE VOCÊ QUER:
- ✅ Deploy imediato (5 minutos)
- ✅ Sem configuração extra
- ✅ Testar rapidamente

---

### **🎯 RECOMENDAÇÃO:**

**FAÇA A OPÇÃO B AGORA** para ver o site funcionando, e depois você pode conectar o GitHub para deploys automáticos.

**Próximo passo:** Role para baixo na tela do Vercel e procure a opção de upload de arquivos! 📁⬆️
