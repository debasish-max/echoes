import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { SignedIn, SignedOut, SignInButton, UserButton, useUser } from '@clerk/clerk-react';
import { Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import clsx from 'clsx';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { user } = useUser();
  const isAdmin = user?.publicMetadata?.role === 'admin';

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'The Journey', path: '/journey' },
    { name: 'Yearbook', path: '/yearbook' },
    { name: 'Media Vault', path: '/vault' },
    { name: 'The Wall', path: '/wall' },
  ];

  if (isAdmin) {
    navLinks.push({ name: 'Admin', path: '/admin' });
  }

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={clsx(
        'fixed w-full z-50 transition-all duration-300',
        scrolled ? 'bg-background/80 backdrop-blur-md border-b border-white/5 py-4' : 'bg-transparent py-6'
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <Link to="/" className="text-2xl font-serif font-bold text-primary text-glow">
            Batch<span className="text-white">-26</span>
          </Link>
          
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link 
                key={link.path} 
                to={link.path}
                className={clsx(
                  "text-sm font-medium transition-colors hover:text-primary",
                  location.pathname === link.path ? "text-primary text-glow" : "text-gray-300"
                )}
              >
                {link.name}
              </Link>
            ))}
            
            <SignedIn>
              <UserButton appearance={{ elements: { avatarBox: "w-9 h-9 border-2 border-primary" } }}/>
            </SignedIn>
            <SignedOut>
              <SignInButton mode="modal">
                <button className="px-5 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/10 transition-all duration-300 text-sm font-medium">
                  Sign In
                </button>
              </SignInButton>
            </SignedOut>
          </div>

          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-300 hover:text-white">
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="md:hidden bg-surface border-t border-white/5"
        >
          <div className="px-4 pt-2 pb-6 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className="block px-3 py-3 text-base font-medium text-gray-300 hover:text-primary"
              >
                {link.name}
              </Link>
            ))}
            <div className="px-3 pt-4 border-t border-white/5 mt-4">
              <SignedIn>
                <UserButton appearance={{ elements: { avatarBox: "w-10 h-10 border-2 border-primary" } }}/>
              </SignedIn>
              <SignedOut>
                <SignInButton mode="modal">
                  <button className="w-full text-left py-2 text-primary font-medium">
                    Sign In
                  </button>
                </SignInButton>
              </SignedOut>
            </div>
          </div>
        </motion.div>
      )}
    </motion.nav>
  );
}
