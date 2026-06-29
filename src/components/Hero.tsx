import { useEffect, useRef, useState, lazy, Suspense } from 'react';

const ProfileSphere = lazy(() => import('./ProfileSphere'));

const BIOS = [
  'Specializing in <strong>On-Device LLMs, Edge AI, and Embedded Systems</strong>. Bringing production-grade GenAI inference to silicon.',
  'Currently an <strong>AI/ML Intern at SiMa.ai</strong>, compiling and deploying <strong>on-device LLMs on embedded edge silicon</strong> using internal C/C++ SDKs under Linux.',
  'Engineered <strong>Bash automation frameworks</strong> for end-to-end GenAI validation — covering pre-quantized LLMs, Dynamic LoRA, and MoLE — <strong>reducing manual effort by 40%+</strong>.',
  'Profile inference and compilation pipelines with <strong>pytest</strong> to hunt hardware-level bottlenecks, then wire it all into <strong>Jenkins CI/CD</strong> for automated firmware-level AI validation.',
  'Builder of the <strong>Iris Biometric Template Security System</strong> — a 3-layer pipeline (ResNet18 + Fuzzy Vault + Paillier HE) hitting <strong>95.8% GAR @ 1% FAR</strong> on CASIA-Iris-Thousand.',
  'Shipped <strong>CampusSphere</strong>, an AI-powered academic platform with <strong>100+ users</strong>, featuring RAG-based PDF analysis via Gemini LLM + Convex vector search.',
  'Architected <strong>Rent a Ride</strong>, a 3-role MERN marketplace with <strong>40+ RBAC-secured REST endpoints</strong> and Razorpay HMAC-SHA256 payment verification.',
  'NLP engineer at heart — boosted <strong>intent classification accuracy by 18–25%</strong> and shipped a 27-category e-commerce pipeline at <strong>91% accuracy</strong>.',
  'Ranked <strong>13th of 50+ teams</strong> at the IIT BHU Machine Learning Hackathon. I thrive where research meets real-world constraints.',
  'Solved <strong>750+ DSA problems</strong> across LeetCode, GFG, and CodeChef — <strong>LeetCode Rating 1676 (Top 20%)</strong>.',
  'CSE undergrad at <strong>NIT Srinagar</strong> (B.Tech, 2022–2026). I bridge the gap between <strong>full-stack web</strong> and deep <strong>edge-AI / LLM systems</strong>.',
  'From <strong>quantization and ONNX</strong> to <strong>Paillier homomorphic encryption</strong> — I love building secure, efficient, and deployable AI.',
];

