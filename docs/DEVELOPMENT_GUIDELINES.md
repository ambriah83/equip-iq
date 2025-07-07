
# Development Guidelines

## 🚨 CRITICAL: Line Ending Configuration

To prevent conflicts between Windows, WSL, Lovable, and other development tools:

1. **`.gitattributes` is configured** - Enforces LF line endings for all text files
2. **If you see all files as modified** (line ending issue), fix with:
   ```bash
   git add --renormalize .
   git reset
   ```
3. **For Claude Code users**: Always start from the project directory:
   ```cmd
   cd C:\Users\ambri\OneDrive\Documents\GitHub\equip-iq
   claude
   ```

## Code Architecture Principles

### **Component Structure (Atomic Design)**
```
src/components/
├── ui/                 # Atoms (base components)
├── shared/             # Molecules (reusable combinations)  
├── [feature]/          # Organisms (feature-specific)
└── pages/              # Templates (full pages)
```

### **Component Creation Rules**
- **One Component Per File**: Each component in its own file
- **Small & Focused**: Components should be ≤ 50 lines when possible
- **Single Responsibility**: Each component has one clear purpose
- **Composition Over Inheritance**: Use composition patterns

### **File Naming Conventions**
```
PascalCase.tsx         # React components
camelCase.ts           # Hooks, utilities, types
kebab-case.css         # Stylesheets (rare with Tailwind)
UPPER_CASE.md          # Documentation files
```

## TypeScript Guidelines

### **Type Safety Requirements**
- **Strict Mode**: All TypeScript strict flags enabled
- **No Any Types**: Avoid `any`, use proper types or `unknown`
- **Interface First**: Prefer interfaces over types for object shapes
- **Generic Constraints**: Use constraints for reusable generics

### **Type Organization**
```typescript
// Component Props
interface ComponentProps {
  required: string;
  optional?: number;
  children?: React.ReactNode;
}

// API Response Types
interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

// Database Types (auto-generated)
import { Database } from '@/integrations/supabase/types';
type Equipment = Database['public']['Tables']['equipment']['Row'];
```

### **Supabase Type Integration**
```typescript
// Use generated types from Supabase
import { Database } from '@/integrations/supabase/types';

// Create derived types for components
type EquipmentInsert = Database['public']['Tables']['equipment']['Insert'];
type EquipmentUpdate = Database['public']['Tables']['equipment']['Update'];

// Transform for frontend use
export interface Equipment extends Omit<DatabaseEquipment, 'status'> {
  status: 'active' | 'maintenance' | 'inactive';
}
```

## React Patterns

### **Custom Hooks Pattern**
```typescript
// Data Management Hook
export const useEquipment = () => {
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEquipment = useCallback(async () => {
    // Implementation
  }, []);

  return {
    equipment,
    loading, 
    error,
    refetch: fetchEquipment,
    // CRUD operations
  };
};
```

### **Component Composition**
```typescript
// Compound Components Pattern
const DataTable = ({ children, ...props }) => {
  return <div className="data-table" {...props}>{children}</div>;
};

DataTable.Header = ({ children }) => (
  <div className="data-table-header">{children}</div>
);

DataTable.Body = ({ children }) => (
  <div className="data-table-body">{children}</div>
);

// Usage
<DataTable>
  <DataTable.Header>Column Headers</DataTable.Header>
  <DataTable.Body>Table Content</DataTable.Body>  
</DataTable>
```

### **Error Boundary Pattern**
```typescript
// Wrap components that might fail
<ErrorBoundary fallback={<ErrorFallback />}>
  <EquipmentManagement />
</ErrorBoundary>
```

## State Management Guidelines

### **State Hierarchy**
1. **Server State**: React Query for API data
2. **Global State**: Context API for user/app state  
3. **Local State**: useState/useReducer for component state
4. **URL State**: React Router for navigation state

### **React Query Patterns**
```typescript
// Query Hook Pattern
export const useEquipmentQuery = () => {
  return useQuery({
    queryKey: ['equipment'],
    queryFn: fetchEquipment,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Mutation Hook Pattern  
export const useCreateEquipment = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: createEquipment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['equipment'] });
    },
  });
};
```

### **Context Usage Rules**
- **Focused Contexts**: Single responsibility per context
- **Provider Optimization**: Memoize context values
- **Selective Consumption**: Use context selectively

## Styling Guidelines

### **Tailwind CSS Best Practices**
```typescript
// Prefer utility classes
<div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm">

// Extract repeated patterns to components
const Card = ({ children, className = "" }) => (
  <div className={`bg-white rounded-lg shadow-sm p-6 ${className}`}>
    {children}
  </div>
);

// Use CSS variables for dynamic values
<div style={{ '--progress': `${percentage}%` }} 
     className="w-full bg-gray-200 rounded-full h-2">
  <div className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
       style={{ width: 'var(--progress)' }} />
</div>
```

