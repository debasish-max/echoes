import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, CheckCircle, X, Info, Trash2 } from 'lucide-react';
import clsx from 'clsx';

export type ActionModalProps = {
  isOpen: boolean;
  type: 'confirm' | 'alert' | 'success';
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
};

export default function ActionModal({
  isOpen,
  type,
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = 'OK',
  cancelText = 'Cancel'
}: ActionModalProps) {
  const isDelete = type === 'confirm' && confirmText?.toLowerCase() === 'delete';

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={type === 'alert' ? onConfirm : onCancel}
          />
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 10 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className={clsx(
              "relative w-full max-w-md p-8 overflow-hidden",
              "bg-surface/90 backdrop-blur-2xl border border-white/10 rounded-3xl",
              "shadow-[0_0_50px_rgba(0,0,0,0.6)]"
            )}
          >
            <div className={clsx(
              "absolute -top-32 -left-32 w-64 h-64 rounded-full blur-[100px] opacity-30 pointer-events-none transition-colors duration-500",
              type === 'confirm' && isDelete ? "bg-red-500" : type === 'confirm' ? "bg-orange-500" : type === 'success' ? "bg-green-500" : "bg-primary"
            )} />
            
            <button 
              onClick={onCancel}
              className="absolute top-6 right-6 p-2 rounded-full bg-white/5 border border-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-all duration-300 z-10"
            >
              <X size={18} />
            </button>

            <div className="relative z-10 flex flex-col items-center text-center mt-2">
              <div className={clsx(
                "p-4 rounded-2xl mb-6 shadow-xl border",
                type === 'confirm' && isDelete ? "bg-red-500/10 border-red-500/20 text-red-500 shadow-red-500/20" : 
                type === 'confirm' ? "bg-orange-500/10 border-orange-500/20 text-orange-500 shadow-orange-500/20" : 
                type === 'success' ? "bg-green-500/10 border-green-500/20 text-green-500 shadow-green-500/20" : 
                "bg-primary/10 border-primary/20 text-primary shadow-primary/20"
              )}>
                {type === 'confirm' && isDelete ? <Trash2 size={32} /> : 
                 type === 'confirm' ? <AlertTriangle size={32} /> :
                 type === 'success' ? <CheckCircle size={32} /> : 
                 <Info size={32} />}
              </div>
              
              <h3 className="text-2xl font-serif font-bold text-white mb-3 tracking-wide">{title}</h3>
              <p className="text-gray-400 mb-8 leading-relaxed px-4">{message}</p>

              <div className="flex flex-col sm:flex-row gap-3 w-full">
                {type === 'confirm' && (
                  <button 
                    onClick={onCancel}
                    className="flex-1 py-3 px-6 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-white font-bold transition-all duration-300 uppercase tracking-widest text-xs"
                  >
                    {cancelText}
                  </button>
                )}
                <button 
                  onClick={onConfirm}
                  className={clsx(
                    "flex-1 py-3 px-6 rounded-xl font-bold uppercase tracking-widest text-xs transition-all duration-300",
                    type === 'confirm' && isDelete
                      ? "bg-red-500 hover:bg-red-600 text-white shadow-[0_0_20px_rgba(239,68,68,0.3)] hover:shadow-[0_0_30px_rgba(239,68,68,0.5)]" 
                      : "bg-primary hover:bg-primary/90 text-black shadow-[0_0_20px_rgba(250,204,21,0.3)] hover:shadow-[0_0_30px_rgba(250,204,21,0.5)]"
                  )}
                >
                  {confirmText}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
