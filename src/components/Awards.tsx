import { motion } from 'framer-motion';

const AWARDS = [
  {
    icon: '🏆',
    category: 'HACKATHON',
    title: 'IIT BHU ML Hackathon',
    desc: 'Ranked 13th out of 50+ teams at the IIT BHU Machine Learning Hackathon.',
    color: '#eab308',
  },
  {
    icon: '💻',
    category: 'COMPETITIVE',
    title: '750+ DSA Problems Solved',
    desc: 'Solved 750+ problems across LeetCode, GFG, and CodeChef. LeetCode Rating: 1676 (Top 20%).',
    color: '#06b6d4',
  },
  {
    icon: '🔐',
    category: 'RESEARCH',
    title: '95.8% GAR Iris Security',
    desc: 'Built a biometric template protection pipeline hitting 95.8% GAR @ 1% FAR with 100-bit cryptographic security on CASIA-Iris-Thousand.',
    color: '#a855f7',
  },
  {
    icon: '🎓',
    category: 'EDUCATION',
    title: 'NIT Srinagar — B.Tech CSE',
    desc: 'Computer Science & Engineering, CGPA 7.91 / 10.0 (2022 – 2026).',
    color: '#22c55e',
  },
];

export default function Awards() {
  return (
    <section id="awards" className="py-24 relative overflow-hidden bg-black/20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl md:text-5xl font-black text-white mb-16 flex items-center gap-4 uppercase tracking-widest"
        >
          <span className="w-2 md:w-3 h-10 md:h-12 bg-yellow-500 block rounded-r-lg" />
          CREDIBILITY & AWARDS
        </motion.h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {AWARDS.map((award, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="bg-slate-900/60 backdrop-blur-md p-6 rounded-2xl hover:-translate-y-2 transition-transform border-l-4"
              style={{
                borderLeftColor: award.color,
                boxShadow: '0 4px 30px rgba(0, 0, 0, 0.5)',
              }}
            >
              <div className="text-4xl mb-4">{award.icon}</div>
              <div
                className="text-xs font-bold tracking-widest mb-2"
                style={{ color: award.color, fontFamily: 'JetBrains Mono, monospace' }}
              >
                {award.category}
              </div>
              <h3 className="text-xl font-bold text-white mb-2">{award.title}</h3>
              <p className="text-sm text-gray-400 leading-relaxed">{award.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
