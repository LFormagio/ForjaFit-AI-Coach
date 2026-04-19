# ForjaFit AI Coach

<div align="center">

**Your AI Personal Trainer Lives in WhatsApp** 💪🤖

[![GitHub](https://img.shields.io/badge/GitHub-LFormagio/ForjaFit-blue?logo=github)](https://github.com/LFormagio/ForjaFit)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green?logo=node.js)](https://nodejs.org/)
[![License](https://img.shields.io/badge/License-MIT-green)](LICENSE)

</div>

---

## 📋 Overview

**ForjaFit** is an intelligent WhatsApp fitness coach MVP that delivers personalized training plans and daily accountability through conversational AI. Unlike traditional fitness apps with static UIs, ForjaFit lives where your users already are: WhatsApp.

The platform combines:
- **Deterministic Workout Engine**: Safe, predictable training logic based on fitness principles (not LLM hallucinations)
- **Personality-Driven Coaching**: Users choose their coaching style (Motivator, Sergeant, or Adaptive Mentor)
- **Proactive Engagement**: Daily reminders, progress check-ins, and adaptive adjustments
- **Subscription Model**: Seamless conversion from trial to paid ($79/month)

---

## ✨ Key Features

### 🎯 Personalized Coaching
- **Three Coach Personalities**:
  - 🎉 **Amigão Torcedor** (Cheerful Supporter): High energy, emojis, celebrates small wins
  - 🪖 **Sargento** (Drill Sergeant): No-nonsense, zero excuses, disciplined approach
  - 🧘 **Mentor Adaptativo** (Adaptive Mentor): Pragmatic, asks questions, tailors workouts to current state

### 💪 Intelligent Workout Generation
- Deterministic engine ensures safe, progressive training programs
- Based on user fitness level (Beginner, Intermediate, Advanced)
- Tailored to goals: Hypertrophy, Weight Loss, Maintenance
- Accounts for available equipment and physical limitations
- Flexible weekly schedules (2-6 days/week)

### 🤖 AI-Powered Conversations
- GPT-4o-mini for natural language workout delivery
- Respects user personality preference
- Daily accountability check-ins
- Motivational messaging with tone-matched responses

### 📱 WhatsApp Native
- QR code-based onboarding
- No app installation required
- Familiar messaging interface
- Webhook-based message handling
- Support for proactive messaging (reminders, notifications)

### 👤 User Journey
1. **Acquisition**: Scan WhatsApp QR code
2. **Onboarding**: Fitness assessment + coaching personality selection
3. **Plan Generation**: Receive weekly workout plan with motivational framing
4. **Daily Engagement**: Pre-workout reminders, completion check-ins, accountability
5. **Conversion**: Subscription offer on days 5-7 (when motivation peaks)

---

## 🏗️ Architecture

### Technology Stack

| Layer | Technology |
|-------|-----------|
| **Runtime** | Node.js 18+ |
| **Language** | TypeScript 5.0+ |
| **WhatsApp Client** | @whiskeysockets/baileys |
| **AI/LLM** | OpenAI API (GPT-4o-mini) |
| **Database** | PostgreSQL |
| **ORM** | Prisma 5.0 |
| **Logging** | Pino |
| **Authentication** | Baileys multi-file auth state |

### System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    WhatsApp Users                            │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│         WhatsApp Service (Baileys Web Client)               │
│  - Handles incoming messages                                │
│  - Sends proactive messages                                 │
│  - Message buffering and routing                            │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│              Bot Controller (Message Handler)                │
│  - Routes messages to appropriate service                   │
│  - Manages conversation state                               │
│  - Triggers workflows                                       │
└─────────────────────────────────────────────────────────────┘
         ↙                    ↓                    ↘
┌──────────────┐  ┌──────────────────┐  ┌──────────────────┐
│LLM Service   │  │Workout Generator │  │Database Service  │
│(GPT-4o-mini) │  │(Deterministic)   │  │(Prisma)          │
└──────────────┘  └──────────────────┘  └──────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                    PostgreSQL                               │
│  Users | FitnessContext | Workouts | Subscriptions         │
└─────────────────────────────────────────────────────────────┘
```

### Core Services

- **WhatsAppService**: Manages connection, message handling, and webhooks
- **BotController**: Routes messages and orchestrates business logic
- **LLMService**: Converts technical workout data to personality-matched text
- **WorkoutGenerator**: Deterministic engine for safe training plans
- **Database Layer**: Prisma ORM with PostgreSQL

---

## 📦 Project Structure

```
ForjaFit/
├── src/
│   ├── index.ts                 # Application bootstrap
│   ├── ai/
│   │   └── llm.service.ts       # OpenAI integration & prompt engineering
│   ├── config/
│   │   └── database.ts          # Database connection setup
│   ├── controllers/
│   │   └── bot.controller.ts    # Message routing & state management
│   ├── engine/
│   │   └── workout.generator.ts # Deterministic workout logic
│   └── services/
│       └── whatsapp.service.ts  # Baileys WhatsApp client
├── prisma/
│   └── schema.prisma            # Database schema
├── .env.example                 # Environment variables template
├── package.json                 # Dependencies & scripts
├── tsconfig.json                # TypeScript configuration
└── README.md                    # This file
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+ 
- **PostgreSQL** 12+
- **OpenAI API Key** (https://platform.openai.com/api-keys)
- **npm** or **yarn**

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/LFormagio/ForjaFit.git
   cd ForjaFit
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Configure `.env`:
   ```env
   # Database
   DATABASE_URL="postgresql://user:password@localhost:5432/forjafit"
   
   # OpenAI
   OPENAI_API_KEY="sk-your-key-here"
   
   # WhatsApp (optional - auto-generated after first login)
   BAILEYS_AUTH_PATH="baileys_auth_info"
   ```

4. **Set up database**
   ```bash
   npx prisma generate
   npx prisma migrate dev --name init
   ```

5. **Start the application**
   ```bash
   npm run dev
   ```
   
   A QR code will appear in your terminal. Scan it with your WhatsApp account to connect.

---

## 📚 Database Schema

### User Model
```typescript
- id (UUID)
- phoneNumber (unique)
- name
- status (LEAD, TRIAL, ACTIVE)
- toneOfVoice (AMIGAO, SARGENTO, MENTOR)
- createdAt, updatedAt
```

### FitnessContext Model
```typescript
- userId (FK to User)
- objective (HIPERTROFIA, EMAGRECIMENTO, MANUTENCAO)
- experience (INICIANTE, INTERMEDIARIO, AVANCADO)
- daysPerWeek (2-6)
- limitations (injuries, equipment restrictions)
- equipments (list of available equipment)
```

### Workout Model
```typescript
- userId (FK to User)
- contentJson (structured exercise data)
- isCompleted (boolean)
- feedback (user notes)
- scheduledFor (datetime)
```

---

## 🔧 Available Scripts

```bash
# Development
npm run dev          # Start with ts-node in watch mode

# Production
npm run start        # Start application

# Database
npm run db:generate  # Generate Prisma client
```

---

## 🔌 Integration Points

### WhatsApp Message Flow
1. User sends message via WhatsApp
2. Baileys client receives and routes to BotController
3. Message context retrieved from database
4. WorkoutGenerator or LLMService processes request
5. Response formatted with user's coaching tone
6. Message sent back via Baileys

### Workout Generation Flow
1. User onboards with fitness context
2. WorkoutGenerator creates deterministic plan for 7 days
3. Plan stored as JSON in Workout model
4. LLMService translates technical plan to personality-matched message
5. User receives personalized workout with daily reminders

---

## 📈 User Conversion Funnel (MVP)

| Stage | Duration | Goal | Actions |
|-------|----------|------|---------|
| **Lead** | Day 1-4 | Engagement | Daily workouts, check-ins |
| **Trial** | Day 5-14 | Conversion validation | Offer subscription on days 5-7 |
| **Active** | Day 15+ | Retention | Adaptive programming, daily coaching |

**Target**: 4 sessions in 14 days before cancellation risk period

---

## 🛣️ Roadmap

### MVP (v1) - Current
- [x] Deterministic workout generation
- [x] Three coaching personalities
- [x] WhatsApp integration via Baileys
- [x] Basic onboarding flow (numeric menu)
- [x] Daily reminder system

### v2 - AI Onboarding
- [ ] Conversational onboarding (replace numeric menu)
- [ ] Real-time form submission via WhatsApp
- [ ] Progressive profile refinement

### v3 - Monetization & Scale
- [ ] Subscription management (Stripe/Pix integration)
- [ ] Meta Cloud API migration (for production scale)
- [ ] Analytics dashboard
- [ ] Admin panel for coach adjustments

### v4+ - Advanced Features
- [ ] Video form submission (exercise execution feedback)
- [ ] Social challenges & leaderboards
- [ ] Nutrition integration
- [ ] Wearable device sync (Apple Health, Google Fit)

---

## 🔐 Security & Design Decisions

### Why Deterministic Engine?
Traditional LLMs can "hallucinate" exercise prescriptions that are unsafe. ForjaFit separates concerns:
- **Deterministic Logic**: Guarantees safe progression and proper exercise selection
- **LLM Role**: Acts as a translator to make workout data human-friendly and motivating

### Why Baileys (for MVP)?
- Fastest time-to-market
- No Meta template approval delays
- Later migration to Meta Cloud API when metrics prove viability

### Data Privacy
- User data stored in PostgreSQL under user control
- WhatsApp integration respects WhatsApp's terms of service
- No data shared with third parties (OpenAI only for LLM inference)

---

## 🚢 Deployment

### Local Development
```bash
npm run dev
```

### Production (Docker)
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY . .
RUN npm ci --only=production
RUN npm run db:generate
CMD npm run start
```

### Environment Variables for Production
- `DATABASE_URL`: PostgreSQL connection string
- `OPENAI_API_KEY`: Your OpenAI secret key
- `NODE_ENV`: Set to "production"
- `LOG_LEVEL`: Set to "info"

---

## 📖 API & Webhook Examples

### Incoming Message Handler
```typescript
// Messages from WhatsApp arrive via Baileys socket event
this.sock.ev.on('messages.upsert', async (m) => {
  const message = m.messages[0];
  await botController.handleMessage(message.from, message.body);
});
```

### Sending Messages
```typescript
// Send text message
await whatsappService.sendMessage(phoneNumber, text);

// Send scheduled reminder
scheduler.scheduleWorkout(userId, scheduledTime);
```

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 📧 Support

For support or questions:
- 📧 Email: contact@forjafit.com
- 🐛 GitHub Issues: [Report a bug](https://github.com/LFormagio/ForjaFit/issues)
- 💬 WhatsApp: [@ForjaFitCoach](https://wa.me/5511999999999)

---

## 🙏 Acknowledgments

- **Baileys** (@whiskeysockets) - WhatsApp Web client
- **OpenAI** - GPT-4o-mini for conversational AI
- **Prisma** - Type-safe database ORM
- **Pino** - Fast JSON logger

---

**Made with 💪 by the ForjaFit Team**
