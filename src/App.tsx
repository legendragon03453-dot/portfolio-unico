import React, { useState, useRef, useMemo, useEffect } from 'react';
import { motion, useScroll, useTransform, useMotionValue, useSpring, AnimatePresence } from 'framer-motion';
import { supabase } from './lib/supabase';
import { ArrowRight, Check, X, Target, DollarSign, User, Send, Loader2 } from 'lucide-react';

// Injetando a fonte customizada globalmente e as keyframes
const FontStyle = () => (
  <style dangerouslySetInnerHTML={{__html: `
    @font-face {
      font-family: 'Hypik';
      src: url('https://raw.githubusercontent.com/legendragon03453-dot/UNICO-SITE-FINAL/main/hypik.otf') format('opentype');
      font-weight: normal;
      font-style: normal;
      font-display: swap;
    }
    @keyframes gradient-x {
      0% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
      100% { background-position: 0% 50%; }
    }
    .animate-gradient-x {
      background-size: 200% auto;
      animation: gradient-x 3s linear infinite;
    }

    /* --- ESTILOS DO BOTÃO SHINY (ORÇAMENTOS) --- */
    :root {
      --shiny-cta-bg: #000000;
      --shiny-cta-bg-subtle: #1a1818;
      --shiny-cta-fg: #ffffff;
      --shiny-cta-highlight: #74FE03;
      --shiny-cta-highlight-subtle: white;
    }
    @property --gradient-angle { syntax: "<angle>"; initial-value: 0deg; inherits: false; }
    @property --gradient-angle-offset { syntax: "<angle>"; initial-value: 0deg; inherits: false; }
    @property --gradient-percent { syntax: "<percentage>"; initial-value: 5%; inherits: false; }
    @property --gradient-shine { syntax: "<color>"; initial-value: white; inherits: false; }

    .shiny-btn {
      --animation: rotate-glow linear infinite;
      --duration: 3s;
      --shadow-size: 2px;
      isolation: isolate;
      position: relative;
      overflow: hidden;
      cursor: pointer;
      outline-offset: 4px;
      padding: 0.6rem 1.5rem;
      font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
      font-size: 0.75rem;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      border: 1px solid transparent;
      border-radius: 360px;
      color: var(--shiny-cta-fg);
      background: linear-gradient(var(--shiny-cta-bg), var(--shiny-cta-bg)) padding-box,
                  conic-gradient(
                      from calc(var(--gradient-angle) - var(--gradient-angle-offset)),
                      transparent,
                      var(--shiny-cta-highlight) var(--gradient-percent),
                      var(--gradient-shine) calc(var(--gradient-percent) * 2),
                      var(--shiny-cta-highlight) calc(var(--gradient-percent) * 3),
                      transparent calc(var(--gradient-percent) * 4)
                  ) border-box;
      box-shadow: inset 0 0 0 1px var(--shiny-cta-bg-subtle);
      transition: 800ms cubic-bezier(0.25, 1, 0.5, 1);
      transition-property: --gradient-angle-offset, --gradient-percent, --gradient-shine;
    }
    .shiny-btn::before, .shiny-btn::after, .shiny-btn span::before {
      content: ""; pointer-events: none; position: absolute; inset-inline-start: 50%; inset-block-start: 50%; translate: -50% -50%; z-index: -1;
    }
    .shiny-btn::before {
      --size: calc(100% - var(--shadow-size) * 3);
      --position: 2px;
      --space: calc(var(--position) * 2);
      width: var(--size); height: var(--size);
      background: radial-gradient(circle at var(--position) var(--position), white calc(var(--position) / 4), transparent 0) padding-box;
      background-size: var(--space) var(--space); background-repeat: space;
      mask-image: conic-gradient(from calc(var(--gradient-angle) + 45deg), black 0%, black 9%, transparent 10%, transparent 90%, black 91%, black 100%);
      border-radius: inherit; opacity: 0.4;
    }
    .shiny-btn::after {
      --animation: subtle-shine linear infinite;
      width: 100%; aspect-ratio: 1;
      background: linear-gradient(-50deg, transparent, var(--shiny-cta-highlight), transparent);
      mask-image: radial-gradient(circle at bottom, transparent 40%, black); opacity: 0.6;
    }
    .shiny-btn span { z-index: 1; position: relative; }
    .shiny-btn span::before {
      width: 100%; height: 100%; box-shadow: inset 0 -1ex 2rem 4px var(--shiny-cta-highlight); opacity: 0; transition: opacity 1500ms cubic-bezier(0.25, 1, 0.5, 1);
    }
    .shiny-btn:hover, .shiny-btn:focus-visible {
      --gradient-percent: 20%; --gradient-angle-offset: 95deg; --gradient-shine: var(--shiny-cta-highlight-subtle);
    }
    .shiny-btn:hover span::before, .shiny-btn:focus-visible span::before { opacity: 1; }
    @keyframes rotate-glow { to { --gradient-angle: 360deg; } }
    @keyframes subtle-shine { to { transform: rotate(360deg); } }
    .shiny-btn, .shiny-btn::before, .shiny-btn::after {
      animation: var(--animation) var(--duration), var(--animation) calc(var(--duration) / 0.4) reverse paused;
      animation-composition: add;
    }
    .shiny-btn:hover, .shiny-btn:hover::before, .shiny-btn:hover::after {
      animation-play-state: running;
    }
    
    /* Variante do botão maior para a Hero */
    .shiny-btn.shiny-btn-lg {
      padding: 1rem 3rem;
      font-size: 1rem;
    }
    @media (max-width: 768px) {
      .shiny-btn.shiny-btn-lg {
        padding: 0.8rem 2.5rem;
        font-size: 0.85rem;
      }
    }

    /* GLOBAL FIXES */
    body {
      background-color: #0A0A0A;
      margin: 0;
      padding: 0;
      overflow-x: hidden;
    }
    section {
      width: 100%;
      position: relative;
    }
  `}} />
);

