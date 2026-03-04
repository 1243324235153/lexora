import { Scale } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";

export default function Footer({ onBookDemo }: { onBookDemo: () => void }) {
  return (
    <footer className="bg-lexora-text text-lexora-bg py-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center mb-24">
          <div>
            <h2 className="text-4xl md:text-5xl font-serif mb-8 text-lexora-bg">Utformad för företag som vill göra rätt</h2>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/register">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="bg-lexora-bg text-lexora-text px-8 py-4 rounded-full text-base font-medium hover:bg-white transition-colors shadow-md flex items-center justify-center"
                >
                  Skapa konto
                </motion.div>
              </Link>
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onBookDemo}
                className="bg-transparent text-lexora-bg border border-lexora-bg/20 px-8 py-4 rounded-full text-base font-medium hover:bg-lexora-bg/10 transition-colors flex items-center justify-center"
              >
                Boka demo
              </motion.button>
              <motion.a 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                href="#hur-det-fungerar"
                className="bg-transparent text-lexora-bg/80 hover:text-lexora-bg px-8 py-4 rounded-full text-base font-medium transition-colors flex items-center justify-center"
              >
                Läs vår metodik
              </motion.a>
            </div>
          </div>
          <div className="bg-lexora-bg/5 rounded-3xl p-8 border border-lexora-bg/10">
            <h3 className="text-xl font-serif mb-4 text-lexora-bg">Om Lexora</h3>
            <p className="text-lexora-bg/70 leading-relaxed mb-6 text-sm">
              Lexora är en AI-baserad juristassistent för företag och organisationer som hjälper till att tolka lagar, regler och krav i relation till den egna verksamheten.
            </p>
            <div className="bg-lexora-bg/10 border border-lexora-bg/20 rounded-xl p-4">
              <h4 className="text-sm font-semibold uppercase tracking-wider text-lexora-bg mb-2">Viktig avgränsning</h4>
              <p className="text-lexora-bg/60 text-xs leading-relaxed">
                Lexora är ett juridiskt beslutsstöd – inte juridisk rådgivning. Lexora ger strukturerade tolkningar och rekommendationer baserade på tillgänglig lagstiftning och den information ni tillhandahåller. Slutgiltiga juridiska beslut ska alltid fattas av behörig person eller juridisk rådgivare.
              </p>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-lexora-bg/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-lexora-bg">
            <Scale className="w-6 h-6" />
            <span className="font-serif text-xl font-semibold tracking-tight">Lexora</span>
          </div>
          <div className="text-lexora-bg/50 text-sm">
            &copy; {new Date().getFullYear()} Lexora AB. Alla rättigheter förbehållna.
          </div>
        </div>
      </div>
    </footer>
  );
}
