import { motion, AnimatePresence } from 'framer-motion';
import { Send, Heart, MessageSquare, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import api from '../lib/api';

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
      const { data } = await api.post('/wall', { text: newMessage });
      setMessages([data, ...messages]);
      setNewMessage('');
    } catch (error) {
      console.error('Error posting message:', error);
    } finally {
      setPosting(false);
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

      {/* Messages Grid */}
      <div className="space-y-6">
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="animate-spin text-primary" size={32} />
          </div>
        ) : (
          <AnimatePresence mode="popLayout">
           {messages.map((msg, index) => (
  <motion.div
  layout
  key={msg._id}
  initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
  animate={{ opacity: 1, x: 0 }}
  exit={{ opacity: 0, scale: 0.95 }}
  transition={{ duration: 0.4 }}
  style={{ transform: `rotate(${index % 2 === 0 ? '-0.8deg' : '0.6deg'})` }}
  className="relative group"
>
  <div
    className="relative p-8 pt-10"
    style={{
      background: '#1a1a1a',
      boxShadow: '6px 6px 0px #facc15',
      border: '1px solid rgba(250,204,21,0.2)',
      borderRadius: '4px',
    }}
  >
    {/* Opening quote */}
    <span
      className="absolute top-2 left-4 font-serif text-4xl leading-none"
      style={{ color: '#facc15', opacity: 0.8 }}
    >
      &ldquo;
    </span>

    <p
      className="text-xl md:text-2xl leading-relaxed mb-6 italic text-white/90"
      style={{ fontFamily: 'Georgia, serif' }}
    >
      {msg.text}
    </p>

    {/* Closing quote */}
    <span
      className="absolute font-serif text-4xl leading-none"
      style={{ color: '#facc15', opacity: 0.8, bottom: '52px', right: '14px' }}
    >
      &rdquo;
    </span>

    {/* Footer */}
    <div
      className="flex justify-between items-center pt-3 mt-4"
      style={{ borderTop: '1px dashed rgba(250,204,21,0.25)' }}
    >
      <span className="text-xs text-primary font-bold uppercase tracking-widest font-mono">
        {new Date(msg.createdAt).toLocaleDateString(undefined, {
          month: 'short', day: 'numeric', year: 'numeric',
        })}
      </span>
      <button className="flex items-center gap-2 group/btn">
        <Heart
          size={16}
          className="text-gray-500 group-hover/btn:text-red-500 transition-colors duration-300"
        />
        <span className="text-sm text-gray-500 group-hover/btn:text-white transition-colors duration-300">0</span>
      </button>
    </div>
  </div>
</motion.div>
))}
          </AnimatePresence>
        )}
      </div>

      {!loading && messages.length === 0 && (
        <div className="text-center py-20">
          <p className="text-gray-500 italic">No messages yet. Be the first to break the silence.</p>
        </div>
      )}
    </div>
  );
}
