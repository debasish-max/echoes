import { motion } from 'framer-motion';
import { Instagram, Search, Loader2, Sparkles } from 'lucide-react';
import { useState, useEffect } from 'react';
import api from '../lib/api';

interface Student {
  _id: string;
  name: string;
  bio: string;
  hobbies: string[];
  instagram: string;
  image: string;
}

export default function Yearbook() {
  const [search, setSearch] = useState('');
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);

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
              className="group glass rounded-3xl overflow-hidden hover:border-primary/30 transition-all duration-500"
            >
              {/* Image Wrapper */}
              <div className="relative aspect-square overflow-hidden bg-white/5">
                <img 
                  src={student.image} 
                  alt={student.name} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 grayscale group-hover:grayscale-0"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-60" />
                
                {/* Instagram Overlay */}
                {student.instagram && (
                  <a 
                    href={`https://instagram.com/${student.instagram}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute top-4 right-4 p-2 bg-primary/20 backdrop-blur-md rounded-full border border-primary/20 text-primary opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0"
                  >
                    <Instagram size={18} />
                  </a>
                )}
              </div>

              <div className="p-6">
                <h3 className="text-xl font-serif font-bold text-primary mb-2 group-hover:text-glow transition-all duration-300">{student.name}</h3>
                <p className="text-sm text-gray-400 leading-relaxed mb-4 line-clamp-3 italic">"{student.bio}"</p>
                
                <div className="flex flex-wrap gap-2">
                  {student.hobbies.map(hobby => (
                    <span key={hobby} className="text-[10px] uppercase tracking-widest px-2 py-1 bg-white/5 rounded-md border border-white/5 text-gray-300">
                      {hobby}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

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
