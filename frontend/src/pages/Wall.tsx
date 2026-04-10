import { motion, AnimatePresence } from 'framer-motion';
import { Send, Loader2, Trash2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import api from '../lib/api';
import { useUser, useAuth } from '@clerk/clerk-react';

interface WallMsg {
  _id: string;
  text: string;
  createdAt: string;
}

export default function Wall() {
  const [messages, setMessages] = useState<WallMsg[]>([]);
  const [loading, setLoading] = useState(true);
  const [newMessage, setNewMessage] = useState('');
  const [posting, setPosting] = useState(false);

  const { user } = useUser();
  const { getToken } = useAuth();
  const isAdmin = user?.publicMetadata?.role === 'admin';

  const fetchMessages = async () => {
    try {
      const { data } = await api.get('/wall');
      setMessages(data);
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handlePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || posting) return;

    setPosting(true);
    try {
      const token = await getToken();
      const { data } = await api.post('/wall', { text: newMessage }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessages([data, ...messages]);
      setNewMessage('');
    } catch (error) {
      console.error('Error posting message:', error);
    } finally {
      setPosting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this quote?')) return;
    try {
      const token = await getToken();
      await api.delete(`/wall/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessages(messages.filter(msg => msg._id !== id));
    } catch (error) {
      console.error('Error deleting message:', error);
      alert('Failed to delete message');
    }
  };

  return (
    <div className="min-h-screen pt-28 pb-20 px-4 max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-16"
      >
        <h1 className="text-5xl font-serif font-bold mb-4 text-glow">The Wall</h1>
        <p className="text-gray-400 italic">Whispers and memories shared anonymously</p>
      </motion.div>

      {/* Message Input */}
      {isAdmin && (
        <motion.form 
          onSubmit={handlePost}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass p-6 rounded-3xl border-primary/10 mb-16 shadow-2xl relative overflow-hidden group"
      >
        <div className="absolute top-0 left-0 w-1 h-full bg-primary/30 group-focus-within:bg-primary transition-colors duration-300" />
        <textarea
          placeholder="Share a memory, a confession, or a wish..."
          className="w-full bg-transparent border-none text-white focus:outline-none resize-none min-h-[120px] text-lg placeholder:text-gray-500 font-light"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          maxLength={300}
          disabled={posting}
        />
        <div className="flex justify-between items-center mt-4 pt-4 border-t border-white/5">
          <span className="text-xs text-gray-500">{newMessage.length}/300 characters</span>
          <button 
            type="submit"
            className="flex items-center gap-2 px-6 py-2 bg-primary text-black rounded-full font-bold hover:shadow-[0_0_15px_rgba(250,204,21,0.5)] transition-all duration-300 active:scale-95 disabled:opacity-50"
            disabled={!newMessage.trim() || posting}
          >
            {posting ? <Loader2 className="animate-spin" size={16} /> : 'Post Anonymously'} <Send size={16} />
          </button>
        </div>
        </motion.form>
      )}

      {/* Messages Grid */}
     {/* Messages Grid - 4 column sticky note layout */}
<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
  <AnimatePresence mode="popLayout">
    {messages.map((msg, index) => {
      const rotations = [-1.2, 0.8, -0.5, 1, 0.7, -1, 0.4, -0.9];
      const rot = rotations[index % rotations.length];
      return (
        <motion.div
  layout
  key={msg._id}
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  exit={{ opacity: 0, scale: 0.95 }}
  transition={{ duration: 0.4 }}
  className="relative pt-5"
>
  {/* Tape */}
  <div
    className="absolute top-0 left-1/2 -translate-x-1/2 z-10"
    style={{
      width: '36px', height: '18px',
      background: '#facc15',
      border: '1px solid rgba(250,204,21,0.45)',
      borderRadius: '2px',
    }}
  />

  {/* Stacked paper layers */}
  <div className="relative">
    {/* Back shadow layers */}
    <div className="absolute"
      style={{ bottom: '-7px', left: '-5px', right: '-5px', top: 0,
        background: '#111', border: '1.5px solid rgba(250,204,21,0.15)', borderRadius: '3px', zIndex: 0 }} />
    <div className="absolute"
      style={{ bottom: '-3px', left: '-2px', right: '-2px', top: 0,
        background: '#161616', border: '1.5px solid rgba(250,204,21,0.22)', borderRadius: '3px', zIndex: 1 }} />

    {/* Main note */}
    <div
      className="relative p-3 flex flex-col"
      style={{
        background: '#1a1a1a',
        border: '1.5px solid #facc15',
        borderRadius: '5px',
        minHeight: '169px',
        zIndex: 2,
        transform: `rotate(${rot}deg)`,
      }}
    >
      {/* Corner brackets */}
      {[
        { top: '8px', left: '6px', borderTop: '1.5px solid rgba(250,204,21,0.5)', borderLeft: '1.5px solid rgba(250,204,21,0.5)' },
        { top: '8px', right: '6px', borderTop: '1.5px solid rgba(250,204,21,0.5)', borderRight: '1.5px solid rgba(250,204,21,0.5)' },
        { bottom: '8px', left: '6px', borderBottom: '1.5px solid rgba(250,204,21,0.5)', borderLeft: '1.5px solid rgba(250,204,21,0.5)' },
        { bottom: '8px', right: '6px', borderBottom: '1.5px solid rgba(250,204,21,0.5)', borderRight: '1.5px solid rgba(250,204,21,0.5)' },
      ].map((s, i) => (
        <div key={i} className="absolute" style={{ width: '14px', height: '12px', borderRadius: '2px', ...s }} />
      ))}

      {/* Dashed lines top & bottom */}
      <div className="absolute" style={{ top: '8px', left: '28px', right: '28px', borderTop: '1.5px dashed rgba(250,204,21,0.2)', opacity: 0.3 }} />
      <div className="absolute" style={{ bottom: '30px', left: '28px', right: '28px', borderBottom: '1.5px dashed rgba(250,204,21,0.2)', opacity: 0.3 }} />

      <p className="flex-1 text-lg leading-relaxed italic mt-3 mb-2 px-1"
        style={{ fontFamily: 'Georgia, serif', color: 'rgba(255,255,255,0.88)' }}>
        {msg.text}
      </p>

      <div className="flex justify-between items-center">
        <span className="text-[11px] font-mono opacity-55" style={{ color: '#facc15' }}>
          {new Date(msg.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
        </span>
        {isAdmin && (
          <button 
            onClick={() => handleDelete(msg._id)}
            className="flex items-center gap-1 opacity-69 hover:opacity-100 transition-opacity text-red-500/70 hover:text-red-500"
            title="Delete Quote"
          >
            <Trash2 size={20} />
          </button>
        )}
      </div>
    </div>
  </div>
</motion.div>
      );
    })}
  </AnimatePresence>
</div>

      {!loading && messages.length === 0 && (
        <div className="text-center py-20">
          <p className="text-gray-500 italic">No messages yet. Be the first to break the silence.</p>
        </div>
      )}
    </div>
  );
}
