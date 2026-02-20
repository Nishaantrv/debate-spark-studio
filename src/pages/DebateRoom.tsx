import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { debateRooms, mockDebateMessages, DebateMessage } from "@/data/mockData";
import { ArrowLeft, Send, Mic, Timer, AlertTriangle, Trophy, Star, ChevronDown } from "lucide-react";

const DebateRoom = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const room = debateRooms.find((r) => r.id === id) || debateRooms[0];
  const [messages, setMessages] = useState<DebateMessage[]>(mockDebateMessages);
  const [input, setInput] = useState("");
  const [timeLeft, setTimeLeft] = useState(300);
  const [showModPanel, setShowModPanel] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setInterval(() => setTimeLeft((t) => (t > 0 ? t - 1 : 0)), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const formatTime = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, "0")}`;

  const handleSend = () => {
    if (!input.trim()) return;
    const newMsg: DebateMessage = {
      id: `m${Date.now()}`,
      sender: "You",
      senderAvatar: "https://api.dicebear.com/9.x/bottts-neutral/svg?seed=arena4",
      content: input,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      side: messages.length % 2 === 0 ? "for" : "against",
    };
    setMessages((prev) => [...prev, newMsg]);
    setInput("");
  };

  const timerPercent = (timeLeft / 300) * 100;

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Header */}
      <header className="border-b border-border bg-background/80 backdrop-blur-lg">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-3">
          <Button variant="ghost" size="icon" onClick={() => navigate("/dashboard")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="text-center">
            <h1 className="font-display text-sm font-semibold text-foreground">{room.topic}</h1>
            <Badge variant="outline" className="mt-1 text-xs">{room.category}</Badge>
          </div>
          <Button variant="ghost" size="icon" onClick={() => setShowModPanel(!showModPanel)}>
            <Star className="h-4 w-4" />
          </Button>
        </div>
        {/* Timer */}
        <div className="mx-auto max-w-3xl px-4 pb-3">
          <div className="flex items-center gap-2 text-sm">
            <Timer className="h-4 w-4 text-muted-foreground" />
            <span className={`font-mono font-semibold ${timeLeft < 60 ? "text-destructive" : "text-foreground"}`}>
              {formatTime(timeLeft)}
            </span>
            <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-secondary">
              <motion.div
                className="h-full rounded-full bg-primary"
                animate={{ width: `${timerPercent}%` }}
                transition={{ duration: 1 }}
              />
            </div>
          </div>
        </div>
      </header>

      {/* AI Moderator Panel */}
      <AnimatePresence>
        {showModPanel && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-b border-border"
          >
            <div className="mx-auto max-w-3xl space-y-3 px-4 py-4">
              <h2 className="font-display text-sm font-semibold text-foreground">AI Moderator</h2>

              {/* Warning */}
              <Card className="border-destructive/30 bg-destructive/5">
                <CardContent className="flex items-start gap-3 p-3">
                  <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />
                  <div>
                    <p className="text-xs font-medium text-destructive">Time Warning</p>
                    <p className="text-xs text-muted-foreground">CyberSage is exceeding time limit per argument</p>
                  </div>
                </CardContent>
              </Card>

              {/* Scores */}
              <div className="grid grid-cols-2 gap-3">
                {[
                  { name: "CyberSage", score: 78, side: "For" },
                  { name: "TechFreedom", score: 72, side: "Against" },
                ].map((d) => (
                  <Card key={d.name}>
                    <CardContent className="p-3 text-center">
                      <p className="text-xs text-muted-foreground">{d.side}</p>
                      <p className="font-display text-lg font-bold text-foreground">{d.score}</p>
                      <p className="text-xs font-medium text-foreground">{d.name}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Feedback */}
              <Card>
                <CardContent className="p-3">
                  <p className="text-xs font-medium text-foreground">Analysis</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Both debaters are presenting strong arguments. CyberSage's points about regulatory necessity are compelling, while TechFreedom offers valid counterarguments about innovation.
                  </p>
                </CardContent>
              </Card>

              {timeLeft === 0 && (
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-center"
                >
                  <Card className="glow-primary border-primary/30 bg-primary/5">
                    <CardContent className="p-4">
                      <Trophy className="mx-auto mb-2 h-8 w-8 text-primary" />
                      <p className="font-display text-sm font-bold text-primary">Winner: CyberSage</p>
                      <p className="mt-1 text-xs text-muted-foreground">Score: 78 vs 72</p>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-3xl space-y-4 px-4 py-4">
          {/* Role indicators */}
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <Badge variant="outline" className="bg-accent/10 text-accent">For</Badge>
            <Badge variant="outline" className="bg-destructive/10 text-destructive">Against</Badge>
          </div>

          {messages.map((msg, i) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, x: msg.side === "for" ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className={`flex gap-3 ${msg.side === "against" ? "flex-row-reverse" : ""}`}
            >
              <Avatar className="h-8 w-8 shrink-0">
                <AvatarImage src={msg.senderAvatar} />
              </Avatar>
              <div className={`max-w-[75%] space-y-1 ${msg.side === "against" ? "text-right" : ""}`}>
                <div className="flex items-center gap-2">
                  {msg.side === "against" && <span className="text-xs text-muted-foreground">{msg.timestamp}</span>}
                  <span className="text-xs font-medium text-foreground">{msg.sender}</span>
                  {msg.side === "for" && <span className="text-xs text-muted-foreground">{msg.timestamp}</span>}
                </div>
                <div className={`rounded-2xl px-4 py-2.5 text-sm ${
                  msg.side === "for"
                    ? "rounded-tl-sm bg-primary/15 text-foreground"
                    : "rounded-tr-sm bg-secondary text-foreground"
                }`}>
                  {msg.content}
                </div>
              </div>
            </motion.div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <div className="border-t border-border bg-background/80 backdrop-blur-lg">
        <div className="mx-auto flex max-w-3xl items-center gap-2 px-4 py-3">
          <Button variant="ghost" size="icon" className="shrink-0">
            <Mic className="h-5 w-5 text-muted-foreground" />
          </Button>
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Make your argument..."
            className="rounded-xl"
          />
          <Button onClick={handleSend} size="icon" className="shrink-0 rounded-xl">
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DebateRoom;
