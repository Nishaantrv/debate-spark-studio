import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { trendingTopics, debateRooms, CATEGORIES } from "@/data/mockData";
import { Search, TrendingUp, Users, Plus, LogOut, Flame, Clock, CheckCircle2 } from "lucide-react";

const statusConfig = {
  live: { label: "Live", className: "bg-destructive/20 text-destructive border-destructive/30" },
  waiting: { label: "Waiting", className: "bg-accent/20 text-accent border-accent/30" },
  completed: { label: "Completed", className: "bg-muted text-muted-foreground border-border" },
};

const Dashboard = () => {
  const { profile, signOut } = useAuth();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredTopics = trendingTopics.filter(
    (t) =>
      (selectedCategory === "All" || t.category === selectedCategory) &&
      t.title.toLowerCase().includes(search.toLowerCase())
  );

  const filteredRooms = debateRooms.filter(
    (r) =>
      (selectedCategory === "All" || r.category === selectedCategory) &&
      r.topic.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-lg">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
          <h1 className="font-display text-xl font-bold text-foreground">
            Debate<span className="text-primary">Arena</span>
          </h1>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src={profile?.avatar_url} />
                <AvatarFallback>{profile?.username?.[0]?.toUpperCase()}</AvatarFallback>
              </Avatar>
              <span className="hidden text-sm font-medium text-foreground sm:block">{profile?.username}</span>
            </div>
            <Button variant="ghost" size="icon" onClick={signOut}>
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-6">
        {/* Search & Filter */}
        <div className="mb-6 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search topics and rooms..."
              className="pl-10"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {CATEGORIES.map((cat) => (
              <Button
                key={cat}
                size="sm"
                variant={selectedCategory === cat ? "default" : "secondary"}
                onClick={() => setSelectedCategory(cat)}
                className="shrink-0 rounded-full text-xs"
              >
                {cat}
              </Button>
            ))}
          </div>
        </div>

        <Tabs defaultValue="trending" className="space-y-6">
          <TabsList className="w-full justify-start gap-1 bg-secondary">
            <TabsTrigger value="trending" className="gap-1.5"><TrendingUp className="h-3.5 w-3.5" />Trending</TabsTrigger>
            <TabsTrigger value="explore" className="gap-1.5"><Users className="h-3.5 w-3.5" />Explore</TabsTrigger>
            <TabsTrigger value="myrooms" className="gap-1.5"><Clock className="h-3.5 w-3.5" />My Rooms</TabsTrigger>
          </TabsList>

          {/* Trending Topics */}
          <TabsContent value="trending">
            <div className="space-y-3">
              {filteredTopics.length === 0 ? (
                <div className="py-16 text-center text-muted-foreground">No topics found</div>
              ) : (
                filteredTopics.map((topic, i) => (
                  <motion.div key={topic.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                    <Card className="cursor-pointer transition-colors hover:bg-card/80" onClick={() => navigate(`/room/${debateRooms[0]?.id || "r1"}`)}>
                      <CardContent className="flex items-center justify-between p-4">
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center gap-2">
                            {topic.trending && <Flame className="h-4 w-4 text-destructive" />}
                            <h3 className="font-medium text-foreground">{topic.title}</h3>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">{topic.category}</Badge>
                            <span className="text-xs text-muted-foreground">{topic.engagementCount.toLocaleString()} engaged</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))
              )}
            </div>
          </TabsContent>

          {/* Explore Rooms */}
          <TabsContent value="explore">
            <div className="mb-4 flex justify-end">
              <Button onClick={() => navigate("/create-room")} className="gap-2 rounded-xl">
                <Plus className="h-4 w-4" /> Create Room
              </Button>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {filteredRooms.length === 0 ? (
                <div className="col-span-full py-16 text-center text-muted-foreground">No rooms found</div>
              ) : (
                filteredRooms.map((room, i) => {
                  const status = statusConfig[room.status];
                  return (
                    <motion.div key={room.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                      <Card className="cursor-pointer transition-colors hover:bg-card/80" onClick={() => navigate(`/room/${room.id}`)}>
                        <CardContent className="space-y-3 p-4">
                          <div className="flex items-start justify-between">
                            <h3 className="font-display text-sm font-semibold text-foreground">{room.topic}</h3>
                            <Badge variant="outline" className={status.className}>{status.label}</Badge>
                          </div>
                          <p className="text-xs text-muted-foreground line-clamp-2">{room.description}</p>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Avatar className="h-5 w-5">
                                <AvatarImage src={room.hostAvatar} />
                              </Avatar>
                              <span className="text-xs text-muted-foreground">{room.host}</span>
                            </div>
                            <span className="text-xs text-muted-foreground">
                              {room.participantCount}/{room.maxParticipants} joined
                            </span>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })
              )}
            </div>
          </TabsContent>

          {/* My Rooms */}
          <TabsContent value="myrooms">
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <CheckCircle2 className="mb-4 h-12 w-12 text-muted-foreground/40" />
              <h3 className="font-display text-lg font-semibold text-foreground">No Rooms Yet</h3>
              <p className="mt-1 text-sm text-muted-foreground">Create or join a debate to get started</p>
              <Button onClick={() => navigate("/create-room")} className="mt-4 gap-2 rounded-xl">
                <Plus className="h-4 w-4" /> Create Room
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Dashboard;