export default function Hero() {
  const bioRef = useRef<HTMLParagraphElement>(null);
  const [currentBioIndex, setCurrentBioIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [displayedText, setDisplayedText] = useState('');
  const animationRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const typeWriter = (html: string, speed = 25) => {
    setIsTyping(true);
    setDisplayedText('');
    let i = 0;
    const stripped = html.replace(/<[^>]+>/g, '');
    const tick = () => {
      if (i <= stripped.length) {
        setDisplayedText(stripped.slice(0, i));
        i++;
        animationRef.current = setTimeout(tick, speed);
      } else {
        // After plain text animation show rich html
        setDisplayedText(html);
        setIsTyping(false);
      }
    };
    tick();
  };

  useEffect(() => {
    typeWriter(BIOS[0]);
    return () => {
      if (animationRef.current) clearTimeout(animationRef.current);
    };
  }, []);

  const generateNewBio = () => {
    if (isTyping) return;
    if (animationRef.current) clearTimeout(animationRef.current);
    const next = (currentBioIndex + 1) % BIOS.length;
    setCurrentBioIndex(next);
    typeWriter(BIOS[next]);
  };



  return (
    <section
      id="home"
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
      style={{ paddingTop: '4rem' }}
    >
      {/* 3D Sphere - positioned behind profile pic area */}
      <Suspense fallback={null}>
        <ProfileSphere />
      </Suspense>

      {/* SYSTEM ONLINE badge */}
      <div
        className="inline-block px-3 py-1 mb-6 text-xs font-bold tracking-widest text-cyan-400 border border-cyan-500/30 rounded-full bg-cyan-500/10 animate-pulse"
        style={{ fontFamily: 'JetBrains Mono, monospace', letterSpacing: '0.15em', zIndex: 2, position: 'relative' }}
      >
        SYSTEM ONLINE
      </div>

      {/* Profile picture - no glow, clean border */}
      <div className="relative flex items-center justify-center mb-6" style={{ zIndex: 2 }}>
          <img
            src="/sunam.webp"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                'https://ui-avatars.com/api/?name=Sunam+Kundal&background=0D8ABC&color=fff&size=256';
            }}
            alt="Sunam Kundal"
            className="relative rounded-full object-cover border-4"
            style={{
              width: 200,
              height: 200,
              borderColor: 'rgba(255,255,255,0.1)',
            }}
          />
      </div>

      {/* Name */}
      <h1
        className="font-bold text-white text-center mb-1"
        style={{
          fontSize: 'clamp(2.5rem, 7vw, 5rem)',
          letterSpacing: '0.05em',
          fontFamily: 'Inter, sans-serif',
          textShadow: '0 0 40px rgba(6,182,212,0.3)',
        }}
      >
        SUNAM KUNDAL
      </h1>

      {/* Title */}
      <h2
        className="text-cyan-400 tracking-widest font-bold mb-8"
        style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.9rem', letterSpacing: '0.3em' }}
      >
        AI/ML INTERN @ SIMA.AI
      </h2>

      {/* Bio terminal box */}
      <div
        className="relative mx-auto mb-6"
        style={{
          maxWidth: 520,
          width: '90%',
          background: 'rgba(10,10,15,0.75)',
          border: '1px solid rgba(6,182,212,0.3)',
          borderRadius: 8,
          padding: '1rem 1.25rem',
        }}
      >
        {/* Terminal header */}
        <div className="flex items-center gap-2 mb-2">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block" />
          <span className="w-2.5 h-2.5 rounded-full bg-yellow-400 inline-block" />
          <span className="w-2.5 h-2.5 rounded-full bg-green-500 inline-block" />
          <span
            className="ml-2 text-gray-400 text-xs"
            style={{ fontFamily: 'JetBrains Mono, monospace' }}
          >
            NEURAL_CORE // BIO_GENERATOR
          </span>
        </div>

        <p
          ref={bioRef}
          className="text-gray-300 text-sm leading-relaxed"
          style={{ fontFamily: 'JetBrains Mono, monospace', minHeight: 60 }}
        >
          <span className="text-cyan-400 mr-1">&gt;</span>
          {isTyping ? (
            <>
              {displayedText}
              <span className="inline-block w-0.5 h-4 bg-cyan-400 ml-0.5 animate-pulse" />
            </>
          ) : (
            <span dangerouslySetInnerHTML={{ __html: displayedText }} />
          )}
        </p>
      </div>

      {/* Generate bio button */}
      <button
        onClick={generateNewBio}
        disabled={isTyping}
        className="group flex items-center gap-2 px-6 py-2.5 rounded-full transition-all mb-10"
        style={{
          background: 'rgba(6,182,212,0.1)',
          border: '1px solid rgba(6,182,212,0.5)',
          color: '#22d3ee',
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: '0.7rem',
          letterSpacing: '0.15em',
          cursor: isTyping ? 'not-allowed' : 'pointer',
          opacity: isTyping ? 0.6 : 1,
        }}
      >
        <span style={{ fontSize: '0.9rem' }}>✦</span>
        GENERATE NEW BIO
      </button>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-3 mb-10" style={{ maxWidth: 480, width: '90%' }}>
        {[
          { value: '750+', label: 'DSA SOLVED' },
          { value: '40%+', label: 'AUTOMATION', color: '#22d3ee' },
          { value: '7.91', label: 'CGPA', color: '#c084fc' },
          { value: '1676', label: 'LEETCODE' },
        ].map(({ value, label, color }) => (
          <div
            key={label}
            className="flex flex-col items-center justify-center p-3 rounded-lg"
            style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.1)',
            }}
          >
            <span className="font-bold text-xl" style={{ color: color ?? '#fff', fontFamily: 'JetBrains Mono, monospace' }}>
              {value}
            </span>
            <span className="text-gray-500 text-xs mt-1" style={{ letterSpacing: '0.1em', fontFamily: 'JetBrains Mono, monospace' }}>
              {label}
            </span>
          </div>
        ))}
      </div>

      {/* CTA buttons */}
      <div className="flex flex-col sm:flex-row gap-3 items-center">
        <a
          href="#projects"
          onClick={(e) => {
            e.preventDefault();
            document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
          }}
          className="px-6 py-2.5 rounded text-sm font-bold transition-all"
          style={{
            background: 'rgba(6,182,212,0.1)',
            border: '1px solid rgba(6,182,212,0.5)',
            color: '#22d3ee',
            fontFamily: 'JetBrains Mono, monospace',
            letterSpacing: '0.05em',
          }}
        >
          VIEW MY WORK
        </a>
        <a
          href="/SUNAM_KUNDAL_RESUME.pdf"
          target="_blank"
          download="SUNAM_KUNDAL_RESUME.pdf"
          className="inline-flex items-center justify-center px-6 py-2.5 rounded text-sm font-bold transition-all hover:bg-cyan-400"
          style={{
            background: '#06b6d4',
            color: '#000',
            fontFamily: 'JetBrains Mono, monospace',
            letterSpacing: '0.05em',
          }}
        >
          DOWNLOAD CV
        </a>
      </div>

      {/* Scroll indicator */}
      <div
        className="absolute bottom-8 left-1/2 text-gray-500 text-xs tracking-widest"
        style={{ transform: 'translateX(-50%)', fontFamily: 'JetBrains Mono, monospace' }}
      >
        SCROLL ↓
      </div>
    </section>
  );
}
