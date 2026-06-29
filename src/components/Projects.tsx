import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { ExternalLink, Github, TrendingUp, Zap, Target, ChevronLeft, ChevronRight } from 'lucide-react';
import { useRef, useState } from 'react';
import ProjectImpactChart from './ProjectImpactChart';

type Project = {
  title: string;
  tagline: string;
  description: string;
  achievements: string[];
  tech: string[];
  liveUrl?: string;
  githubUrl?: string;
  gradient: string;
  impactMetric: { value: number; label: string; prefix?: string; unit?: string };
  image: string;
};

const projects: Project[] = [
  {
    title: 'Iris Biometric Template Security',
    tagline: 'ResNet18 + Fuzzy Vault + Paillier Homomorphic Encryption',
    description: 'A 3-layer biometric security pipeline protecting iris templates, evaluated on 20,000 NIR images across 1,000 subjects from the CASIA-Iris-Thousand benchmark and satisfying ISO/IEC 24745 template protection requirements.',
    achievements: [
      '95.8% GAR at 1.0% FAR on CASIA-Iris-Thousand benchmark',
      'Fine-tuned ResNet18 with Transfer Learning + CenterLoss for 256-D iris embeddings',
      'Fisher discriminant quantization achieving 100-bit cryptographic security',
      'OpenCV enrollment/auth (Daugman normalization, CLAHE) with 1024-bit keys',
      'Paillier homomorphic encryption for privacy-preserving matching',
    ],
    tech: ['PyTorch', 'OpenCV', 'Fuzzy Vault', 'Paillier HE', 'Transfer Learning', 'NumPy'],
    gradient: 'from-purple-500 to-cyan-500',
    impactMetric: { value: 95.8, label: 'GAR @ 1% FAR', prefix: '', unit: '%' },
    image: '/images/fair_assess_smurf.png'
  },
  {
    title: 'Rent a Ride',
    tagline: 'Full-Stack Car Rental Marketplace (MERN)',
    description: 'A 3-role (User / Admin / Vendor) MERN platform supporting vehicle booking, fleet management, and admin workflows, secured with role-based access control and hardened payment verification.',
    achievements: [
      '40+ RBAC-secured REST endpoints across User, Admin, and Vendor roles',
      'Razorpay HMAC-SHA256 signature verification on every transaction',
      'Idempotency-key duplicate-payment guards preventing double-charge',
      'Vehicle booking, fleet management, and admin workflow modules',
      'JWT-based authentication and authorization',
    ],
    tech: ['React', 'Node.js', 'Express', 'MongoDB', 'Razorpay', 'JWT'],
    githubUrl: 'https://github.com/sunamkundal01',
    gradient: 'from-orange-500 to-red-500',
    impactMetric: { value: 40, label: 'REST Endpoints', prefix: '', unit: '+' },
    image: '/images/tasknerve_smurf.webp'
  },
  {
    title: 'CampusSphere',
    tagline: 'AI-Powered Academic Collaboration Platform',
    description: 'A production full-stack platform with 100+ registered users enabling real-time peer collaboration and structured academic note sharing, powered by RAG over user-uploaded notes.',
    achievements: [
      '100+ registered users tracked via DB records',
      'Gemini LLM + Convex vector search for RAG-based PDF analysis',
      'Semantic retrieval with no external vector infrastructure',
      'Role-based access control via Firebase Auth with scoped permissions',
      'Optimized Convex real-time queries to minimize client re-renders',
    ],
    tech: ['React.js', 'Convex', 'Firebase Auth', 'Gemini API', 'RAG', 'Vercel'],
    githubUrl: 'https://github.com/sunamkundal01',
    gradient: 'from-blue-500 to-cyan-500',
    impactMetric: { value: 100, label: 'Registered Users', prefix: '', unit: '+' },
    image: '/images/crowdguardian_smurf.webp'
  },
];

