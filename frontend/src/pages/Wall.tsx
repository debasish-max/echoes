import { motion, AnimatePresence } from 'framer-motion';
import { Send, Loader2, Trash2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import api from '../lib/api';
import { useUser, useAuth } from '@clerk/clerk-react';
import ActionModal from '../components/ui/ActionModal';
import type { ActionModalProps } from '../components/ui/ActionModal';

function useActionModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [config, setConfig] = useState<Omit<ActionModalProps, 'isOpen'>>({
    type: 'alert',
    title: '',
    message: '',
    onConfirm: () => setIsOpen(false),
    onCancel: () => setIsOpen(false)
  });

  const showAlert = (title: string, message: string, type: 'alert' | 'success' = 'alert') => {
    setConfig({ type, title, message, onConfirm: () => setIsOpen(false), onCancel: () => setIsOpen(false) });
    setIsOpen(true);
  };

  const showConfirm = (title: string, message: string, onConfirm: () => void) => {
    setConfig({
      type: 'confirm',
      title,
      message,
      onConfirm: () => { setIsOpen(false); onConfirm(); },
      onCancel: () => setIsOpen(false),
      confirmText: 'Delete',
      cancelText: 'Cancel'
    });
    setIsOpen(true);
  };

  return { showAlert, showConfirm, modalProps: { ...config, isOpen } };
}

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
  const modal = useActionModal();

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

  const handleDelete = (id: string) => {
    modal.showConfirm('Delete Quote', 'Are you sure you want to permanently delete this anonymous quote?', async () => {
      try {
        const token = await getToken();
        await api.delete(`/wall/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setMessages(messages.filter(msg => msg._id !== id));
      } catch (error) {
        console.error('Error deleting message:', error);
        modal.showAlert('Error', 'Failed to delete message. Please try again.');
      }
    });
  };

  return (
    <div className="min-h-screen pt-28 pb-20 px-4 max-w-7xl mx-auto">
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
          className="glass p-6 rounded-3xl border-primary/10 mb-16 shadow-2xl relative overflow-hidden group max-w-3xl mx-auto"
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

      {/* Messages Grid - 4 column Masonry layout */}
      <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-6">
        <AnimatePresence mode="popLayout">
          {messages.map((msg, index) => {
            const rotations = [-1.5, 1.2, -0.8, 1.5, 0.9, -1.2, 0.6, -1.1];
            const rot = rotations[index % rotations.length];
            return (
              <div
                key={msg._id}
                className="masonry-item pt-8 mb-8 group"
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4 }}
                  className="relative group italic"
                  style={{ transform: 'translateZ(0)' }}
                >
                  {/* Tape - Minimalist design to avoid artifacts */}
                  <div
                    className="absolute -top-1 left-1/2 -translate-x-1/2 w-10 h-5 bg-[#facc15] shadow-md pointer-events-none"
                    style={{ zIndex: 10, borderRadius: '1px' }}
                  />

                  {/* Stacked paper layers */}
                  <div className="relative">
                    <div className="absolute"
                      style={{ 
                        bottom: '-6px', left: '-3px', right: '-3px', top: '24px',
                        background: '#0a0a0a', borderRadius: '2px', zIndex: 0 }} />
                    <div className="absolute"
                      style={{ 
                        bottom: '-3px', left: '-1px', right: '-1px', top: '12px',
                        background: '#121212', borderRadius: '2px', zIndex: 1 }} />

                    {/* Main note */}
                    <div
                      className="relative p-6 flex flex-col transition-transform duration-300 group-hover:-translate-y-1"
                      style={{
                        background: '#1a1a1a',
                        border: '1.5px solid #facc15', // Solid yellow, no transparency
                        borderRadius: '2px',
                        minHeight: '170px',
                        zIndex: 2,
                        transform: `rotate(${rot}deg)`,
                      }}
                    >
                      {/* Decorative brackets */}
                      <div className="absolute top-3 left-3 w-3 h-3 border-t border-l border-primary/40" />
                      <div className="absolute top-3 right-3 w-3 h-3 border-t border-r border-primary/40" />
                      <div className="absolute bottom-3 left-3 w-3 h-3 border-b border-l border-primary/40" />
                      <div className="absolute bottom-3 right-3 w-3 h-3 border-b border-r border-primary/40" />

                      <p className="flex-1 text-[17px] leading-relaxed mt-1 mb-6 px-1 text-white/90"
                        style={{ fontFamily: 'Georgia, serif' }}>
                        {msg.text}
                      </p>

                      <div className="flex justify-between items-center mt-auto border-t border-white/10 pt-4">
                        <span className="text-[10px] font-mono text-primary/60 tracking-widest">
                          {new Date(msg.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                        {isAdmin && (
                          <button 
                            onClick={() => handleDelete(msg._id)}
                            className="p-1 text-red-500/40 hover:text-red-500 transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            );
          })}
        </AnimatePresence>
      </div>

      {!loading && messages.length === 0 && (
        <div className="text-center py-20">
          <p className="text-gray-500 italic">No messages yet. Be the first to break the silence.</p>
        </div>
      )}
      <ActionModal {...modal.modalProps} />
    </div>
  );
}
