import React, { useState, useRef, useEffect } from 'react';
import { 
  Server, 
  Database, 
  Cloud, 
  Layout, 
  Smartphone,
  LineChart,
  Code2,
  Image as ImageIcon,
  X
} from 'lucide-react';
import projectsData from '../../public/data/projects.json';

export interface ProjectData {
  id: string;
  title: string;
  type: 'frontend' | 'backend' | 'fullstack';
  stats?: { label: string; value: string }[];
  technologies: { name: string; icon: React.ReactNode }[];
  desktopThumbnailUrl?: string;
  mobileThumbnailUrl?: string;
  architectureDiagramUrl?: string;
}

interface MonitorProps {
  projects?: ProjectData[];
  state?: 'hero' | 'expand' | 'collapse';
  onHeroClick?: () => void;
  onProjectClick?: (project: any) => void;
}

const DEFAULT_PROJECTS: ProjectData[] = [
  {
    id: 'proj-1',
    title: 'Fintech Dashboard',
    type: 'fullstack',
    stats: [
      { label: 'Total Volume', value: '$63.5M' },
      { label: 'Active Users', value: '12.4K' }
    ],
    technologies: [
      { name: 'React.js', icon: <Code2 className="w-4 h-4 text-zinc-400" /> },
      { name: 'React Native', icon: <Smartphone className="w-4 h-4 text-zinc-400" /> }
    ],
    desktopThumbnailUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=400&h=300',
    mobileThumbnailUrl: 'https://images.unsplash.com/photo-1618761714954-0b8cd0026356?auto=format&fit=crop&q=80&w=200&h=400',
    architectureDiagramUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&q=80&w=600&h=400',
  }
];

