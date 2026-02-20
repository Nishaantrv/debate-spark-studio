import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CATEGORIES } from "@/data/mockData";
import { toast } from "sonner";
import { ArrowLeft, Copy } from "lucide-react";

const CreateRoom = () => {
  const navigate = useNavigate();
  const [topic, setTopic] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [maxParticipants, setMaxParticipants] = useState("6");
  const [created, setCreated] = useState(false);
  const inviteLink = `${window.location.origin}/room/new-room-${Date.now()}`;

  const handleCreate = () => {
    if (!topic.trim() || !category) {
      toast.error("Please fill in topic and category");
      return;
    }
    setCreated(true);
    toast.success("Room created!");
  };

  return (
    <div className="min-h-screen bg-background px-4 py-6">
      <div className="mx-auto max-w-lg">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4 gap-2">
          <ArrowLeft className="h-4 w-4" /> Back
        </Button>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          <h1 className="font-display text-2xl font-bold text-foreground">Create Debate Room</h1>

          {!created ? (
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Topic</label>
                <Input value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="What should we debate?" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Description</label>
                <Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Add context..." />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Category</label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.filter((c) => c !== "All").map((c) => (
                      <SelectItem key={c} value={c}>{c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Max Participants</label>
                <Input type="number" value={maxParticipants} onChange={(e) => setMaxParticipants(e.target.value)} min="2" max="20" />
              </div>
              <Button onClick={handleCreate} size="lg" className="w-full rounded-xl py-6 text-lg font-semibold glow-primary">
                Create Room
              </Button>
            </div>
          ) : (
            <Card className="space-y-4 p-6">
              <h2 className="font-display text-lg font-semibold text-foreground">Room Created!</h2>
              <p className="text-sm text-muted-foreground">Share this invite link:</p>
              <div className="flex items-center gap-2">
                <Input value={inviteLink} readOnly className="text-xs" />
                <Button
                  size="icon"
                  variant="outline"
                  onClick={() => {
                    navigator.clipboard.writeText(inviteLink);
                    toast.success("Link copied!");
                  }}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
              <Button onClick={() => navigate("/dashboard")} variant="secondary" className="w-full">
                Go to Dashboard
              </Button>
            </Card>
          )}
        </motion.div>
      </div>
    </div>
  );
};

// Need Card import
import { Card } from "@/components/ui/card";

export default CreateRoom;
