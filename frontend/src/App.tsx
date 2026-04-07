import { Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Home from './pages/Home';
import Journey from './pages/Journey';
import Yearbook from './pages/Yearbook';
import MediaVault from './pages/MediaVault';
import Wall from './pages/Wall';
import AdminPanel from './pages/AdminPanel';

function App() {
  return (
    <div className="min-h-screen bg-background text-white selection:bg-primary selection:text-black">
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/journey" element={<Journey />} />
          <Route path="/yearbook" element={<Yearbook />} />
          <Route path="/vault" element={<MediaVault />} />
          <Route path="/wall" element={<Wall />} />
          <Route path="/admin" element={<AdminPanel />} />
        </Routes>
      </main>
      
      {/* Background Glows */}
      <div className="fixed top-0 -left-1/4 w-[500px] h-[500px] bg-primary/5 blur-[120px] rounded-full pointer-events-none z-0" />
      <div className="fixed bottom-0 -right-1/4 w-[500px] h-[500px] bg-primary/5 blur-[120px] rounded-full pointer-events-none z-0" />
    </div>
  );
}

export default App;