export default function App({ projects = DEFAULT_PROJECTS, state = 'hero', onHeroClick, onProjectClick }: MonitorProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const BASE_ROTATION_X = 5;
  const BASE_ROTATION_Y = 45;
  
  const [isExploded, setIsExploded] = useState(false);
  const [hoveredLayer, setHoveredLayer] = useState<'none' | 'frontend' | 'backend'>('none');
  const [activeOverlay, setActiveOverlay] = useState<'none' | 'frontend-prep' | 'frontend' | 'backend-prep' | 'backend'>('none');
  const [isMobile, setIsMobile] = useState(false);
  
  const [devFilter, setDevFilter] = useState<string>('all');
  const [mlFilter, setMlFilter] = useState<string>('all');

  const allProjects = projectsData.projects || [];
  const devProjects = allProjects.filter((p: any) => p.category === 'Development Project');
  const mlProjects = allProjects.filter((p: any) => p.category === 'Machine Learning');

  const devSubcategories = ['all', ...Array.from(new Set(devProjects.map((p: any) => p.subCategory).filter(Boolean)))];
  const mlSubcategories = ['all', ...Array.from(new Set(mlProjects.map((p: any) => p.subCategory).filter(Boolean)))];

  const filteredDevProjects = devFilter === 'all' ? devProjects : devProjects.filter((p: any) => p.subCategory === devFilter);
  const filteredMlProjects = mlFilter === 'all' ? mlProjects : mlProjects.filter((p: any) => p.subCategory === mlFilter);

  const mlListRef = useRef<HTMLDivElement>(null);
  const devListRef = useRef<HTMLDivElement>(null);
  const mlFilterRef = useRef<HTMLDivElement>(null);
  const devFilterRef = useRef<HTMLDivElement>(null);

  const scroll = (ref: React.RefObject<HTMLDivElement>, dir: 'up' | 'down' | 'left' | 'right', amount = 80) => {
    if (!ref.current) return;
    const isVertical = dir === 'up' || dir === 'down';
    ref.current.scrollBy({
      [isVertical ? 'top' : 'left']: (dir === 'down' || dir === 'right' ? 1 : -1) * amount,
      behavior: 'smooth',
    });
  };

  // Resolve a filename from the JSON to a local /assets/ URL
  const resolveAsset = (filename: string) => {
    if (!filename || filename === '') return null;
    if (filename.startsWith('http')) return filename; // already a full URL
    return `/assets/${filename}`;
  };

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.matchMedia("(max-width: 768px)").matches);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const isHoveredRef = useRef(false);

  const activeOverlayRef = useRef(activeOverlay);
  useEffect(() => {
    activeOverlayRef.current = activeOverlay;
  }, [activeOverlay]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    let timeout: NodeJS.Timeout;

    if (state === 'hero') {
      interval = setInterval(() => {
        if (!isHoveredRef.current && activeOverlayRef.current === 'none') {
          setIsExploded(true);
          
          timeout = setTimeout(() => {
            if (!isHoveredRef.current && activeOverlayRef.current === 'none') {
              setIsExploded(false);
            }
          }, 1500);
        }
      }, 5000);
    }

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [state]);

  const prevStateRef = useRef(state);
  useEffect(() => {
    if (prevStateRef.current !== state) {
      // Close expanded view when scrolled back to hero or when a project detail opens
      if (state === 'hero' || state === 'collapse') {
        setActiveOverlay('none');
        setIsExploded(false);
        setDevFilter('all');
        setMlFilter('all');
      }
      prevStateRef.current = state;
    }
  }, [state]);

  const handleMouseEnterContainer = () => {
    isHoveredRef.current = true;
    if (activeOverlay === 'none') {
      setIsExploded(true);
    }
  };

  const handleMouseLeaveContainer = () => {
    isHoveredRef.current = false;
    // Only collapse if we aren't viewing an overlay
    if (activeOverlay === 'none') {
      setIsExploded(false);
      setHoveredLayer('none');
    }
  };

  const closeOverlay = (e: React.MouseEvent, layer: 'frontend' | 'backend') => {
    e.stopPropagation();
    setActiveOverlay(`${layer}-prep` as any);
    setTimeout(() => {
      setActiveOverlay('none');
      setIsExploded(true); 
    }, 250);
  };

  // --- Sub-components for rendering the layer content ---

  // Development layer: clean desktop-icon style
  const DevProjectCard = ({ project }: { project: any }) => {
    const imgSrc = resolveAsset(project.thumbnail) || (project.images?.[0] ? resolveAsset(project.images[0]) : null);
    return (
      <div 
        onClick={(e) => {
          e.stopPropagation();
          if (onProjectClick) onProjectClick(project);
        }}
        className="flex flex-col items-center gap-1.5 p-2 rounded-xl group hover:bg-white/5 transition-colors cursor-pointer w-full"
      >
        <div className="w-14 h-14 bg-zinc-800 rounded-2xl flex items-center justify-center overflow-hidden shrink-0 shadow-md group-hover:shadow-lg group-hover:scale-105 transition-all">
          {imgSrc ? (
            <img src={imgSrc} alt={project.name} className="w-full h-full object-cover" />
          ) : (
            <Code2 className="w-5 h-5 text-zinc-500" />
          )}
        </div>
        <span className="text-zinc-300 text-[10px] text-center leading-tight font-medium truncate w-full max-w-[72px] mx-auto">{project.name}</span>
      </div>
    );
  };

  // ML layer: terminal/data-science aesthetic
  const MLProjectRow = ({ project, idx }: { project: any; idx: number }) => {
    const tagColors: Record<string, string> = {
      'ml': 'text-emerald-400',
      'llm-agent': 'text-purple-400',
      'robotics': 'text-orange-400',
      'computer-vision': 'text-yellow-400',
    };
    const typeColor = tagColors[project.subCategory] || 'text-zinc-400';
    return (
      <div 
        onClick={(e) => {
          e.stopPropagation();
          if (onProjectClick) onProjectClick(project);
        }}
        className="flex items-center gap-3 px-4 py-2 hover:bg-white/[0.03] transition-colors border-b border-zinc-800/40 group cursor-pointer"
      >
        <span className="text-zinc-600 font-mono text-[10px] w-5 shrink-0">{String(idx + 1).padStart(2, '0')}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-zinc-200 font-mono text-xs truncate">{project.name}</span>
            <span className={`text-[9px] font-mono shrink-0 ${typeColor}`}>[{project.subCategory || 'misc'}]</span>
          </div>
          <div className="flex gap-1 mt-0.5">
            {(project.tags || []).slice(0, 3).map((t: string, i: number) => (
              <span key={i} className="text-[9px] text-zinc-600 font-mono">{t}{i < Math.min(2, (project.tags || []).length - 1) ? ',' : ''}</span>
            ))}
          </div>
        </div>
        <div className="w-1.5 h-1.5 rounded-full bg-zinc-700 group-hover:bg-emerald-400 transition-colors shrink-0" />
      </div>
    );
  };

  const BackendContent = () => (
    <div className="w-full h-full flex flex-col bg-transparent font-mono">
      {/* Terminal header */}
      <div className="border-b border-zinc-800 px-4 py-3 flex items-center justify-between shrink-0 bg-black/20">
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-zinc-700" />
            <div className="w-2.5 h-2.5 rounded-full bg-zinc-700" />
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-800" />
          </div>
          <span className="text-emerald-500 text-[11px] font-mono">~/machine-code</span>
          <span className="text-zinc-600 text-[11px]">— {filteredMlProjects.length} results</span>
        </div>
        {/* Filter row with left/right arrows */}
        <div className="flex items-center gap-1">
          <button onClick={(e) => { e.stopPropagation(); scroll(mlFilterRef, 'left'); }} className="text-zinc-600 hover:text-zinc-300 transition-colors p-0.5">
            <svg width="8" height="10" viewBox="0 0 8 10" fill="none"><path d="M6 1L2 5l4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
          <div ref={mlFilterRef} className="flex gap-1.5 overflow-x-hidden hide-scrollbar max-w-[220px]">
            {mlSubcategories.map((sub: string) => (
              <button
                key={sub}
                onClick={(e) => { e.stopPropagation(); setMlFilter(sub); }}
                className={`px-2.5 py-0.5 rounded text-[10px] font-mono whitespace-nowrap transition-all border ${
                  mlFilter === sub 
                    ? 'bg-emerald-900/50 text-emerald-400 border-emerald-700/60' 
                    : 'bg-transparent text-zinc-600 border-zinc-800 hover:text-zinc-400 hover:border-zinc-700'
                }`}
              >
                {sub}
              </button>
            ))}
          </div>
          <button onClick={(e) => { e.stopPropagation(); scroll(mlFilterRef, 'right'); }} className="text-zinc-600 hover:text-zinc-300 transition-colors p-0.5">
            <svg width="8" height="10" viewBox="0 0 8 10" fill="none"><path d="M2 1l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
        </div>
      </div>
      {/* Column header */}
      <div className="flex items-center gap-3 px-4 py-1.5 border-b border-zinc-800/60 shrink-0">
        <span className="text-zinc-700 font-mono text-[10px] w-5">#</span>
        <span className="text-zinc-700 font-mono text-[10px] flex-1">REPOSITORY</span>
        <span className="text-zinc-700 font-mono text-[10px] w-4">●</span>
      </div>
      {/* List with up/down arrow buttons */}
      <div className="flex-1 flex flex-col min-h-0 relative">
        <div ref={mlListRef} className="flex-1 overflow-y-hidden hide-scrollbar">
          {filteredMlProjects.map((project: any, idx: number) => (
            <MLProjectRow key={project.id || project.name} project={project} idx={idx} />
          ))}
        </div>
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex flex-col gap-1 z-10">
          <button onClick={(e) => { e.stopPropagation(); scroll(mlListRef, 'up'); }} className="w-5 h-5 flex items-center justify-center rounded bg-zinc-900/80 border border-zinc-800 text-zinc-500 hover:text-emerald-400 hover:border-emerald-700 transition-all">
            <svg width="8" height="8" viewBox="0 0 8 8" fill="none"><path d="M1 5.5L4 2.5l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
          <button onClick={(e) => { e.stopPropagation(); scroll(mlListRef, 'down'); }} className="w-5 h-5 flex items-center justify-center rounded bg-zinc-900/80 border border-zinc-800 text-zinc-500 hover:text-emerald-400 hover:border-emerald-700 transition-all">
            <svg width="8" height="8" viewBox="0 0 8 8" fill="none"><path d="M1 2.5L4 5.5l3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
        </div>
      </div>
    </div>
  );

  const FrontendContent = () => (
    <div className="w-full h-full bg-transparent flex flex-col">
      {/* App-store style header */}
      <div className="border-b border-zinc-800 px-5 py-3 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2 shrink-0">
          {/* <div className="w-2 h-4 rounded-sm bg-gradient-to-b from-sky-400 to-violet-500" /> */}
          <h2 className="text-zinc-100 font-semibold text-sm tracking-wide">Development Projects</h2>
          <span className="text-zinc-600 text-xs ml-1">{filteredDevProjects.length}</span>
        </div>
        {/* Filter row with left/right arrows */}
        <div className="flex items-center gap-1">
          <button onClick={(e) => { e.stopPropagation(); scroll(devFilterRef, 'left'); }} className="text-zinc-600 hover:text-zinc-300 transition-colors p-0.5">
            <svg width="8" height="10" viewBox="0 0 8 10" fill="none"><path d="M6 1L2 5l4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
          <div ref={devFilterRef} className="flex gap-1.5 overflow-x-hidden hide-scrollbar max-w-[260px]">
            {devSubcategories.map((sub: string) => (
              <button
                key={sub}
                onClick={(e) => { e.stopPropagation(); setDevFilter(sub); }}
                className={`px-2.5 py-0.5 rounded-md text-[10px] font-medium whitespace-nowrap transition-all border ${
                  devFilter === sub 
                    ? 'bg-white/10 text-white border-white/20' 
                    : 'bg-transparent text-zinc-500 border-zinc-800 hover:text-zinc-300 hover:border-zinc-600'
                }`}
              >
                {sub}
              </button>
            ))}
          </div>
          <button onClick={(e) => { e.stopPropagation(); scroll(devFilterRef, 'right'); }} className="text-zinc-600 hover:text-zinc-300 transition-colors p-0.5">
            <svg width="8" height="10" viewBox="0 0 8 10" fill="none"><path d="M2 1l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
        </div>
      </div>

      {/* Grid with up/down arrow buttons */}
      <div className="flex-1 flex flex-col min-h-0 relative">
        <div ref={devListRef} className="flex-1 overflow-y-hidden hide-scrollbar p-4">
          <div className="grid grid-cols-4 bg-transarent gap-1">
            {filteredDevProjects.map((project: any) => (
              <DevProjectCard key={project.id || project.name} project={project} />
            ))}
          </div>
        </div>
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex flex-col gap-1 z-10">
          <button onClick={(e) => { e.stopPropagation(); scroll(devListRef, 'up'); }} className="w-6 h-6 flex items-center justify-center rounded-lg bg-black/60 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-600 transition-all">
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M2 6.5L5 3.5l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
          <button onClick={(e) => { e.stopPropagation(); scroll(devListRef, 'down'); }} className="w-6 h-6 flex items-center justify-center rounded-lg bg-black/60 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-600 transition-all">
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M2 3.5L5 6.5l3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
        </div>
      </div>
    </div>
  );



  return (
    <div className="w-full h-full bg-transparent flex flex-col items-center justify-center font-sans text-zinc-200 overflow-visible relative">
      
      {/* Background overlay that fades in when a layer is active */}
      <div 
        className={`absolute inset-0 z-40 transition-opacity duration-500 pointer-events-none opacity-0`}
      />

      {/* --- MAIN 3D SCENE --- */}
      <div 
        className={`relative w-full max-w-[1200px] min-h-[500px] flex items-center justify-center transition-all duration-700 ease-in-out ${
          state === 'hero' ? 'scale-[0.45] md:scale-[0.5] lg:scale-[0.55] xl:scale-[0.6] -mt-16 -ml-16 cursor-pointer' :
          state === 'expand' ? 'scale-[0.7] md:scale-[0.85] lg:scale-[1] xl:scale-[1.05]' :
          'scale-[0.45] md:scale-[0.5] lg:scale-[0.6]'
        } ${activeOverlay !== 'none' ? 'z-50' : 'z-10'}`}
        // Dynamically disable perspective when overlay is active to allow 2D flattening
        style={{ perspective: activeOverlay !== 'none' ? 'none' : '2000px' }}
        onMouseEnter={handleMouseEnterContainer}
        onMouseLeave={handleMouseLeaveContainer}
        onTouchStart={handleMouseEnterContainer}
        onClick={() => {
          if (state === 'hero' && onHeroClick) {
            onHeroClick();
          }
        }}
      >
        
        <div 
          ref={containerRef}
          className="relative w-[700px] h-[440px]"
          style={{
            // Dynamically disable preserve-3d when overlay is active
            transformStyle: 'preserve-3d',
            transform: (activeOverlay === 'frontend' || activeOverlay === 'backend') 
              ? 'rotateX(0deg) rotateY(0deg)' 
              : `rotateX(${BASE_ROTATION_X}deg) rotateY(${BASE_ROTATION_Y}deg)`,
            transition: 'transform 0.6s cubic-bezier(0.22, 1, 0.36, 1)'
          }}
        >



          {/* LAYER 1: BACK LAYER (Infrastructure) */}
          <div 
            className={`absolute inset-0 rounded-2xl border bg-transparent transition-all duration-[600ms] ease-[cubic-bezier(0.22,1,0.36,1)] cursor-pointer
              ${(activeOverlay === 'backend' || activeOverlay === 'backend-prep') ? 'z-50 shadow-2xl' : 'z-10 shadow-[0_0_30px_rgba(0,0,0,0.8)]'}
              ${hoveredLayer === 'backend' && activeOverlay === 'none' ? 'border-zinc-500 shadow-[0_0_30px_rgba(255,255,255,0.1)]' : 'border-zinc-800'}
            `}
            style={
              activeOverlay === 'backend' 
              ? { transform: 'translateZ(40px) scale(1.7)', zIndex: 50 }
              : activeOverlay === 'backend-prep'
              ? { transform: 'translateZ(-250px) translateX(-450px) translateY(0px) scale(1.02)', zIndex: 50 }
              : activeOverlay.includes('frontend')
              ? { transform: 'translateZ(-400px) scale(0.8)', opacity: 0, pointerEvents: 'none' }
              : { transform: isExploded ? `translateZ(-250px) translateX(-80px) translateY(0px) ${hoveredLayer === 'backend' ? 'scale(1.02)' : 'scale(0.95)'}` : 'translateZ(-2px) scale(0.98)', opacity: isExploded ? 1 : 0 }
            }
            onMouseEnter={() => isExploded && activeOverlay === 'none' && setHoveredLayer('backend')}
            onMouseLeave={() => isExploded && activeOverlay === 'none' && setHoveredLayer('none')}
            onClick={() => {
              if (isExploded && activeOverlay === 'none') {
                setActiveOverlay('backend-prep');
                setTimeout(() => setActiveOverlay('backend'), 250);
              }
            }}
          >
            {activeOverlay === 'backend' && (
              <button 
                onClick={(e) => closeOverlay(e, 'backend')} 
                className="absolute top-[-18px] right-[-18px] z-[60] p-1.5 bg-zinc-900 hover:bg-zinc-700 rounded-full text-zinc-300 border border-zinc-700 transition-colors shadow-lg pointer-events-auto"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
            <div className={`w-full h-full overflow-hidden rounded-2xl ${activeOverlay === 'backend' ? 'pointer-events-auto' : 'pointer-events-none'}`}>
              <BackendContent />
            </div>
          </div>

          {/* LAYER 2: MIDDLE LAYER (Monitor & Stand) */}
          <div 
            className={`absolute inset-0 rounded-2xl border-[16px] border-[#111113] bg-black shadow-[0_0_50px_rgba(0,0,0,0.9)] transition-all duration-[600ms] ease-[cubic-bezier(0.22,1,0.36,1)] pointer-events-none z-20`}
            style={{ 
              transform: (activeOverlay !== 'none') ? 'translateZ(-100px) scale(0.9)' : 'translateZ(0px) scale(1)',
              opacity: (activeOverlay !== 'none') ? 0.2 : 1,
              transformStyle: 'preserve-3d'
            }}
          >
            <div className="absolute inset-0 shadow-[inset_0_0_20px_rgba(0,0,0,1)] z-10" />
            
            <div className="w-full h-full bg-gradient-to-br from-[#0a0a0c] to-black flex items-center justify-center overflow-hidden">
               <div className="text-zinc-800 font-bold text-4xl opacity-50 tracking-widest flex flex-col items-center gap-4">
                 <Server className="w-16 h-16" />
                 My Projects
               </div>
            </div>

            {/* Stand — neck */}
            <div 
              className="absolute -bottom-[96px] left-1/2 -ml-12 -translate-x-1/2 w-32 h-[120px] bg-gradient-to-b from-[#1a1a1c] to-[#0a0a0c] border-x border-[#222]"
              style={{ transformOrigin: 'top center', transform: 'rotateX(-15deg) translateZ(-10px)' }} 
            />
            {/* Stand — base */}
            <div 
              className="absolute -bottom-[120px] left-1/2 -ml-20 -translate-x-1/2 w-64 h-[200px] bg-gradient-to-br from-[#111] to-[#050505] rounded-[2rem] shadow-[0_20px_40px_rgba(0,0,0,0.9)] border-t border-[#222]"
              style={{ transformOrigin: 'center', transform: 'rotateX(80deg) translateZ(-60px) translateY(20px)' }} 
            />
          </div>

          {/* LAYER 3: FRONT LAYER (Frontend UI) */}
          <div 
            className={`absolute inset-0 rounded-2xl border transition-all duration-[600ms] ease-[cubic-bezier(0.22,1,0.36,1)] cursor-pointer
              ${(activeOverlay === 'frontend' || activeOverlay === 'frontend-prep') ? 'z-50 shadow-2xl border-zinc-800 bg-transparent' : 'z-30'}
              ${hoveredLayer === 'frontend' && activeOverlay === 'none' ? 'ring-2 ring-zinc-500 shadow-[0_0_40px_rgba(255,255,255,0.15)] bg-black/90 border-zinc-500' : ''}
              ${isExploded && activeOverlay === 'none' && hoveredLayer !== 'frontend' ? 'bg-transparent border-zinc-800' : 'bg-transparent border-zinc-800'}
            `}
            style={
              activeOverlay === 'frontend' 
              ? { transform: 'translateZ(40px) scale(1.7)', zIndex: 50 }
              : activeOverlay === 'frontend-prep'
              ? { transform: 'translateZ(250px) translateX(60px) translateY(-250px) scale(1.07)', zIndex: 50 }
              : activeOverlay.includes('backend')
              ? { transform: 'translateZ(400px) scale(1.2)', opacity: 0, pointerEvents: 'none' }
              : { transform: isExploded ? `translateZ(250px) translateX(60px) translateY(0px) ${hoveredLayer === 'frontend' ? 'scale(1.07)' : 'scale(1.05)'}` : 'translateZ(1px) scale(1)' }
            }
            onMouseEnter={() => isExploded && activeOverlay === 'none' && setHoveredLayer('frontend')}
            onMouseLeave={() => isExploded && activeOverlay === 'none' && setHoveredLayer('none')}
            onClick={() => {
              if (isExploded && activeOverlay === 'none') {
                setActiveOverlay('frontend-prep');
                setTimeout(() => setActiveOverlay('frontend'), 250);
              }
            }}
          >
            {activeOverlay === 'frontend' && (
              <button 
                onClick={(e) => closeOverlay(e, 'frontend')} 
                className="absolute top-[-18px] right-[-18px] z-[60] p-1.5 bg-zinc-900 hover:bg-zinc-700 rounded-full text-zinc-300 border border-zinc-700 transition-colors shadow-lg pointer-events-auto"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
            <div className={`w-full h-full overflow-hidden rounded-2xl ${activeOverlay === 'frontend' ? 'pointer-events-auto' : 'pointer-events-none'}`}>
              <FrontendContent />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}