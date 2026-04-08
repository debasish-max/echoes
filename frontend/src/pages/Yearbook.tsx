import { motion, AnimatePresence } from 'framer-motion';
import { Instagram, Search, Loader2, Sparkles, Linkedin, X, Quote } from 'lucide-react';
import { useState, useEffect } from 'react';
import api from '../lib/api';

interface Student {
  _id: string;
  name: string;
  bio: string;
  department: string;
  hobbies: string[];
  instagram: string;
  linkedin: string;
  imageUrl: string;
}


export default function Yearbook() {
  const [search, setSearch] = useState('');
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/yearbook');
      setStudents(data);
    } catch (error) {
      console.error('Error fetching students:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const filteredStudents = students.filter(s => 
    s.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen pt-28 pb-20 px-4 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-16"
      >
        <h1 className="text-5xl font-serif font-bold mb-4 text-glow">The Yearbook</h1>
        <p className="text-gray-400">Faces and stories that shaped Batch-26</p>
      </motion.div>

      {/* Search Bar */}
      <div className="max-w-md mx-auto mb-12 relative group">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-primary transition-colors duration-300" size={20} />
        <input 
          type="text" 
          placeholder="Search by name..." 
          className="w-full bg-surface border border-white/5 rounded-full py-3 pl-12 pr-6 text-white focus:outline-none focus:border-primary/50 transition-all duration-300 shadow-xl"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <Loader2 className="animate-spin text-primary" size={48} />
          <p className="text-gray-500 animate-pulse">Retrieving the class directory...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {filteredStudents.map((student, index) => (
            <motion.div
              key={student._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => setSelectedStudent(student)}
              className="group glass rounded-3xl overflow-hidden hover:border-primary/30 transition-all duration-500 cursor-pointer"
            >
              {/* Image Wrapper */}
              <div className="relative aspect-square overflow-hidden bg-white/5">
                <img 
                  src={student.imageUrl} 
                  alt={student.name} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 grayscale group-hover:grayscale-0"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-60" />
              </div>

              <div className="p-6">
                <div className="flex justify-between items-start mb-1">
                  <h3 className="text-xl font-serif font-bold text-primary group-hover:text-glow transition-all duration-300">{student.name}</h3>
                  <span className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">{student.department}</span>
                </div>
                <p className="text-sm text-gray-400 leading-relaxed mb-4 line-clamp-3 italic">"{student.bio}"</p>
                
                <div className="flex flex-wrap gap-2">
                  {student.hobbies.slice(0, 3).map(hobby => (
                    <span key={hobby} className="text-[10px] uppercase tracking-widest px-2 py-1 bg-white/5 rounded-md border border-white/5 text-gray-300">
                      {hobby}
                    </span>
                  ))}
                  {student.hobbies.length > 3 && <span className="text-[10px] text-gray-500">+{student.hobbies.length - 3}</span>}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Cinematic Profile Modal */}
      <AnimatePresence>
        {selectedStudent && (
          <StudentProfileModal 
            student={selectedStudent} 
            onClose={() => setSelectedStudent(null)} 
          />
        )}
      </AnimatePresence>

      {!loading && filteredStudents.length === 0 && (
        <div className="text-center py-20 flex flex-col items-center gap-4">
          <div className="p-6 bg-white/5 rounded-full border border-white/5">
            <Sparkles className="text-gray-600" size={48} />
          </div>
          <div>
            <h3 className="text-xl font-serif text-white mb-2">
              {search ? "No students found matching your search." : "The Directory is currently empty."}
            </h3>
            <p className="text-gray-500">Wait for the admin to add your classmates' profiles.</p>
          </div>
        </div>
      )}
    </div>
  );
}

function StudentProfileModal({ student, onClose }: { student: Student; onClose: () => void }) {

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 md:p-8"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.9, y: 20, opacity: 0 }}
        className="glass w-full max-w-6xl h-full md:max-h-[85vh] overflow-hidden rounded-[2.5rem] border-primary/20 shadow-2xl relative flex flex-col md:flex-row"
        onClick={e => e.stopPropagation()}
      >
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 z-[110] p-3 bg-white/5 hover:bg-white/10 rounded-full border border-white/10 text-white transition-all duration-300"
        >
          <X size={20} />
        </button>

        {/* Left Column: Portrait Only */}
        <div className="w-full md:w-[45%] h-[50vh] md:h-auto relative overflow-hidden">
          <img 
            src={student.imageUrl} 
            alt={student.name} 
            className="absolute inset-0 w-full h-full object-cover"
          />
        </div>

        {/* Right Column: All Info */}
        <div className="flex-1 overflow-y-auto custom-scrollbar bg-surface/30 p-8 md:p-12">
          <div className="max-w-2xl mx-auto space-y-10">
            
            {/* Header Info */}
            <header className="border-b border-white/5 pb-8">
              <h2 className="text-4xl md:text-5xl font-serif font-bold text-white mb-2 text-glow">{student.name}</h2>
              <p className="text-primary font-bold tracking-[0.2em] text-sm uppercase">{student.department}</p>
            </header>
            
            {/* Bio Section */}
            <section>
              <div className="flex items-center gap-3 mb-6">
                <Quote className="text-primary opacity-50" size={24} />
                <h3 className="text-xs font-bold uppercase tracking-[0.3em] text-gray-500">Your legacy from the batch</h3>
              </div>
              <p className="text-xl font-serif italic text-white/90 leading-relaxed pl-8 border-l-2 border-primary/30">
                "{student.bio}"
              </p>
            </section>

            {/* Hobbies */}
            <section className="flex flex-wrap gap-3">
              {student.hobbies.map(hobby => (
                <span key={hobby} className="px-4 py-2 bg-white/5 rounded-full border border-white/5 text-xs text-gray-400 font-medium">
                  #{hobby}
                </span>
              ))}
            </section>

            {/* Social Links */}
            <div className="flex gap-3 pt-6 border-t border-white/5">
              {student.instagram && (
                <a href={`https://instagram.com/${student.instagram}`} target="_blank" className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/10 text-white transition-all duration-300">
                  <Instagram size={20} />
                </a>
              )}
              {student.linkedin && (
                <a href={student.linkedin} target="_blank" className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/10 text-white transition-all duration-300">
                  <Linkedin size={20} />
                </a>
              )}
            </div>


          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
