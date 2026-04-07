import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, CameraOff } from 'lucide-react';
import clsx from 'clsx';
import api from '../lib/api';

const semesters = [1, 2, 3, 4, 5, 6];

interface JourneyPhoto {
  _id: string;
  semester: number;
  imageUrl: string;
  caption: string;
}

export default function Journey() {
  const [activeSem, setActiveSem] = useState<number | 'all'>('all');
  const [photos, setPhotos] = useState<JourneyPhoto[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchJourney = async () => {
    try {
      setLoading(true);
      const url = activeSem === 'all' ? '/journey' : `/journey?semester=${activeSem}`;
      const { data } = await api.get(url);
      setPhotos(data);
    } catch (error) {
      console.error('Error fetching journey:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJourney();
  }, [activeSem]);

  return (
    <div className="min-h-screen pt-28 pb-20 px-4 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-16"
      >
        <h1 className="text-5xl font-serif font-bold mb-4 text-glow">The Journey</h1>
        <p className="text-gray-400">Tracing our footprints through every semester</p>
      </motion.div>

      {/* Filter Sidebar/Top-bar */}
      <div className="flex flex-wrap justify-center gap-4 mb-12">
        <button
          onClick={() => setActiveSem('all')}
          className={clsx(
            "px-6 py-2 rounded-full border transition-all duration-300",
            activeSem === 'all' 
              ? "bg-primary text-black border-primary font-semibold shadow-lg" 
              : "bg-surface text-gray-400 border-white/5 hover:border-primary/50"
          )}
        >
          All
        </button>
        {semesters.map(sem => (
          <button
            key={sem}
            onClick={() => setActiveSem(sem)}
            className={clsx(
              "px-6 py-2 rounded-full border transition-all duration-300",
              activeSem === sem 
                ? "bg-primary text-black border-primary font-semibold shadow-lg" 
                : "bg-surface text-gray-400 border-white/5 hover:border-primary/50"
            )}
          >
            Sem {sem}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <Loader2 className="animate-spin text-primary" size={48} />
          <p className="text-gray-500 animate-pulse">Reliving memories...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {photos.map((photo, index) => (
              <motion.div
                layout
                key={photo._id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4 }}
                className="group relative rounded-2xl overflow-hidden glass aspect-[4/5]"
              >
                <img 
                  src={photo.imageUrl} 
                  alt={photo.caption} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                  <span className="text-primary text-xs font-bold uppercase tracking-widest mb-1">Semester {photo.semester}</span>
                  <h3 className="text-white text-lg font-medium">{photo.caption}</h3>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {!loading && photos.length === 0 && (
        <div className="text-center py-20 flex flex-col items-center gap-4">
          <div className="p-6 bg-white/5 rounded-full border border-white/5">
            <CameraOff className="text-gray-600" size={48} />
          </div>
          <div>
            <h3 className="text-xl font-serif text-white mb-2">No memories captured yet</h3>
            <p className="text-gray-500">The first footprints are yet to be traced for this semester.</p>
          </div>
        </div>
      )}
    </div>
  );
}
