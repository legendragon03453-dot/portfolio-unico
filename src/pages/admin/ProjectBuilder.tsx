import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import type { ProjectBlock, ProjectCategory, BlockType } from '../../lib/types';
import { useNavigate, useParams } from 'react-router-dom';
import { BlockRenderer } from '../PortfolioDetail';

const CATEGORIES: ProjectCategory[] = ['Sites', 'Identidade Visual', 'Posts', 'Estratégias de Conteúdo', 'Outros'];
const BLOCK_TYPES: BlockType[] = ['text', 'image', 'photo_grid', 'video', 'embed', 'prototype', '3d', 'title_text', 'link', 'text_over_image'];

function ImageField({ value, onChange }: { value: string, onChange: (val: string) => void }) {
  const [mode, setMode] = useState<'url' | 'upload'>('url');
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    
    const fileExt = file.name.split('.').pop();
    const filePath = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

    const { error } = await supabase.storage.from('portfolio-media').upload(filePath, file);

    if (error) {
      alert("Erro: " + error.message + "\n\nO BUCKET 'portfolio-media' PRECISA ESTAR CRIADO COMO PUBLIC NO SUPABASE!");
    } else {
      const { data: publicUrlData } = supabase.storage.from('portfolio-media').getPublicUrl(filePath);
      onChange(publicUrlData.publicUrl);
    }
    setUploading(false);
  };

  return (
    <div className="flex flex-col gap-2 w-full">
      <div className="flex gap-2 mb-1">
        <button 
          onClick={() => setMode('url')} 
          className={`text-[9px] uppercase tracking-widest px-2 py-1 ${mode === 'url' ? 'bg-white text-black font-bold' : 'bg-[#141414] text-white/50 border border-white/10 hover:text-white'}`}
        >
          Inserir Link URL
        </button>
        <button 
          onClick={() => setMode('upload')} 
          className={`text-[9px] uppercase tracking-widest px-2 py-1 ${mode === 'upload' ? 'bg-white text-black font-bold' : 'bg-[#141414] text-white/50 border border-white/10 hover:text-white'}`}
        >
          Fazer Upload
        </button>
      </div>

      {mode === 'url' ? (
        <input 
          type="text" 
          value={value} 
          onChange={e => onChange(e.target.value)} 
          placeholder="https://"
          className="w-full bg-[#0A0A0A] border border-white/10 p-3 text-sm text-white focus:outline-none focus:border-white/30"
        />
      ) : (
        <div className="relative w-full bg-[#0A0A0A] border border-dashed border-white/20 p-4 flex items-center justify-center hover:border-white/50 transition-colors cursor-pointer min-h-[50px]">
          {uploading ? (
            <span className="text-xs uppercase tracking-widest text-[#A3A3A3]">Enviando...</span>
          ) : (
            <>
              <span className="text-xs uppercase tracking-widest text-white/50">Clique para Enviar Imagem</span>
              <input 
                type="file" 
                accept="image/*"
                onChange={handleUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
            </>
          )}
        </div>
      )}
      {value && mode === 'upload' && (
        <div className="text-[9px] text-green-500 max-w-full overflow-hidden text-ellipsis whitespace-nowrap mt-1">Upload Completo!</div>
      )}
    </div>
  );
}

