import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import type { Project, ProjectCategory } from '../lib/types';
import { motion } from 'framer-motion';

const CATEGORY_ORDER: ProjectCategory[] = [ // used as literal matches
  'Sites', 
  'Identidade Visual', 
  'Posts', 
  'Estratégias de Conteúdo', 
  'Outros'
];

export default function PortfolioGrid() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProjects() {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('published', true)
        .order('created_at', { ascending: false });
      
      if (!error && data) {
        setProjects(data as Project[]);
      }
      setLoading(false);
    }
    fetchProjects();
  }, []);

  if (loading) {
    return <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center text-white font-sans text-xs tracking-widest uppercase">Carregando Obras...</div>;
  }

  const featured = projects.filter(p => p.is_featured);
  const byCategory = (cat: ProjectCategory) => projects.filter(p => p.category === cat && !p.is_featured);

  const blurFadeIn = {
    initial: { opacity: 0, y: 15, filter: 'blur(5px)' },
    whileInView: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.8 } },
    viewport: { once: true, margin: "-10%" }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white pt-24 pb-32 px-4 sm:px-10 font-sans">
      <div className="w-full flex flex-col items-center justify-center text-center mb-24 max-w-7xl mx-auto relative pt-10">
        <a href="/" className="absolute left-0 top-1/2 -translate-y-1/2 text-[10px] md:text-xs tracking-widest uppercase hover:text-white/60 transition-colors hidden md:block">← Voltar para a Home</a>
        <h1 className="text-5xl md:text-7xl font-bold tracking-widest uppercase" style={{ fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}>Portfólio</h1>
        <p className="text-[10px] md:text-sm tracking-widest text-[#A3A3A3] uppercase mt-4">Alguns dos nossos projetos</p>
        <a href="/" className="text-[10px] tracking-widest uppercase text-white/50 hover:text-white transition-colors mt-8 md:hidden">← Voltar para a Home</a>
      </div>

      <div className="w-full max-w-7xl mx-auto flex flex-col gap-24">
        {/* Featured Section */}
        {featured.length > 0 && (
          <section>
            <div className="mb-10 w-full flex flex-col items-start">
              <h2 className="text-xl md:text-3xl font-light tracking-[0.2em] uppercase text-white">Destaques</h2>
              <div className="w-full h-[1px] bg-white/20 mt-6"></div>
            </div>
            <div className="grid grid-cols-1 gap-10">
              {featured.map(p => (
                <ProjectCard key={p.id} project={p} featured={true} />
              ))}
            </div>
          </section>
        )}

        {/* Regular Sections */}
        {CATEGORY_ORDER.map(cat => {
          const list = byCategory(cat);
          if (list.length === 0) return null;
          
          return (
            <motion.section key={cat} variants={blurFadeIn} initial="initial" whileInView="whileInView">
              <div className="mb-10 w-full flex flex-col items-start">
                <h2 className="text-lg md:text-2xl font-light tracking-[0.2em] uppercase text-white/80">{cat}</h2>
                <div className="w-full h-[1px] bg-white/10 mt-6"></div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {list.map(p => (
                  <ProjectCard key={p.id} project={p} />
                ))}
              </div>
            </motion.section>
          )
        })}
      </div>
    </div>
  );
}

function ProjectCard({ project, featured = false }: { project: Project, featured?: boolean }) {
  return (
    <a 
      href={`/portfolio/${project.slug}`} 
      className={`relative group overflow-hidden block bg-[#141414] ${featured ? 'aspect-video md:aspect-[21/9]' : 'aspect-square md:aspect-[4/3]'}`}
    >
      {/* Imagem Cover sem bordas e pura, cobrindo o bloco */}
      {project.cover_image_url ? (
        <img 
          src={project.cover_image_url} 
          alt={project.title} 
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]" 
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center text-white/20 tracking-widest uppercase text-xs">Sem Imagem</div>
      )}
      
      {/* Overlay Escuro Minimalista */}
      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10 flex flex-col justify-end p-6 md:p-10">
        <h3 className="text-xl md:text-3xl font-bold uppercase tracking-widest text-white translate-y-4 group-hover:translate-y-0 transition-transform duration-500" style={{ fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}>
          {project.title}
        </h3>
        <p className="text-xs tracking-widest text-[#A3A3A3] mt-2 translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-75 uppercase">
          {project.category}
        </p>
      </div>
    </a>
  );
}
