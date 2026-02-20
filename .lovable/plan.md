
# DebateArena — AI-Moderated Debate Platform

## Overview
A futuristic, dark-mode-first debate platform where users sign in with Google, build profiles with avatars and interests, and participate in real-time debates with AI moderation. Authentication and profiles are real (Supabase); debate features are mocked UI ready for future backend integration.

---

## Phase 1: Foundation & Auth

### Supabase Setup
- Connect to user's external Supabase project
- Create `users` table (id, username, avatar_url, interests, created_at) with RLS policies
- Database trigger to auto-link profile to `auth.users`

### Google OAuth Authentication
- Landing page with app branding (futuristic dark theme, animated background)
- Google Sign-In button via Supabase Auth
- Session persistence with `onAuthStateChange` listener
- Auto-restore session on refresh
- Logout functionality
- Protected route wrapper for authenticated pages

### Auth Flow Logic
- After login → check if profile exists in `users` table
- No profile → redirect to Profile Setup
- Has profile → redirect to Dashboard

---

## Phase 2: Profile Setup

### Profile Creation Screen
- Username input with validation
- Pre-made avatar grid (8-12 illustrated avatar options to choose from)
- Interest selection chips: Politics, Technology, Science, Philosophy, Sports, Entertainment, Health, Economics, Environment, Culture
- Multi-select for interests
- Save profile to Supabase `users` table
- Profile editing capability from Dashboard

---

## Phase 3: Dashboard

### Tabbed Dashboard Layout
- **Trending Topics** — Mocked list of popular debate topics with engagement stats, category tags, and trending indicators
- **Explore Rooms** — Browse available debate rooms (mocked) with topic, participant count, and status
- **My Rooms** — User's created/joined rooms (mocked)

### Dashboard Features
- Search and filter functionality
- Loading skeletons while data loads
- Empty states with illustrations
- User profile summary in header/sidebar

---

## Phase 4: Debate Rooms

### Create Room
- Form: topic, description, category, max participants, scheduled time
- Generate shareable invite link (mocked)

### Join Room
- Browse and join from Explore tab
- Join via invite link
- Room lobby showing participants and rules

### Room Card UI
- Topic, host info, participant count, status badge, category tag

---

## Phase 5: Debate Screen

### Live Debate UI (All Mocked)
- Topic header with debate rules
- Countdown timer with visual progress
- Turn-based chat layout (alternating sides like a messaging app)
- Text input for arguments
- Microphone button (visual only, non-functional)
- Debater vs Audience role indicators
- Real-time feel with mock message animations

---

## Phase 6: AI Moderator Panel

### Moderator Feedback UI (All Mocked)
- Warning cards (rule violations, time warnings)
- Live scoring display per debater
- Winner announcement with celebration animation
- Post-debate feedback cards with argument analysis
- Overall debate summary

---

## Design & UX

- **Dark mode default** with futuristic aesthetic (glowing accents, subtle gradients)
- **Mobile-first** responsive design
- Framer Motion animations for page transitions and UI interactions
- Loading skeletons on all data-fetching screens
- Error handling UI with retry options
- Empty states with helpful messaging
- Clean typography and generous spacing
