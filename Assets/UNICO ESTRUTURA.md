\# 🚀 Guia de Integração: Portfólio Dinâmico (React \+ Supabase)

Este documento detalha o passo a passo para transformar a seção estática de portfólio em um sistema dinâmico (CMS próprio), inspirado no Behance, com um painel administrativo integrado e páginas dedicadas.

\#\# Passo 1: Configuração do Backend (Supabase)  
O primeiro passo é preparar o terreno para receber e armazenar os dados dos seus projetos.  
\*   \*\*Criar o Projeto:\*\* Iniciar um novo projeto no Supabase.  
\*   \*\*Configurar o Storage:\*\* Criar buckets no Supabase Storage para armazenar as mídias pesadas (capas, vídeos em alta, galerias de imagens).  
\*   \*\*Variáveis de Ambiente:\*\* Adicionar a URL do Supabase e as chaves de API seguras (\`anon key\` e \`service\_role key\` para o admin) no arquivo \`.env\` do projeto frontend.

\#\# Passo 2: Estruturação do Front-End e Rotas  
A arquitetura precisará de novas rotas para separar a visualização do painel de controle.  
\*   \*\*Página Principal (\`/\`):\*\* Atualizar a seção \`\#portfolio\` para fazer um "fetch" dos 4 ou 5 projetos mais recentes no banco de dados, em vez de ler o array estático.  
\*   \*\*Página Dedicada (\`/work\` ou \`/portfolio\`):\*\* Criar uma página isolada contendo o grid completo de projetos, utilizando a estrutura HTML/Framer base para manter o design refinado.  
\*   \*\*Páginas Dinâmicas (\`/work/\[slug\]\`):\*\* Configurar o roteamento dinâmico para que, ao clicar em um projeto, o sistema carregue uma página detalhada contendo o título, categorias, mídias (Behance-style) e textos.

\#\# Passo 3: Criação do Painel Administrativo (\`/admin\`)  
Esta será a sua área de trabalho para gerenciar o conteúdo.  
\*   \*\*Autenticação:\*\* Implementar login (Email/Senha ou Magic Link) com Supabase Auth para garantir que apenas usuários autorizados acessem o painel.  
\*   \*\*Dashboard de Listagem:\*\* Uma tabela ou grid simples listando os projetos existentes com opções de Editar, Excluir ou Publicar/Rascunho.  
\*   \*\*Editor de Projetos (Novo/Editar):\*\* Construir o formulário de publicação:  
    \*   Campos de texto para Título, Slug (URL) e Resumo.  
    \*   Seleção de Tags/Categorias (ex: Brand Identity, Motion & 3D).  
    \*   Upload de Mídia Principal (Thumbnail/Vídeo de capa).  
    \*   \*Rich Text Editor\* ou um construtor de blocos flexível para o corpo do projeto (permitindo intercalar imagens de alta qualidade, parágrafos e embeds de vídeo).

\#\# Passo 4: Integração Front e Back (CRUD)  
Conectar os botões e formulários do painel admin ao banco de dados.  
\*   \*\*Create:\*\* Função para enviar os dados do formulário e fazer upload das mídias para o Supabase.  
\*   \*\*Read:\*\* Funções para buscar os projetos e exibi-los no site e no painel admin.  
\*   \*\*Update:\*\* Função para editar projetos existentes.  
\*   \*\*Delete:\*\* Função para remover projetos e excluir os arquivos de mídia associados do Storage.

\#\# Passo 5: Preparação para Produção  
Revisão final antes de subir para a Vercel.  
\*   \*\*Otimização de Mídia:\*\* Garantir que as imagens e vídeos servidos pelo Supabase estejam otimizados para não prejudicar o tempo de carregamento.  
\*   \*\*Proteção de Rotas:\*\* Confirmar que as rotas \`/admin\` estão protegidas por \*middleware\*, redirecionando usuários não autenticados para a home.  
