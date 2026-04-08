import { motion, AnimatePresence } from 'framer-motion';
import { Upload, X, ZoomIn, Heart, Share2, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import api from '../lib/api';
import { useAuth } from '@clerk/clerk-react';

interface MediaItem {
  _id: string;
  imageUrl: string;
  caption: string;
  uploadedBy: string;
  likes: number;
  createdAt: string;
}

export default function MediaVault() {
  const [photos, setPhotos] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPhoto, setSelectedPhoto] = useState<MediaItem | null>(null);
  const [uploadModal, setUploadModal] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [newCaption, setNewCaption] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  
  const { getToken } = useAuth();

  const fetchMedia = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/media');
      setPhotos(data);
    } catch (error) {
      console.error('Error fetching media:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedia();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !newCaption) return;

    try {
      setUploading(true);
      const token = await getToken();
      
      const formData = new FormData();
      formData.append('image', file);
      formData.append('caption', newCaption);

      await api.post('/media', formData, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      
      setUploadModal(false);
      setFile(null);
      setPreview(null);
      setNewCaption('');
      fetchMedia();
    } catch (error: any) {
      console.error('Upload failed:', error);
      alert(error.response?.data?.message || 'Failed to upload image. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen pt-28 pb-20 px-4 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row justify-between items-center mb-16 gap-8"
      >
        <div className="text-center md:text-left">
          <h1 className="text-5xl font-serif font-bold mb-4 text-glow">Media Vault</h1>
          <p className="text-gray-400">Collaborative memories shared by the batch</p>
        </div>
        
        <button 
          onClick={() => setUploadModal(true)}
          className="flex items-center gap-2 px-8 py-3 bg-white/10 hover:bg-white/20 border border-white/10 rounded-full font-bold transition-all duration-300 group"
        >
          <Upload size={18} className="text-primary group-hover:scale-110 transition-transform duration-300" />
          Share a Moment
        </button>
      </motion.div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <Loader2 className="animate-spin text-primary" size={48} />
          <p className="text-gray-500 animate-pulse">Unlocking the vault...</p>
        </div>
      ) : (
        <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-8 space-y-8">
          <AnimatePresence mode="popLayout">
            {photos.map((photo, index) => (
              <motion.div
                layout
                key={photo._id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: index * 0.05 }}
                className="break-inside-avoid glass rounded-[2rem] overflow-hidden group relative cursor-pointer hover:border-primary/40 transition-all duration-500 shadow-2xl"
                onClick={() => setSelectedPhoto(photo)}
              >
                <img 
                  src={photo.imageUrl} 
                  alt={photo.caption} 
                  className="w-full object-cover transition-transform duration-1000 group-hover:scale-110"
                  style={{ minHeight: '200px' }}
                />
                
                {/* Modern Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-8">
                   <motion.div 
                     initial={{ y: 20, opacity: 0 }}
                     whileHover={{ y: 0, opacity: 1 }}
                     className="space-y-3"
                   >
                     <p className="text-primary font-bold tracking-[0.2em] text-[10px] uppercase">A Shared Moment</p>
                     <h3 className="text-white font-serif text-xl leading-tight">{photo.caption}</h3>
                     
                     <div className="flex justify-between items-center pt-4 border-t border-white/10">
                        <div className="flex items-center gap-2 text-primary font-bold text-[10px] uppercase tracking-widest">
                          Expand <ZoomIn size={12} />
                        </div>
                        <div className="flex items-center gap-2 text-gray-400">
                           <Heart size={14} className="group-hover:text-red-500 transition-colors" /> 
                           <span className="text-xs font-mono">{photo.likes}</span>
                        </div>
                     </div>
                   </motion.div>
                </div>

                {/* Subtle border shine effect */}
                <div className="absolute inset-0 border border-white/5 rounded-[2rem] pointer-events-none group-hover:border-primary/20 transition-colors duration-500" />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedPhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 sm:p-8"
            onClick={() => setSelectedPhoto(null)}
          >
            <button className="absolute top-8 right-8 text-white hover:text-primary p-2 bg-white/10 rounded-full transition-colors duration-300">
              <X size={24} />
            </button>
            
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-w-5xl w-full h-full flex flex-col items-center justify-center gap-6"
              onClick={(e) => e.stopPropagation()}
            >
              <img 
                src={selectedPhoto.imageUrl} 
                alt={selectedPhoto.caption} 
                className="max-h-[80vh] w-auto rounded-xl shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-white/10"
              />
              <div className="text-center">
                <h3 className="text-2xl font-serif text-white mb-2">{selectedPhoto.caption}</h3>
                <div className="flex justify-center gap-6">
                  <button className="flex items-center gap-2 text-gray-400 hover:text-red-500 transition-colors duration-300">
                    <Heart size={20} /> Like ({selectedPhoto.likes})
                  </button>
                  <button className="flex items-center gap-2 text-gray-400 hover:text-primary transition-colors duration-300">
                    <Share2 size={20} /> Share
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Functional Upload Modal with Preview */}
      <AnimatePresence>
        {uploadModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setUploadModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="glass p-8 rounded-3xl max-w-md w-full border-primary/20 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-2xl font-serif text-primary mb-6 text-center">Share a Moment</h2>
              <form onSubmit={handleUpload} className="space-y-6">
                <div className="flex flex-col items-center justify-center border-2 border-dashed border-white/10 rounded-xl py-8 hover:border-primary/50 transition-colors bg-black/20 cursor-pointer relative">
                  <input 
                    type="file" 
                    accept="image/*" 
                    required 
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    onChange={handleFileChange}
                  />
                  {preview ? (
                    <img src={preview} alt="Preview" className="max-h-32 rounded-lg" />
                  ) : (
                    <div className="flex flex-col items-center">
                       <Upload className="text-gray-600 mb-2" size={32} />
                       <p className="text-gray-400 text-sm">Select Image</p>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Caption</label>
                  <input 
                    type="text" 
                    placeholder="Tell us about this photo..." 
                    className="w-full bg-white/5 border border-white/5 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-primary/50 text-sm"
                    value={newCaption}
                    onChange={(e) => setNewCaption(e.target.value)}
                    required
                  />
                </div>
                <button 
                  type="submit"
                  disabled={uploading || !file}
                  className="w-full py-4 bg-primary text-black rounded-xl font-bold hover:shadow-[0_0_15px_rgba(250,204,21,0.5)] transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {uploading ? <Loader2 className="animate-spin" size={20} /> : 'Post to Vault'}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