// Dicionário de traduções
const translations = {
  pt: {
    nav: [
      { label: "Home", href: "#home" },
      { label: "Serviços", href: "#servicos" },
      { label: "Portfólio", href: "#portfolio" },
      { label: "Orçamento", href: "#orcamento" }
    ],
    heroTop: "Identidade Visual para Influencers e artistas",
    heroSub1: "Não seja",
    heroSub2: "Apenas mais um.",
    heroSub3: "Seja Único.",
    footer: "© EST. 202X — VISUAL IDENTIFY & STRATEGY.",
    scroll: "Scroll",
    sec2Title1: "Trabalhos em ",
    sec2Title2: "Destaque",
    sec2Btn: "todos projetos \u2192",
    sec2BtnQuote: "Orçamentos",
    cardHover: "Veja mais",
    sec3Title1: "A UNICO só trabalha",
    sec3Title2: "com pessoas ",
    sec3Title3: "ÚNICAS",
    sec4Title: "Serviços",
    servicesData: [
      {
        id: "01",
        title: "Identidade Visual",
        titleSplit: ["Identidade", "Visual"],
        desc: "Criamos marcas com propósito e sistemas visuais que conectam profundamente com o seu público desde o primeiro olhar. Uma identidade inesquecível.",
        subs: ["Identidade de Marca", "Direção de Arte", "Direção Criativa", "Manuais de Marca"],
        video: "https://raw.githubusercontent.com/legendragon03453-dot/FILIPPO-SITE/main/CARD%201.webm"
      },
      {
        id: "02",
        title: "Web Design & Dev",
        titleSplit: ["Web Design", "& Dev"],
        desc: "Desenvolvemos experiências digitais imersivas, focadas em alta performance, conversão e um design de ponta totalmente responsivo.",
        subs: ["Design UI/UX", "Design Interativo", "Webflow / React", "E-commerce"],
        video: "https://raw.githubusercontent.com/legendragon03453-dot/FILIPPO-SITE/main/CARD%202.webm"
      },
      {
        id: "03",
        title: "Estratégia Social",
        titleSplit: ["Estratégia", "Social"],
        desc: "Estratégias de conteúdo direcionadas para o posicionamento de autoridade, alto engajamento orgânico e crescimento sustentável da marca.",
        subs: ["Planejamento de Conteúdo", "Copywriting", "Gestão de Comunidade", "Análise de Dados"],
        video: "https://raw.githubusercontent.com/legendragon03453-dot/FILIPPO-SITE/main/CARD%203.webm"
      }
    ],
    sec4Footer: "Transformamos negócios em obras únicas.",
    stats: [
      { num: "5", suffix: " anos", label: "de experiência" },
      { num: "+100", suffix: "", label: "Clientes satisfeitos" },
      { num: "+5", suffix: "", label: "Lançamentos colaborados" }
    ],
    bioName: "Filippo Rodrigues",
    bioRole: "Fundador do UNICO e o cara por trás de vários influencers",
    bioTitle: "O ÚNICO",
    bioP1: "Filippo fundou o UNICO com uma visão clara: erradicar o 'mais do mesmo' no mercado digital. Com anos respirando design, ele se especializou em construir a identidade visual e o posicionamento estratégico de grandes influenciadores e marcas que ditam tendências.",
    bioP2: "O seu trabalho une direção de arte impecável, motion design imersivo e desenvolvimento web de alta performance. Para Filippo, a estética só importa quando está aliada a um propósito claro e à conversão real. Ele não cria apenas layouts; ele forja ecossistemas visuais completos.",
    bioP3: "Seja a liderar grandes projetos de branding ou a desenhar os mínimos detalhes de uma interface, ele envolve-se profundamente em cada etapa. O objetivo é apenas um: garantir que o seu negócio seja absolutamente inconfundível.",
    bioBtn: "Vire cliente do UNICO",
    sec6Title1: "Pronto para",
    sec6Title2: "Quebrar o",
    sec6Title3: "Padrão?",
    sec6Btn: "Iniciar Projeto ↗",
    sec6Links: ["Instagram", "WhatsApp", "Portfólio"],
    sec6Copy: "© ÚNICO WORLDWIDE. ALL RIGHTS RESERVED."
  },
  en: {
    nav: [
      { label: "Home", href: "#home" },
      { label: "Services", href: "#servicos" },
      { label: "Portfolio", href: "#portfolio" },
      { label: "Quote", href: "#orcamento" }
    ],
    heroTop: "Visual Identity for Influencers and Artists",
    heroSub1: "Don't be",
    heroSub2: "Just another one.",
    heroSub3: "Be Unique.",
    footer: "© EST. 202X — VISUAL IDENTIFY & STRATEGY.",
    scroll: "Scroll",
    sec2Title1: "Featured ",
    sec2Title2: "Works",
    sec2Btn: "all projects \u2192",
    sec2BtnQuote: "Quotes",
    cardHover: "See more",
    sec3Title1: "UNICO only works",
    sec3Title2: "with ",
    sec3Title3: "UNIQUE people",
    sec4Title: "Services",
    servicesData: [
      {
        id: "01",
        title: "Visual Identity",
        titleSplit: ["Branding", "Identity"],
        desc: "We create purposeful brands and visual systems that deeply connect with your audience from the very first glance. An unforgettable identity.",
        subs: ["Identity Branding", "Art Direction", "Creative Direction", "Guidelines"],
        video: "https://raw.githubusercontent.com/legendragon03453-dot/FILIPPO-SITE/main/CARD%201.webm"
      },
      {
        id: "02",
        title: "Web Design & Dev",
        titleSplit: ["Web Design", "& Dev"],
        desc: "We develop immersive digital experiences focused on high performance, conversion, and fully responsive cutting-edge design.",
        subs: ["UI/UX Design", "Interactive Design", "Webflow / React", "E-commerce"],
        video: "https://raw.githubusercontent.com/legendragon03453-dot/FILIPPO-SITE/main/CARD%202.webm"
      },
      {
        id: "03",
        title: "Social Strategy",
        titleSplit: ["Social", "Strategy"],
        desc: "Content strategies focused on authority positioning, high organic engagement, and sustainable brand growth.",
        subs: ["Content Planning", "Copywriting", "Community Management", "Analytics"],
        video: "https://raw.githubusercontent.com/legendragon03453-dot/FILIPPO-SITE/main/CARD%203.webm"
      }
    ],
    sec4Footer: "We transform businesses into unique masterpieces.",
    stats: [
      { num: "5", suffix: " years", label: "of experience" },
      { num: "100+", suffix: "", label: "Satisfied clients" },
      { num: "5+", suffix: "", label: "Collaborated launches" }
    ],
    bioName: "Filippo Rodrigues",
    bioRole: "Founder of UNICO and the guy behind several influencers",
    bioTitle: "THE UNIQUE",
    bioP1: "Filippo founded UNICO with a clear vision: to eradicate the 'more of the same' in the digital market. With years of breathing design, he specializes in building the visual identity and strategic positioning of major influencers and trendsetting brands.",
    bioP2: "His work combines flawless art direction, immersive motion design, and high-performance web development. For Filippo, aesthetics only matter when allied with a clear purpose and real conversion. He doesn't just create layouts; he forges complete visual ecosystems.",
    bioP3: "Whether leading major branding projects or designing the finest details of an interface, he is deeply involved in every step. The goal is always the same: to ensure your business is absolutely unmistakable.",
    bioBtn: "Become a UNICO client",
    sec6Title1: "Ready to",
    sec6Title2: "Break the",
    sec6Title3: "Pattern?",
    sec6Btn: "Start Project ↗",
    sec6Links: ["Instagram", "WhatsApp", "Portfolio"],
    sec6Copy: "© ÚNICO WORLDWIDE. ALL RIGHTS RESERVED."
  }
};

