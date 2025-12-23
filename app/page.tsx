"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mic,
  MicOff,
  Send,
  Cpu,
  FileText,
  Mail,
  MessageSquare,
  Chrome,
  Folder,
  Settings,
  Zap,
  Brain,
  Heart,
} from "lucide-react";

type Message = {
  id: string;
  role: "user" | "jonny";
  content: string;
  timestamp: Date;
  emotion?: "calm" | "friendly" | "motivating" | "empathetic";
};

type JonnyStatus = "idle" | "listening" | "thinking" | "working" | "done";

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "jonny",
      content:
        "Hey! I'm Jonny, your personal AI agent. I'm here 24/7 to help you with anything you need. Try saying 'Hey Jonny' or just type your command!",
      timestamp: new Date(),
      emotion: "friendly",
    },
  ]);
  const [input, setInput] = useState("");
  const [status, setStatus] = useState<JonnyStatus>("idle");
  const [isListening, setIsListening] = useState(false);
  const [voiceSupported, setVoiceSupported] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    // Check if Web Speech API is supported
    if (typeof window !== "undefined") {
      const SpeechRecognition =
        (window as any).SpeechRecognition ||
        (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        setVoiceSupported(true);
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = true;
        recognitionRef.current.interimResults = true;

        recognitionRef.current.onresult = (event: any) => {
          const transcript = Array.from(event.results)
            .map((result: any) => result[0])
            .map((result) => result.transcript)
            .join("");

          if (
            transcript.toLowerCase().includes("hey jonny") ||
            transcript.toLowerCase().includes("hey johnny")
          ) {
            setInput(transcript.replace(/hey jonn?y/i, "").trim());
            setStatus("listening");
          } else if (event.results[event.results.length - 1].isFinal) {
            setInput(transcript);
          }
        };

        recognitionRef.current.onerror = (event: any) => {
          console.error("Speech recognition error:", event.error);
          setIsListening(false);
          setStatus("idle");
        };

        recognitionRef.current.onend = () => {
          if (isListening) {
            recognitionRef.current.start();
          }
        };
      }
    }
  }, [isListening]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const toggleListening = () => {
    if (!voiceSupported) return;

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      setStatus("idle");
    } else {
      recognitionRef.current?.start();
      setIsListening(true);
      setStatus("listening");
    }
  };

  const detectEmotion = (userMessage: string): Message["emotion"] => {
    const lowerMessage = userMessage.toLowerCase();
    if (
      lowerMessage.includes("tired") ||
      lowerMessage.includes("exhausted") ||
      lowerMessage.includes("stressed")
    ) {
      return "motivating";
    }
    if (
      lowerMessage.includes("angry") ||
      lowerMessage.includes("frustrated") ||
      lowerMessage.includes("annoyed")
    ) {
      return "calm";
    }
    if (
      lowerMessage.includes("sad") ||
      lowerMessage.includes("upset") ||
      lowerMessage.includes("worried")
    ) {
      return "empathetic";
    }
    return "friendly";
  };

  const generateResponse = (
    userMessage: string,
    emotion: Message["emotion"]
  ): string => {
    const lowerMessage = userMessage.toLowerCase();

    // File operations
    if (
      lowerMessage.includes("send file") ||
      lowerMessage.includes("share file")
    ) {
      return "I'd open your file manager, identify the file you want to share, and prepare it for sending via WhatsApp, Email, or your preferred method. Which file would you like to send?";
    }

    // WhatsApp
    if (lowerMessage.includes("whatsapp")) {
      return "I can help you with WhatsApp! I'd open WhatsApp, select your contact, and send your message or file. Just tell me who to send it to and what to say.";
    }

    // Email
    if (lowerMessage.includes("email") || lowerMessage.includes("mail")) {
      return "I'll help you with email. I can compose, send, or manage your emails. Who should I send this to, and what's the message?";
    }

    // Browser/Search
    if (
      lowerMessage.includes("search") ||
      lowerMessage.includes("google") ||
      lowerMessage.includes("browse")
    ) {
      return "Opening your browser and searching for that now. I'll find the most relevant information for you.";
    }

    // File management
    if (
      lowerMessage.includes("organize") ||
      lowerMessage.includes("folder") ||
      lowerMessage.includes("files")
    ) {
      return "I can organize your files! Tell me which folders or files you want me to work with, and I'll sort, rename, or move them as needed.";
    }

    // Scheduling/Reminder
    if (
      lowerMessage.includes("remind") ||
      lowerMessage.includes("schedule") ||
      lowerMessage.includes("meeting")
    ) {
      return "I'll set that up for you. When would you like the reminder, and what should I remind you about?";
    }

    // Emotional responses
    if (emotion === "motivating") {
      return "I can see you're tired. Let me handle this for you - you focus on taking a break. I've got this covered!";
    }
    if (emotion === "calm") {
      return "I understand you're frustrated. Take a deep breath - I'm here to help make things easier. Let me handle the technical stuff.";
    }
    if (emotion === "empathetic") {
      return "I'm here for you. Whatever you need, we'll work through it together. What can I do to help right now?";
    }

    // General assistance
    if (
      lowerMessage.includes("help") ||
      lowerMessage.includes("what can you do")
    ) {
      return "I can help you with: sending files & messages, managing emails, organizing folders, web searches, setting reminders, opening apps, and automating daily tasks. I understand natural language, so just tell me what you need!";
    }

    // Default friendly response
    return "I'm ready to help! I can send files, manage messages, organize your work, browse the web, and handle daily digital tasks. What would you like me to do?";
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setStatus("thinking");

    // Simulate processing
    await new Promise((resolve) => setTimeout(resolve, 800));
    setStatus("working");

    await new Promise((resolve) => setTimeout(resolve, 1200));

    const emotion = detectEmotion(input);
    const response = generateResponse(input, emotion);

    const jonnyMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: "jonny",
      content: response,
      timestamp: new Date(),
      emotion: emotion,
    };

    setMessages((prev) => [...prev, jonnyMessage]);
    setStatus("done");

    setTimeout(() => setStatus("idle"), 2000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case "listening":
        return "bg-blue-500";
      case "thinking":
        return "bg-yellow-500";
      case "working":
        return "bg-purple-500";
      case "done":
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };

  const getStatusText = () => {
    switch (status) {
      case "listening":
        return "Listening...";
      case "thinking":
        return "Thinking...";
      case "working":
        return "Working on it...";
      case "done":
        return "Done!";
      default:
        return "Ready";
    }
  };

  const capabilities = [
    { icon: FileText, label: "File Handling" },
    { icon: MessageSquare, label: "WhatsApp" },
    { icon: Mail, label: "Email" },
    { icon: Chrome, label: "Web Browser" },
    { icon: Folder, label: "File Manager" },
    { icon: Settings, label: "Automation" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-950/50 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <motion.div
              className="relative"
              animate={{
                scale: status === "working" ? [1, 1.1, 1] : 1,
              }}
              transition={{ repeat: Infinity, duration: 2 }}
            >
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                <Brain className="w-6 h-6" />
              </div>
              <motion.div
                className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full ${getStatusColor()} border-2 border-slate-950`}
                animate={{
                  scale: status !== "idle" ? [1, 1.2, 1] : 1,
                }}
                transition={{ repeat: Infinity, duration: 1 }}
              />
            </motion.div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                Jonny
              </h1>
              <p className="text-sm text-slate-400">{getStatusText()}</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 text-sm text-slate-400">
              <Heart className="w-4 h-4 text-red-500" />
              <span>Your Personal AI Agent</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-6 flex flex-col lg:flex-row gap-6 h-[calc(100vh-88px)]">
        {/* Sidebar */}
        <motion.aside
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:w-64 space-y-4"
        >
          <div className="bg-slate-900/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-800">
            <h2 className="text-sm font-semibold text-slate-400 mb-4 flex items-center gap-2">
              <Zap className="w-4 h-4" />
              CAPABILITIES
            </h2>
            <div className="space-y-2">
              {capabilities.map((capability, index) => (
                <motion.div
                  key={capability.label}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-800/50 transition-colors cursor-pointer"
                >
                  <capability.icon className="w-4 h-4 text-cyan-400" />
                  <span className="text-sm text-slate-300">
                    {capability.label}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-br from-cyan-950/30 to-blue-950/30 backdrop-blur-xl rounded-2xl p-6 border border-cyan-900/30">
            <h3 className="text-sm font-semibold text-cyan-400 mb-2">
              Voice Control
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              {voiceSupported
                ? 'Click the mic and say "Hey Jonny" followed by your command'
                : "Voice control not supported in this browser"}
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <Cpu className="w-3 h-3" />
              <span>Always Learning</span>
            </div>
          </div>
        </motion.aside>

        {/* Chat Area */}
        <main className="flex-1 flex flex-col bg-slate-900/30 backdrop-blur-xl rounded-2xl border border-slate-800 overflow-hidden">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            <AnimatePresence>
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className={`flex gap-3 ${
                    message.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  {message.role === "jonny" && (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center flex-shrink-0">
                      <Brain className="w-4 h-4" />
                    </div>
                  )}
                  <div
                    className={`max-w-[70%] rounded-2xl px-4 py-3 ${
                      message.role === "user"
                        ? "bg-gradient-to-br from-cyan-600 to-blue-600 text-white"
                        : "bg-slate-800/50 text-slate-100 border border-slate-700"
                    }`}
                  >
                    <p className="text-sm leading-relaxed">{message.content}</p>
                    <span className="text-xs opacity-60 mt-2 block">
                      {message.timestamp.toLocaleTimeString()}
                    </span>
                  </div>
                  {message.role === "user" && (
                    <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-semibold">You</span>
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="border-t border-slate-800 p-4 bg-slate-900/50">
            <div className="flex gap-3">
              <button
                onClick={toggleListening}
                disabled={!voiceSupported}
                className={`p-3 rounded-xl transition-all ${
                  isListening
                    ? "bg-blue-600 hover:bg-blue-700"
                    : "bg-slate-800 hover:bg-slate-700"
                } ${!voiceSupported ? "opacity-50 cursor-not-allowed" : ""}`}
                title={
                  voiceSupported
                    ? isListening
                      ? "Stop listening"
                      : "Start voice input"
                    : "Voice not supported"
                }
              >
                {isListening ? (
                  <Mic className="w-5 h-5 text-white" />
                ) : (
                  <MicOff className="w-5 h-5 text-slate-400" />
                )}
              </button>
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder='Type your command or say "Hey Jonny"...'
                className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white placeholder-slate-500"
              />
              <button
                onClick={handleSend}
                disabled={!input.trim()}
                className="p-3 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