export default function ProjectBuilder() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNew = id === undefined || id === 'new';

  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);

  // Project State
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [coverUrl, setCoverUrl] = useState('');
  const [category, setCategory] = useState<ProjectCategory>('Sites');
  const [isFeatured, setIsFeatured] = useState(false);

  // Blocks State
  const [blocks, setBlocks] = useState<(Partial<ProjectBlock> & { localId: string })[]>([]);

  useEffect(() => {
    checkUser();
    if (!isNew && id) {
      fetchData(id);
    }
  }, [id, isNew]);

  async function checkUser() {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) navigate('/admin/login');
  }

  async function fetchData(projectId: string) {
    const { data: projData } = await supabase.from('projects').select('*').eq('id', projectId).single();
    if (projData) {
      setTitle(projData.title);
      setSlug(projData.slug);
      setCoverUrl(projData.cover_image_url || '');
      setCategory(projData.category);
      setIsFeatured(projData.is_featured);

      const { data: blocksData } = await supabase
        .from('project_blocks')
        .select('*')
        .eq('project_id', projectId)
        .order('order_index', { ascending: true });

      if (blocksData) {
        setBlocks(blocksData.map(b => ({ ...b, localId: b.id })));
      }
    }
    setLoading(false);
  }

  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (isNew) {
      setSlug(val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''));
    }
  };

  const addBlock = (type: BlockType) => {
    let initialContent = '';
    if (type === 'photo_grid') initialContent = '[]';
    else if (type === 'title_text') initialContent = JSON.stringify({ title: '', paragraph: '' });
    else if (type === 'link') initialContent = JSON.stringify({ text: 'Clique Aqui', url: '' });
    else if (type === 'text_over_image') initialContent = JSON.stringify({ url: '', title: '', paragraph: '' });

    const newBlock = {
      localId: Math.random().toString(36).substring(7),
      type,
      content: initialContent,
      order_index: blocks.length
    };
    setBlocks([...blocks, newBlock]);
  };

  const updateBlock = (localId: string, content: string) => {
    setBlocks(blocks.map(b => b.localId === localId ? { ...b, content } : b));
  };

  const removeBlock = (localId: string) => {
    setBlocks(blocks.filter(b => b.localId !== localId));
  };

  const moveBlock = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === blocks.length - 1) return;

    const newBlocks = [...blocks];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    
    const temp = newBlocks[index];
    newBlocks[index] = newBlocks[targetIndex];
    newBlocks[targetIndex] = temp;
    
    // Re-index
    newBlocks.forEach((b, i) => b.order_index = i);
    setBlocks(newBlocks);
  };

  const saveProject = async () => {
    if (!title || !slug) return alert("Título e URL (slug) são obrigatórios");
    setSaving(true);

    const projectData = {
      title,
      slug,
      cover_image_url: coverUrl,
      category,
      is_featured: isFeatured
    };

    let projectId = id;

    if (isNew) {
      const { data, error } = await supabase.from('projects').insert([projectData]).select().single();
      if (error) {
        setSaving(false);
        return alert("Erro ao criar projeto: " + error.message);
      }
      projectId = data.id;
    } else {
      await supabase.from('projects').update(projectData).eq('id', id);
    }

    // Save Blocks (delete all then re-insert for sync simplicity)
    if (projectId) {
      await supabase.from('project_blocks').delete().eq('project_id', projectId);
      if (blocks.length > 0) {
        const blocksToInsert = blocks.map((b, i) => ({
          project_id: projectId,
          type: b.type,
          content: b.content,
          order_index: i
        }));
        await supabase.from('project_blocks').insert(blocksToInsert);
      }
    }

    setSaving(false);
    navigate('/admin/portfolio');
  };

  if (loading) return <div className="min-h-screen bg-[#0A0A0A] text-white p-10 font-sans">Carregando...</div>;

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white p-4 md:p-8 font-sans pb-32">
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 max-w-[1800px] mx-auto items-start">
        
        {/* LEFT COLUMN: EDITOR */}
        <div className="flex flex-col w-full">
          <div className="flex justify-between items-center mb-8 border-b border-white/10 pb-6">
            <h1 className="text-2xl font-bold uppercase tracking-widest">{isNew ? 'Criar Novo Projeto' : 'Editar Projeto'}</h1>
            <div className="flex gap-4">
              <button onClick={() => navigate('/admin/portfolio')} className="text-xs uppercase tracking-widest text-[#A3A3A3] hover:text-white">Cancelar</button>
              <button onClick={saveProject} disabled={saving} className="bg-white text-black px-6 py-2 text-xs uppercase tracking-widest font-bold hover:bg-[#A3A3A3] disabled:opacity-50">
                {saving ? 'Salvando...' : 'Salvar Tudo'}
              </button>
            </div>
          </div>

        {/* METADATA */}
        <div className="bg-[#141414] border border-white/5 p-6 md:p-8 mb-10 mt-6 flex flex-col gap-6">
          <h2 className="text-xs font-bold uppercase tracking-widest text-white/50 border-b border-white/5 pb-2">Detalhes Principais</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-[10px] uppercase tracking-widest text-zinc-500 mb-2">Título do Projeto</label>
              <input type="text" value={title} onChange={e => handleTitleChange(e.target.value)} className="w-full bg-[#0A0A0A] border border-white/10 p-3 text-sm text-white focus:outline-none focus:border-white/40" />
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-widest text-zinc-500 mb-2">URL (Slug)</label>
              <input type="text" value={slug} onChange={e => setSlug(e.target.value)} className="w-full bg-[#0A0A0A] border border-white/10 p-3 text-sm text-white focus:outline-none focus:border-white/40 cursor-not-allowed text-zinc-600" />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-[10px] uppercase tracking-widest text-zinc-500 mb-2">Imagem da Capa</label>
              <ImageField value={coverUrl} onChange={setCoverUrl} />
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-widest text-zinc-500 mb-2">Categoria</label>
              <select value={category} onChange={e => setCategory(e.target.value as ProjectCategory)} className="w-full bg-[#0A0A0A] border border-white/10 p-3 text-sm text-white focus:outline-none focus:border-white/40 appearance-none">
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <input type="checkbox" id="isFeatured" checked={isFeatured} onChange={e => setIsFeatured(e.target.checked)} className="w-4 h-4 accent-white bg-[#0A0A0A] border-white/10" />
            <label htmlFor="isFeatured" className="text-xs uppercase tracking-widest text-white/80 cursor-pointer">Marcar como Destaque (Tamanho Expandido)</label>
          </div>
        </div>

        {/* BUILDER */}
        <div className="mt-12">
          <h2 className="text-sm font-bold uppercase tracking-widest text-white mb-6 border-b border-white/10 pb-4">Construtor do Projeto (Estilo Behance)</h2>
          
          {/* Builder Controls */}
          <div className="flex flex-wrap gap-2 mb-8 bg-[#141414] p-4 border border-white/5">
             <span className="w-full block text-[10px] uppercase tracking-widest text-zinc-500 mb-2">Adicionar Bloco</span>
             {BLOCK_TYPES.map(bt => (
               <button key={bt} onClick={() => addBlock(bt)} className="border border-white/10 px-4 py-2 text-[10px] uppercase tracking-widest hover:bg-white hover:text-black transition-colors">
                 + {bt}
               </button>
             ))}
          </div>

          {/* Blocks List */}
          <div className="flex flex-col gap-6">
            {blocks.length === 0 && <p className="text-[10px] uppercase tracking-widest text-zinc-600 text-center py-10 border border-dashed border-white/10">Nenhum bloco adicionado. Adicione blocos acima para construir a página.</p>}
            
            {blocks.map((block, index) => (
              <div key={block.localId} className="bg-[#141414] border border-white/10 flex flex-col group relative">
                
                {/* Block Header Toolbar */}
                <div className="bg-[#0f0f0f] border-b border-white/10 p-2 flex justify-between items-center text-[10px] uppercase tracking-widest text-zinc-500">
                  <span className="font-bold text-white px-2">Bloco: {block.type}</span>
                  <div className="flex gap-2">
                    <button onClick={() => moveBlock(index, 'up')} disabled={index === 0} className="hover:text-white disabled:opacity-30 px-2">▲ Sobe</button>
                    <button onClick={() => moveBlock(index, 'down')} disabled={index === blocks.length - 1} className="hover:text-white disabled:opacity-30 px-2">▼ Desce</button>
                    <button onClick={() => removeBlock(block.localId)} className="hover:text-red-400 text-red-500/50 px-2 ml-4">✕ Remover</button>
                  </div>
                </div>

                {/* Block Content Input */}
                <div className="p-4">
                  {block.type === 'image' ? (
                    <div>
                       <p className="text-[10px] uppercase tracking-widest text-zinc-500 mb-2">Imagem</p>
                       <ImageField value={block.content || ''} onChange={val => updateBlock(block.localId, val)} />
                    </div>
                  ) : block.type === 'title_text' ? (
                    <div>
                       <p className="text-[10px] uppercase tracking-widest text-zinc-500 mb-2 border-b border-white/10 pb-2">Título e Parágrafo</p>
                       {(() => {
                         let data = { title: '', paragraph: '' };
                         try { data = JSON.parse(block.content || '{}'); } catch (e) {}
                         return (
                           <div className="flex flex-col gap-4">
                             <input type="text" placeholder="Título" value={data.title} onChange={e => updateBlock(block.localId, JSON.stringify({...data, title: e.target.value}))} className="w-full bg-[#0A0A0A] border border-white/10 p-3 text-sm text-white focus:outline-none focus:border-white/30 font-bold" />
                             <textarea placeholder="Parágrafo" value={data.paragraph} onChange={e => updateBlock(block.localId, JSON.stringify({...data, paragraph: e.target.value}))} className="w-full bg-[#0A0A0A] border border-white/10 p-3 text-sm text-white focus:outline-none focus:border-white/30 h-24" />
                           </div>
                         );
                       })()}
                    </div>
                  ) : block.type === 'link' ? (
                    <div>
                       <p className="text-[10px] uppercase tracking-widest text-zinc-500 mb-2 border-b border-white/10 pb-2">Link Dinâmico</p>
                       {(() => {
                         let data = { text: '', url: '' };
                         try { data = JSON.parse(block.content || '{}'); } catch (e) {}
                         return (
                           <div className="flex flex-col gap-4">
                             <input type="text" placeholder="Texto Escrito no Botão" value={data.text} onChange={e => updateBlock(block.localId, JSON.stringify({...data, text: e.target.value}))} className="w-full bg-[#0A0A0A] border border-white/10 p-3 text-sm text-white focus:outline-none focus:border-white/30" />
                             <input type="text" placeholder="URL do Link (https://...)" value={data.url} onChange={e => updateBlock(block.localId, JSON.stringify({...data, url: e.target.value}))} className="w-full bg-[#0A0A0A] border border-white/10 p-3 text-sm text-white focus:outline-none focus:border-white/30" />
                           </div>
                         );
                       })()}
                    </div>
                  ) : block.type === 'text_over_image' ? (
                    <div>
                       <p className="text-[10px] uppercase tracking-widest text-zinc-500 mb-2 border-b border-white/10 pb-2">Texto Sobre Imagem</p>
                       {(() => {
                         let data = { url: '', title: '', paragraph: '' };
                         try { data = JSON.parse(block.content || '{}'); } catch (e) {}
                         return (
                           <div className="flex flex-col gap-4">
                             <ImageField value={data.url} onChange={val => updateBlock(block.localId, JSON.stringify({...data, url: val}))} />
                             <input type="text" placeholder="Título Opcional" value={data.title} onChange={e => updateBlock(block.localId, JSON.stringify({...data, title: e.target.value}))} className="w-full bg-[#0A0A0A] border border-white/10 p-3 text-sm text-white focus:outline-none focus:border-white/30 font-bold" />
                             <textarea placeholder="Parágrafo Opcional" value={data.paragraph} onChange={e => updateBlock(block.localId, JSON.stringify({...data, paragraph: e.target.value}))} className="w-full bg-[#0A0A0A] border border-white/10 p-3 text-sm text-white focus:outline-none focus:border-white/30 h-24" />
                           </div>
                         );
                       })()}
                    </div>
                  ) : block.type === 'photo_grid' ? (
                    <div>
                       <p className="text-[10px] uppercase tracking-widest text-zinc-500 mb-4 border-b border-white/10 pb-2">Itens da Grade (2 Imagens por linha)</p>
                       <div className="flex flex-col gap-4">
                         {(() => {
                           let urls: string[] = [];
                           try { urls = block.content ? JSON.parse(block.content) : []; } catch (e) { urls = []; }
                           return (
                             <>
                               {urls.map((url, i) => (
                                 <div key={i} className="flex flex-col gap-2 border border-white/5 p-4 bg-[#0A0A0A]">
                                   <div className="flex justify-between items-center mb-2">
                                     <span className="text-[9px] uppercase tracking-widest text-white/50">Imagem {i + 1}</span>
                                     <button 
                                       onClick={() => {
                                         const newUrls = [...urls];
                                         newUrls.splice(i, 1);
                                         updateBlock(block.localId, JSON.stringify(newUrls));
                                       }}
                                       className="text-[9px] text-red-500 uppercase tracking-widest"
                                     >
                                       Remover Imagem
                                     </button>
                                   </div>
                                   <ImageField 
                                     value={url} 
                                     onChange={val => {
                                       const newUrls = [...urls];
                                       newUrls[i] = val;
                                       updateBlock(block.localId, JSON.stringify(newUrls));
                                     }} 
                                   />
                                 </div>
                               ))}
                               <button 
                                 onClick={() => {
                                   const newUrls = [...urls, ""];
                                   updateBlock(block.localId, JSON.stringify(newUrls));
                                 }}
                                 className="border border-white/20 p-3 text-[10px] uppercase tracking-widest text-white/80 hover:bg-white hover:text-black transition-colors"
                               >
                                 + Adicionar Nova Imagem na Grade
                               </button>
                             </>
                           );
                         })()}
                       </div>
                    </div>
                  ) : block.type === 'text' ? (
                    <textarea 
                      value={block.content} 
                      onChange={e => updateBlock(block.localId, e.target.value)} 
                      placeholder="Digite o texto aqui (quebras de linha serão respeitadas)..."
                      className="w-full bg-[#0A0A0A] border border-white/10 p-4 text-sm text-[#A3A3A3] min-h-[150px] focus:outline-none focus:border-white/30"
                    />
                  ) : (
                    <div>
                       <p className="text-[10px] uppercase tracking-widest text-zinc-500 mb-2">URL da mídia (Vimeo, iframe src, Youtube, 3D embed, etc)</p>
                       <input 
                        type="text" 
                        value={block.content} 
                        onChange={e => updateBlock(block.localId, e.target.value)} 
                        placeholder="https://"
                        className="w-full bg-[#0A0A0A] border border-white/10 p-3 text-sm text-white focus:outline-none focus:border-white/30"
                      />
                    </div>
                  )}
                </div>

              </div>
            ))}
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN: LIVE PREVIEW */}
      <div className="hidden xl:flex flex-col sticky top-8 border border-white/10 bg-[#050505] h-[90vh] overflow-hidden">
        <div className="bg-[#141414] border-b border-white/10 p-4 flex items-center justify-between z-50 shadow-md">
          <span className="text-[10px] text-white/50 uppercase tracking-widest font-bold">Live Preview (WIP)</span>
        </div>
        <div className="overflow-y-auto flex-1 custom-scrollbar">
          {/* Mock Detail Page View */}
          <div className="w-full bg-[#0A0A0A] text-white font-sans min-h-full">
            <div className="w-full h-[50vh] relative">
              {coverUrl ? (
                <img src={coverUrl} alt="Preview Cover" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-[#141414] flex items-center justify-center text-white/20 text-xs uppercase tracking-widest border-b border-white/5">(Capa do Projeto Resolução Larga)</div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-black/40 to-transparent flex flex-col justify-end p-8">
                <h1 className="text-5xl font-bold uppercase tracking-wide leading-none" style={{ fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}>
                  {title || 'Título do Projeto'}
                </h1>
                <div className="mt-4 flex flex-wrap gap-4">
                  <span className="text-[10px] uppercase tracking-widest text-[#A3A3A3] bg-[#141414] px-4 py-2 border border-white/10">{category}</span>
                </div>
              </div>
            </div>

            <div className="w-full max-w-[1200px] mx-auto py-12 flex flex-col gap-12 px-6">
              {blocks.length === 0 && (
                <div className="text-center py-20 text-white/30 text-[10px] uppercase tracking-widest border border-dashed border-white/10">O preview dos blocos aparecerá aqui.</div>
              )}
              {blocks.map((block) => (
                <BlockRenderer key={block.localId} block={block as ProjectBlock} />
              ))}
            </div>
          </div>
        </div>
      </div>
      
      </div>
    </div>
  );
}
