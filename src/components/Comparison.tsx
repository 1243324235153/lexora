import { motion } from "motion/react";
import { Check, X } from "lucide-react";

export default function Comparison() {
  return (
    <section className="py-32 bg-lexora-bg">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-3xl mx-auto mb-20"
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif text-lexora-text mb-6">
            Hur skiljer sig Lexora från traditionell juridisk rådgivning?
          </h2>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl border border-lexora-border overflow-hidden"
        >
          <div className="grid grid-cols-2 bg-gray-50 border-b border-lexora-border">
            <div className="p-8 text-center font-serif text-xl font-semibold text-lexora-text/60">
              Traditionell juridik
            </div>
            <div className="p-8 text-center font-serif text-xl font-semibold text-lexora-bg bg-lexora-text">
              Lexora
            </div>
          </div>

          <div className="divide-y divide-lexora-border">
            {[
              { t: "Reaktiv – vid problem", l: "Proaktiv – före risk" },
              { t: "Tidsdebiterad", l: "Fast abonnemang" },
              { t: "Generella utlåtanden", l: "Verksamhetsanpassade svar" },
              { t: "Kräver juridisk förkunskap", l: "Förklarar på klar svenska" },
              { t: "Punktinsatser", l: "Kontinuerligt stöd" },
            ].map((row, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="grid grid-cols-2 hover:bg-gray-50/50 transition-colors group"
              >
                <div className="p-6 md:p-8 flex items-center gap-4 text-lexora-text/70">
                  <X className="w-6 h-6 text-lexora-text/30 shrink-0 group-hover:text-red-400 transition-colors" />
                  <span className="font-medium text-lg">{row.t}</span>
                </div>
                <div className="p-6 md:p-8 flex items-center gap-4 text-lexora-text bg-lexora-text/5">
                  <Check className="w-6 h-6 text-lexora-text shrink-0" />
                  <span className="font-semibold text-lg">{row.l}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
