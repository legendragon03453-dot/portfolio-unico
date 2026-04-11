-- Supabase Architecture: UNICO Portfolio

-- Tabela de Projetos
CREATE TABLE public.projects (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    cover_image_url TEXT,
    category TEXT CHECK (category IN ('Sites', 'Identidade Visual', 'Posts', 'Estratégias de Conteúdo', 'Outros')),
    is_featured BOOLEAN DEFAULT false,
    published BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Tabela de Blocos do Projeto (Behance Style Builder)
CREATE TABLE public.project_blocks (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    type TEXT NOT NULL CHECK (type IN ('text', 'image', 'photo_grid', 'video', 'embed', 'prototype', '3d')),
    content TEXT NOT NULL, -- Store URL, iframe code, or raw text depending on block type
    order_index INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Indexing for fast public fetch
CREATE INDEX idx_projects_slug ON public.projects(slug);
CREATE INDEX idx_projects_published ON public.projects(published);
CREATE INDEX idx_project_blocks_project_id ON public.project_blocks(project_id);

-- Optional: RLS (Row Level Security) 
-- Se você quiser garantir que acessos públicos apenas vejam publicados:
-- ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY "Projetos públicos publicados" ON public.projects FOR SELECT USING (published = true);
-- CREATE POLICY "Blocos de projetos públicos" ON public.project_blocks FOR SELECT USING (
--  EXISTS (SELECT 1 FROM public.projects p WHERE p.id = project_blocks.project_id AND p.published = true)
-- );
