import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Calendar as CalendarIcon, Clock, CheckCircle2 } from "lucide-react";
import { DayPicker } from "react-day-picker";
import { format } from "date-fns";
import { sv } from "date-fns/locale";
import "react-day-picker/dist/style.css";

export default function BookingModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDate || !email) return;
    setIsSubmitted(true);
    setTimeout(() => {
      onClose();
      setIsSubmitted(false);
      setSelectedDate(undefined);
      setEmail("");
    }, 3000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-lexora-text/40 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="bg-white rounded-3xl shadow-2xl border border-lexora-border w-full max-w-2xl overflow-hidden relative"
          >
            <button
              onClick={onClose}
              className="absolute top-6 right-6 w-10 h-10 rounded-full bg-lexora-bg flex items-center justify-center text-lexora-text/60 hover:text-lexora-text hover:bg-gray-100 transition-colors z-10"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="p-8 md:p-12">
              {isSubmitted ? (
                <div className="text-center py-16">
                  <div className="w-20 h-20 rounded-full bg-lexora-text/10 flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 className="w-10 h-10 text-lexora-text" />
                  </div>
                  <h2 className="text-3xl font-serif text-lexora-text mb-4">Tack för din bokning!</h2>
                  <p className="text-lexora-text/70 text-lg">
                    Vi har mottagit din förfrågan för {selectedDate ? format(selectedDate, "d MMMM yyyy", { locale: sv }) : ""} och återkommer till {email} inom kort med en bekräftelse.
                  </p>
                </div>
              ) : (
                <>
                  <h2 className="text-3xl font-serif text-lexora-text mb-2">Boka en demo</h2>
                  <p className="text-lexora-text/70 mb-8">
                    Välj en dag som passar dig så visar vi hur Lexora kan hjälpa er verksamhet.
                  </p>

                  <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-8">
                    <div>
                      <label className="block text-sm font-medium text-lexora-text mb-4 flex items-center gap-2">
                        <CalendarIcon className="w-4 h-4 text-lexora-text" /> Välj datum
                      </label>
                      <div className="bg-lexora-bg rounded-2xl p-4 border border-lexora-border flex justify-center">
                        <DayPicker
                          mode="single"
                          selected={selectedDate}
                          onSelect={setSelectedDate}
                          locale={sv}
                          disabled={{ before: new Date() }}
                          modifiersClassNames={{
                            selected: "bg-lexora-text text-white rounded-full",
                            today: "font-bold text-lexora-text",
                          }}
                          className="font-sans text-sm"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col justify-between">
                      <div>
                        <label className="block text-sm font-medium text-lexora-text mb-4 flex items-center gap-2">
                          <Clock className="w-4 h-4 text-lexora-text" /> Kontaktuppgifter
                        </label>
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="Din e-postadress"
                          className="w-full bg-lexora-bg border border-lexora-border rounded-xl px-4 py-3 text-lexora-text placeholder:text-lexora-text/40 focus:outline-none focus:ring-2 focus:ring-lexora-text/50 transition-all mb-4"
                        />
                        {selectedDate && (
                          <div className="bg-lexora-text/5 border border-lexora-text/20 rounded-xl p-4 mb-6">
                            <p className="text-sm text-lexora-text/80">
                              Valt datum: <strong className="text-lexora-text">{format(selectedDate, "d MMMM yyyy", { locale: sv })}</strong>
                            </p>
                            <p className="text-xs text-lexora-text/60 mt-1">
                              Vi återkommer med förslag på tid.
                            </p>
                          </div>
                        )}
                      </div>

                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        disabled={!selectedDate || !email}
                        className="w-full bg-lexora-text text-lexora-bg px-6 py-4 rounded-xl text-base font-medium hover:bg-lexora-text/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
                      >
                        Bekräfta bokning
                      </motion.button>
                    </div>
                  </form>
                </>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
