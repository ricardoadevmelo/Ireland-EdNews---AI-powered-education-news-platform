# Teste do Modo Manutenção

## Para testar localmente:

1. **Ativar modo manutenção:**
   ```bash
   set NEXT_PUBLIC_MAINTENANCE_MODE=true
   npm run dev
   ```

2. **Desativar modo manutenção:**
   ```bash
   set NEXT_PUBLIC_MAINTENANCE_MODE=false
   npm run dev
   ```

## Para testar em produção (Vercel):

1. **Ativar modo manutenção:**
   - Vá para Settings → Environment Variables
   - Adicione: `NEXT_PUBLIC_MAINTENANCE_MODE` = `true`
   - Redeploy

2. **Desativar modo manutenção:**
   - Mude a variável para `false` ou delete
   - Redeploy

## Estado atual:
- ✅ Código do modo manutenção implementado
- ✅ Página de manutenção criada (maintenance.tsx)
- ✅ Lógica condicional na page.tsx
- 🔄 Pronto para teste no Vercel

## Como testar no Vercel:
1. Adicione a variável de ambiente
2. Force um redeploy
3. Acesse https://ireland-ednews-ricardo.vercel.app
4. Deve mostrar a página de manutenção azul/roxa