function ProjectCard({ project, index }: { project: typeof projects[0], index: number }) {
  const ref = useRef<HTMLDivElement>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseX = useSpring(x, { stiffness: 500, damping: 100 });
  const mouseY = useSpring(y, { stiffness: 500, damping: 100 });

  const rotateX = useTransform(mouseY, [-0.5, 0.5], ["7deg", "-7deg"]);
  const rotateY = useTransform(mouseX, [-0.5, 0.5], ["-7deg", "7deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;

    const rect = ref.current.getBoundingClientRect();

    const width = rect.width;
    const height = rect.height;

    const mouseXFromCenter = e.clientX - rect.left - width / 2;
    const mouseYFromCenter = e.clientY - rect.top - height / 2;

    x.set(mouseXFromCenter / width);
    y.set(mouseYFromCenter / height);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, delay: index * 0.1 }}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="group relative perspective-1000 min-w-[350px] md:min-w-[600px] lg:min-w-[900px] snap-center"
    >
      <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-[2rem] blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ transform: "translateZ(-50px)" }}
      />

      <div className="relative bg-slate-900/80 backdrop-blur-xl rounded-[2rem] border border-white/10 overflow-hidden hover:border-cyan-400/50 transition-colors duration-500 shadow-2xl h-full flex flex-col lg:flex-row">

        <div className="p-8 lg:p-10 flex flex-col justify-between space-y-6 lg:w-1/2" style={{ transform: "translateZ(20px)" }}>
          <div>
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="inline-block"
            >
              <h3 className={`text-3xl font-bold mb-2 bg-gradient-to-r ${project.gradient} bg-clip-text text-transparent`}>
                {project.title}
              </h3>
            </motion.div>
            <p className="text-cyan-400 text-lg font-medium mb-4">
              {project.tagline}
            </p>
            <p className="text-gray-300 text-base leading-relaxed line-clamp-3 hover:line-clamp-none transition-all">
              {project.description}
            </p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2 text-cyan-400 font-semibold uppercase tracking-wider text-xs">
              <Target className="w-4 h-4" />
              <span>Key Achievements</span>
            </div>
            <div className="grid gap-2">
              {project.achievements.slice(0, 3).map((achievement, i) => (
                <motion.div
                  key={i}
                  className="flex items-start gap-2"
                >
                  <Zap className="w-4 h-4 text-cyan-400 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-300 text-sm">{achievement}</span>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {project.tech.map((tech) => (
              <span
                key={tech}
                className={`px-3 py-1 bg-white/5 rounded-full text-xs text-cyan-300 border border-white/10 hover:bg-white/10 transition-colors`}
              >
                {tech}
              </span>
            ))}
          </div>

          <div className="flex gap-4 pt-2">
            {project.liveUrl && (
              <motion.a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`flex items-center gap-2 px-6 py-3 bg-gradient-to-r ${project.gradient} rounded-full text-white font-bold text-sm shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all`}
              >
                <ExternalLink size={16} />
                Live Demo
              </motion.a>
            )}
            {project.githubUrl && (
              <motion.a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/10 rounded-full text-white font-bold text-sm hover:bg-white/10 transition-all"
              >
                <Github size={16} />
                Code
              </motion.a>
            )}
          </div>
        </div>

        <div className="relative h-[300px] lg:h-auto lg:w-1/2 bg-gradient-to-br from-slate-800 to-slate-900 p-8 flex items-center justify-center overflow-hidden">

          <motion.div
            className="absolute inset-0 opacity-20"
            style={{
              scale: 1.1,
              translateX: useTransform(mouseX, [-0.5, 0.5], ["-5%", "5%"]),
              translateY: useTransform(mouseY, [-0.5, 0.5], ["-5%", "5%"]),
            }}
          >
            <img
              src={project.image}
              alt={project.title}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </motion.div>

          <motion.div
            className="relative z-10 w-full max-w-[280px]"
            style={{ transform: "translateZ(50px)" }}
          >
            <div className={`bg-gradient-to-br ${project.gradient} bg-opacity-10 rounded-3xl p-6 border border-white/10 backdrop-blur-md shadow-xl`}>
              <div className="text-center">
                <TrendingUp className="w-12 h-12 text-white mx-auto mb-4 drop-shadow-lg" />
                <div className="text-5xl font-black text-white mb-2 tracking-tight drop-shadow-lg">
                  {project.impactMetric.prefix}{project.impactMetric.value}{project.impactMetric.unit}
                </div>
                <div className="text-sm text-white/90 font-bold uppercase tracking-widest">
                  {project.impactMetric.label}
                </div>
              </div>
              <div className="mt-6 h-[100px]">
                <ProjectImpactChart value={project.impactMetric.value} />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

export default function Projects() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  // Swipe detection logic
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      scrollRight();
    } else if (isRightSwipe) {
      scrollLeft();
    }

    // Reset
    setTouchStart(0);
    setTouchEnd(0);
  };

  const scrollLeft = () => {
    if (containerRef.current) {
      containerRef.current.scrollBy({ left: -window.innerWidth * 0.8, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (containerRef.current) {
      containerRef.current.scrollBy({ left: window.innerWidth * 0.8, behavior: 'smooth' });
    }
  };

  return (
    <section id="projects" className="py-20 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              Featured Projects
            </span>
          </h2>
          <div className="h-1 w-20 bg-gradient-to-r from-blue-400 to-cyan-400 mx-auto rounded-full" />
          <p className="text-gray-400 mt-4 text-lg">
            Swipe to explore my latest work
          </p>
        </motion.div>

        <div className="relative">
          {/* Scroll Buttons for Desktop */}
          <button
            onClick={scrollLeft}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-20 bg-slate-800/80 p-3 rounded-full text-white hover:bg-cyan-500 hover:scale-110 transition-all hidden md:block backdrop-blur-sm border border-white/10"
          >
            <ChevronLeft size={24} />
          </button>

          <button
            onClick={scrollRight}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-20 bg-slate-800/80 p-3 rounded-full text-white hover:bg-cyan-500 hover:scale-110 transition-all hidden md:block backdrop-blur-sm border border-white/10"
          >
            <ChevronRight size={24} />
          </button>

          {/* Horizontal Scroll Container */}
          <div
            ref={containerRef}
            className="flex overflow-x-auto gap-6 md:gap-8 pb-12 snap-x snap-mandatory hide-scrollbar"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {projects.map((project, index) => (
              <ProjectCard key={project.title} project={project} index={index} />
            ))}

            {/* CTA Card as the last item */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="min-w-[300px] flex items-center justify-center snap-center"
            >
              <div className="text-center p-8 bg-white/5 rounded-3xl border border-white/10 hover:border-cyan-400/30 transition-colors">
                <Github size={48} className="mx-auto mb-4 text-gray-400" />
                <h3 className="text-xl font-bold text-white mb-2">View More</h3>
                <p className="text-gray-400 mb-6">Check out more projects on GitHub</p>
                <a
                  href="https://github.com/sunamkundal01"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full text-white font-semibold hover:opacity-90 transition-opacity"
                >
                  Visit GitHub
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
