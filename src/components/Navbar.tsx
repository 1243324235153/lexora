import { Scale } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";

export default function Navbar({ onBookDemo }: { onBookDemo: () => void }) {
  return (
    <header className="sticky top-0 z-50 bg-lexora-bg/80 backdrop-blur-md border-b border-lexora-border">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 text-lexora-text hover:opacity-80 transition-opacity">
          <Scale className="w-8 h-8" />
          <span className="font-serif text-2xl font-semibold tracking-tight">Lexora</span>
        </Link>
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
          <a href="#hur-det-fungerar" className="hover:opacity-70 transition-opacity">Hur det fungerar</a>
          <a href="#transparens" className="hover:opacity-70 transition-opacity">Transparens</a>
        </nav>
        <div className="flex items-center gap-4">
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onBookDemo}
            className="hidden sm:block text-lexora-text px-5 py-2.5 rounded-full text-sm font-medium hover:bg-lexora-text/5 transition-colors"
          >
            Boka demo
          </motion.button>
          <Link to="/register">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-lexora-text text-lexora-bg px-6 py-2.5 rounded-full text-sm font-medium hover:bg-lexora-text/90 transition-colors shadow-sm flex items-center justify-center"
            >
              Skapa konto
            </motion.div>
          </Link>
        </div>
      </div>
    </header>
  );
}
