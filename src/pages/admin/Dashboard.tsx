import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import type { Project } from '../../lib/types';
import { useNavigate } from 'react-router-dom';

export default function AdminDashboard() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    checkUser();
    fetchProjects();
  }, []);

  async function checkUser() {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate('/admin/login');
    }
  }

  async function fetchProjects() {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (!error && data) {
      setProjects(data as Project[]);
    }
    setLoading(false);
  }

  const togglePublish = async (id: string, currentStatus: boolean) => {
    await supabase.from('projects').update({ published: !currentStatus }).eq('id', id);
    fetchProjects();
  };

  const deleteProject = async (id: string) => {
    if (window.confirm("Tem certeza que deseja deletar este projeto?")) {
      await supabase.from('projects').delete().eq('id', id);
      fetchProjects();
    }
  };

  if (loading) return <div className="min-h-screen bg-[#0A0A0A] text-white p-10 font-sans">Carregando...</div>;

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white p-6 md:p-10 font-sans">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-12 gap-4">
          <h1 className="text-2xl md:text-4xl font-bold uppercase tracking-widest" style={{ fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}>
            Projetos
          </h1>
          <div className="flex items-center gap-4">
            <button 
              onClick={async () => {
                await supabase.auth.signOut();
                navigate('/admin/login');
              }}
              className="text-xs uppercase tracking-widest text-[#A3A3A3] hover:text-white"
            >
              Sair
            </button>
            <button 
              onClick={() => navigate('/admin/portfolio/new')}
              className="bg-white text-black px-6 py-3 text-xs uppercase tracking-widest font-bold hover:bg-[#A3A3A3] transition-colors rounded-[3px]"
            >
              Novo Projeto
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          {projects.length === 0 && (
            <div className="p-10 border border-dashed border-white/20 text-center text-white/50 text-xs uppercase tracking-widest">
              Nenhum projeto encontrado.
            </div>
          )}
          {projects.map((project) => (
            <div key={project.id} className="bg-[#141414] border border-white/5 p-4 sm:p-6 flex flex-col md:flex-row items-center justify-between gap-6 transition-all hover:border-white/20">
              <div className="flex items-center gap-6 w-full md:w-auto">
                <div className="w-20 h-20 md:w-24 md:h-24 bg-black flex-shrink-0">
                  {project.cover_image_url ? (
                    <img src={project.cover_image_url} alt={project.title} className="w-full h-full object-cover opacity-80" />
                  ) : <div className="w-full h-full flex items-center justify-center text-[10px] text-white/20">SEM CAPA</div>}
                </div>
                <div className="flex flex-col">
                  <h3 className="text-lg md:text-xl font-bold uppercase tracking-widest">{project.title}</h3>
                  <div className="flex gap-3 text-[10px] uppercase tracking-widest text-white/50 mt-2">
                    <span>{project.category}</span>
                    <span>•</span>
                    <span className={project.published ? "text-green-500" : "text-yellow-500"}>
                      {project.published ? "Publicado" : "Rascunho"}
                    </span>
                    {project.is_featured && (
                      <>
                        <span>•</span>
                        <span className="text-blue-400">Destaque</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-4 w-full md:w-auto justify-end">
                <button 
                  onClick={() => togglePublish(project.id, project.published)}
                  className="text-[10px] uppercase tracking-widest text-[#A3A3A3] hover:text-white border border-white/10 px-3 py-2"
                >
                  {project.published ? "Ocultar" : "Publicar"}
                </button>
                <button 
                  onClick={() => navigate(`/admin/portfolio/${project.id}`)}
                  className="text-[10px] uppercase tracking-widest text-black bg-white hover:bg-white/80 px-4 py-2 font-bold"
                >
                  Editar
                </button>
                <button 
                  onClick={() => deleteProject(project.id)}
                  className="text-[10px] uppercase tracking-widest text-red-500 hover:text-red-400 border border-red-500/20 px-3 py-2"
                >
                  Excluir
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
