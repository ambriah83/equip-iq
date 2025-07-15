# EquipIQ - Equipment Management System

A comprehensive web application for managing equipment, locations, users, and maintenance operations with role-based permissions and real-time collaboration features.

## 🤖 For AI Assistants & Developers

**Important**: Before working on this project, please read:
- 📋 [PROJECT_CONTEXT.md](./PROJECT_CONTEXT.md) - Complete project context and current status
- 📊 [PROGRESS.md](./PROGRESS.md) - What's done and what's pending
- 💬 [PROMPTS.md](./PROMPTS.md) - Tested prompts that work with Lovable.dev
- 🔧 [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) - Common issues and solutions

## 📝 Copy & Messaging

All copy follows our conversion-focused guidelines designed to SHIP FAST and convert users!

- **Copy Guidelines:** [`/docs/COPY-GUIDE.md`](./docs/COPY-GUIDE.md) - READ THIS FIRST!
- **All Copy Strings:** [`/src/copy/en.json`](./src/copy/en.json) - Import don't hardcode!

### For Developers:
```tsx
// ❌ DON'T hardcode strings
<button>Submit</button>

// ✅ DO import from copy file
import copy from '@/copy/en.json';
<button>{copy.chat.buttons.sendMessage}</button>
```

### Copy Checklist:
- [ ] No Lorem Ipsum
- [ ] All copy from en.json
- [ ] Mobile-friendly (test at 375px)
- [ ] Error messages are helpful

## 🚀 Features

- **Equipment Management**: Track equipment status, warranties, maintenance schedules, and locations
- **Location & Room Management**: Organize equipment by facilities, buildings, and rooms
- **User Management**: Role-based access control with customizable permissions
- **Vendor Management**: Track vendor information and service relationships
- **Work Orders**: Ticket system for maintenance and repairs
- **AI Assistant**: Intelligent troubleshooting and guidance
- **Permission System**: Granular permissions for safety-critical operations
- **Real-time Updates**: Live data synchronization across users
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **File Management**: Upload and manage equipment documentation and images

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui (Radix UI primitives)
- **Icons**: Lucide React
- **Charts**: Recharts
- **Routing**: React Router DOM
- **Forms**: React Hook Form with Zod validation
- **Date Handling**: date-fns

### Backend & Database
- **Backend as a Service**: Supabase
- **Database**: PostgreSQL (via Supabase)
- **Authentication**: Supabase Auth
- **File Storage**: Supabase Storage
- **Real-time**: Supabase Realtime
- **Row Level Security**: PostgreSQL RLS policies

### State Management & Data Fetching
- **Data Fetching**: TanStack React Query
- **Local Storage**: Custom hooks for client-side persistence
- **Context API**: React Context for global state

### Development & Deployment
- **Package Manager**: npm
- **Linting**: ESLint
- **Type Checking**: TypeScript
- **Deployment Platform**: Lovable (with custom domain support)
- **Version Control**: Git with GitHub integration

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (version 16 or higher) - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)
- npm (comes with Node.js)
- A Supabase account and project

## 🚀 Getting Started

### 1. Clone the Repository

```sh
git clone https://github.com/ambriah83/equip-iq.git
cd equip-iq
```

### 2. Install Dependencies

```sh
npm install
```

### 3. Environment Setup

The application uses Supabase for backend services. The Supabase configuration is already set up in the codebase, but you may need to configure additional environment variables for production deployment.

### 4. Database Setup

The project includes Supabase migrations that will automatically set up:
- Equipment, locations, rooms, and vendor tables
- User management and role-based permissions system
- Row Level Security (RLS) policies
- Default permission data for different user roles
- Work order (ticket) system

### 5. Start Development Server

```sh
npm run dev
```

The application will be available at `http://localhost:8080`

## 🏗️ Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── ui/              # Base UI components (shadcn/ui)
│   ├── equipment/       # Equipment-specific components
│   ├── location/        # Location management components
│   ├── settings/        # Settings and admin components
│   ├── permissions/     # Permission management components
│   └── shared/          # Shared utility components
├── contexts/            # React Context providers
├── hooks/               # Custom React hooks
├── integrations/        # External service integrations
│   └── supabase/        # Supabase client and types
├── lib/                 # Utility functions
├── pages/               # Page components
└── types/               # TypeScript type definitions

docs/                    # Project documentation
├── DATABASE_SCHEMA.md   # Complete database structure
├── API_INTEGRATION.md   # API documentation
└── ...                  # Other technical docs
```

## 🔧 Available Scripts

- `npm run dev` - Start development server with hot-reloading
- `npm run build` - Build the application for production
- `npm run preview` - Preview the production build locally
- `npm run lint` - Run ESLint for code quality checks

## 🔐 User Roles & Permissions

The system includes several predefined roles with different permission levels:

- **Owner**: Full access to all features and system administration
- **Admin**: Nearly full access, can manage users and most operations
- **Manager**: Supervisory access with some restrictions on dangerous operations
- **Staff**: Standard operational access with safety restrictions
- **Vendor**: Limited access for external service providers
- **Tech**: Technical staff with equipment access

Each role has specific permissions for safety-critical operations like:
- Electrical work
- Working at height
- Chemical handling
- Heavy equipment operation
- Emergency shutdowns

## 🚀 Deployment

### Using Lovable Platform

1. Open your [Lovable Project](https://lovable.dev/projects/1bbe4a9f-b017-44d9-91ea-5a7ba7705cdc)
2. Click on "Share" → "Publish"
3. Your app will be deployed to a Lovable subdomain

### Custom Domain

To connect a custom domain:
1. Navigate to Project > Settings > Domains in Lovable
2. Click "Connect Domain"
3. Follow the setup instructions

*Note: A paid Lovable plan is required for custom domains.*

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 Development Notes

- The application uses TypeScript for type safety
- All components follow the shadcn/ui design system
- Database operations use Supabase's Row Level Security for data protection
- Real-time features are implemented using Supabase's real-time subscriptions
- The codebase includes comprehensive error handling and loading states
- Built with Lovable.dev - no coding experience required!

## 🔗 Useful Links

- [Lovable Documentation](https://docs.lovable.dev/)
- [Supabase Documentation](https://supabase.com/docs)
- [shadcn/ui Components](https://ui.shadcn.com/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [React Query Documentation](https://tanstack.com/query/latest)

## 📄 License

This project is developed using the Lovable platform. See the Lovable terms of service for usage rights and restrictions.

---

**Project URL**: https://lovable.dev/projects/1bbe4a9f-b017-44d9-91ea-5a7ba7705cdc
**GitHub Repository**: https://github.com/ambriah83/equip-iq