// Projetos de Exemplo
const PROJECTS_FALLBACK = [
  {
    id: "1vc9ono",
    title: "Kastle AI",
    link: "#",
    tags: ["Motion & 3D", "Web Design & Development"],
    video: "https://stokt.b-cdn.net/hero-mockup-kastle-01.mp4",
    poster: "https://framerusercontent.com/images/VB82dEnl1ArluP1RIAvtcy8cKII.png"
  },
  {
    id: "d60mnz",
    title: "We Scale It",
    link: "#",
    tags: ["Brand Identity", "Web Design & Development"],
    video: "https://stokt.b-cdn.net/WSI%20Trim%20SR.webm",
    poster: "https://framerusercontent.com/images/KWqrwJ1XgAuAFpxNQlXvLl03Hk.jpg"
  },
  {
    id: "6smmma",
    title: "Wildly Wyoming",
    link: "#",
    tags: ["Brand Identity", "Motion & 3D"],
    video: "https://stokt.b-cdn.net/WW-SERIES_TRAILER-FINAL-30S-16X9-H264HD.mp4",
    poster: "https://framerusercontent.com/images/BF7bCtJWiPlNYlGtyEA3HqIaH4.webp"
  },
  {
    id: "6blico",
    title: "Jeremie Bouchard | Director + Editor",
    link: "#",
    tags: ["Brand Identity", "Web Design & Development"],
    video: "https://stokt.b-cdn.net/H-BEAM-MACBOOK-16-9-4k.mp4",
    poster: "https://framerusercontent.com/images/6cGsflAPFCSTYGPeNRuSZsTt8Y.png"
  },
  {
    id: "1mitsi3",
    title: "Enzo Drew - Creative Company",
    link: "#",
    tags: ["Web Design & Development"],
    video: "https://stokt.b-cdn.net/fish-eye-laptop%202.mp4",
    poster: "https://framerusercontent.com/images/H2qpUZT3Cys5cpksCNCl5TnNgw.png"
  }
];

// As exatas 9 imagens dos influenciadores
const ORBIT_IMAGES = [
  "https://raw.githubusercontent.com/legendragon03453-dot/FILIPPO-SITE/main/influs/Ellipse%2011_1x.webp",
  "https://raw.githubusercontent.com/legendragon03453-dot/FILIPPO-SITE/main/influs/Ellipse%2012_1x.webp",
  "https://raw.githubusercontent.com/legendragon03453-dot/FILIPPO-SITE/main/influs/Ellipse%2013_1x.webp",
  "https://raw.githubusercontent.com/legendragon03453-dot/FILIPPO-SITE/main/influs/Ellipse%2014_1x.webp",
  "https://raw.githubusercontent.com/legendragon03453-dot/FILIPPO-SITE/main/influs/Ellipse%2015_1x.webp",
  "https://raw.githubusercontent.com/legendragon03453-dot/FILIPPO-SITE/main/influs/Ellipse%2016_1x.webp",
  "https://raw.githubusercontent.com/legendragon03453-dot/FILIPPO-SITE/main/influs/Ellipse%207_1x.webp",
  "https://raw.githubusercontent.com/legendragon03453-dot/FILIPPO-SITE/main/influs/Ellipse%208_1x.webp",
  "https://raw.githubusercontent.com/legendragon03453-dot/FILIPPO-SITE/main/influs/Ellipse%209_1x.webp",
];
const CENTRAL_IMAGE = "https://raw.githubusercontent.com/legendragon03453-dot/FILIPPO-SITE/main/unico%20fili.webp?raw=true";

// Componente de Troca de Idioma
const LanguageToggle = ({ lang, setLang }: { lang: 'pt' | 'en', setLang: (l: 'pt' | 'en') => void }) => (
  <div className="flex items-center rounded-full border border-white p-1 shadow-2xl pointer-events-auto">
    <button 
      onClick={() => setLang('pt')} 
      className={`px-3 py-1.5 text-[10px] md:text-xs rounded-full transition-colors duration-300 ${lang === 'pt' ? 'bg-white text-black' : 'text-white hover:bg-white/20'}`}
    >
      🇧🇷
    </button>
    <button 
      onClick={() => setLang('en')} 
      className={`px-3 py-1.5 text-[10px] md:text-xs rounded-full transition-colors duration-300 ${lang === 'en' ? 'bg-white text-black' : 'text-white hover:bg-white/20'}`}
    >
      🇺🇸
    </button>
  </div>
);

