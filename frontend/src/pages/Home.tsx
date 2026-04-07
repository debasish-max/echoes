import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="relative overflow-hidden pt-20">
      {/* Hero Section */}
      <section className="min-h-screen flex flex-col items-center justify-center text-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="relative"
        >
          {/* Subtle Glow Behind Text */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[200px] bg-primary/20 blur-[100px] rounded-full z-0 pointer-events-none" />
          
          <h1 className="text-6xl md:text-8xl font-serif font-bold tracking-tight mb-4 relative z-10">
            Batch <span className="text-primary drop-shadow-lg text-glow">2022–26</span>
          </h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="text-xl md:text-2xl text-gray-400 font-light mb-12 tracking-wide"
          >
            A Journey We'll Always Carry
          </motion.p>
          
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/journey')}
            className="px-8 py-3 rounded-full bg-primary text-black font-semibold text-lg hover:shadow-[0_0_20px_rgba(250,204,21,0.5)] transition-all duration-300 relative z-10"
          >
            Start the Journey
          </motion.button>
        </motion.div>

        {/* Floating Background Text/Numbers */}
        <div className="absolute top-10 left-10 text-[180px] font-serif font-bold text-white/[0.02] select-none pointer-events-none -z-10">
          2022
        </div>
        <div className="absolute bottom-10 right-10 text-[180px] font-serif font-bold text-white/[0.02] select-none pointer-events-none -z-10">
          26
        </div>
      </section>

      {/* Intro Section / Nostalgia Hook */}
      <section className="py-32 px-4 max-w-5xl mx-auto text-center border-t border-white/5">
        <motion.div
           initial={{ opacity: 0, y: 50 }}
           whileInView={{ opacity: 1, y: 0 }}
           transition={{ duration: 1 }}
           viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-serif mb-8 bg-gradient-to-r from-white via-primary to-white bg-clip-text text-transparent">
            Memories in Motion
          </h2>
          <p className="text-lg text-gray-400 leading-relaxed mb-12">
            The laughs, the caffeine-fueled nights, and the friendships that defined our college years. 
            This is our digital time capsule—a place for every smile, every milestone, and every message.
          </p>
          <div className="grid md:grid-cols-3 gap-8 text-left">
            <FeatureCard title="The Journey" desc="Relive the evolution semester by semester." icon="🛤️" />
            <FeatureCard title="The Vault" desc="A shared archive of our best moments." icon="🖼️" />
            <FeatureCard title="The Wall" desc="Words that matter, shared anonymously." icon="🧱" />
          </div>
        </motion.div>
      </section>
    </div>
  );
}

function FeatureCard({ title, desc, icon }: { title: string; desc: string; icon: string }) {
  return (
    <div className="glass p-8 rounded-2xl hover:border-primary/20 transition-all duration-300 group">
      <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">{icon}</div>
      <h3 className="text-xl font-serif text-primary mb-2">{title}</h3>
      <p className="text-gray-400 text-sm">{desc}</p>
    </div>
  );
}
