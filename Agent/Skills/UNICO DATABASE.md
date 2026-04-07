.

### **🗺️ Arquitetura e Fluxo do Site (Workflow)**

A estrutura do site será dividida em duas grandes áreas: o **Lado do Cliente (Público)**, onde seus visitantes navegam, e o **Lado do Servidor (Admin)**, onde você gerencia o conteúdo.

---

#### **1\. Área Pública (Front-End)**

Onde a mágica acontece para os seus clientes. O foco aqui é performance, animações fluidas (Framer Motion) e carregamento rápido do banco de dados.

* **`/` (Home / Landing Page)**  
  * **Hero Section:** A dobra principal com vídeo de fundo e o texto "Seja Único".  
  * **Trabalhos em Destaque:** Agora *dinâmico*. Busca no Supabase apenas os projetos marcados como "Destaque" ou os 4 mais recentes.  
  * **Órbita 3D & Serviços:** Onde fica a sua apresentação de serviços (Identity, Web Dev, Social Strategy).  
  * **Bio & Footer:** Sua apresentação e chamadas para ação (Orçamento).  
* **`/work` (Galeria de Portfólio Geral)**  
  * Esta é a página dedicada que você mencionou.  
  * Contém a estrutura HTML do Framer (`Featured Work` / `All-Access Pass`).  
  * Exibe um Grid completo com *todos* os seus projetos publicados, puxados diretamente do Supabase.  
  * Filtros opcionais (ex: clicar em "Motion & 3D" e ver apenas esses projetos).  
* **`/work/[slug]` (Página do Projeto \- Estilo Behance)**  
  * **Rota Dinâmica:** A URL muda de acordo com o projeto (ex: `/work/kastle-ai`).  
  * **Cabeçalho:** Título principal, tags do projeto e breve descrição.  
  * **Corpo da Página (Canvas):** Onde o conteúdo criado no painel admin é renderizado. Imagens em tela cheia, textos intercalados explicando o processo de design (Brand Identity, Web Design), vídeos incorporados e tipografia refinada.

---

#### **2\. Área Administrativa (Back-Office)**

O seu estúdio de criação privado. Totalmente protegido por autenticação.

* **`/admin/login` (Autenticação)**  
  * Tela limpa e segura conectada ao Supabase Auth. Acesso restrito via seu e-mail e senha.  
* **`/admin` (Dashboard Principal)**  
  * Visão geral: Número total de projetos publicados, atalhos rápidos para "Criar Novo Projeto".  
* **`/admin/projects` (Gerenciador de Portfólio)**  
  * Tabela listando todos os projetos.  
  * Colunas: Capa, Título, Data de Publicação, Status (Rascunho/Publicado).  
  * Ações: Editar, Excluir, Ver na página pública.  
* **`/admin/projects/new` (O Editor / "Construtor Behance")**  
  * A interface onde você monta o case.  
  * **Configurações Básicas:** Nome do projeto, Slug (gerado automaticamente), Tags (selecionáveis).  
  * **Mídia de Capa:** Upload do vídeo ou imagem que vai aparecer no Grid da Home e do `/work`.  
  * **Editor de Blocos (Conteúdo):** Uma área onde você pode ir adicionando blocos (Ex: Adicionar Imagem Larga, Adicionar Texto, Adicionar Embed de Vídeo) para construir a narrativa visual do projeto de cima a baixo.

---

#### **3\. Fluxo de Dados (Como as engrenagens rodam)**

1. **Você (Admin) cria um projeto:** Você faz login no `/admin`, faz o upload das imagens de alta qualidade da identidade visual e escreve os textos.  
2. **Supabase age:** As imagens vão para o *Supabase Storage* e os textos/links vão para o *Supabase Database*.  
3. **Vercel / React renderiza:** Um visitante entra no site. A página `/work` bate no banco de dados, pega as informações e monta os cards do Framer automaticamente. Se você atualizar uma capa no painel, ela muda na hora no site ao vivo.

