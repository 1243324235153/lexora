import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Send, Loader2, Bot, User, Scale, Settings, LogOut, FileText, ShieldAlert, Info, Upload, Trash2, Search, AlertTriangle, CheckCircle2, Plus } from "lucide-react";
import Markdown from "react-markdown";
import { Link, useNavigate } from "react-router-dom";
import { askLexora, LexoraResponse } from "../services/geminiService";
import { useAuth } from "../contexts/AuthContext";
import { auth } from "../lib/firebase";
import { signOut } from "firebase/auth";
import DocumentUploadModal from "../components/DocumentUploadModal";
import { getDocuments, saveDocument, deleteDocument, SavedDocument } from "../services/storageService";

type ViewMode = "chat" | "review";

interface Message {
  role: "user" | "lexora";
  content: string | LexoraResponse;
}

const TOPICS = [
  {
    id: "gdpr",
    title: "GDPR & Kunddata",
    icon: <ShieldAlert className="w-4 h-4" />,
    initialMessage: "Du har valt att analysera **GDPR & Kunddata**. Beskriv kort hur ni samlar in och lagrar kunduppgifter idag, vilka system ni använder och om ni delar data med tredje part, så hjälper jag er att identifiera risker och åtgärder."
  },
  {
    id: "arbetsmiljo",
    title: "Arbetsmiljöpolicy",
    icon: <FileText className="w-4 h-4" />,
    initialMessage: "Du har valt att analysera er **Arbetsmiljöpolicy**. Vilken typ av verksamhet bedriver ni (t.ex. kontor, industri, distansarbete) och har ni skyddsombud? Beskriv er nuvarande situation så kan vi gå igenom vilka krav som ställs på er policy."
  },
  {
    id: "visselblasare",
    title: "Visselblåsarlagen",
    icon: <Info className="w-4 h-4" />,
    initialMessage: "Du har valt att analysera era krav enligt **Visselblåsarlagen**. Hur många anställda har ni i dagsläget, och ingår ni i en koncern? Har ni redan någon form av rapporteringskanal på plats?"
  }
];

