### **🚀 Guia de Deploy (Vercel)**

#### **1\. Preparando o Terreno (GitHub)**

Antes de ir para a Vercel, seu código precisa estar em um repositório no GitHub.

1. No seu terminal, certifique-se de que tudo está commitado:  
   Bash  
   git add .  
2. git commit \-m "feat: portfolio dinamico integrado com supabase"  
3. git push origin main  
1. 

   #### **2\. Importando para a Vercel**

1. Acesse [vercel.com](https://www.google.com/search?q=https://vercel.com/) e faça login com a sua conta do GitHub.  
2. No painel principal, clique no botão preto **"Add New..."** e selecione **"Project"**.  
3. A Vercel vai listar os seus repositórios do GitHub. Encontre o repositório do seu site UNICO e clique em **"Import"**.

   #### **3\. Configurando as Variáveis de Ambiente (CRUCIAL)**

Esta é a parte mais importante. Se você não colocar as chaves do Supabase aqui, seu site vai quebrar em produção, pois não conseguirá puxar os projetos do banco de dados.

Na tela de configuração do projeto na Vercel, antes de clicar em Deploy, abra a seção **"Environment Variables"**. Adicione as variáveis que você usou no seu arquivo `.env.local`:

* **Nome:** `NEXT_PUBLIC_SUPABASE_URL`  
  * **Valor:** `https://[seu-projeto].supabase.co`  
* **Nome:** `NEXT_PUBLIC_SUPABASE_ANON_KEY`  
  * **Valor:** `[sua-chave-anon-publica]`  
* *(Opcional, se você fez rotas de API seguras)* **Nome:** `SUPABASE_SERVICE_ROLE_KEY`  
  * **Valor:** `[sua-chave-secreta-de-admin]` *(Atenção: nunca use o prefixo `NEXT_PUBLIC_` nesta chave)*.

  #### **4\. O Deploy Mágico**

1. Como você está usando React (provavelmente via Vite ou Next.js), a Vercel detecta o framework automaticamente e já preenche os comandos de build (geralmente `npm run build`). Não precisa mexer em nada na seção "Build and Output Settings".  
2. Clique no botão **"Deploy"**.  
3. A Vercel vai construir o seu site. Isso leva cerca de 1 a 2 minutos. Você verá uma tela com confetes quando terminar\! 🎉

   #### **5\. Configurações Finais (Pós-Deploy)**

* **Domínio Customizado:** Vá na aba **"Settings" \> "Domains"** no painel da Vercel. Adicione o seu domínio próprio (ex: `unicoworldwide.com`). A Vercel vai te dar os registros DNS (A ou CNAME) para você configurar lá no site onde comprou o domínio (Registro.br, GoDaddy, Hostinger, etc). O certificado SSL (HTTPS) é gerado automaticamente.  
* **Autorizar o Domínio no Supabase:** Se você implementou o painel de Login (`/admin`), precisa avisar ao Supabase que o seu novo domínio tem permissão para autenticar usuários. Vá no painel do Supabase \> **Authentication** \> **URL Configuration** \> **Site URL** e adicione a URL final do seu site da Vercel (e o seu domínio customizado em "Redirect URLs").  
4. 

