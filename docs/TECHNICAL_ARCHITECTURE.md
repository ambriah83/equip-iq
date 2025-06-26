
# Technical Architecture

## System Overview
Operations Hub follows a modern web application architecture with a React frontend, Supabase backend, and AI-powered features for equipment management and support.

## Frontend Architecture

### Core Technologies
- **React 18**: Latest React with concurrent features
- **TypeScript**: Full type safety throughout the application
- **Vite**: Fast development and optimized builds
- **Tailwind CSS**: Utility-first styling approach
- **Shadcn UI**: Consistent component library

### State Management Strategy
- **React Query**: Server state management with caching
- **Custom Hooks**: Encapsulated business logic
- **Context API**: Global state for user permissions and settings
- **Local State**: Component-level state with useState/useReducer

### Component Architecture
```
src/components/
├── shared/              # Reusable components
├── equipment/           # Equipment-specific components
├── location/            # Location management components
├── vendor/             # Vendor management components
├── settings/           # Settings and configuration
├── permissions/        # Permission management
├── room/               # Room management
└── ui/                 # Base UI components (Shadcn)
```

### Custom Hooks Pattern
- **Data Hooks**: `useEquipment`, `useLocations`, `useVendors`
- **UI Hooks**: `useViewToggle`, `useDataFiltering`
- **Permission Hooks**: `usePermissions`
- **Utility Hooks**: `useLocalStorage`, `useMobile`

## Backend Architecture

### Supabase Integration
- **PostgreSQL Database**: Relational data with JSONB support
- **Row Level Security (RLS)**: Data access control
- **Real-time Subscriptions**: Live data updates
- **Edge Functions**: Server-side logic and AI processing
- **Authentication**: Built-in user management

### Database Schema
```sql
-- Core Tables
├── locations           # Franchise locations
├── rooms              # Location rooms
├── equipment          # Equipment tracking
├── equipment_types    # Equipment categorization
├── equipment_logs     # Service history
├── vendors            # Vendor management
├── knowledge_base     # Documentation storage
└── user_permissions   # Access control
```

### Data Relationships
- **Hierarchical Structure**: Location → Room → Equipment
- **Many-to-Many**: Users ↔ Locations (access control)
- **One-to-Many**: Equipment → Logs (service history)
- **Foreign Keys**: Enforced referential integrity

## Security Architecture

### Authentication & Authorization
- **Supabase Auth**: JWT-based authentication
- **Role-Based Access Control**: 5 distinct user roles
- **Row Level Security**: Database-level access control
- **Permission Matrix**: Granular permission system

### User Roles & Permissions
```typescript
enum UserRole {
  OWNER = 'owner',
  ADMIN = 'admin', 
  MANAGER = 'manager',
  STAFF = 'staff',
  VENDOR = 'vendor'
}

enum EscalationPermission {
  CAN_USE_LADDER = 'can_use_ladder',
  CAN_HANDLE_ELECTRICAL = 'can_handle_electrical',
  CAN_DISASSEMBLE_PARTS = 'can_disassemble_parts',
  CAN_WORK_AT_HEIGHT = 'can_work_at_height',
  CAN_HANDLE_CHEMICALS = 'can_handle_chemicals',
  CAN_OPERATE_HEAVY_EQUIPMENT = 'can_operate_heavy_equipment',
  CAN_ACCESS_RESTRICTED_AREAS = 'can_access_restricted_areas',
  CAN_PERFORM_EMERGENCY_SHUTDOWNS = 'can_perform_emergency_shutdowns'
}
```

### Data Security
- **Input Validation**: Client and server-side validation
- **SQL Injection Prevention**: Parameterized queries
- **XSS Protection**: Input sanitization
- **CSRF Protection**: Built-in Supabase protection

## AI Integration Architecture

### Multi-modal Processing
- **Text Processing**: Natural language understanding
- **Image Analysis**: Equipment photo analysis
- **Video Processing**: Real-time troubleshooting
- **Voice Input**: Speech-to-text conversion

### AI Workflow
1. **Input Processing**: Multi-modal input handling
2. **Context Building**: Equipment and location context
3. **AI Processing**: External AI service integration
4. **Response Generation**: Structured response formatting
5. **Feedback Loop**: Success rate tracking

## Performance Architecture

### Frontend Optimization
- **Code Splitting**: Route-based lazy loading
- **Image Optimization**: WebP format with fallbacks
- **Bundle Optimization**: Tree shaking and minification
- **Caching Strategy**: Browser and service worker caching

### Backend Performance
- **Database Indexing**: Optimized query performance
- **Connection Pooling**: Efficient database connections
- **Caching Layer**: Redis-like caching with Supabase
- **CDN Integration**: Static asset optimization

### Real-time Features
- **WebSocket Connections**: Real-time data updates
- **Subscription Management**: Efficient event handling
- **Optimistic Updates**: Immediate UI feedback
- **Conflict Resolution**: Concurrent update handling

## Deployment Architecture

### Build Process
- **Vite Build**: Optimized production builds
- **Type Checking**: Pre-build TypeScript validation
- **Linting**: ESLint and Prettier formatting
- **Testing**: Unit and integration tests

### Hosting Strategy
- **Static Hosting**: Optimized for CDN delivery
- **Environment Configuration**: Multi-environment support
- **CI/CD Pipeline**: Automated deployment process
- **Monitoring**: Error tracking and performance monitoring

## Scalability Considerations

### Database Scaling
- **Read Replicas**: Query load distribution
- **Partitioning**: Large table optimization
- **Indexing Strategy**: Query performance optimization
- **Archive Strategy**: Historical data management

### Application Scaling
- **Horizontal Scaling**: Multi-instance deployment
- **Load Balancing**: Traffic distribution
- **Caching Strategy**: Multi-layer caching
- **Resource Optimization**: Memory and CPU efficiency

## Development Workflow

### Code Organization
- **Atomic Design**: Component hierarchy
- **Separation of Concerns**: Clean architecture principles
- **Type Safety**: Full TypeScript coverage
- **Error Boundaries**: Graceful error handling

### Quality Assurance
- **TypeScript**: Compile-time error prevention
- **ESLint Rules**: Code quality enforcement
- **Prettier**: Consistent code formatting
- **Git Hooks**: Pre-commit validation

### Testing Strategy
- **Unit Tests**: Component and hook testing
- **Integration Tests**: Feature workflow testing
- **E2E Tests**: Full user journey testing
- **Performance Tests**: Load and stress testing
