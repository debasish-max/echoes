import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { Compass, BookOpen, Image as ImageIcon, MessageSquare } from 'lucide-react';

export default function Home() {
  const navigate = useNavigate();

  const features = [
    {
      num: "01",
      title: "The Journey",
      desc: "Trace our evolution from wide-eyed freshmen to the graduates of today. A visual timeline of our best eras.",
      icon: Compass,
      link: "/journey"
    },
    {
      num: "02",
      title: "The Yearbook",
      desc: "Every face holds a story. Explore the profiles, quirks, and lasting legacies of everyone in the batch.",
      icon: BookOpen,
      link: "/yearbook"
    },
    {
      num: "03",
      title: "Media Vault",
      desc: "An unfiltered, collaborative collection of candid snapshots and spontaneous adventures.",
      icon: ImageIcon,
      link: "/vault"
    },
    {
      num: "04",
      title: "The Wall",
      desc: "Leave your final words. A space for confessions, inside jokes, and heartfelt anonymous goodbyes.",
      icon: MessageSquare,
      link: "/wall"
    }
  ];

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
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-xl md:text-2xl text-primary font-serif italic mb-6 tracking-wide"
          >
            A Journey We'll Always Carry
          </motion.p>

          <h1 className="text-6xl md:text-8xl font-serif font-bold tracking-tight mb-8 relative z-10 text-white">
            Batch <span className="font-serif italic font-normal text-white drop-shadow-lg">2023–26</span>
          </h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="max-w-2xl mx-auto text-sm md:text-base text-gray-400 font-light mb-16 tracking-wide leading-relaxed"
          >
            Four years of laughter, unforgettable days, and lessons learned. Join us as we look back on the moments that defined us.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="flex flex-col items-center gap-4 relative z-10"
          >
            <button
              onClick={() => navigate('/journey')}
              className="text-xs uppercase tracking-[0.3em] text-gray-400 hover:text-primary transition-colors duration-300"
            >
              Click to start the journey
            </button>
            <div className="w-[1px] h-12 bg-gradient-to-b from-gray-500 to-transparent"></div>
          </motion.div>
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
      <section className="py-32 px-4 max-w-7xl mx-auto border-t border-white/5 relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1px] h-32 bg-gradient-to-b from-white/10 to-transparent" />
        
        <motion.div
           initial={{ opacity: 0, y: 40 }}
           whileInView={{ opacity: 1, y: 0 }}
           transition={{ duration: 1 }}
           viewport={{ once: true }}
           className="flex flex-col lg:flex-row justify-between items-end mb-24 gap-10 relative z-10"
        >
          <div className="max-w-3xl">
             <span className="text-primary tracking-[0.4em] uppercase text-xs font-bold mb-6 block">The Echoes Archive</span>
             <h2 className="text-4xl md:text-6xl font-serif text-white leading-tight">
                More than just memories. <br />
                <span className="text-gray-500 italic">A legacy we leave behind.</span>
             </h2>
          </div>
          <p className="text-gray-400 max-w-md text-sm md:text-base leading-relaxed border-l border-primary/30 pl-6">
            Four years vanished in the blink of an eye. This digital time capsule was built to ensure the laughter, the struggles, and the unbreakable bonds of Batch-26 are never forgotten.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <motion.div
                key={feat.num}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                viewport={{ once: true }}
              >
                <Link to={feat.link} className="group relative h-[380px] rounded-[2rem] overflow-hidden bg-white/[0.02] border border-white/5 hover:border-primary/30 transition-all duration-500 block">
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/40 to-black/90 z-10" />
                  
                  {/* Subtle animated background gradient */}
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                  
                  <div className="absolute inset-0 p-8 flex flex-col justify-between z-20">
                    <div className="flex justify-between items-start">
                       <span className="text-6xl font-serif text-white/5 group-hover:text-primary/10 transition-colors duration-500">{feat.num}</span>
                       <div className="p-3 bg-white/5 rounded-full backdrop-blur-sm border border-white/10 group-hover:bg-primary/20 group-hover:border-primary/50 transition-all duration-500">
                         <Icon className="text-gray-400 group-hover:text-primary transition-colors duration-500" size={20} />
                       </div>
                    </div>
                    <div>
                      <h3 className="text-2xl font-serif text-white mb-3 group-hover:text-primary transition-colors duration-300">{feat.title}</h3>
                      <p className="text-gray-400 text-sm leading-relaxed opacity-60 group-hover:opacity-100 transition-opacity duration-500">
                        {feat.desc}
                      </p>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
