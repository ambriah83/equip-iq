
# Operations Hub Documentation

Welcome to the comprehensive documentation for **Operations Hub** - an AI-powered multi-location equipment management and support system.

## 📚 Documentation Structure

### **Getting Started**
- [Project Overview](./PROJECT_OVERVIEW.md) - Vision, goals, and key features
- [Development Guidelines](./DEVELOPMENT_GUIDELINES.md) - Code standards and best practices

### **Features & Implementation**
- [Features Implemented](./FEATURES_IMPLEMENTED.md) - Complete feature breakdown
- [UX & Design Philosophy](./UX_DESIGN_PHILOSOPHY.md) - Design principles and implementation

### **Technical Documentation**
- [Technical Architecture](./TECHNICAL_ARCHITECTURE.md) - System design and patterns
- [Database Schema](./DATABASE_SCHEMA.md) - Complete database documentation
- [API Integration](./API_INTEGRATION.md) - Supabase integration patterns

### **Deployment & Operations**
- [Deployment Guide](./DEPLOYMENT_GUIDE.md) - Production deployment instructions

## 🎯 Quick Reference

### **Core Technologies**
- **Frontend**: React 18 + TypeScript + Vite + Tailwind CSS
- **Backend**: Supabase (PostgreSQL + Edge Functions + Auth)
- **State Management**: React Query + Custom Hooks
- **UI Components**: Shadcn UI + Lucide React Icons

### **Key Features**
- ✅ **AI-Powered Assistant** with multi-modal support (text, image, video, voice)
- ✅ **Equipment Management** with warranty tracking and service history
- ✅ **Multi-Location Support** with room-level organization
- ✅ **Role-Based Access Control** with granular permissions
- ✅ **Vendor Management** with communication tools
- ✅ **CSV Import System** with intelligent column mapping
- ✅ **Real-Time Dashboard** with operational metrics

### **User Roles**
- **Owner**: Full system access with analytics and financial oversight
- **Admin**: Administrative privileges and user management
- **Manager**: Location management and operational control
- **Staff**: Basic operations and equipment interaction
- **Vendor**: Limited access to assigned equipment and services

## 🏗️ Project Structure

```
src/
├── components/          # React components
│   ├── shared/         # Reusable components
│   ├── equipment/      # Equipment management
│   ├── location/       # Location management
│   ├── vendor/         # Vendor management
│   └── ui/             # Base UI components
├── hooks/              # Custom React hooks
├── pages/              # Route components
├── types/              # TypeScript definitions
├── integrations/       # External services
└── lib/                # Utility functions

docs/                   # This documentation
supabase/              # Database migrations & functions
```

## 🚀 Development Workflow

### **Getting Started**
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Type checking
npm run type-check

# Build for production
npm run build
```

### **Code Quality**
- **TypeScript**: Full type safety with strict mode
- **ESLint**: Code quality and consistency
- **Prettier**: Automatic code formatting
- **Atomic Design**: Component organization pattern

### **Database Development**
- **Supabase**: Managed PostgreSQL with real-time features
- **Type Generation**: Automatic TypeScript types from schema
- **Row Level Security**: Database-level access control
- **Edge Functions**: Server-side logic and AI processing

## 🎨 Design System

### **Visual Design**
- **Primary Colors**: Blue (#3B82F6), Teal (#14B8A6)
- **AI Features**: Purple (#8B5CF6) accent
- **Typography**: Inter font family, 500 weight headings
- **Spacing**: 20px outer padding, 16px gutters
- **Borders**: 1px light gray with 6px corner radius

### **UX Principles**
- **Powerful Simplicity**: Complex operations made intuitive
- **AI-First Interactions**: Natural language over forms
- **Role-Based Experience**: Tailored interfaces per user type
- **Mobile-First Design**: Responsive across all devices

## 📊 System Capabilities

### **Equipment Management**
- Track 127+ pieces of equipment across multiple locations
- Warranty management with automated expiry alerts
- Service history with cost tracking and parts inventory
- Photo documentation for equipment and room layouts
- TMAX integration for specialized tanning equipment

### **AI Assistant**
- Natural language troubleshooting and support
- Image analysis for equipment diagnosis
- Video support for real-time guidance
- Voice input capabilities (UI implemented)
- Feedback loop for continuous improvement

### **Multi-Location Operations**
- Franchise hierarchy with location codes
- Room-level equipment assignment
- Manager assignments and contact management
- Bulk import with intelligent data mapping

### **Access Control**
- 5 user roles with distinct permissions
- 8 escalation permissions for safety operations
- Location-based access control
- Custom permission overrides per user

## 🔧 Customization & Extensions

### **Adding New Features**
1. Create feature-specific components in `src/components/[feature]/`
2. Implement data hooks in `src/hooks/`
3. Add database tables/migrations in `supabase/`
4. Update TypeScript types
5. Add to navigation based on user roles

### **Extending Permissions**
1. Add new enum values to `escalation_permission`
2. Update permission matrix in settings
3. Implement checks in component logic
4. Test across all user roles

### **Custom Fields**
- Equipment types and specifications
- Location metadata and contact info
- User profile extensions
- Vendor specialization categories

## 📈 Performance & Monitoring

### **Optimization**
- Code splitting with lazy loading
- React Query caching and optimistic updates
- Database indexing for common queries
- CDN optimization for static assets

### **Monitoring**
- Real-time error tracking
- Performance metrics (Web Vitals)
- Database query monitoring
- User analytics and feedback loops

## 🔐 Security

### **Authentication & Authorization**
- Supabase Auth with JWT tokens
- Row Level Security (RLS) policies
- Role-based access control
- Location-specific permissions

### **Data Protection**
- Input validation and sanitization
- SQL injection prevention
- XSS protection
- Secure API endpoints

## 📞 Support & Maintenance

### **Regular Maintenance**
- Database cleanup and optimization
- Security updates and patches
- Performance monitoring and tuning
- User feedback integration

### **Troubleshooting**
- Check browser console for client-side errors
- Monitor Supabase logs for database issues
- Review Edge Function logs for AI processing
- Validate user permissions and access levels

---

For specific implementation details, refer to the individual documentation files. This system successfully demonstrates the "Powerful Simplicity" philosophy by making complex multi-location equipment management feel effortless through AI-first interactions and carefully crafted user experiences.
