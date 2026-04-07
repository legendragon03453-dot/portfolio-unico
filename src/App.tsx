// @ts-nocheck
import React, { useState, useRef, useMemo } from 'react';
import { motion, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion';

// Injetando a fonte customizada globalmente e as keyframes
const FontStyle = () => (
  <style dangerouslySetInnerHTML={{__html: `
    @font-face {
      font-family: 'Hypik';
      src: url('https://raw.githubusercontent.com/legendragon03453-dot/UNICO-SITE-FINAL/main/hypik.otf') format('opentype');
      font-weight: normal;
      font-style: normal;
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
  `}} />
);

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

const PROJECTS = [
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

const LanguageToggle = ({ lang, setLang }) => (
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
  
  const [lang, setLang] = useState('pt');
  const t = translations[lang];

  // A MÁGICA COMEÇA AQUI: "end start" obriga a tela a travar e esperar o branco
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const indicatorOpacity = useTransform(scrollYProgress, [0, 0.05], [1, 0]);

  const sec3Ref = useRef(null);
  const { scrollYProgress: sec3Progress } = useScroll({
    target: sec3Ref,
    offset: ["start start", "end end"]
  });

  const sec3TextOpacity = useTransform(sec3Progress, [0, 0.2], [1, 0]);
  const ringsScale = useTransform(sec3Progress, [0.1, 0.8], [1, 0]);
  const centralImageScale = useTransform(sec3Progress, [0.75, 0.8], [1, 0]);
  const whiteCircleScale = useTransform(sec3Progress, [0.8, 1], [0, 50]);
  
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const smoothX = useSpring(mouseX, { stiffness: 50, damping: 20 });
  const smoothY = useSpring(mouseY, { stiffness: 50, damping: 20 });

  const rotateX = useTransform(smoothY, [-0.5, 0.5], [55, 85]); 
  const rotateY = useTransform(smoothX, [-0.5, 0.5], [-25, 25]);

  const invRotateX = useTransform(rotateX, v => -v);
  const invRotateY = useTransform(rotateY, v => -v);

  const handleMouseMove = (e) => {
    const { clientX, clientY } = e;
    const x = (clientX / window.innerWidth) - 0.5;
    const y = (clientY / window.innerHeight) - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

    <div id="home" className="bg-zinc-900 font-sans">
      <FontStyle />

      {/* A MÁGICA CONTINUA: 200vh exatos para dar o timing perfeito do scroll */}
      <div ref={containerRef} className="relative w-full h-[200vh]">
        <div className="sticky top-0 left-0 w-full h-screen overflow-hidden flex flex-col">
          
          <div 
            className="absolute inset-0 z-50 w-full h-full pointer-events-none opacity-20 mix-blend-plus-lighter"
            style={{ backgroundImage: "url('https://rtl4013zxp.easybuilder.com.br/wp-content/uploads/2025/06/ruido-animado.gif')" }}
          />

          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute top-0 left-0 w-full h-full object-cover z-0 opacity-90"
            src="https://raw.githubusercontent.com/legendragon03453-dot/UNICO-SITE-FINAL/main/UNCI%20BG%20FDS.webm"
          />

          <header className="relative z-20 w-full pt-6 md:pt-10 px-4 sm:px-6 md:px-10 flex flex-col md:flex-row items-center justify-between gap-4 md:gap-0">
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
                  onClick={() => document.querySelector('#orcamento')?.scrollIntoView({ behavior: 'smooth' })}
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

          {/* GRID COM Z-INDEX GIGANTE PARA COBRIR TUDO COM BRANCO */}
          <GridOverlay scrollYProgress={scrollYProgress} />
        </div>
      </div>

      {/* O VILÃO MORTO: Removido o '-mt-[100vh]' e ajustado o z-index para 50 para o portfólio nascer DEPOIS dos quadrados brancos */}
      <section id="portfolio" className="relative z-50 w-full min-h-screen bg-white flex flex-col items-start justify-start text-zinc-900 py-24 pb-12">
        <div className="w-full flex flex-col md:flex-row justify-between items-start md:items-end px-4 sm:px-[20px] md:px-10 gap-2">
          <h2 
            className="text-left text-3xl sm:text-4xl md:text-5xl lg:text-7xl tracking-[0.2em] uppercase font-normal"
            style={{ fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}
          >
            {t.sec2Title1} <span className="font-bold tracking-wider">{t.sec2Title2}</span>
          </h2>
          <span className="text-[9px] sm:text-[10px] md:text-xs tracking-widest font-light uppercase text-zinc-400 md:pb-3">
            {"<BY FILIPPO>"}
          </span>
        </div>

        <div className="w-full px-4 sm:px-[20px] md:px-10 mt-8 sm:mt-12 grid grid-cols-1 lg:grid-cols-2 gap-6">
          {PROJECTS.map((project) => (
            <a 
              key={project.id} 
              href={project.link} 
              className="relative block w-full rounded-[10px] overflow-hidden aspect-video group cursor-pointer transition-transform duration-500 hover:scale-[1.02] shadow-sm hover:shadow-xl"
            >
              <video 
                src={project.video} 
                poster={project.poster}
                autoPlay 
                loop 
                muted 
                playsInline 
                className="absolute inset-0 w-full h-full object-cover z-0 scale-105 group-hover:scale-100 transition-transform duration-700 ease-out" 
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/30 z-10 transition-opacity duration-500 group-hover:opacity-80" />
              <div className="absolute inset-0 z-30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 pointer-events-none">
                <div className="bg-white/10 backdrop-blur-md text-white px-6 py-3 rounded-full border border-white/20 uppercase tracking-widest text-[10px] md:text-xs font-semibold transform translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                  {t.cardHover}
                </div>
              </div>
              <div className="absolute top-4 left-4 md:top-6 md:left-6 z-20 flex flex-col gap-3">
                <h5 
                  className="text-white text-lg sm:text-xl md:text-2xl tracking-wide drop-shadow-md"
                  style={{ fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}
                >
                  {project.title}
                </h5>
                <div className="flex flex-wrap gap-2">
                  {project.tags.map(tag => (
                    <div key={tag} className="rounded-[5px] px-3 py-1.5 backdrop-blur-[15px]" style={{ backgroundColor: 'rgba(240, 240, 240, 0.25)' }}>
                      <p className="text-[#f4f2ee] text-[9px] sm:text-[10px] md:text-xs font-medium tracking-wide drop-shadow-sm">
                        {tag}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </a>
          ))}
        </div>

        <div className="mt-12 sm:mt-16 w-full flex items-center justify-center gap-6">
          <button className="text-[9px] sm:text-[10px] md:text-xs uppercase tracking-widest font-light hover:opacity-50 transition-opacity duration-300">
            {t.sec2Btn}
          </button>
          <div className="w-[1px] h-6 bg-zinc-300"></div>
          <button className="shiny-btn">
            <span>{t.sec2BtnQuote}</span>
          </button>
        </div>
      </section>

      {/* --- TERCEIRA DOBRA (ÓRBITA 3D E TRANSIÇÃO) --- */}
      <section id="influencers" ref={sec3Ref} className="relative w-full h-[150vh]">
        <div 
          className="sticky top-0 left-0 w-full h-screen bg-zinc-950 overflow-hidden"
          onMouseMove={handleMouseMove}
          style={{ perspective: "1500px" }}
        >
          {/* Texto Absoluto no Topo */}
          <motion.div 
            style={{ opacity: sec3TextOpacity }}
            className="absolute top-16 sm:top-20 md:top-24 left-0 right-0 z-30 text-center px-4 w-full pointer-events-none"
          >
             <h2 
              className="text-xl sm:text-2xl md:text-4xl lg:text-5xl text-white tracking-widest uppercase font-normal drop-shadow-md leading-[1.6] md:leading-[1.8]" 
              style={{ fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}
             >
               {t.sec3Title1} <br />
               {t.sec3Title2} <span className="font-bold">{t.sec3Title3}</span>
             </h2>
          </motion.div>

          {/* Container Global 3D */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
            <motion.div 
               className="relative flex items-center justify-center"
               style={{ 
                 rotateX, 
                 rotateY,
                 transformStyle: "preserve-3d" 
               }}
            >

               {/* Imagem Central */}
               <motion.div 
                  className="absolute z-50 w-20 h-20 sm:w-24 sm:h-24 md:w-40 md:h-40 rounded-full shadow-[0_0_50px_rgba(255,255,255,0.15)] ring-4 ring-white/10 bg-zinc-800 flex items-center justify-center"
                  style={{ 
                    rotateX: invRotateX, 
                    rotateY: invRotateY,
                    scale: centralImageScale,
                    transformStyle: "preserve-3d"
                  }}
               >
                  <img 
                    src={CENTRAL_IMAGE} 
                    alt="Central Profile" 
                    className="w-[95%] h-[95%] rounded-full object-cover" 
                  />
               </motion.div>

               {/* Anéis de Saturno */}
               <SaturnRing radius={200} duration={30} direction={1} invX={invRotateX} invY={invRotateY} scale={ringsScale} images={ORBIT_IMAGES.slice(0, 3)} />
               <SaturnRing radius={350} duration={45} direction={-1} invX={invRotateX} invY={invRotateY} scale={ringsScale} images={ORBIT_IMAGES.slice(3, 6)} />
               <SaturnRing radius={500} duration={60} direction={1} invX={invRotateX} invY={invRotateY} scale={ringsScale} images={ORBIT_IMAGES.slice(6, 9)} />
               
               <SaturnRing radius={650} duration={75} direction={-1} invX={invRotateX} invY={invRotateY} scale={ringsScale} images={[]} />
               <SaturnRing radius={800} duration={90} direction={1} invX={invRotateX} invY={invRotateY} scale={ringsScale} images={[]} />
               <SaturnRing radius={950} duration={105} direction={-1} invX={invRotateX} invY={invRotateY} scale={ringsScale} images={[]} />

            </motion.div>
          </div>

          {/* OVERLAYS DE TRANSIÇÃO (Círculo Branco) */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-40">
            <motion.div
               className="w-32 h-32 bg-white rounded-full"
               style={{ scale: whiteCircleScale }}
            />
          </div>

        </div>
      </section>

      {/* --- QUARTA DOBRA (SERVIÇOS) --- */}
      <section id="servicos" className="relative z-[150] w-full min-h-screen bg-white flex flex-col items-start justify-center text-zinc-900 pt-24 pb-12 px-4 sm:px-[20px] md:px-10">
        
        {/* Cabeçalho da Sessão 4 */}
        <h2 
          className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl tracking-[0.2em] uppercase font-bold text-left mb-8 sm:mb-12"
          style={{ fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}
        >
          {t.sec4Title}
        </h2>
        
        {/* Componente de Acordeão com os Cards de Serviço */}
        <div className="w-full">
          <ServicesAccordion data={t.servicesData} />
        </div>

        {/* Frase de Impacto Final da Sessão 4 */}
        <div className="w-full mt-12 sm:mt-16 md:mt-24 flex justify-center">
          <h3 
            className="text-xl sm:text-2xl md:text-4xl lg:text-5xl font-bold tracking-widest text-center uppercase max-w-5xl leading-snug text-black"
            style={{ fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}
          >
            {t.sec4Footer}
          </h3>
        </div>
        
      </section>

      {/* --- QUINTA DOBRA (BIO & ESTATÍSTICAS) --- */}
      <section id="bio" className="relative z-[150] w-full bg-white flex flex-col items-center justify-start text-zinc-900 pt-8 pb-24 px-4 sm:px-[20px] md:px-10">
        
        {/* Grid de Estatísticas (Preenchimento nulo, Traçado preto) */}
        <div className="w-full max-w-7xl grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-16">
          {t.stats.map((stat, i) => (
            <div 
              key={i} 
              className="border border-black bg-transparent rounded-[10px] p-6 sm:p-8 md:p-12 flex flex-col justify-center items-start hover:bg-zinc-50 transition-colors duration-300"
            >
              <h2 
                className="text-4xl sm:text-5xl md:text-6xl font-medium mb-2 sm:mb-3 text-black tracking-tight"
                style={{ fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}
              >
                {stat.num}<span className="text-2xl sm:text-3xl md:text-4xl font-light">{stat.suffix}</span>
              </h2>
              <p className="text-[10px] sm:text-xs md:text-sm text-zinc-500 uppercase tracking-widest font-semibold">
                {stat.label}
              </p>
            </div>
          ))}
        </div>

        {/* Layout do Fundador (Filippo) */}
        <div className="w-full max-w-7xl border border-black rounded-[10px] flex flex-col lg:flex-row overflow-hidden bg-transparent">
          
          {/* Lado Esquerdo: Imagem com Overlay */}
          <div className="relative w-full lg:w-[45%] h-[350px] sm:h-[450px] md:h-[500px] lg:h-auto border-b lg:border-b-0 lg:border-r border-black">
            <img 
              src="https://raw.githubusercontent.com/legendragon03453-dot/FILIPPO-SITE/main/project.webp" 
              alt="Filippo Rodrigues" 
              className="w-full h-full object-cover object-center"
            />
            {/* Gradiente escuro para garantir leitura do texto */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>
            
            {/* Textos sobre a imagem */}
            <div className="absolute bottom-6 sm:bottom-8 left-6 sm:left-8 right-6 sm:right-8 text-white">
              <h4 
                className="text-xl sm:text-2xl md:text-3xl font-bold mb-1 sm:mb-2 tracking-widest uppercase"
                style={{ fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}
              >
                {t.bioName}
              </h4>
              <p className="text-[9px] sm:text-[10px] md:text-xs font-mono uppercase tracking-widest text-zinc-300 leading-relaxed">
                {t.bioRole}
              </p>
            </div>
          </div>

          {/* Lado Direito: Textos e CTA */}
          <div className="w-full lg:w-[55%] p-6 sm:p-8 md:p-12 lg:p-16 flex flex-col justify-center bg-transparent">
            <h3 
              className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 sm:mb-8 uppercase tracking-widest text-black"
              style={{ fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}
            >
              {t.bioTitle}
            </h3>
            
            <div className="flex flex-col gap-4 sm:gap-6 text-zinc-600 text-sm md:text-base leading-relaxed mb-8 sm:mb-12 font-light">
              <p>{t.bioP1}</p>
              <p>{t.bioP2}</p>
              <p>{t.bioP3}</p>
            </div>

            {/* Botão Clean com Seta Animada */}
            <button className="group flex items-center justify-between w-fit gap-4 sm:gap-6 px-6 py-3 sm:px-8 sm:py-4 border border-black rounded-full hover:bg-black hover:text-white transition-all duration-300">
              <span className="text-[10px] sm:text-xs md:text-sm uppercase tracking-widest font-bold">
                {t.bioBtn}
              </span>
              <motion.div
                animate={{ x: [0, 5, 0] }}
                transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </motion.div>
            </button>
          </div>
          
        </div>
      </section>

      {/* --- SEXTA DOBRA (FOOTER / CONTATO) --- */}
      <footer id="orcamento" className="relative z-[200] w-full bg-black text-white flex flex-col items-center justify-center pt-24 sm:pt-32 pb-12 px-4 sm:px-[20px] md:px-10">
        
        <div className="flex flex-col items-center text-center max-w-6xl mx-auto mb-16 sm:mb-24 md:mb-32">
          {/* Manchete Final com Tamanho Reduzido e Fonte Hypik no Destaque */}
          <h2 
            className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-bold uppercase tracking-tight leading-snug mb-8 sm:mb-10 md:mb-14"
            style={{ fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}
          >
            <span className="block text-zinc-500 mb-1 sm:mb-2 md:mb-4">{t.sec6Title1}</span>
            <span className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-1 sm:gap-3 md:gap-5 text-white">
              <span>{t.sec6Title2}</span>
              <span 
                style={{ fontFamily: "'Hypik', sans-serif" }} 
                className="font-normal tracking-wide text-4xl sm:text-5xl md:text-7xl lg:text-8xl mt-1 sm:mt-0"
              >
                {t.sec6Title3}
              </span>
            </span>
          </h2>
          
          {/* Botão idêntico ao da Head (tamanho padrão shiny-btn) */}
          <button className="shiny-btn">
            <span>{t.sec6Btn}</span>
          </button>
        </div>

        {/* Rodapé Técnico */}
        <div className="w-full max-w-7xl flex flex-col md:flex-row items-center justify-between border-t border-white/20 pt-8 gap-6 md:gap-0">
          <div className="flex flex-wrap justify-center gap-3 sm:gap-4 md:gap-6 text-[9px] sm:text-[10px] md:text-xs tracking-widest uppercase font-semibold text-zinc-400">
            {t.sec6Links.map((link, i) => (
              <React.Fragment key={link}>
                <a href="#" className="hover:text-white transition-colors duration-300">{link}</a>
                {i < t.sec6Links.length - 1 && <span className="text-zinc-700 hidden sm:inline">—</span>}
              </React.Fragment>
            ))}
          </div>
          <p className="text-[8px] sm:text-[9px] md:text-[10px] tracking-widest text-zinc-600 uppercase text-center md:text-right">
            {t.sec6Copy}
          </p>
        </div>
      </footer>

    </div>
  );
}

// ==========================================
// COMPONENTES AUXILIARES DAS SESSÕES
// ==========================================

const ServicesAccordion = ({ data }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className="w-full flex flex-col md:flex-row h-[800px] sm:h-[600px] md:h-[500px] lg:h-[600px] gap-4">
      {data.map((item, index) => {
        const isActive = activeIndex === index;
        
        return (
          <motion.div
            key={item.id}
            onMouseEnter={() => setActiveIndex(index)}
            onClick={() => setActiveIndex(index)}
            animate={{
              // Expande brutalmente o flex-grow do card ativo
              flex: isActive ? 5 : 1
            }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="relative bg-transparent rounded-[10px] overflow-hidden cursor-pointer border border-black group flex-shrink-0 hover:bg-zinc-50 transition-colors duration-300"
          >
            <div className="relative w-full h-full z-10 flex">
               
               {/* --- ESTADO INATIVO: Texto Rotacionado --- */}
               <motion.div 
                 initial={false}
                 animate={{ opacity: isActive ? 0 : 1 }}
                 className="absolute inset-0 flex items-center justify-center md:justify-center px-4 pointer-events-none"
               >
                 <h4 
                    className="text-black font-bold uppercase tracking-widest whitespace-nowrap text-lg md:text-xl hidden md:block"
                    style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)', fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}
                 >
                   {item.title}
                 </h4>
                 <h4 
                    className="text-black font-bold uppercase tracking-widest whitespace-nowrap text-sm sm:text-base md:hidden w-full text-center"
                    style={{ fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}
                 >
                   {item.title}
                 </h4>
               </motion.div>

               {/* --- ESTADO ATIVO: Conteúdo Expandido --- */}
               <motion.div
                 initial={false}
                 animate={{ opacity: isActive ? 1 : 0 }}
                 className="w-full h-full flex flex-col md:flex-row p-4 sm:p-6 md:p-10 gap-4 sm:gap-6 md:gap-10"
               >
                  {/* Lado Esquerdo: Textos e Lista */}
                  <div className="flex-1 flex flex-col justify-between overflow-hidden min-w-[150px] sm:min-w-[200px]">
                    <div>
                      <h4 
                        className="text-2xl sm:text-3xl md:text-5xl text-black font-bold leading-none mb-3 sm:mb-4 md:mb-6"
                        style={{ fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}
                      >
                         {item.titleSplit.map((part, pI) => <span key={pI} className="block">{part}</span>)}
                      </h4>
                      <p className="text-zinc-600 text-xs sm:text-sm md:text-base leading-relaxed max-w-sm mb-4 sm:mb-6 md:mb-8 font-light">
                         {item.desc}
                      </p>
                    </div>
                    
                    <div className="flex flex-col gap-2 sm:gap-3">
                       {item.subs.map((sub, sI) => (
                         <div key={sI} className="flex items-center gap-2 sm:gap-3">
                           <div className="rotate-[-90deg]">
                             <svg width="8" height="8" className="sm:w-[10px] sm:h-[10px]" viewBox="0 0 10 10" fill="black">
                               <path d="M 8.144 5.138 C 8.327 5.321 8.327 5.617 8.144 5.8 L 5.487 8.456 C 5.304 8.639 5.008 8.639 4.825 8.456 L 2.169 5.8 C 1.997 5.615 2.002 5.327 2.18 5.149 C 2.359 4.97 2.646 4.966 2.831 5.137 L 4.687 6.994 L 4.687 2.344 C 4.687 2.085 4.897 1.875 5.156 1.875 C 5.415 1.875 5.625 2.085 5.625 2.344 L 5.625 6.994 L 7.481 5.138 C 7.664 4.955 7.961 4.955 8.144 5.138 Z"/>
                             </svg>
                           </div>
                           <span className="text-zinc-600 font-medium text-[10px] sm:text-xs md:text-sm hover:text-black transition-colors cursor-pointer">
                             {sub}
                           </span>
                         </div>
                       ))}
                    </div>
                  </div>

                  {/* Lado Direito: Vídeo Demonstrativo com Borda Preta */}
                  <div className="flex-1 w-full h-32 sm:h-48 md:h-full rounded-lg overflow-hidden border border-black flex-shrink-0">
                     <video 
                       src={item.video} 
                       autoPlay 
                       loop 
                       muted 
                       playsInline 
                       className="w-full h-full object-cover"
                     />
                  </div>
               </motion.div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

const SaturnRing = ({ radius, duration, images, direction, invX, invY, scale }) => {
  return (
    <motion.div
      className="absolute rounded-full border border-solid border-white/20 flex items-center justify-center"
      style={{ width: radius * 2, height: radius * 2, transformStyle: "preserve-3d", scale }}
      animate={{ rotateZ: 360 * direction }}
      transition={{ duration, repeat: Infinity, ease: "linear" }}
    >
      {images.map((src, i) => {
        const angle = (i / images.length) * 360;
        const rad = angle * (Math.PI / 180);
        const x = Math.cos(rad) * 50; 
        const y = Math.sin(rad) * 50;

        return (
          <div
            key={i}
            className="absolute w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 -translate-x-1/2 -translate-y-1/2"
            style={{
              left: `calc(50% + ${x}%)`,
              top: `calc(50% + ${y}%)`,
              transformStyle: "preserve-3d"
            }}
          >
            <motion.div
              className="w-full h-full"
              animate={{ rotateZ: -360 * direction }}
              transition={{ duration, repeat: Infinity, ease: "linear" }}
              style={{ transformStyle: "preserve-3d" }}
            >
              <motion.img
                src={src}
                className="w-full h-full rounded-full object-cover shadow-[0_0_20px_rgba(0,0,0,0.5)] border border-white/20 bg-zinc-800"
                style={{ rotateX: invX, rotateY: invY }}
              />
            </motion.div>
          </div>
        );
      })}
    </motion.div>
  );
};

// A MATEMÁTICA CORRETA DA TRANSIÇÃO
const GridOverlay = ({ scrollYProgress }) => {
  const cols = 20;
  const rows = 15;

  const squares = useMemo(() => {
    return Array.from({ length: cols * rows }).map((_, i) => {
      const start = 0.4 + Math.random() * 0.4; 
      const end = Math.min(start + 0.15, 0.98); 
      return { id: i, start, end };
    });
  }, []);

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

const Square = ({ scrollYProgress, start, end }) => {
  const opacity = useTransform(scrollYProgress, [start, end], [0, 1]);
  return <motion.div style={{ opacity, willChange: "opacity" }} className="bg-white w-full h-full scale-[1.05]" />;
};

const SlideTabs = ({ tabs }) => {
  const [position, setPosition] = useState({
    left: 0,
    width: 0,
    opacity: 0,
  });

  return (
    <ul
      onMouseLeave={() => {
        setPosition((pv) => ({
          ...pv,
          opacity: 0,
        }));
      }}
      className="relative mx-auto flex w-fit rounded-full border border-white p-1 shadow-2xl pointer-events-auto"
    >
      {tabs.map((tab) => (
        <Tab key={tab.label} href={tab.href} setPosition={setPosition}>
          {tab.label}
        </Tab>
      ))}
      <Cursor position={position} />
    </ul>
  );
};

const Tab = ({ children, href, setPosition }) => {
  const ref = useRef(null);

  const handleClick = (e) => {
    e.preventDefault();
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <li
      ref={ref}
      onClick={handleClick}
      onMouseEnter={() => {
        if (!ref?.current) return;
        const { width } = ref.current.getBoundingClientRect();
        setPosition({
          left: ref.current.offsetLeft,
          width,
          opacity: 1,
        });
      }}
      className="relative z-10 block cursor-pointer px-2 sm:px-3 py-1.5 text-[10px] sm:text-xs uppercase text-white mix-blend-difference md:px-5 md:py-3 md:text-base font-semibold"
    >
      {children}
    </li>
  );
};

const Cursor = ({ position }) => {
  return (
    <motion.li
      animate={{
        ...position,
      }}
      transition={{
        type: "spring",
        stiffness: 400,
        damping: 30
      }}
      className="absolute z-0 h-7 rounded-full bg-white md:h-12"
    />
  );
};