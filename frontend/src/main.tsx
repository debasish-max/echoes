import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { ClerkProvider } from '@clerk/clerk-react'
import { BrowserRouter } from 'react-router-dom'

// Import your publishable key
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  console.warn("Missing Publishable Key. Please set VITE_CLERK_PUBLISHABLE_KEY in your .env");
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {PUBLISHABLE_KEY ? (
      <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/">
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </ClerkProvider>
    ) : (
      <div className="min-h-screen bg-background text-white flex items-center justify-center p-4 text-center">
        <div className="glass p-8 rounded-xl max-w-md">
          <h1 className="text-2xl font-serif text-primary mb-4 text-glow">Missing Clerk Key</h1>
          <p className="text-gray-400">Please set your <code className="bg-black px-2 py-1 rounded">VITE_CLERK_PUBLISHABLE_KEY</code> in the frontend environment variables to continue building the app.</p>
        </div>
      </div>
    )}
  </React.StrictMode>,
)
