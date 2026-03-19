import { useState, useEffect, useRef } from 'react';

interface Video {
  id: number;
  url: string;
  title: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  zIndex: number;
}

const sampleVideos = [
  { id: 1, url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', title: 'Project Alpha' },
  { id: 2, url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4', title: 'Project Beta' },
  { id: 3, url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', title: 'Project Gamma' },
  { id: 4, url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4', title: 'Project Delta' },
  { id: 5, url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4', title: 'Project Epsilon' },
  { id: 6, url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4', title: 'Project Zeta' },
];

export default function App() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [hoveredVideo, setHoveredVideo] = useState<number | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isLoaded, setIsLoaded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const generateRandomLayout = () => {
      const containerWidth = window.innerWidth;
      const containerHeight = window.innerHeight;
      
      return sampleVideos.map((video, index) => {
        const width = Math.random() * 200 + 250;
        const height = width * (9 / 16);
        const x = Math.random() * (containerWidth - width - 100) + 50;
        const y = Math.random() * (containerHeight - height - 100) + 50;
        const rotation = (Math.random() - 0.5) * 20;
        
        return {
          ...video,
          x,
          y,
          width,
          height,
          rotation,
          zIndex: index,
        };
      });
    };

    setVideos(generateRandomLayout());
    setTimeout(() => setIsLoaded(true), 100);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleVideoHover = (id: number) => {
    setHoveredVideo(id);
    setVideos(prev => prev.map(v => ({
      ...v,
      zIndex: v.id === id ? 100 : v.zIndex
    })));
  };

  const handleVideoLeave = () => {
    setHoveredVideo(null);
  };

  const shuffleLayout = () => {
    const containerWidth = window.innerWidth;
    const containerHeight = window.innerHeight;
    
    setVideos(prev => prev.map(video => {
      const width = Math.random() * 200 + 250;
      const height = width * (9 / 16);
      const x = Math.random() * (containerWidth - width - 100) + 50;
      const y = Math.random() * (containerHeight - height - 100) + 50;
      const rotation = (Math.random() - 0.5) * 20;
      
      return {
        ...video,
        x,
        y,
        width,
        height,
        rotation,
      };
    }));
  };

  return (
    <div className="relative min-h-screen bg-black overflow-hidden" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
      {/* Animated background gradient */}
      <div className="fixed inset-0 opacity-30">
        <div 
          className="absolute inset-0 bg-gradient-to-br from-purple-900 via-blue-900 to-pink-900"
          style={{
            transform: `translate(${mousePos.x * 0.02}px, ${mousePos.y * 0.02}px)`,
            transition: 'transform 0.3s ease-out',
          }}
        />
      </div>

      {/* Noise texture overlay */}
      <div 
        className="fixed inset-0 opacity-[0.015] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-[200] p-8 md:p-12">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-2 tracking-tight">
              PORTFOLIO
            </h1>
            <p className="text-gray-400 text-sm md:text-base tracking-wider uppercase" style={{ fontFamily: 'Inter, sans-serif' }}>
              Creative Director & Visual Artist
            </p>
          </div>
          <button
            onClick={shuffleLayout}
            className="group relative px-6 py-3 border border-white/20 text-white text-sm tracking-wider uppercase hover:border-white/40 transition-all duration-300 overflow-hidden"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            <span className="relative z-10">Shuffle</span>
            <div className="absolute inset-0 bg-white transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
            <span className="absolute inset-0 flex items-center justify-center text-black opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
              Shuffle
            </span>
          </button>
        </div>
      </header>

      {/* Video Canvas */}
      <div ref={containerRef} className="relative w-full h-screen">
        {videos.map((video, index) => (
          <div
            key={video.id}
            className={`absolute cursor-pointer transition-all duration-700 ease-out ${
              isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
            }`}
            style={{
              left: `${video.x}px`,
              top: `${video.y}px`,
              width: `${video.width}px`,
              height: `${video.height}px`,
              transform: `rotate(${video.rotation}deg) ${hoveredVideo === video.id ? 'scale(1.1)' : 'scale(1)'}`,
              zIndex: video.zIndex,
              transitionDelay: `${index * 100}ms`,
            }}
            onMouseEnter={() => handleVideoHover(video.id)}
            onMouseLeave={handleVideoLeave}
          >
            <div className="relative w-full h-full group">
              {/* Video container with border effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500 via-pink-500 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl" />
              <div className="relative w-full h-full bg-black border border-white/10 group-hover:border-white/30 transition-all duration-500 overflow-hidden">
                <video
                  src={video.url}
                  className="w-full h-full object-cover"
                  autoPlay
                  loop
                  muted
                  playsInline
                />
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                {/* Title */}
                <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                  <h3 className="text-white text-lg font-semibold tracking-wide">
                    {video.title}
                  </h3>
                  <p className="text-gray-400 text-xs mt-1 tracking-wider uppercase" style={{ fontFamily: 'Inter, sans-serif' }}>
                    View Project
                  </p>
                </div>

                {/* Corner accent */}
                <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-white/0 group-hover:border-white/50 transition-all duration-500" />
                <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-white/0 group-hover:border-white/50 transition-all duration-500" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer Info */}
      <footer className="fixed bottom-0 left-0 right-0 z-[200] p-8 md:p-12">
        <div className="flex justify-between items-end">
          <div className="text-gray-500 text-xs tracking-wider uppercase" style={{ fontFamily: 'Inter, sans-serif' }}>
            <p>© 2024</p>
            <p>All Rights Reserved</p>
          </div>
          <div className="text-right text-gray-500 text-xs tracking-wider uppercase" style={{ fontFamily: 'Inter, sans-serif' }}>
            <p>Scroll to Explore</p>
            <p>Hover to Interact</p>
          </div>
        </div>
      </footer>

      {/* Floating cursor follower */}
      <div
        className="fixed w-8 h-8 border border-white/30 rounded-full pointer-events-none z-[300] mix-blend-difference transition-transform duration-100 ease-out"
        style={{
          left: `${mousePos.x - 16}px`,
          top: `${mousePos.y - 16}px`,
          transform: `scale(${hoveredVideo ? 2 : 1})`,
        }}
      />
    </div>
  );
}