### **Responsive Design Pattern**
```typescript
// Mobile-first approach
<div className="
  flex flex-col           // Mobile: stack vertically
  md:flex-row            // Tablet: side by side  
  lg:items-center        // Desktop: center align
  gap-4                  // Consistent spacing
">
```

### **Design System Usage**
```typescript
// Use design tokens consistently
const Button = ({ variant = 'primary', size = 'default', ...props }) => {
  const variants = {
    primary: 'bg-primary text-primary-foreground hover:bg-primary/90',
    secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
  };
  
  const sizes = {
    default: 'h-10 px-4 py-2',
    sm: 'h-9 px-3',
    lg: 'h-11 px-8',
  };
  
  return (
    <button 
      className={`${variants[variant]} ${sizes[size]} rounded-md font-medium`}
      {...props}
    />
  );
};
```

## Database Integration

### **Supabase Query Patterns**
```typescript
// Simple Query
const { data, error } = await supabase
  .from('equipment')
  .select('*')
  .eq('location_id', locationId);

// Complex Query with Joins
const { data, error } = await supabase
  .from('equipment')
  .select(`
    *,
    location:locations(*),
    room:rooms(*),
    equipment_type:equipment_types(*)
  `)
  .eq('status', 'active');

// Real-time Subscription
useEffect(() => {
  const subscription = supabase
    .channel('equipment-changes')
    .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'equipment' },
        handleEquipmentChange
    )
    .subscribe();

  return () => subscription.unsubscribe();
}, []);
```

### **Error Handling Pattern**
```typescript
const handleDatabaseOperation = async () => {
  try {
    setLoading(true);
    const { data, error } = await supabase
      .from('equipment')
      .insert(equipmentData);
    
    if (error) throw error;
    
    // Success handling
    toast.success('Equipment created successfully');
    return data;
  } catch (error) {
    console.error('Database error:', error);
    toast.error(error.message || 'An error occurred');
    throw error;
  } finally {
    setLoading(false);
  }
};
```

## Performance Guidelines

### **Optimization Strategies**
```typescript
// Lazy Loading
const EquipmentManagement = lazy(() => import('./EquipmentManagement'));

// Memoization
const MemoizedComponent = memo(({ data }) => {
  const processedData = useMemo(() => 
    processExpensiveData(data), [data]
  );
  
  return <div>{processedData}</div>;
});

// Debounced Search
const useSearch = (query) => {
  const [debouncedQuery] = useDebounce(query, 300);
  
  return useQuery({
    queryKey: ['search', debouncedQuery],
    queryFn: () => searchAPI(debouncedQuery),
    enabled: debouncedQuery.length > 2,
  });
};
```

### **Bundle Optimization**
- **Code Splitting**: Route-based lazy loading
- **Tree Shaking**: Import only what's needed
- **Image Optimization**: WebP with fallbacks
- **Bundle Analysis**: Regular bundle size monitoring

## Testing Guidelines

### **Testing Hierarchy**
1. **Unit Tests**: Individual functions and hooks
2. **Component Tests**: Component behavior and rendering
3. **Integration Tests**: Feature workflows
4. **E2E Tests**: Complete user journeys

### **Testing Patterns**
```typescript
// Hook Testing
import { renderHook, waitFor } from '@testing-library/react';

test('useEquipment fetches data correctly', async () => {
  const { result } = renderHook(() => useEquipment());
  
  await waitFor(() => {
    expect(result.current.loading).toBe(false);
  });
  
  expect(result.current.equipment).toHaveLength(3);
});

// Component Testing
import { render, screen, fireEvent } from '@testing-library/react';

test('EquipmentCard displays equipment data', () => {
  render(<EquipmentCard equipment={mockEquipment} />);
  
  expect(screen.getByText(mockEquipment.name)).toBeInTheDocument();
  expect(screen.getByText(mockEquipment.status)).toBeInTheDocument();
});
```

## Code Quality Standards

### **ESLint Configuration**
```json
{
  "extends": [
    "@typescript-eslint/recommended",
    "plugin:react-hooks/recommended"
  ],
  "rules": {
    "@typescript-eslint/no-unused-vars": "error",
    "@typescript-eslint/no-explicit-any": "error",
    "react-hooks/exhaustive-deps": "error"
  }
}
```

### **Git Workflow**
- **Branch Naming**: `feature/equipment-management`, `fix/warranty-bug`
- **Commit Messages**: Conventional commits format
- **Pull Requests**: Require review and tests passing
- **Pre-commit Hooks**: Lint, format, and type check

### **Documentation Requirements**
- **Component Props**: JSDoc comments for all props
- **Complex Logic**: Inline comments explaining algorithms  
- **API Integration**: Document endpoint usage and error handling
- **Hooks**: Document parameters, return values, and side effects

This development approach ensures maintainable, scalable, and high-quality code that follows React and TypeScript best practices while integrating seamlessly with the Supabase backend.
