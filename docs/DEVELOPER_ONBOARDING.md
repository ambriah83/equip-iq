# Developer Onboarding Guide

**Welcome to EquipIQ!** This guide will get you up and running quickly.

## 🎯 Week 1 Goal
Build a working AI chat interface that says **"I can help with tanning equipment issues"**

## 🔑 Required Access

### 1. **Supabase Database**
- URL: `https://supabase.com`
- Project: EquipIQ (Ambria will provide access)
- **Status**: ✅ Already configured with 22/26 tables

### 2. **GitHub Repository** 
- Repo: `https://github.com/ambriah83/equip-iq`
- **Status**: ✅ You should have access to this already

### 3. **OpenAI API**
- Platform: `https://platform.openai.com`
- **Action Required**: Get API key from Ambria

### 4. **Stripe Account** 
- **Status**: ✅ Already configured
- **Note**: For billing integration in Week 3

### 5. **Limble CMMS API**
- **Action Required**: Get API credentials from Ambria
- **Data Available**: 20,055 work orders, 1,168 assets, 940 parts from Glo Tanning

## 🛠️ Development Setup

### Local Environment
```bash
# Clone the repository
git clone https://github.com/ambriah83/equip-iq.git
cd equip-iq

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Add your API keys to .env.local

# Start development server
npm run dev
```

### Required Environment Variables
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_key
OPENAI_API_KEY=your_openai_key
LIMBLE_API_KEY=your_limble_key
STRIPE_SECRET_KEY=your_stripe_key
```

## 📚 Essential Reading

**READ THESE FIRST** (in order):
1. [`PROJECT_CONTEXT.md`](../PROJECT_CONTEXT.md) - Full project overview
2. [`docs/TECHNICAL_ARCHITECTURE.md`](./TECHNICAL_ARCHITECTURE.md) - Tech stack details
3. [`docs/DATABASE_SCHEMA.md`](./DATABASE_SCHEMA.md) - Database structure
4. [`PROGRESS.md`](../PROGRESS.md) - Current status
5. [`docs/GLO_EQUIPMENT_REFERENCE.md`](./GLO_EQUIPMENT_REFERENCE.md) - Equipment types for AI training

## 🎯 Week 1 Tasks (Your Focus)

### Day 1-2: Setup & Basic Chat
- [ ] Complete environment setup above
- [ ] Verify you can run the app locally
- [ ] Test basic authentication (login/signup works)
- [ ] Build simple AI chat interface (UI only)

### Day 3-4: Connect OpenAI
- [ ] Integrate OpenAI API with chat interface
- [ ] Test basic responses (no equipment knowledge yet)
- [ ] Create simple system prompt for tanning equipment

### Day 5: Demo Ready
- [ ] Chat responds with basic tanning equipment help
- [ ] Deploy to staging environment
- [ ] Demo working for Ambria

## 📋 Reference Documentation

### API References
- **Supabase**: [`docs/API_INTEGRATION.md`](./API_INTEGRATION.md)
- **OpenAI**: `https://platform.openai.com/docs`
- **Limble**: [`docs/LIMBLE_INTEGRATION.md`](./LIMBLE_INTEGRATION.md)
- **VAPI** (future): `https://vapi.ai/docs`

### Equipment Knowledge
- **Glo Equipment**: [`docs/GLO_EQUIPMENT_REFERENCE.md`](./GLO_EQUIPMENT_REFERENCE.md)
- **AI Training**: [`docs/AI_TRAINING_PATTERNS.md`](./AI_TRAINING_PATTERNS.md)

## 🚨 What NOT to Build

**Limble already handles these** - don't duplicate:
- ❌ Equipment database management
- ❌ User management system  
- ❌ Work order system
- ❌ Location hierarchy management

**EquipIQ focus** - only build:
- ✅ AI chat interface
- ✅ Integration layer with Limble
- ✅ Auto-ticket creation from chat
- ✅ Equipment-aware AI responses

## 💬 Daily Standups

**Every day at 9 AM** (15 minutes max):
1. What did you work on yesterday?
2. What will you work on today?
3. Any blockers or questions?
4. Demo something working (even if small)

## 🆘 Need Help?

### Stuck on Code?
- Check [`TROUBLESHOOTING.md`](../TROUBLESHOOTING.md)
- Use proven prompts from [`PROMPTS.md`](../PROMPTS.md)
- Slack/email Ambria with specific error messages

### Stuck on Business Logic?
- Review [`docs/UX_DESIGN_PHILOSOPHY.md`](./UX_DESIGN_PHILOSOPHY.md)
- Ask Ambria about Glo Tanning workflows
- Check existing Limble work order patterns

### Emergency Contacts
- **Ambria**: ambriahatcher@gmail.com
- **GitHub Issues**: Create issue in repository
- **Lovable Project**: https://lovable.dev/projects/1bbe4a9f-b017-44d9-91ea-5a7ba7705cdc

## 🏆 Success Metrics

**Week 1**: Chat interface responds to "Norvell bed not working" with generic troubleshooting
**Week 2**: Chat recognizes Glo equipment and gives specific advice
**Week 3**: Production-ready app with billing
**Week 4**: Live paying customer (Glo Tanning)
**Week 5**: Scale to multiple Glo locations

---

**Welcome to the team! Let's build something amazing! 🚀**
