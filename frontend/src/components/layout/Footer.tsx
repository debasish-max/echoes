export default function Footer() {
  return (
    <footer className="w-full py-8 border-t border-white/5 bg-background/50 backdrop-blur-md relative z-10 mt-auto">
      <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-3">
          <span className="font-serif font-bold text-xl text-glow text-white">Echoes</span>
        </div>
        <div className="text-[10px] text-gray-500 uppercase tracking-[0.3em] font-bold">
          A Legacy Preserved
        </div>
      </div>
    </footer>
  );
}
