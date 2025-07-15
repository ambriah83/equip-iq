# ChatGPT EquipIQ Prototype

This is a properly structured version of the EquipIQ prototype using ChatGPT (OpenAI) with all components separated into individual files following React best practices.

## Setup Instructions

### 1. API Key Configuration

The ChatGPT integration uses your OpenAI API key from the `.env` file. Make sure you have:

```env
VITE_OPENAI_API_KEY=your_openai_api_key_here
```

The prototype is already configured to read from this environment variable.

### 2. Run the Prototype

There are two ways to run this prototype:

#### Option A: Run Standalone
```bash
cd src/gemini-prototype
npm install
npm run dev
```

#### Option B: Update Main Project
Update your main `src/App.tsx` to import from the gemini-prototype:
```typescript
import App from './gemini-prototype/App';
export default App;
```

## File Structure

```
src/gemini-prototype/
├── contexts/
│   ├── AuthContext.tsx     # Authentication context and useAuth hook
│   └── ThemeContext.tsx    # Theme management (light/dark mode)
├── lib/
│   ├── icons.tsx           # All SVG icon components
│   └── data.ts             # Mock data and types
├── components/
│   ├── layout/
│   │   ├── AppLayout.tsx   # Main app layout wrapper
│   │   └── Sidebar.tsx     # Navigation sidebar
│   ├── pages/
│   │   ├── Landing.tsx     # Landing page
│   │   ├── Auth.tsx        # Sign in/up page
│   │   ├── Dashboard.tsx   # Main dashboard
│   │   ├── Equipment.tsx   # Equipment list
│   │   ├── Locations.tsx   # Locations list
│   │   ├── Tickets.tsx     # Tickets table
│   │   ├── AIChat.tsx      # AI chat interface (Gemini API)
│   │   └── Settings.tsx    # Settings page
│   └── shared/
│       ├── StatusBadge.tsx # Status indicator component
│       └── SkeletonLoader.tsx # Loading skeleton
├── App.tsx                 # Main app component with routing
├── main.tsx                # Entry point
├── index.css               # Tailwind CSS imports
└── index.html              # HTML template
```

## Key Fixes Applied

1. **Proper Module Structure**: Each component is in its own file with proper imports/exports
2. **Context Providers**: Auth and Theme contexts are properly separated
3. **Type Safety**: Added TypeScript interfaces where needed
4. **Icon Props**: Fixed icon components to have default className values
5. **API Key Configuration**: Clear location for adding Gemini API key
6. **Entry Point**: Proper ReactDOM.render setup in main.tsx

## Features

- ✅ Authentication flow (mock)
- ✅ Dark/Light theme toggle
- ✅ Dashboard with stats
- ✅ Equipment management
- ✅ Location tracking
- ✅ Ticket system
- ✅ AI Chat with ChatGPT (OpenAI) integration
- ✅ Responsive design

## Notes

- This is a prototype with mock data
- The ChatGPT API integration uses your OpenAI API key from the .env file
- All data is hardcoded and doesn't persist between sessions
- Uses GPT-4o-mini model for the best balance of performance and cost