import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import type { Project, ProjectBlock } from '../lib/types';
import { motion } from 'framer-motion';

export default function PortfolioDetail() {
  const { slug } = useParams();
  const [project, setProject] = useState<Project | null>(null);
  const [blocks, setBlocks] = useState<ProjectBlock[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      if (!slug) return;
      
      const { data: projData } = await supabase
        .from('projects')
        .select('*')
        .eq('slug', slug)
        .single();
      
      if (projData) {
        setProject(projData as Project);
        
        const { data: blocksData } = await supabase
          .from('project_blocks')
          .select('*')
          .eq('project_id', projData.id)
          .order('order_index', { ascending: true });
          
        if (blocksData) {
          setBlocks(blocksData as ProjectBlock[]);
        }
      }
      setLoading(false);
    }
    fetchData();
  }, [slug]);

  if (loading) {
    return <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center text-white font-sans text-xs tracking-widest uppercase">Carregando Projeto...</div>;
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex flex-col items-center justify-center text-white font-sans gap-4">
        <h1 className="text-2xl font-bold uppercase tracking-widest">Projeto não encontrado</h1>
        <a href="/portfolio" className="text-xs uppercase tracking-widest border border-white/20 p-2 hover:bg-white hover:text-black transition-colors rounded-full px-6">Voltar</a>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white font-sans">
      <div className="w-full h-[60vh] md:h-[80vh] relative">
        {project.cover_image_url && (
          <img src={project.cover_image_url} alt={project.title} className="w-full h-full object-cover" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-black/40 to-transparent flex flex-col justify-end p-6 md:p-16">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-6xl lg:text-8xl font-bold uppercase tracking-wide leading-none" 
            style={{ fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}
          >
            {project.title}
          </motion.h1>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="mt-6 flex flex-wrap gap-4"
          >
            <span className="text-xs uppercase tracking-widest text-[#A3A3A3] bg-[#141414] px-4 py-2 border border-white/10">{project.category}</span>
            <a href="/portfolio" className="text-xs uppercase tracking-widest text-white border border-white/20 px-4 py-2 hover:bg-white hover:text-black transition-colors">Voltar</a>
          </motion.div>
        </div>
      </div>

      <div className="w-[85%] max-w-[1400px] mx-auto py-16 md:py-20 flex flex-col gap-12 md:gap-20">
        {blocks.map((block) => (
          <BlockRenderer key={block.id} block={block} />
        ))}
      </div>

      <footer className="w-full border-t border-white/10 mt-20 pt-20 pb-10 flex flex-col items-center justify-center gap-12 overflow-hidden">
        <div className="flex gap-6 md:gap-16 items-center">
          <a href="/portfolio" className="text-[10px] md:text-xs tracking-widest uppercase hover:text-white/60 transition-colors">Voltar aos Portfólios</a>
          <span className="text-white/30">/</span>
          <a href="/#orcamento" className="text-[10px] md:text-xs tracking-widest uppercase hover:text-white/60 transition-colors">Fazer orçamento</a>
        </div>
        <h2 className="text-6xl md:text-8xl lg:text-[15rem] leading-none font-bold uppercase tracking-wider text-white/5 select-none" style={{ fontFamily: "'Hypik', sans-serif" }}>
          &nbsp;UNICO&nbsp;
        </h2>
      </footer>
    </div>
  );
}

export function BlockRenderer({ block }: { block: ProjectBlock }) {
  const blurFadeIn = {
    initial: { opacity: 0, y: 20, filter: 'blur(5px)' },
    whileInView: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.8 } },
    viewport: { once: true, margin: "-10%" }
  };

  switch (block.type) {
    case 'text':
      return (
        <motion.div variants={blurFadeIn} initial="initial" whileInView="whileInView" className="max-w-4xl mx-auto w-full">
          {/* Support very basic multiline text rendering */}
          {block.content.split('\n').map((line, i) => (
            <p key={i} className="text-base md:text-lg text-[#A3A3A3] font-light leading-relaxed mb-4">
              {line}
            </p>
          ))}
        </motion.div>
      );
    case 'image':
      return (
        <motion.div variants={blurFadeIn} initial="initial" whileInView="whileInView" className="w-full">
          <img src={block.content} alt="Project Block" className="w-full object-cover bg-[#141414]" />
        </motion.div>
      );
    case 'title_text':
      try {
        const data = JSON.parse(block.content);
        return (
          <motion.div variants={blurFadeIn} initial="initial" whileInView="whileInView" className="w-full flex flex-col gap-6 md:gap-8 max-w-4xl">
            {data.title && <h2 className="text-2xl md:text-5xl font-bold uppercase tracking-widest" style={{ fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}>{data.title}</h2>}
            {data.paragraph && data.paragraph.split('\n').map((line: string, i: number) => (
              <p key={i} className="text-base md:text-lg text-[#A3A3A3] font-light leading-relaxed">{line}</p>
            ))}
          </motion.div>
        );
      } catch { return null; }
    case 'link':
      try {
        const data = JSON.parse(block.content);
        return (
          <motion.div variants={blurFadeIn} initial="initial" whileInView="whileInView" className="w-full flex justify-start my-4">
            <a href={data.url} target="_blank" rel="noopener noreferrer" className="border border-white/20 px-8 py-4 text-xs tracking-widest uppercase hover:bg-white hover:text-black transition-colors">
              {data.text || 'Acessar Link'}
            </a>
          </motion.div>
        );
      } catch { return null; }
    case 'text_over_image':
      try {
        const data = JSON.parse(block.content);
        return (
          <motion.div variants={blurFadeIn} initial="initial" whileInView="whileInView" className="w-full relative aspect-video md:aspect-[21/9] flex items-center justify-center p-8 overflow-hidden group">
            {data.url ? (
               <img src={data.url} alt="Background" className="absolute inset-0 w-full h-full object-cover z-0 transition-transform duration-1000 group-hover:scale-105" />
            ) : (
               <div className="absolute inset-0 bg-[#141414] z-0" />
            )}
            <div className="absolute inset-0 bg-black/60 z-10 pointer-events-none" />
            <div className="relative z-20 flex flex-col items-center justify-center text-center max-w-3xl gap-6">
              {data.title && <h2 className="text-3xl md:text-6xl font-bold uppercase tracking-widest drop-shadow-lg" style={{ fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}>{data.title}</h2>}
              {data.paragraph && <p className="text-sm md:text-base text-white/80 font-light leading-relaxed drop-shadow-md">{data.paragraph}</p>}
            </div>
          </motion.div>
        );
      } catch { return null; }
    case 'photo_grid':
      try {
        const urls = JSON.parse(block.content);
        return (
          <motion.div variants={blurFadeIn} initial="initial" whileInView="whileInView" className="w-full columns-1 md:columns-2 gap-4 md:gap-8 space-y-4 md:space-y-8">
            {urls.map((url: string, i: number) => (
              <div key={i} className="w-full h-auto break-inside-avoid bg-[#141414]">
                <img src={url} alt={`Grid item ${i}`} className="w-full h-auto block object-cover" />
              </div>
            ))}
          </motion.div>
        );
      } catch {
        return null;
      }
    case 'video':
    case 'prototype':
    case '3d':
    case 'embed':
      return (
        <motion.div variants={blurFadeIn} initial="initial" whileInView="whileInView" className="w-full aspect-video bg-[#141414] relative">
          <iframe 
            src={block.content} 
            className="absolute inset-0 w-full h-full border-0"
            allow="autoplay; fullscreen; picture-in-picture"
            loading="lazy"
          ></iframe>
        </motion.div>
      );
    default:
      return null;
  }
}
