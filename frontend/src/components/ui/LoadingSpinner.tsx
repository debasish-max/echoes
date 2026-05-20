import { useState, useEffect } from 'react';
import { Loader2, ServerCrash } from 'lucide-react';
import { motion } from 'framer-motion';

interface LoadingSpinnerProps {
  message?: string;
  delayMs?: number; // Time before showing the waking server message
}

export default function LoadingSpinner({ 
  message = "Retrieving information...", 
  delayMs = 3000 
}: LoadingSpinnerProps) {
  const [showWakingMessage, setShowWakingMessage] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowWakingMessage(true);
    }, delayMs);

    return () => clearTimeout(timer);
  }, [delayMs]);

  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center max-w-md mx-auto">
      <div className="relative mb-6">
        <Loader2 className="animate-spin text-primary" size={48} />
        {showWakingMessage && (
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="absolute -top-1 -right-1 bg-primary text-black text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-tighter"
          >
            Sleep
          </motion.div>
        )}
      </div>

      <p className="text-gray-400 font-medium mb-3">{message}</p>

      {showWakingMessage && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="p-4 rounded-2xl bg-white/5 border border-white/5 shadow-xl"
        >
          <div className="flex items-start gap-3 text-left">
            <ServerCrash className="text-primary mt-0.5 flex-shrink-0" size={18} />
            <div>
              <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-1">Server Cold Start</p>
              <p className="text-xs text-gray-500 leading-relaxed">
                The backend service is sleeping on Render's free tier. We are waking it up for you. This might take up to 50 seconds. Thanks for your patience! ☕
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