export default function AppPage() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [viewMode, setViewMode] = useState<ViewMode>("chat");
  const [input, setInput] = useState("");
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [documents, setDocuments] = useState<SavedDocument[]>([]);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "lexora",
      content: "Välkommen till Lexora. Beskriv en situation eller en regel du undrar över, så hjälper jag dig att förstå hur den påverkar din verksamhet.",
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [isReviewing, setIsReviewing] = useState(false);
  const [reviewResult, setReviewResult] = useState<LexoraResponse | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  useEffect(() => {
    const loadDocs = async () => {
      try {
        const docs = await getDocuments();
        setDocuments(docs);
      } catch (error) {
        console.error("Failed to load documents", error);
      }
    };
    loadDocs();
  }, []);

  const handleLogout = async () => {
    if (auth) {
      await signOut(auth);
    }
    navigate("/");
  };

  const handleTopicSelect = (topicId: string) => {
    setViewMode("chat");
    const topic = TOPICS.find(t => t.id === topicId);
    if (topic) {
      setMessages([{ role: "lexora", content: topic.initialMessage }]);
    }
  };

  const handleFileUpload = async (file: File) => {
    try {
      const savedDoc = await saveDocument(file);
      setDocuments(prev => [...prev, savedDoc]);
      if (viewMode === "chat") {
        setMessages(prev => [
          ...prev,
          {
            role: "lexora",
            content: `✅ **Dokument sparat:** \`${file.name}\`\n\nJag har nu läst in dokumentet och lagt till det i din företagskontext. Du kan nu ställa frågor om innehållet, till exempel hur det förhåller sig till GDPR eller er arbetsmiljöpolicy.`
          }
        ]);
      }
    } catch (error) {
      console.error("Failed to save document", error);
    }
  };

  const handleDeleteDocument = async (id: string) => {
    try {
      await deleteDocument(id);
      setDocuments(prev => prev.filter(d => d.id !== id));
    } catch (error) {
      console.error("Failed to delete document", error);
    }
  };

  const handleReviewDocuments = async () => {
    if (documents.length === 0) return;
    setViewMode("review");
    setIsReviewing(true);
    
    try {
      const docNames = documents.map(d => d.name).join(", ");
      const prompt = `Granska följande uppladdade dokument för potentiella kryphål och risker: ${docNames}. Identifiera brister i relation till GDPR, arbetsmiljö eller annan relevant lagstiftning.`;
      const response = await askLexora(prompt);
      if (typeof response !== "string") {
        setReviewResult(response);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsReviewing(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setIsLoading(true);

    try {
      const response = await askLexora(userMessage);
      setMessages((prev) => [...prev, { role: "lexora", content: response }]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { role: "lexora", content: "Ett fel uppstod. Vänligen försök igen." },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="flex h-screen bg-lexora-bg overflow-hidden selection:bg-lexora-text/20 selection:text-lexora-text"
    >
      {/* Sidebar */}
      <motion.aside 
        initial={{ x: -300 }}
        animate={{ x: 0 }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
        className="w-72 bg-[#1A2033] text-lexora-bg flex flex-col border-r border-white/5 z-20 shadow-2xl relative"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />
        <div className="p-6 border-b border-white/10 flex items-center justify-between relative z-10">
          <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 rounded-lg bg-lexora-bg/10 flex items-center justify-center border border-white/10">
              <Scale className="w-5 h-5 text-lexora-bg" />
            </div>
            <span className="font-serif text-2xl font-semibold tracking-tight">Lexora</span>
          </Link>
        </div>

        <div className="flex-1 overflow-y-auto p-4 py-6 relative z-10">
          <div className="mb-8">
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-lexora-bg/40 mb-4 px-3">Verktyg</h3>
            <div className="space-y-1">
              <button 
                onClick={() => setViewMode("chat")}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 text-sm font-medium ${viewMode === "chat" ? "bg-white/10 text-white shadow-sm border border-white/5" : "text-lexora-bg/60 hover:bg-white/5 hover:text-white"}`}
              >
                <Bot className="w-4 h-4" />
                Chatt & Analys
              </button>
              <button 
                onClick={handleReviewDocuments}
                disabled={documents.length === 0}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 text-sm font-medium ${viewMode === "review" ? "bg-white/10 text-white shadow-sm border border-white/5" : "text-lexora-bg/60 hover:bg-white/5 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed"}`}
              >
                <Search className="w-4 h-4" />
                Granska dokument
              </button>
            </div>
          </div>

          <div className="mb-8">
            <div className="flex items-center justify-between mb-4 px-3">
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-lexora-bg/40">Företagsdokument</h3>
              <button 
                onClick={() => setIsUploadModalOpen(true)}
                className="text-lexora-bg/40 hover:text-white transition-colors p-1 rounded-md hover:bg-white/10"
                title="Ladda upp nytt dokument"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="space-y-1">
              {documents.length === 0 ? (
                <div className="px-3 py-5 text-center border border-dashed border-white/10 rounded-xl bg-white/5">
                  <p className="text-xs text-lexora-bg/40 font-medium">Inga dokument uppladdade ännu.</p>
                </div>
              ) : (
                documents.map((doc) => (
                  <div key={doc.id} className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-lexora-bg/70 hover:bg-white/5 group transition-all duration-200 border border-transparent hover:border-white/5">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center shrink-0">
                        <FileText className="w-4 h-4 text-lexora-bg/80" />
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="truncate text-sm font-medium text-lexora-bg/90">{doc.name}</span>
                        <span className="text-[10px] text-lexora-bg/40 uppercase tracking-wider font-medium">{(doc.size / 1024).toFixed(0)} KB</span>
                      </div>
                    </div>
                    <button 
                      onClick={() => handleDeleteDocument(doc.id)}
                      className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-red-500/20 hover:text-red-400 rounded-lg transition-all"
                      title="Ta bort dokument"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          <div>
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-lexora-bg/40 mb-4 px-3">Analysområden</h3>
            <div className="space-y-1">
              {TOPICS.map((topic) => (
                <button 
                  key={topic.id}
                  onClick={() => handleTopicSelect(topic.id)}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-lexora-bg/60 hover:bg-white/5 hover:text-white transition-all duration-200 text-sm text-left truncate font-medium"
                >
                  <div className="w-6 h-6 rounded-md bg-white/5 flex items-center justify-center shrink-0">
                    {topic.icon}
                  </div>
                  <span className="truncate">{topic.title}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-white/10 relative z-10 bg-black/10">
          <div className="flex items-center gap-3 px-3 py-3 mb-2 rounded-xl bg-white/5 border border-white/5">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-lexora-bg/20 to-transparent flex items-center justify-center text-lexora-bg border border-white/10 shadow-inner">
              <User className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white truncate">
                {currentUser?.displayName || "Användare"}
              </p>
              <p className="text-xs text-lexora-bg/50 truncate font-medium">
                {currentUser?.email || "Företaget AB"}
              </p>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-lexora-bg/60 hover:bg-red-500/10 hover:text-red-400 transition-all duration-200 text-sm font-medium border border-transparent hover:border-red-500/20"
          >
            <LogOut className="w-4 h-4" />
            Logga ut
          </button>
        </div>
      </motion.aside>

      {/* Main Area */}
      <main className="flex-1 flex flex-col relative bg-white">
        {/* Header */}
        <header className="h-16 border-b border-lexora-border flex items-center px-8 bg-white/80 backdrop-blur-sm sticky top-0 z-10">
          <h1 className="font-serif text-lg font-medium text-lexora-text">
            {viewMode === "chat" ? "Ny analys" : "Dokumentgranskning"}
          </h1>
        </header>

        {viewMode === "chat" ? (
          <>
            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4 md:p-8 scroll-smooth bg-[#FAFAFA]">
              <div className="max-w-3xl mx-auto space-y-8 pb-32">
                <AnimatePresence initial={false}>
                  {messages.map((msg, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 20, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ type: "spring", stiffness: 200, damping: 20 }}
                      className={`flex gap-4 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
                    >
                      <div
                        className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center shrink-0 shadow-sm ${
                          msg.role === "lexora"
                            ? "bg-lexora-text text-lexora-bg"
                            : "bg-white text-lexora-text border border-lexora-border"
                        }`}
                      >
                        {msg.role === "lexora" ? <Bot className="w-4 h-4 md:w-5 md:h-5" /> : <User className="w-4 h-4 md:w-5 md:h-5" />}
                      </div>
                      <div
                        className={`max-w-[85%] ${
                          msg.role === "lexora" && typeof msg.content !== "string"
                            ? "w-full"
                            : "rounded-2xl p-5 md:p-6 shadow-sm " + (msg.role === "lexora" ? "bg-white border border-lexora-border text-lexora-text" : "bg-lexora-text text-lexora-bg")
                        }`}
                      >
                        {msg.role === "lexora" ? (
                          typeof msg.content === "string" ? (
                            <div className="prose prose-sm max-w-none prose-headings:font-serif prose-headings:text-lexora-text prose-a:text-lexora-text prose-a:underline prose-p:leading-relaxed prose-li:leading-relaxed">
                              <Markdown>{msg.content}</Markdown>
                            </div>
                          ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="col-span-1 md:col-span-2 bg-white border border-lexora-border rounded-2xl p-6 shadow-sm">
                                <div className="flex items-center justify-between mb-4">
                                  <h3 className="font-serif text-lg text-lexora-text">Sammanfattning</h3>
                                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                    msg.content.riskLevel === "Hög" ? "bg-red-100 text-red-700" :
                                    msg.content.riskLevel === "Medel" ? "bg-amber-100 text-amber-700" :
                                    "bg-emerald-100 text-emerald-700"
                                  }`}>
                                    Risknivå: {msg.content.riskLevel}
                                  </span>
                                </div>
                                <p className="text-sm text-lexora-text/80 leading-relaxed">{msg.content.summary}</p>
                              </div>
                              
                              <div className="bg-lexora-bg/50 border border-lexora-border rounded-2xl p-6 shadow-sm">
                                <div className="flex items-center gap-2 mb-3">
                                  <Scale className="w-4 h-4 text-lexora-text/60" />
                                  <h3 className="font-serif text-md text-lexora-text">Lagrum</h3>
                                </div>
                                <p className="text-sm text-lexora-text/80 leading-relaxed">{msg.content.legislation}</p>
                              </div>

                              <div className="bg-lexora-bg/50 border border-lexora-border rounded-2xl p-6 shadow-sm">
                                <div className="flex items-center gap-2 mb-3">
                                  <Info className="w-4 h-4 text-lexora-text/60" />
                                  <h3 className="font-serif text-md text-lexora-text">Tolkning</h3>
                                </div>
                                <p className="text-sm text-lexora-text/80 leading-relaxed">{msg.content.interpretation}</p>
                              </div>

                              <div className="col-span-1 md:col-span-2 bg-lexora-text text-lexora-bg rounded-2xl p-6 shadow-sm">
                                <div className="flex items-center gap-2 mb-4">
                                  <CheckCircle2 className="w-5 h-5 text-lexora-bg/80" />
                                  <h3 className="font-serif text-lg">Rekommendationer</h3>
                                </div>
                                <ul className="space-y-2">
                                  {msg.content.recommendations.map((rec, i) => (
                                    <li key={i} className="flex items-start gap-3 text-sm text-lexora-bg/90">
                                      <span className="w-1.5 h-1.5 rounded-full bg-lexora-bg/50 mt-1.5 shrink-0" />
                                      <span className="leading-relaxed">{rec}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          )
                        ) : (
                          <p className="text-sm leading-relaxed">{msg.content as string}</p>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
                
                {isLoading && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex gap-4"
                  >
                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-lexora-text text-lexora-bg flex items-center justify-center shrink-0 shadow-sm">
                      <Bot className="w-4 h-4 md:w-5 md:h-5" />
                    </div>
                    <div className="bg-white border border-lexora-border rounded-2xl p-5 md:p-6 flex items-center gap-3 shadow-sm">
                      <Loader2 className="w-5 h-5 animate-spin text-lexora-text" />
                      <span className="text-sm font-medium text-lexora-text/70">Lexora analyserar lagrum och kontext...</span>
                    </div>
                  </motion.div>
                )}
                <div ref={messagesEndRef} className="h-4" />
              </div>
            </div>

            {/* Input Area */}
            <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 bg-gradient-to-t from-[#FAFAFA] via-[#FAFAFA] to-transparent pointer-events-none">
              <div className="max-w-3xl mx-auto relative pointer-events-auto">
                <form onSubmit={handleSubmit} className="relative flex items-end gap-2 bg-white border border-lexora-border rounded-3xl p-2 shadow-lg focus-within:ring-2 focus-within:ring-lexora-text/20 transition-all">
                  <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSubmit(e);
                      }
                    }}
                    placeholder="Beskriv din situation (t.ex. 'Vi planerar att införa kameraövervakning på lagret...')"
                    className="w-full bg-transparent resize-none max-h-32 min-h-[44px] py-3 pl-4 pr-2 text-lexora-text placeholder:text-lexora-text/40 focus:outline-none text-sm leading-relaxed"
                    rows={1}
                    disabled={isLoading}
                  />
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="submit"
                    disabled={!input.trim() || isLoading}
                    className="w-11 h-11 shrink-0 rounded-full bg-lexora-text text-lexora-bg flex items-center justify-center hover:bg-lexora-text/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm mb-0.5 mr-0.5"
                  >
                    <Send className="w-5 h-5 ml-0.5" />
                  </motion.button>
                </form>
                <div className="text-center mt-3">
                  <span className="text-xs text-lexora-text/40 font-medium">Lexora kan göra misstag. Kontrollera alltid viktig information.</span>
                </div>
              </div>
            </div>
          </>
        ) : (
          /* Review Dashboard */
          <div className="flex-1 overflow-y-auto p-4 md:p-8 bg-[#FAFAFA]">
            <div className="max-w-4xl mx-auto">
              <div className="mb-8">
                <h2 className="text-3xl font-serif text-lexora-text mb-3">Dokumentgranskning</h2>
                <p className="text-lexora-text/70 text-lg">Lexora letar efter kryphål, risker och bristande efterlevnad i era uppladdade dokument.</p>
              </div>

              {isReviewing ? (
                <div className="flex flex-col items-center justify-center py-32 bg-white rounded-3xl border border-lexora-border shadow-sm">
                  <Loader2 className="w-12 h-12 text-lexora-text animate-spin mb-6" />
                  <h3 className="text-xl font-serif text-lexora-text">Granskar {documents.length} dokument...</h3>
                  <p className="text-lexora-text/60 mt-2">Detta kan ta en stund beroende på dokumentens storlek.</p>
                </div>
              ) : reviewResult ? (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="grid grid-cols-1 md:grid-cols-2 gap-6"
                >
                  <div className="col-span-1 md:col-span-2 bg-white border border-lexora-border rounded-3xl p-8 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                          reviewResult.riskLevel === "Hög" ? "bg-red-50 text-red-500" :
                          reviewResult.riskLevel === "Medel" ? "bg-amber-50 text-amber-500" :
                          "bg-emerald-50 text-emerald-500"
                        }`}>
                          <ShieldAlert className="w-6 h-6" />
                        </div>
                        <h3 className="font-serif text-2xl text-lexora-text">Övergripande bedömning</h3>
                      </div>
                      <span className={`px-5 py-2 rounded-full text-sm font-bold uppercase tracking-wider ${
                        reviewResult.riskLevel === "Hög" ? "bg-red-100 text-red-700" :
                        reviewResult.riskLevel === "Medel" ? "bg-amber-100 text-amber-700" :
                        "bg-emerald-100 text-emerald-700"
                      }`}>
                        Risknivå: {reviewResult.riskLevel}
                      </span>
                    </div>
                    <p className="text-lexora-text/80 leading-relaxed text-lg">{reviewResult.summary}</p>
                  </div>
                  
                  <div className="bg-white border border-lexora-border rounded-3xl p-8 shadow-sm">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center">
                        <AlertTriangle className="w-5 h-5 text-amber-500" />
                      </div>
                      <h3 className="font-serif text-xl text-lexora-text">Identifierade kryphål</h3>
                    </div>
                    <p className="text-lexora-text/80 leading-relaxed">{reviewResult.interpretation}</p>
                  </div>

                  <div className="bg-white border border-lexora-border rounded-3xl p-8 shadow-sm">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 rounded-full bg-lexora-bg flex items-center justify-center">
                        <Scale className="w-5 h-5 text-lexora-text/60" />
                      </div>
                      <h3 className="font-serif text-xl text-lexora-text">Berörd lagstiftning</h3>
                    </div>
                    <p className="text-lexora-text/80 leading-relaxed">{reviewResult.legislation}</p>
                  </div>

                  <div className="col-span-1 md:col-span-2 bg-lexora-text text-lexora-bg rounded-3xl p-8 md:p-10 shadow-xl">
                    <div className="flex items-center gap-3 mb-8">
                      <CheckCircle2 className="w-8 h-8 text-lexora-bg/80" />
                      <h3 className="font-serif text-2xl">Rekommendationer</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {reviewResult.recommendations.map((rec, i) => (
                        <div key={i} className="flex items-start gap-4 bg-white/5 rounded-2xl p-6 border border-white/10">
                          <div className="w-8 h-8 rounded-full bg-lexora-bg text-lexora-text flex items-center justify-center shrink-0 text-sm font-bold mt-0.5">
                            {i + 1}
                          </div>
                          <span className="text-lexora-bg/90 leading-relaxed">{rec}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ) : (
                <div className="flex flex-col items-center justify-center py-32 bg-white rounded-3xl border border-lexora-border border-dashed">
                  <Search className="w-12 h-12 text-lexora-text/20 mb-4" />
                  <h3 className="text-xl font-serif text-lexora-text/50">Klicka på "Granska dokument" i menyn</h3>
                  <p className="text-lexora-text/40 mt-2">Lexora kommer att analysera alla uppladdade filer.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      <DocumentUploadModal 
        isOpen={isUploadModalOpen} 
        onClose={() => setIsUploadModalOpen(false)} 
        onUpload={handleFileUpload} 
      />
    </motion.div>
  );
}
