import { motion } from "motion/react";
import { ArrowRight, BookOpen, Building2, Cpu } from "lucide-react";
import { Link } from "react-router-dom";

export default function Hero({ onBookDemo }: { onBookDemo: () => void }) {
  return (
    <section className="relative pt-32 pb-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-2xl"
        >
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-serif text-lexora-text leading-[1.1] mb-8">
            Hur kan Lexora förstå just <span className="italic text-lexora-accent">er</span> verksamhet?
          </h1>
          <p className="text-lg md:text-xl text-lexora-text/80 leading-relaxed mb-10 max-w-lg">
            Lexora kombinerar gällande lagstiftning med er företagskontext för att ge relevanta, spårbara och ansvarsfulla rekommendationer.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link to="/register">
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="bg-lexora-text text-lexora-bg px-8 py-4 rounded-full text-base font-medium hover:bg-lexora-text/90 transition-colors shadow-md flex items-center justify-center gap-2"
              >
                Skapa konto <ArrowRight className="w-5 h-5" />
              </motion.div>
            </Link>
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onBookDemo}
              className="bg-transparent text-lexora-text border border-lexora-text/20 px-8 py-4 rounded-full text-base font-medium hover:bg-lexora-text/5 transition-colors flex items-center justify-center"
            >
              Boka demo
            </motion.button>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="relative h-[500px] rounded-3xl bg-white shadow-xl border border-lexora-border p-8 flex flex-col justify-center items-center"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-lexora-accent/5 to-transparent rounded-3xl" />
          
          <div className="relative z-10 flex flex-col items-center gap-8 w-full">
            <div className="flex items-center justify-between w-full max-w-md px-4">
              <div className="flex flex-col items-center gap-3">
                <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center border border-blue-100 shadow-sm">
                  <BookOpen className="w-8 h-8 text-blue-600" />
                </div>
                <span className="text-xs font-semibold uppercase tracking-wider text-lexora-text/60">Lagbok</span>
              </div>
              
              <div className="h-0.5 w-16 bg-lexora-border relative">
                <motion.div 
                  initial={{ left: 0 }}
                  animate={{ left: "100%" }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="absolute top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-lexora-accent -translate-x-full" 
                />
              </div>

              <div className="flex flex-col items-center gap-3">
                <div className="w-20 h-20 rounded-2xl bg-lexora-accent/10 flex items-center justify-center border border-lexora-accent/20 shadow-md relative">
                  <Cpu className="w-10 h-10 text-lexora-accent" />
                  <div className="absolute -inset-1 border border-lexora-accent/30 rounded-2xl animate-pulse" />
                </div>
                <span className="text-xs font-semibold uppercase tracking-wider text-lexora-accent">Lexora AI</span>
              </div>

              <div className="h-0.5 w-16 bg-lexora-border relative overflow-hidden">
                <motion.div 
                  initial={{ left: 0 }}
                  animate={{ left: "100%" }}
                  transition={{ duration: 2, delay: 1, repeat: Infinity, ease: "linear" }}
                  className="absolute top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-lexora-accent -translate-x-full" 
                />
              </div>

              <div className="flex flex-col items-center gap-3">
                <div className="w-16 h-16 rounded-2xl bg-gray-50 flex items-center justify-center border border-gray-200 shadow-sm">
                  <Building2 className="w-8 h-8 text-gray-700" />
                </div>
                <span className="text-xs font-semibold uppercase tracking-wider text-lexora-text/60">Företag</span>
              </div>
            </div>

            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1.5 }}
              className="w-full max-w-md bg-white border border-lexora-border rounded-xl p-5 shadow-sm mt-8"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-xs font-mono text-lexora-text/60">ANALYS SLUTFÖRD</span>
              </div>
              <p className="text-sm text-lexora-text/80 font-medium leading-relaxed">
                "Baserat på er verksamhet inom tech och 50 anställda, är följande åtgärder för GDPR-efterlevnad rekommenderade..."
              </p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
