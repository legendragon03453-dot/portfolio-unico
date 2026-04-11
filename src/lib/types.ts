export type ProjectCategory = 'Sites' | 'Identidade Visual' | 'Posts' | 'Estratégias de Conteúdo' | 'Outros';

export interface Project {
  id: string;
  title: string;
  slug: string;
  cover_image_url: string;
  category: ProjectCategory;
  is_featured: boolean;
  published: boolean;
  created_at: string;
}

export type BlockType = 'text' | 'image' | 'photo_grid' | 'video' | 'embed' | 'prototype' | '3d' | 'title_text' | 'link' | 'text_over_image';

export interface ProjectBlock {
  id: string;
  project_id: string;
  type: BlockType;
  content: string; // JSON string for photo_grid, embedded URLs, etc.
  order_index: number;
  created_at?: string;
}
