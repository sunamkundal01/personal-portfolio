import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { useRef } from 'react';

// Icon sources: skillicons.dev (consistent set) + devicon + Simple Icons.
const ic = (slug: string) => `https://skillicons.dev/icons?i=${slug}`;
const dev = (slug: string, variant = 'original') =>
  `https://cdn.jsdelivr.net/gh/devicons/devicon/icons/${slug}/${slug}-${variant}.svg`;
const si = (slug: string) => `https://cdn.simpleicons.org/${slug}`;

type Skill = { name: string; icon?: string };

const skillCategories: { title: string; color: string; skills: Skill[] }[] = [
  {
    title: 'Languages',
    color: 'from-blue-500 to-cyan-500',
    skills: [
      { name: 'Python', icon: ic('py') },
      { name: 'C', icon: ic('c') },
      { name: 'C++', icon: ic('cpp') },
      { name: 'Java', icon: ic('java') },
      { name: 'JavaScript', icon: ic('js') },
      { name: 'TypeScript', icon: ic('ts') },
      { name: 'SQL', icon: ic('mysql') },
      { name: 'Bash', icon: ic('bash') },
      { name: 'Ruby', icon: ic('ruby') },
    ],
  },
  {
    title: 'AI/ML & Data Science',
    color: 'from-cyan-500 to-teal-500',
    skills: [
      { name: 'PyTorch', icon: ic('pytorch') },
      { name: 'TensorFlow', icon: ic('tensorflow') },
      { name: 'Keras', icon: dev('keras') },
      { name: 'Scikit-learn', icon: dev('scikitlearn') },
      { name: 'HuggingFace', icon: si('huggingface') },
      { name: 'LangChain', icon: si('langchain/ffffff') },
      { name: 'OpenCV', icon: ic('opencv') },
      { name: 'NumPy', icon: dev('numpy') },
      { name: 'Pandas', icon: dev('pandas') },
      { name: 'Matplotlib', icon: dev('matplotlib') },
      { name: 'Seaborn' },
      { name: 'Anaconda', icon: ic('anaconda') },
      { name: 'Jupyter', icon: dev('jupyter') },
      { name: 'NLP' },
      { name: 'RAG' },
      { name: 'Generative AI' },
      { name: 'Transfer Learning' },
      { name: 'Fine-tuning' },
    ],
  },
  {
    title: 'Edge AI & LLMs',
    color: 'from-teal-500 to-emerald-500',
    skills: [
      { name: 'ONNX', icon: si('onnx') },
      { name: 'Ollama', icon: si('ollama/ffffff') },
      { name: 'On-Device LLM Deployment' },
      { name: 'LLM-Compressor' },
      { name: 'Quantization' },
      { name: 'Dynamic LoRA' },
      { name: 'MoLE' },
    ],
  },
  {
    title: 'Backend & Web',
    color: 'from-emerald-500 to-green-500',
    skills: [
      { name: 'Node.js', icon: ic('nodejs') },
      { name: 'Express.js', icon: ic('express') },
      { name: 'React.js', icon: ic('react') },
      { name: 'Vue.js', icon: ic('vue') },
      { name: 'Flask', icon: ic('flask') },
      { name: 'Django', icon: ic('django') },
      { name: 'Spring', icon: ic('spring') },
      { name: 'HTML', icon: ic('html') },
      { name: 'CSS', icon: ic('css') },
      { name: 'Tailwind', icon: ic('tailwind') },
      { name: 'Firebase', icon: ic('firebase') },
      { name: 'Streamlit', icon: si('streamlit/FF4B4B') },
      { name: 'JWT', icon: si('jsonwebtokens') },
      { name: 'REST APIs' },
      { name: 'RBAC' },
    ],
  },
  {
    title: 'Databases',
    color: 'from-green-500 to-lime-500',
    skills: [
      { name: 'MongoDB', icon: ic('mongodb') },
      { name: 'MySQL', icon: ic('mysql') },
      { name: 'MariaDB', icon: dev('mariadb') },
      { name: 'SQLite', icon: ic('sqlite') },
    ],
  },
  {
    title: 'Systems & DevOps',
    color: 'from-blue-500 to-indigo-500',
    skills: [
      { name: 'Linux', icon: ic('linux') },
      { name: 'Docker', icon: ic('docker') },
      { name: 'Kubernetes', icon: ic('kubernetes') },
      { name: 'Jenkins', icon: ic('jenkins') },
      { name: 'Git', icon: ic('git') },
      { name: 'pytest', icon: dev('pytest') },
      { name: 'Embedded Validation' },
    ],
  },
  {
    title: 'Cloud & Tools',
    color: 'from-indigo-500 to-purple-500',
    skills: [
      { name: 'Google Cloud', icon: dev('googlecloud') },
      { name: 'Vercel', icon: si('vercel/ffffff') },
      { name: 'VS Code', icon: dev('vscode') },
    ],
  },
];

function SkillChip({ skill }: { skill: Skill }) {
  return (
    <span className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 border border-white/10 hover:border-cyan-400/50 hover:bg-white/10 transition-all">
      {skill.icon ? (
        <img
          src={skill.icon}
          alt=""
          aria-hidden="true"
          loading="lazy"
          className="w-5 h-5 object-contain"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).style.display = 'none';
          }}
        />
      ) : (
        <Sparkles className="w-4 h-4 text-cyan-400 flex-shrink-0" />
      )}
      <span className="text-gray-200 text-sm font-medium whitespace-nowrap">{skill.name}</span>
    </span>
  );
}

function SkillCard({ category, index }: { category: typeof skillCategories[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseX = useSpring(x, { stiffness: 500, damping: 100 });
  const mouseY = useSpring(y, { stiffness: 500, damping: 100 });

  const rotateX = useTransform(mouseY, [-0.5, 0.5], ['4deg', '-4deg']);
  const rotateY = useTransform(mouseX, [-0.5, 0.5], ['-4deg', '4deg']);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    x.set((e.clientX - rect.left - rect.width / 2) / rect.width);
    y.set((e.clientY - rect.top - rect.height / 2) / rect.height);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.08 }}
      style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm p-8 rounded-2xl border border-blue-500/20 hover:border-cyan-400/50 transition-all perspective-1000"
    >
      <h3
        className={`text-2xl font-bold mb-6 bg-gradient-to-r ${category.color} bg-clip-text text-transparent`}
        style={{ transform: 'translateZ(20px)' }}
      >
        {category.title}
      </h3>
      <div className="flex flex-wrap gap-3" style={{ transform: 'translateZ(10px)' }}>
        {category.skills.map((skill) => (
          <SkillChip key={skill.name + category.title} skill={skill} />
        ))}
      </div>
    </motion.div>
  );
}

export default function Skills() {
  return (
    <section id="skills" className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              Skills & Expertise
            </span>
          </h2>
          <div className="h-1 w-20 bg-gradient-to-r from-blue-400 to-cyan-400 mx-auto rounded-full" />
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {skillCategories.map((category, categoryIndex) => (
            <SkillCard key={category.title} category={category} index={categoryIndex} />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-12 text-center"
        >
          <p className="text-gray-400 text-lg">
            Constantly learning and adapting to emerging technologies in AI and systems engineering
          </p>
        </motion.div>
      </div>
    </section>
  );
}
