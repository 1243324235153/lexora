import { motion } from "motion/react";
import { Lock, Globe, ShieldOff, Trash2 } from "lucide-react";

export default function Security() {
  return (
    <section className="py-32 bg-white border-y border-lexora-border overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-2xl mx-auto mb-20"
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif text-lexora-text mb-6">Dataskydd & säkerhet</h2>
          <p className="text-xl text-lexora-text/70">
            Designad för compliance och byggd med EU:s AI-principer i åtanke.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { icon: <Lock className="w-8 h-8" />, title: "Krypterad data", desc: "All data krypteras både i vila och under överföring." },
            { icon: <Globe className="w-8 h-8" />, title: "Lagring inom EU", desc: "Data lagras säkert på servrar inom den Europeiska Unionen." },
            { icon: <ShieldOff className="w-8 h-8" />, title: "Ingen delning", desc: "Din kunddata delas aldrig med tredje part eller används för träning." },
            { icon: <Trash2 className="w-8 h-8" />, title: "Full kontroll", desc: "Du har full kontroll över din data och kan radera den när som helst." },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: i * 0.15, type: "spring", stiffness: 100 }}
              whileHover={{ y: -10 }}
              className="bg-lexora-bg rounded-3xl p-8 border border-lexora-border text-center flex flex-col items-center group shadow-sm hover:shadow-xl transition-all duration-300"
            >
              <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center text-lexora-text shadow-md border border-lexora-border mb-8 group-hover:scale-110 transition-transform duration-300">
                {item.icon}
              </div>
              <h3 className="text-2xl font-serif text-lexora-text mb-4">{item.title}</h3>
              <p className="text-lexora-text/70 leading-relaxed text-lg">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