export default function App() {
  const containerRef = useRef(null);
  
  // Estado do idioma
  const [lang, setLang] = useState<'pt' | 'en'>('pt');
  const t = translations[lang];

  // Projetos dinâmicos
  const [projects, setProjects] = useState<any[]>([]);
  const [isQuizOpen, setIsQuizOpen] = useState(false);

  useEffect(() => {
    async function fetchProjects() {
      try {
        const { data } = await supabase.from('projects').select('*').order('created_at', { ascending: false });
        if (data && data.length > 0) setProjects(data);
        else setProjects(PROJECTS_FALLBACK);
      } catch (e) {
        setProjects(PROJECTS_FALLBACK);
      }
    }
    fetchProjects();
  }, []);

  // Hook para o scroll da primeira sessão
  // AJUSTE: offset "end start" mantém a medição até o topo do container sair
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const indicatorOpacity = useTransform(scrollYProgress, [0, 0.05], [1, 0]);
  const heroContentOpacity = useTransform(scrollYProgress, [0.4, 0.6], [1, 0]);

  // =============== LÓGICA DO SCROLL DA SESSÃO 3 PARA A SESSÃO 4 ===============
  const sec3Ref = useRef(null);
  const { scrollYProgress: sec3Progress } = useScroll({
    target: sec3Ref,
    offset: ["start start", "end end"]
  });

  const sec3TextOpacity = useTransform(sec3Progress, [0, 0.2], [1, 0]);
  const ringsScale = useTransform(sec3Progress, [0.1, 0.8], [1, 0]);
  const centralImageScale = useTransform(sec3Progress, [0.75, 0.8], [1, 0]);
  const whiteCircleScale = useTransform(sec3Progress, [0.8, 1], [0, 50]);
  
  // =============== LÓGICA DE MOUSE PARA O 3D ===============
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const smoothX = useSpring(mouseX, { stiffness: 50, damping: 20 });
  const smoothY = useSpring(mouseY, { stiffness: 50, damping: 20 });
  const rotateX = useTransform(smoothY, [-0.5, 0.5], [55, 85]); 
  const rotateY = useTransform(smoothX, [-0.5, 0.5], [-25, 25]);
  const invRotateX = useTransform(rotateX, v => -v);
  const invRotateY = useTransform(rotateY, v => -v);

  const handleMouseMove = (e: React.MouseEvent) => {
    const { clientX, clientY } = e;
    const x = (clientX / window.innerWidth) - 0.5;
    const y = (clientY / window.innerHeight) - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  return (
    <div id="home" className="bg-[#0A0A0A] font-sans overflow-clip w-full">
      <FontStyle />

      {/* --- PRIMEIRA DOBRA (HERO) --- */}
      {/* AJUSTE: Altura de 200vh para permitir o preenchimento total da tela antes da revelação */}
      <div ref={containerRef} className="relative w-full h-[200vh]">
        <div className="sticky top-0 left-0 w-full h-screen overflow-hidden flex flex-col bg-zinc-900">
          
          <div 
            className="absolute inset-0 z-50 w-full h-full pointer-events-none opacity-20 mix-blend-plus-lighter"
            style={{ backgroundImage: "url('https://rtl4013zxp.easybuilder.com.br/wp-content/uploads/2025/06/ruido-animado.gif')" }}
          />

          <video
            autoPlay
            loop
            muted
            playsInline
            controls={false}
            className="absolute top-0 left-0 w-full h-full object-cover z-0 opacity-90 pointer-events-none"
            src="https://raw.githubusercontent.com/legendragon03453-dot/UNICO-SITE-FINAL/main/UNCI%20BG%20FDS.webm"
          />

          <motion.div style={{ opacity: heroContentOpacity }} className="flex flex-col h-full w-full">
            <header className="relative z-[60] w-full pt-6 md:pt-10 px-4 sm:px-6 md:px-10 flex flex-col md:flex-row items-center justify-between gap-4 md:gap-0">
              <div className="flex md:hidden w-full justify-between items-start pointer-events-none">
                <p className="text-[8px] tracking-widest font-light uppercase text-white/60 text-left max-w-[120px] leading-relaxed">
                  {t.heroTop}
                </p>
                <LanguageToggle lang={lang} setLang={setLang} />
              </div>

              <div className="hidden md:block w-1/3 pointer-events-none">
                <p className="text-[9px] md:text-[10px] tracking-widest font-light uppercase text-white/60 text-left max-w-[160px] leading-relaxed">
                  {t.heroTop}
                </p>
              </div>

              <div className="flex justify-center w-full md:w-1/3">
                <SlideTabs tabs={t.nav} />
              </div>

              <div className="hidden md:flex w-1/3 justify-end items-center pointer-events-none">
                <LanguageToggle lang={lang} setLang={setLang} />
              </div>
            </header>

            <main className="relative z-10 flex-1 flex flex-col items-center justify-center pointer-events-none">
              <div className="flex flex-col items-stretch w-fit -mt-12 sm:-mt-16 md:-mt-24">
                <h1 
                  className="text-[5rem] sm:text-[7rem] md:text-[10rem] lg:text-[13rem] leading-normal p-4 md:p-10 overflow-visible whitespace-nowrap tracking-wider text-white opacity-90 text-center"
                  style={{ fontFamily: "'Hypik', sans-serif" }}
                >
                  &nbsp;UNICO&nbsp;
                </h1>
                
                <div className="flex flex-wrap justify-center gap-3 sm:gap-6 md:gap-16 w-full -mt-[30px] sm:-mt-[50px] md:-mt-[90px] lg:-mt-[120px] text-[8px] sm:text-[10px] md:text-sm lg:text-base tracking-[0.2em] text-white/80 uppercase font-light">
                  <span>{t.heroSub1}</span>
                  <span>{t.heroSub2}</span>
                  <span>{t.heroSub3}</span>
                </div>

                <div className="flex justify-center mt-10 sm:mt-12 md:mt-16 pointer-events-auto">
                  <button 
                    onClick={() => setIsQuizOpen(true)}
                    className="shiny-btn shiny-btn-lg"
                  >
                    <span>{t.sec2BtnQuote}</span>
                  </button>
                </div>
              </div>
            </main>

          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 md:bottom-10 z-20 pointer-events-none w-full flex justify-center">
            <p className="text-white/60 text-[8px] sm:text-[9px] md:text-xs tracking-widest font-light uppercase text-center px-4">
              {t.footer}
            </p>
          </div>

          <motion.div 
            style={{ opacity: indicatorOpacity }}
            className="absolute bottom-16 md:bottom-24 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center pointer-events-none"
          >
            <span className="text-[9px] md:text-[10px] tracking-widest font-light uppercase text-white/50 mb-2">
              {t.scroll}
            </span>
            <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white/50">
                <path d="M12 5v14M19 12l-7 7-7-7"/>
              </svg>
            </motion.div>
          </motion.div>

          </motion.div>

          <GridOverlay scrollYProgress={scrollYProgress} />
        </div>
      </div>

      {/* --- SEGUNDA DOBRA (PORTFÓLIO) --- */}
      <motion.section 
        id="portfolio" 
        style={{ opacity: useTransform(scrollYProgress, [0.7, 0.85], [0, 1]) }}
        className="relative z-[150] w-full min-h-screen bg-white flex flex-col items-start justify-start text-zinc-900 -mt-[100vh] py-24 pb-12 px-4 sm:px-[20px] md:px-10"
      >
        <div className="w-full flex flex-col md:flex-row justify-between items-start md:items-end gap-2 mb-12">
          <h2 
            className="text-left text-3xl sm:text-4xl md:text-5xl lg:text-7xl tracking-[0.2em] uppercase font-normal leading-tight"
            style={{ fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}
          >
            {t.sec2Title1} <br className="md:hidden" /> <span className="font-bold tracking-wider">{t.sec2Title2}</span>
          </h2>
          <span className="text-[9px] sm:text-[10px] md:text-xs tracking-widest font-light uppercase text-zinc-400 md:pb-3">
            {"<BY FILIPPO>"}
          </span>
        </div>

        <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
          {projects.map((project) => (
            <a 
              key={project.id} 
              href={project.link || "#"} 
              className="relative block w-full rounded-[15px] overflow-hidden aspect-video group cursor-pointer transition-all duration-500 hover:scale-[1.01] shadow-2xl"
            >
              <video 
                src={project.video_url || project.video} 
                poster={project.poster_url || project.poster}
                autoPlay 
                loop 
                muted 
                playsInline 
                className="absolute inset-0 w-full h-full object-cover z-0 transition-transform duration-700 ease-out group-hover:scale-105" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 z-10 transition-opacity duration-500" />
              <div className="absolute inset-0 z-30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 pointer-events-none">
                <div className="bg-white/10 backdrop-blur-md text-white px-8 py-3 rounded-full border border-white/20 uppercase tracking-widest text-xs font-semibold transform translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                  {t.cardHover}
                </div>
              </div>
              <div className="absolute bottom-6 left-6 md:bottom-10 md:left-10 z-20 flex flex-col gap-4">
                <h5 
                  className="text-white text-xl sm:text-2xl md:text-4xl tracking-wide font-normal"
                  style={{ fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}
                >
                  {project.title}
                </h5>
                <div className="flex flex-wrap gap-2">
                  {project.tags?.map((tag: string) => (
                    <div key={tag} className="rounded-full px-4 py-1.5 backdrop-blur-xl border border-white/20" style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}>
                      <p className="text-white text-[10px] md:text-xs font-medium tracking-widest uppercase">
                        {tag}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </a>
          ))}
        </div>

        <div className="mt-20 w-full flex items-center justify-center gap-8">
          <button className="text-[10px] md:text-xs uppercase tracking-[0.3em] font-bold hover:opacity-50 transition-opacity duration-300">
            {t.sec2Btn}
          </button>
          <div className="w-[1px] h-8 bg-zinc-200"></div>
          <button onClick={() => setIsQuizOpen(true)} className="shiny-btn">
            <span>{t.sec2BtnQuote}</span>
          </button>
        </div>
      </motion.section>

      {/* --- TERCEIRA DOBRA (ÓRBITA 3D E TRANSIÇÃO) --- */}
      <section id="influencers" ref={sec3Ref} className="relative w-full h-[150vh]">
        <div 
          className="sticky top-0 left-0 w-full h-screen bg-zinc-950 overflow-hidden"
          onMouseMove={handleMouseMove}
          style={{ perspective: "1500px" }}
        >
          <motion.div 
            style={{ opacity: sec3TextOpacity }}
            className="absolute top-24 left-0 right-0 z-30 text-center px-4 w-full pointer-events-none"
          >
             <h2 
              className="text-2xl md:text-5xl lg:text-6xl text-white tracking-widest uppercase font-normal leading-relaxed" 
              style={{ fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}
             >
               {t.sec3Title1} <br />
               {t.sec3Title2} <span className="font-bold text-[#74FE03]">{t.sec3Title3}</span>
             </h2>
          </motion.div>

          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
            <motion.div 
               className="relative flex items-center justify-center"
               style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
            >
               <motion.div 
                  className="absolute z-50 w-32 h-32 md:w-56 md:h-56 rounded-full shadow-[0_0_80px_rgba(116,254,3,0.2)] ring-8 ring-white/5 bg-zinc-900 flex items-center justify-center overflow-hidden"
                  style={{ rotateX: invRotateX, rotateY: invRotateY, scale: centralImageScale, transformStyle: "preserve-3d" }}
               >
                  <img src={CENTRAL_IMAGE} alt="Único" className="w-full h-full object-cover" />
               </motion.div>

               <SaturnRing radius={200} duration={30} direction={1} invX={invRotateX} invY={invRotateY} scale={ringsScale} images={ORBIT_IMAGES.slice(0, 3)} />
               <SaturnRing radius={380} duration={45} direction={-1} invX={invRotateX} invY={invRotateY} scale={ringsScale} images={ORBIT_IMAGES.slice(3, 6)} />
               <SaturnRing radius={580} duration={60} direction={1} invX={invRotateX} invY={invRotateY} scale={ringsScale} images={ORBIT_IMAGES.slice(6, 9)} />
            </motion.div>
          </div>

          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-40">
            <motion.div className="w-40 h-40 bg-white rounded-full" style={{ scale: whiteCircleScale }} />
          </div>
        </div>
      </section>

      {/* --- QUARTA DOBRA (SERVIÇOS) --- */}
      <section id="servicos" className="relative z-[150] w-full min-h-screen bg-white flex flex-col items-start pt-32 pb-24 px-4 sm:px-[20px] md:px-10">
        <h2 className="text-4xl md:text-7xl tracking-[0.2em] uppercase font-bold text-left mb-16 tracking-tighter" style={{ fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}>
          {t.sec4Title}
        </h2>
        <div className="w-full">
          <ServicesAccordion data={t.servicesData} />
        </div>

        <div className="w-full mt-32 flex justify-center">
          <h3 className="text-2xl md:text-5xl font-bold tracking-[0.1em] text-center uppercase max-w-6xl leading-tight text-black" style={{ fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}>
            {t.sec4Footer}
          </h3>
        </div>
      </section>

      {/* --- QUINTA DOBRA (BIO & ESTATÍSTICAS) --- */}
      <section id="bio" className="relative z-[150] w-full bg-white flex flex-col items-center pt-8 pb-32 px-4 sm:px-[20px] md:px-10">
        <div className="w-full max-w-7xl grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
          {t.stats.map((stat, i) => (
            <div key={i} className="border-2 border-black rounded-[20px] p-12 flex flex-col justify-center items-start hover:bg-black hover:text-white transition-all duration-500 group">
              <h2 className="text-6xl font-bold mb-4 tracking-tighter" style={{ fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}>
                {stat.num}<span className="text-3xl font-light opacity-50">{stat.suffix}</span>
              </h2>
              <p className="text-xs uppercase tracking-[0.4em] font-bold opacity-60 group-hover:opacity-100">
                {stat.label}
              </p>
            </div>
          ))}
        </div>

        <div className="w-full max-w-7xl border-2 border-black rounded-[20px] flex flex-col lg:flex-row overflow-hidden">
          <div className="relative w-full lg:w-[45%] h-[500px] lg:h-auto border-b lg:border-b-0 lg:border-r-2 border-black">
            <img src="https://raw.githubusercontent.com/legendragon03453-dot/FILIPPO-SITE/main/project.webp" alt="Filippo" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
            <div className="absolute bottom-10 left-10 text-white">
              <h4 className="text-3xl font-bold mb-2 tracking-widest uppercase" style={{ fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}>{t.bioName}</h4>
              <p className="text-xs font-mono uppercase tracking-[0.3em] text-zinc-400">{t.bioRole}</p>
            </div>
          </div>

          <div className="w-full lg:w-[55%] p-10 md:p-20 flex flex-col justify-center">
            <h3 className="text-4xl md:text-6xl font-bold mb-10 uppercase tracking-tighter text-black" style={{ fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}>{t.bioTitle}</h3>
            <div className="flex flex-col gap-8 text-zinc-600 text-lg leading-relaxed mb-16 font-light">
              <p>{t.bioP1}</p>
              <p>{t.bioP2}</p>
              <p>{t.bioP3}</p>
            </div>
            <button className="group flex items-center justify-between w-full max-w-md px-10 py-6 border-2 border-black rounded-full hover:bg-black hover:text-white transition-all duration-500">
              <span className="text-xs uppercase tracking-[0.5em] font-black">{t.bioBtn}</span>
              <motion.div animate={{ x: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 2 }}>
                <ArrowRight className="w-6 h-6" />
              </motion.div>
            </button>
          </div>
        </div>
      </section>

      {/* --- SEXTA DOBRA (FOOTER / CONTATO) --- */}
      <footer id="orcamento" className="relative z-[200] w-full bg-black text-white flex flex-col items-center pt-32 pb-16 px-4 md:px-10">
        <div className="flex flex-col items-center text-center max-w-6xl mx-auto mb-32">
          <h2 className="text-3xl md:text-7xl font-bold uppercase tracking-tight leading-tight mb-16" style={{ fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}>
            <span className="block text-zinc-700 mb-4">{t.sec6Title1}</span>
            <span className="flex flex-col md:flex-row items-center justify-center gap-6">
              <span>{t.sec6Title2}</span>
              <span style={{ fontFamily: "'Hypik', sans-serif" }} className="text-5xl md:text-9xl text-[#74FE03]">{t.sec6Title3}</span>
            </span>
          </h2>
          <button onClick={() => setIsQuizOpen(true)} className="shiny-btn shiny-btn-lg">
            <span>{t.sec6Btn}</span>
          </button>
        </div>

        <div className="w-full max-w-7xl flex flex-col md:flex-row items-center justify-between border-t border-white/10 pt-12 gap-8">
          <div className="flex gap-8 text-[10px] tracking-[0.4em] uppercase font-black text-zinc-500">
            {t.sec6Links.map((link) => (
              <a key={link} href="#" className="hover:text-white transition-all">{link}</a>
            ))}
          </div>
          <p className="text-[10px] tracking-widest text-zinc-700 uppercase">{t.sec6Copy}</p>
        </div>
      </footer>

      {/* MODAL QUIZ */}
      <AnimatePresence>
        {isQuizOpen && <LeadQuiz onClose={() => setIsQuizOpen(false)} lang={lang} />}
      </AnimatePresence>
    </div>
  );
}

// ==========================================
// COMPONENTES AUXILIARES
// ==========================================

const LeadQuiz = ({ onClose, lang }: { onClose: () => void, lang: 'pt' | 'en' }) => {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({ name: '', email: '', company: '', revenue: '', instagram: '', objective: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDone, setIsDone] = useState(false);

  const steps = [
    { id: 'name', label: lang === 'pt' ? 'Qual o seu nome?' : "What's your name?", placeholder: 'Seu nome completo', icon: <User />, type: 'text' },
    { id: 'email', label: lang === 'pt' ? 'Seu melhor e-mail?' : 'Your best email?', placeholder: 'email@exemplo.com', icon: <Send />, type: 'email' },
    { id: 'revenue', label: lang === 'pt' ? 'Qual o faturamento mensal atual?' : 'Current monthly revenue?', type: 'select', options: ['0 - 10k', '10k - 50k', '50k - 100k', '100k - 200k', '200k+'], icon: <DollarSign /> },
    { id: 'objective', label: lang === 'pt' ? 'Qual o seu principal objetivo?' : 'What is your main goal?', placeholder: 'Descreva seu projeto...', icon: <Target />, type: 'textarea' }
  ];

  const handleNext = () => { if (step < steps.length - 1) setStep(step + 1); else submitLead(); };

  const submitLead = async () => {
    setIsSubmitting(true);
    try {
      const score = formData.revenue.includes('200k') ? 100 : (formData.revenue.includes('100k') ? 90 : 50);
      await supabase.from('leads').insert([{ ...formData, score, status: 'Triagem' }]);
      setIsDone(true);
      setTimeout(onClose, 3000);
    } catch (e) { alert('Erro ao enviar.'); }
    setIsSubmitting(false);
  };

  const currentStep = steps[step];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[300] bg-black/95 backdrop-blur-2xl flex items-center justify-center p-6">
      <button onClick={onClose} className="absolute top-10 right-10 text-white/40 hover:text-white transition-all"><X className="w-10 h-10" /></button>
      <div className="w-full max-w-2xl">
        {!isDone ? (
          <motion.div key={step} initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} className="flex flex-col gap-12">
            <div className="flex items-center gap-6"><div className="w-16 h-16 rounded-full border-2 border-[#74FE03] flex items-center justify-center text-[#74FE03]">{currentStep.icon}</div><h3 className="text-3xl md:text-5xl font-bold text-white uppercase tracking-tighter">{currentStep.label}</h3></div>
            {currentStep.type === 'select' ? (
              <div className="grid grid-cols-1 gap-4">{currentStep.options?.map((opt: string) => (<button key={opt} onClick={() => { setFormData({ ...formData, [currentStep.id]: opt }); setTimeout(handleNext, 300); }} className={`w-full p-6 h-20 rounded-2xl border-2 text-left text-xl transition-all ${formData[currentStep.id as keyof typeof formData] === opt ? 'border-[#74FE03] bg-[#74FE03]/10 text-white' : 'border-white/10 bg-white/5 text-white/50 hover:border-white/20'}`}>{opt}</button>))}</div>
            ) : currentStep.type === 'textarea' ? (
              <textarea autoFocus placeholder={currentStep.placeholder} value={formData[currentStep.id as keyof typeof formData]} onChange={(e) => setFormData({ ...formData, [currentStep.id]: e.target.value })} className="w-full bg-transparent border-b-4 border-white/20 py-4 text-2xl md:text-4xl text-white outline-none focus:border-[#74FE03] transition-colors h-48 resize-none" />
            ) : (
              <input autoFocus type={currentStep.type} placeholder={currentStep.placeholder} value={formData[currentStep.id as keyof typeof formData]} onChange={(e) => setFormData({ ...formData, [currentStep.id]: e.target.value })} onKeyDown={(e) => e.key === 'Enter' && handleNext()} className="w-full bg-transparent border-b-4 border-white/20 py-4 text-3xl md:text-6xl text-white outline-none focus:border-[#74FE03] transition-colors" />
            )}
            <div className="flex justify-between items-center mt-12">
              <button onClick={() => step > 0 && setStep(step - 1)} className={`text-white/30 hover:text-white uppercase tracking-[0.5em] text-xs font-black ${step === 0 ? 'opacity-0' : ''}`}>BACK</button>
              <button onClick={handleNext} disabled={isSubmitting || !formData[currentStep.id as keyof typeof formData]} className="bg-white text-black px-12 py-6 rounded-full font-black uppercase tracking-[0.3em] text-sm flex items-center gap-4 disabled:opacity-20 hover:bg-[#74FE03] transition-all">
                {isSubmitting ? <Loader2 className="w-6 h-6 animate-spin" /> : (step === steps.length - 1 ? 'FINISH' : 'NEXT')}
              </button>
            </div>
          </motion.div>
        ) : (
          <div className="flex flex-col items-center gap-8 text-center"><div className="w-32 h-32 rounded-full bg-[#74FE03] flex items-center justify-center text-black"><Check className="w-16 h-16" /></div><h2 className="text-5xl font-black text-white uppercase tracking-tighter">SUCCESS</h2><p className="text-white/50 text-xl max-w-md">Our AI is analyzing your application. We will contact you soon.</p></div>
        )}
      </div>
    </motion.div>
  );
};

const ServicesAccordion = ({ data }: { data: any[] }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  return (
    <div className="w-full flex flex-col md:flex-row h-[1200px] md:h-[700px] gap-6">
      {data.map((item, index) => {
        const isActive = activeIndex === index;
        return (
          <motion.div key={item.id} onMouseEnter={() => setActiveIndex(index)} onClick={() => setActiveIndex(index)} animate={{ flex: isActive ? 8 : 1 }} transition={{ type: "spring", stiffness: 300, damping: 30 }} className="relative bg-transparent rounded-[20px] overflow-hidden cursor-pointer border-2 border-black flex-shrink-0 group">
            <div className="relative w-full h-full flex">
               <motion.div animate={{ opacity: isActive ? 0 : 1 }} className="absolute inset-0 flex items-center justify-center pointer-events-none">
                 <h4 className="text-black font-black uppercase tracking-[0.4em] whitespace-nowrap text-2xl hidden md:block" style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}>{item.title}</h4>
                 <h4 className="text-black font-black uppercase tracking-[0.2em] md:hidden">{item.title}</h4>
               </motion.div>
               <motion.div animate={{ opacity: isActive ? 1 : 0 }} className="w-full h-full flex flex-col md:flex-row p-12 gap-12 overflow-hidden">
                  <div className="flex-1 flex flex-col justify-between min-w-[300px]">
                    <div>
                      <h4 className="text-4xl md:text-7xl text-black font-black leading-none mb-10 tracking-tighter">
                         {item.titleSplit.map((part: string, pI: number) => <span key={pI} className="block">{part}</span>)}
                      </h4>
                      <p className="text-zinc-500 text-lg leading-relaxed max-w-md mb-12 font-light">{item.desc}</p>
                    </div>
                    <div className="flex flex-col gap-4">
                       {item.subs.map((sub: string, sI: number) => (
                         <div key={sI} className="flex items-center gap-4 group/item">
                           <div className="w-2 h-2 bg-black rounded-full transition-all group-hover/item:scale-150" />
                           <span className="text-zinc-400 font-bold text-sm tracking-widest uppercase hover:text-black transition-colors">{sub}</span>
                         </div>
                       ))}
                    </div>
                  </div>
                  <div className="flex-[1.5] w-full h-full rounded-[15px] overflow-hidden border-2 border-black">
                     <video src={item.video} autoPlay loop muted playsInline className="w-full h-full object-cover" />
                  </div>
               </motion.div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

const SaturnRing = ({ radius, duration, images, direction, invX, invY, scale }: any) => {
  return (
    <motion.div className="absolute rounded-full border border-white/5 flex items-center justify-center" style={{ width: radius * 2, height: radius * 2, transformStyle: "preserve-3d", scale }} animate={{ rotateZ: 360 * direction }} transition={{ duration, repeat: Infinity, ease: "linear" }}>
      {images.map((src: string, i: number) => {
        const angle = (i / images.length) * 360;
        const rad = angle * (Math.PI / 180);
        const x = Math.cos(rad) * 50; 
        const y = Math.sin(rad) * 50;
        return (
          <div key={i} className="absolute w-16 h-16 md:w-24 md:h-24 -translate-x-1/2 -translate-y-1/2" style={{ left: `calc(50% + ${x}%)`, top: `calc(50% + ${y}%)`, transformStyle: "preserve-3d" }}>
            <motion.div className="w-full h-full" animate={{ rotateZ: -360 * direction }} transition={{ duration, repeat: Infinity, ease: "linear" }} style={{ transformStyle: "preserve-3d" }}>
              <motion.img src={src} className="w-full h-full rounded-full object-cover shadow-2xl border-4 border-white/10" style={{ rotateX: invX, rotateY: invY }} />
            </motion.div>
          </div>
        );
      })}
    </motion.div>
  );
};

// GRID BRUTALISTA: Animação de quadrados que preenchem a tela
const GridOverlay = ({ scrollYProgress }: { scrollYProgress: any }) => {
  // Aumentamos a densidade para um visual mais "preenchido" e premium
  const cols = 25;
  const rows = 20;

  const squares = useMemo(() => {
    return Array.from({ length: cols * rows }).map((_, i) => {
      const x = i % cols;
      const y = Math.floor(i / cols);
      
      // Padrão de revelação: Fluxo orgânico do centro e de cima para baixo
      const centerX = cols / 2;
      const centerY = rows / 2;
      const distFromCenter = Math.sqrt(Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2)) / (cols / 1.5);
      const verticalPos = y / rows;
      
      // Sincronizado com o heroContentOpacity (que vai de 0.4 a 0.6)
      // Queremos que comece um pouco antes e termine logo depois
      const bias = (verticalPos * 0.2) + (distFromCenter * 0.1);
      const start = 0.25 + bias + Math.random() * 0.2; 
      const end = Math.min(start + 0.15, 0.75); // Garante que tudo esteja branco perto de 0.75
      
      return { id: i, start, end, x, y };
    });
  }, [cols, rows]);

  return (
    <div
      className="absolute inset-0 z-[100] pointer-events-none grid"
      style={{
        gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
        gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))`
      }}
    >
      {squares.map((sq) => (
        <Square key={sq.id} scrollYProgress={scrollYProgress} start={sq.start} end={sq.end} />
      ))}
    </div>
  );
};

const Square = ({ scrollYProgress, start, end }: { scrollYProgress: any, start: number, end: number }) => {
  // Transformações para tornar a entrada do quadrado mais dinâmica
  const opacity = useTransform(scrollYProgress, [start, end], [0, 1]);
  const scale = useTransform(scrollYProgress, [start, Math.min(end + 0.05, 1)], [0.5, 1.05]);
  const rotate = useTransform(scrollYProgress, [start, end], [12, 0]);
  
  return (
    <motion.div 
      style={{ 
        opacity, 
        scale,
        rotate,
        willChange: "opacity, transform" 
      }} 
      className="bg-white w-full h-full border-[0.5px] border-zinc-100/10" 
    />
  );
};


const SlideTabs = ({ tabs }: { tabs: any[] }) => {
  const [position, setPosition] = useState({ left: 0, width: 0, opacity: 0 });
  return (
    <ul onMouseLeave={() => setPosition((pv) => ({ ...pv, opacity: 0 }))} className="relative mx-auto flex w-fit rounded-full border-2 border-white/10 p-1.5 shadow-2xl pointer-events-auto backdrop-blur-xl">
      {tabs.map((tab) => <Tab key={tab.label} href={tab.href} setPosition={setPosition}>{tab.label}</Tab>)}
      <Cursor position={position} />
    </ul>
  );
};

const Tab = ({ children, href, setPosition }: any) => {
  const ref = useRef<HTMLLIElement>(null);
  const handleClick = (e: React.MouseEvent) => { e.preventDefault(); document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' }); };
  return (
    <li ref={ref} onClick={handleClick} onMouseEnter={() => { if (!ref?.current) return; const { width } = ref.current.getBoundingClientRect(); setPosition({ left: ref.current.offsetLeft, width, opacity: 1 }); }} className="relative z-10 block cursor-pointer px-6 py-3 text-[10px] md:text-sm uppercase text-white font-bold leading-none tracking-widest transition-opacity hover:opacity-100 opacity-60">
      {children}
    </li>
  );
};

const Cursor = ({ position }: any) => <motion.li animate={position} transition={{ type: "spring", stiffness: 400, damping: 30 }} className="absolute z-0 h-10 rounded-full bg-white/10 md:h-10" />;
