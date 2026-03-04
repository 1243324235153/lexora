import { motion } from "motion/react";
import { Building, Scale, Search, RefreshCw } from "lucide-react";

const steps = [
  {
    id: 1,
    title: "Företagsprofil",
    icon: <Building className="w-6 h-6 text-lexora-bg" />,
    description: "Vid onboarding anger ni bransch, antal anställda, verksamhetsländer, kollektivavtal och roller.",
    note: "Ingen känslig data krävs.",
  },
  {
    id: 2,
    title: "Relevant lagstiftning",
    icon: <Scale className="w-6 h-6 text-lexora-bg" />,
    description: "Lexora använder gällande svenska lagar, EU-förordningar, myndighetsföreskrifter och rättspraxis.",
    note: "Alla svar innehåller källhänvisningar.",
  },
  {
    id: 3,
    title: "Kontextuell tolkning",
    icon: <Search className="w-6 h-6 text-lexora-bg" />,
    description: "Lexora jämför lagen med er verksamhet, filtrerar bort irrelevanta krav och markerar risknivå (Låg, Medel, Hög).",
    note: "Samma lag gäller inte lika för alla.",
  },
  {
    id: 4,
    title: "Kontinuerlig uppdatering",
    icon: <RefreshCw className="w-6 h-6 text-lexora-bg" />,
    description: "När lagar ändras uppdateras rekommendationerna automatiskt, ni får notifieringar och checklistor anpassas.",
    note: "Alltid uppdaterad.",
  },
];

export default function HowItWorks() {
  return (
    <section id="hur-det-fungerar" className="py-32 bg-white border-y border-lexora-border overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-2xl mx-auto mb-20"
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif text-lexora-text mb-6">Så får Lexora kännedom</h2>
          <p className="text-xl text-lexora-text/70">
            En strukturerad process för att förstå er verksamhet och ge relevanta rekommendationer.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: index * 0.15, type: "spring", stiffness: 100 }}
              whileHover={{ y: -10 }}
              className="bg-lexora-bg rounded-3xl p-8 border border-lexora-border relative flex flex-col h-full shadow-sm hover:shadow-xl transition-all duration-300 group"
            >
              <div className="w-14 h-14 rounded-2xl bg-lexora-text flex items-center justify-center shadow-md mb-8 group-hover:scale-110 transition-transform duration-300">
                {step.icon}
              </div>
              <div className="absolute top-8 right-8 text-5xl font-serif text-lexora-text/5 font-bold transition-colors duration-300 group-hover:text-lexora-text/10">
                {step.id}
              </div>
              <h3 className="text-2xl font-serif text-lexora-text mb-4">{step.title}</h3>
              <p className="text-lexora-text/80 leading-relaxed mb-8 flex-grow text-lg">
                {step.description}
              </p>
              <div className="pt-6 border-t border-lexora-border mt-auto">
                <span className="text-sm font-medium text-lexora-text/60 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-lexora-text" />
                  {step.note}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
