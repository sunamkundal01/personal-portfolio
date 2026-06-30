import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Linkedin, Github, MapPin, Send, Code2, Instagram, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';

const contactMethods = [
  {
    icon: Mail,
    label: 'Email',
    value: 'kundalsunam@gmail.com',
    href: 'mailto:kundalsunam@gmail.com',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    icon: Linkedin,
    label: 'LinkedIn',
    value: 'linkedin.com/in/sunamkundal',
    href: 'https://www.linkedin.com/in/sunamkundal/',
    color: 'from-cyan-500 to-teal-500',
  },
  {
    icon: Github,
    label: 'GitHub',
    value: 'github.com/sunamkundal01',
    href: 'https://github.com/sunamkundal01',
    color: 'from-teal-500 to-emerald-500',
  },
  {
    icon: Code2,
    label: 'LeetCode',
    value: 'leetcode.com/sunamkundal',
    href: 'https://leetcode.com/sunamkundal',
    color: 'from-amber-500 to-orange-500',
  },
  {
    icon: Instagram,
    label: 'Instagram',
    value: '@sunamkundal01',
    href: 'https://instagram.com/sunamkundal01',
    color: 'from-pink-500 to-rose-500',
  },
  {
    icon: MapPin,
    label: 'Location',
    value: 'Bengaluru, Karnataka, India',
    color: 'from-emerald-500 to-green-500',
  },
];

type Status = 'idle' | 'sending' | 'success' | 'error';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState('');

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === 'sending') return;
    setStatus('sending');
    setError('');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error || 'Something went wrong. Please try again.');
      setStatus('success');
      setForm({ name: '', email: '', message: '' });
    } catch (err) {
      setStatus('error');
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    }
  };

  return (
    <section id="contact" className="py-20 relative">
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
              Let's Connect
            </span>
          </h2>
          <div className="h-1 w-20 bg-gradient-to-r from-blue-400 to-cyan-400 mx-auto rounded-full" />
          <p className="text-gray-400 mt-4 text-lg">
            Open to opportunities in AI Engineering, Machine Learning, and Data Science
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-6 mb-12">
          {contactMethods.map((method, index) => (
            <motion.div
              key={method.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ scale: 1.05, rotate: 2 }}
              className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm p-6 rounded-2xl border border-blue-500/20 hover:border-cyan-400/50 transition-all"
            >
              {method.href ? (
                <a
                  href={method.href}
                  target={method.href.startsWith('http') ? '_blank' : undefined}
                  rel={method.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  className="block text-center"
                >
                  <motion.div
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.5 }}
                    className={`inline-flex items-center justify-center w-14 h-14 bg-gradient-to-r ${method.color} rounded-full mb-4`}
                  >
                    <method.icon className="w-7 h-7 text-white" />
                  </motion.div>
                  <h3 className="text-white font-semibold mb-2">{method.label}</h3>
                  <p className="text-gray-400 text-sm break-words">{method.value}</p>
                </a>
              ) : (
                <div className="text-center">
                  <motion.div
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.5 }}
                    className={`inline-flex items-center justify-center w-14 h-14 bg-gradient-to-r ${method.color} rounded-full mb-4`}
                  >
                    <method.icon className="w-7 h-7 text-white" />
                  </motion.div>
                  <h3 className="text-white font-semibold mb-2">{method.label}</h3>
                  <p className="text-gray-400 text-sm">{method.value}</p>
                </div>
              )}
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-3xl p-8 md:p-12 border border-blue-500/20"
        >
          <div className="text-center">
            <Send className="w-16 h-16 text-cyan-400 mx-auto mb-6" />
            <h3 className="text-3xl font-bold text-white mb-4">
              Ready to Build Something Amazing?
            </h3>
            <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
              I'm actively seeking opportunities where I can apply my AI/ML and edge-deployment expertise to solve real-world problems. Whether it's a full-time role, internship, or an exciting project collaboration, I'd love to hear from you!
            </p>
          </div>

          <form onSubmit={handleSubmit} className="max-w-2xl mx-auto text-left">
            <div className="grid sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label htmlFor="name" className="block text-sm text-gray-300 mb-2">
                  Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  maxLength={100}
                  value={form.name}
                  onChange={handleChange}
                  disabled={status === 'sending'}
                  placeholder="Your name"
                  className="w-full px-4 py-3 rounded-xl bg-slate-900/60 border border-blue-500/20 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400/60 focus:ring-1 focus:ring-cyan-400/40 transition-colors disabled:opacity-60"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm text-gray-300 mb-2">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  maxLength={200}
                  value={form.email}
                  onChange={handleChange}
                  disabled={status === 'sending'}
                  placeholder="you@example.com"
                  className="w-full px-4 py-3 rounded-xl bg-slate-900/60 border border-blue-500/20 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400/60 focus:ring-1 focus:ring-cyan-400/40 transition-colors disabled:opacity-60"
                />
              </div>
            </div>
            <div className="mb-6">
              <label htmlFor="message" className="block text-sm text-gray-300 mb-2">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                required
                rows={5}
                maxLength={5000}
                value={form.message}
                onChange={handleChange}
                disabled={status === 'sending'}
                placeholder="Tell me about the opportunity or project..."
                className="w-full px-4 py-3 rounded-xl bg-slate-900/60 border border-blue-500/20 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400/60 focus:ring-1 focus:ring-cyan-400/40 transition-colors resize-y disabled:opacity-60"
              />
            </div>

            {status === 'success' && (
              <div className="mb-4 flex items-center gap-2 text-emerald-400 text-sm">
                <CheckCircle2 size={18} />
                Thanks! Your message has been sent — I'll get back to you soon.
              </div>
            )}
            {status === 'error' && (
              <div className="mb-4 flex items-center gap-2 text-rose-400 text-sm">
                <AlertCircle size={18} />
                {error}
              </div>
            )}

            <div className="text-center">
              <motion.button
                type="submit"
                disabled={status === 'sending'}
                whileHover={{ scale: status === 'sending' ? 1 : 1.05 }}
                whileTap={{ scale: status === 'sending' ? 1 : 0.95 }}
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full text-white font-semibold shadow-lg shadow-blue-500/50 hover:shadow-blue-500/70 transition-shadow disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {status === 'sending' ? (
                  <>
                    <Loader2 size={20} className="animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Mail size={20} />
                    Send Message
                  </>
                )}
              </motion.button>
            </div>
          </form>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-12 text-center text-gray-500 text-sm"
        >
          <p>© 2026 Sunam Kundal. Crafted with passion and code.</p>
          <p className="mt-2">Hint: Try pressing Ctrl + Shift + N for a surprise! 🎨</p>
        </motion.div>
      </div>
    </section>
  );
}
