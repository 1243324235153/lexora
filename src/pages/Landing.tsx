import { useState } from "react";
import { motion } from "motion/react";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import HowItWorks from "../components/HowItWorks";
import Comparison from "../components/Comparison";
import Transparency from "../components/Transparency";
import Security from "../components/Security";
import Footer from "../components/Footer";
import BookingModal from "../components/BookingModal";

export default function Landing() {
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  const handleBookDemo = () => {
    setIsBookingOpen(true);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="min-h-screen bg-lexora-bg font-sans text-lexora-text selection:bg-lexora-text/20 selection:text-lexora-text"
    >
      <Navbar onBookDemo={handleBookDemo} />
      
      <main>
        <Hero onBookDemo={handleBookDemo} />
        <HowItWorks />
        <Comparison />
        <Transparency />
        <Security />
      </main>

      <Footer onBookDemo={handleBookDemo} />

      <BookingModal 
        isOpen={isBookingOpen} 
        onClose={() => setIsBookingOpen(false)} 
      />
    </motion.div>
  );
}
