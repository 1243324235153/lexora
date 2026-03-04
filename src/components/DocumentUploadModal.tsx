import { useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, UploadCloud, Loader2 } from "lucide-react";

interface DocumentUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (file: File) => void;
}

export default function DocumentUploadModal({ isOpen, onClose, onUpload }: DocumentUploadModalProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file: File) => {
    setIsUploading(true);
    // Simulate a brief upload/analysis delay
    setTimeout(() => {
      setIsUploading(false);
      onUpload(file);
      onClose();
    }, 2000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-lexora-text/40 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden border border-lexora-border"
          >
            <div className="flex items-center justify-between p-6 md:p-8 border-b border-lexora-border bg-[#FAFAFA]">
              <h2 className="font-serif text-2xl font-medium text-lexora-text">Ladda upp dokument</h2>
              <button onClick={onClose} className="w-8 h-8 rounded-full bg-white border border-lexora-border flex items-center justify-center text-lexora-text/50 hover:text-lexora-text hover:bg-lexora-bg transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 md:p-8">
              <p className="text-lexora-text/70 mb-8 leading-relaxed">
                Ladda upp era policys, GDPR-dokument eller kundavtal. Lexora kommer att använda dessa som kontext i era analyser.
              </p>

              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => !isUploading && fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-3xl p-10 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-200 ${
                  isDragging ? "border-lexora-text bg-lexora-text/5 scale-[1.02]" : "border-lexora-border hover:border-lexora-text/30 hover:bg-[#FAFAFA]"
                } ${isUploading ? "opacity-50 pointer-events-none" : ""}`}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                  accept=".pdf,.doc,.docx,.txt"
                />
                
                {isUploading ? (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center"
                  >
                    <Loader2 className="w-12 h-12 text-lexora-text animate-spin mb-4" />
                    <p className="font-medium text-lexora-text">Krypterar och sparar...</p>
                    <p className="text-sm text-lexora-text/50 mt-1">Detta kan ta några sekunder</p>
                  </motion.div>
                ) : (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center"
                  >
                    <div className="w-16 h-16 rounded-full bg-lexora-bg flex items-center justify-center mb-6 shadow-sm border border-lexora-border">
                      <UploadCloud className="w-8 h-8 text-lexora-text" />
                    </div>
                    <p className="font-medium text-lexora-text mb-2 text-lg">
                      Klicka eller dra filer hit
                    </p>
                    <p className="text-sm text-lexora-text/50">
                      Stödjer PDF, Word och TXT (max 10MB)
                    </p>
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
