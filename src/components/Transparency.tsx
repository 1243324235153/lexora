import { motion } from "motion/react";
import { CheckCircle2, FileText, Calendar, ShieldAlert } from "lucide-react";

export default function Transparency() {
  return (
    <section id="transparens" className="py-32 bg-lexora-bg overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, type: "spring", stiffness: 100 }}
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif text-lexora-text mb-8">
            Full transparens i varje svar
          </h2>
          <p className="text-xl text-lexora-text/70 leading-relaxed mb-12">
            Lexora bygger på förtroende. Varje analys och rekommendation är spårbar och tydligt motiverad.
          </p>

          <div className="space-y-6">
            {[
              { icon: <FileText className="w-6 h-6" />, text: "Refererat lagrum" },
              { icon: <Calendar className="w-6 h-6" />, text: "Datum för senaste uppdatering" },
              { icon: <ShieldAlert className="w-6 h-6" />, text: "Bedömningsnivå (tolkning, rekommendation, risk)" },
              { icon: <CheckCircle2 className="w-6 h-6" />, text: "Inga \"dolda beslut\"" },
              { icon: <CheckCircle2 className="w-6 h-6" />, text: "Inga automatiska juridiska beslut" },
            ].map((item, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="flex items-center gap-6 group"
              >
                <div className="w-14 h-14 rounded-full bg-white border border-lexora-border flex items-center justify-center text-lexora-text shadow-sm group-hover:scale-110 transition-transform duration-300">
                  {item.icon}
                </div>
                <span className="text-lexora-text font-medium text-lg">{item.text}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9, rotate: 2 }}
          whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, delay: 0.2, type: "spring", stiffness: 100 }}
          className="bg-white rounded-3xl p-10 border border-lexora-border shadow-2xl relative"
        >
          <div className="absolute top-0 left-0 w-full h-3 bg-lexora-text rounded-t-3xl" />
          <div className="flex items-center justify-between mb-8 pb-8 border-b border-lexora-border">
            <div className="flex items-center gap-3">
              <motion.div 
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-4 h-4 rounded-full bg-yellow-400" 
              />
              <span className="text-sm font-semibold uppercase tracking-wider text-lexora-text/60">Medelrisk</span>
            </div>
            <span className="text-sm text-lexora-text/50">Uppdaterad: 2024-03-15</span>
          </div>
          
          <h3 className="text-2xl font-serif text-lexora-text mb-6">Arbetsmiljöansvar vid distansarbete</h3>
          <p className="text-lexora-text/80 leading-relaxed mb-8 text-lg">
            Som arbetsgivare har ni fortsatt arbetsmiljöansvar även när anställda arbetar hemifrån. Det rekommenderas att upprätta en tydlig policy för distansarbete.
          </p>
          
          <div className="bg-lexora-bg rounded-2xl p-6 border border-lexora-border hover:border-lexora-text/30 transition-colors cursor-pointer group">
            <span className="text-xs font-semibold uppercase tracking-wider text-lexora-text/50 mb-3 block">Källa</span>
            <a href="#" className="text-base font-medium text-lexora-text group-hover:underline flex items-center gap-3">
              <FileText className="w-5 h-5" /> Arbetsmiljölagen (1977:1160) 3 kap. 2 §
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
