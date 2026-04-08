import { motion, AnimatePresence } from 'framer-motion';
import { Instagram, Search, Loader2, Sparkles, Linkedin, X, Send, Quote } from 'lucide-react';
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

interface LegacyMessage {
  _id: string;
  author: string;
  content: string;
  createdAt: string;
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
  const [messages, setMessages] = useState<LegacyMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [newMessage, setNewMessage] = useState({ author: '', content: '' });
  const [sending, setSending] = useState(false);

  const fetchMessages = async () => {
    try {
      const { data } = await api.get(`/messages/${student._id}`);
      setMessages(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [student._id]);

  const handleSubmitMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.author || !newMessage.content) return;
    try {
      setSending(true);
      await api.post(`/messages/${student._id}`, newMessage);
      setNewMessage({ author: '', content: '' });
      fetchMessages();
    } catch (err) {
      alert('Failed to post message');
    } finally {
      setSending(false);
    }
  };

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

        {/* Left Column: Portrait & Info */}
        <div className="w-full md:w-[40%] h-[40vh] md:h-auto relative overflow-hidden flex flex-col">
          <div className="flex-1 relative">
            <img 
              src={student.imageUrl} 
              alt={student.name} 
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
            
            {/* Social Overlays */}
            <div className="absolute bottom-12 left-10 right-10">
              <h2 className="text-4xl font-serif font-bold text-white mb-1 text-glow">{student.name}</h2>
              <p className="text-primary font-bold tracking-[0.2em] text-xs uppercase mb-6">{student.department}</p>
              
              <div className="flex gap-4">
                {student.instagram && (
                  <a href={`https://instagram.com/${student.instagram}`} target="_blank" className="p-3 bg-white/10 hover:bg-white/20 rounded-xl border border-white/10 text-white transition-all">
                    <Instagram size={20} />
                  </a>
                )}
                {student.linkedin && (
                  <a href={student.linkedin} target="_blank" className="p-3 bg-white/10 hover:bg-white/20 rounded-xl border border-white/10 text-white transition-all">
                    <Linkedin size={20} />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Bio & Legacy Wall */}
        <div className="flex-1 overflow-y-auto custom-scrollbar bg-surface/30 p-8 md:p-12">
          <div className="max-w-2xl mx-auto space-y-12">
            
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

            {/* Legacy Message Wall */}
            <section className="space-y-8 pt-8 border-t border-white/5">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold text-white">The Legacy Wall</h3>
                <span className="text-xs text-gray-500 font-mono">{messages.length} Memories</span>
              </div>

              {/* Message List */}
              <div className="space-y-4 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                {loading ? (
                  <Loader2 className="animate-spin text-primary mx-auto" />
                ) : messages.length === 0 ? (
                  <div className="p-8 bg-white/5 rounded-2xl border border-white/5 text-center italic text-gray-600 text-sm">
                    No messages yet. Be the first to leave a memory!
                  </div>
                ) : (
                  messages.map(msg => (
                    <motion.div 
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      key={msg._id} 
                      className="p-4 bg-white/5 rounded-2xl border border-white/5 relative group"
                    >
                      <p className="text-gray-300 text-sm leading-relaxed mb-2">"{msg.content}"</p>
                      <div className="flex justify-between items-center">
                        <span className="text-primary text-[10px] font-bold uppercase tracking-widest">— {msg.author}</span>
                        <span className="text-[8px] text-gray-600 uppercase font-mono">{new Date(msg.createdAt).toLocaleDateString()}</span>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>

              {/* Message Form */}
              <form onSubmit={handleSubmitMessage} className="bg-black/40 p-6 rounded-3xl border border-primary/10 space-y-4">
                <h4 className="text-xs font-bold text-primary/70 uppercase tracking-widest">Leave a memory</h4>
                <div className="space-y-3">
                  <input 
                    type="text" 
                    placeholder="Your Name" 
                    required 
                    className="w-full bg-white/5 border border-white/5 rounded-xl py-2 px-4 text-white text-sm outline-none focus:border-primary/50"
                    value={newMessage.author}
                    onChange={e => setNewMessage({...newMessage, author: e.target.value})}
                  />
                  <textarea 
                    placeholder="Write something heartfelt..." 
                    required 
                    className="w-full bg-white/5 border border-white/5 rounded-xl py-3 px-4 text-white text-sm outline-none focus:border-primary/50 h-24"
                    value={newMessage.content}
                    onChange={e => setNewMessage({...newMessage, content: e.target.value})}
                  />
                  <button 
                    type="submit" 
                    disabled={sending}
                    className="w-full bg-primary text-black font-bold py-3 rounded-xl hover:shadow-lg transition-all flex items-center justify-center gap-2 group disabled:opacity-50"
                  >
                    {sending ? <Loader2 className="animate-spin" size={18} /> : (
                      <>Post Memory <Send size={16} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" /></>
                    )}
                  </button>
                </div>
              </form>
            </section>

          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
