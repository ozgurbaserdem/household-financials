# components/

This directory contains reusable React components organized by scope and functionality. Components here are designed to be shared across multiple features and pages.

## Overview

Components are organized into three main categories:

- **ui/**: Low-level, reusable UI primitives and building blocks
- **shared/**: Application-specific shared components
- **WizardClient.tsx**: Top-level wizard wrapper component

## Architecture

### Component Hierarchy

```
components/
├── ui/                    # Primitive UI components (design system)
├── shared/                # Application-specific shared components
└── WizardClient.tsx       # Feature wrapper components
```

### Design System Philosophy

The UI components follow atomic design principles:

- **Atoms**: Basic building blocks (Button, Input, Text)
- **Molecules**: Simple combinations (Form fields, Cards)
- **Organisms**: Complex UI sections (Navigation, Layouts)

## ui/ - Design System Components

Low-level, highly reusable components that form the foundation of the design system.

### Layout Components

- **box.tsx**: Flexible container with spacing utilities
- **main.tsx**: Main content area wrapper
- **section.tsx**: Semantic content sections
- **card.tsx**: Content cards with consistent styling
- **modern-card.tsx**: Enhanced card variant with advanced styling

### Form Components

- **input.tsx**: Text input with validation styling
- **button.tsx**: Button component with variants and states
- **label.tsx**: Form labels with accessibility features
- **checkbox.tsx**: Checkbox with custom styling
- **radio-group.tsx**: Radio button group component
- **select.tsx**: Dropdown selection component
- **switch.tsx**: Toggle switch component
- **form.tsx**: Form wrapper with React Hook Form integration

### Navigation & Flow

- **tabs.tsx**: Tab interface for content switching
- **progress.tsx**: Progress bar for multi-step flows
- **step-indicator.tsx**: Visual step progression indicator
- **step-description.tsx**: Step description text component

### Feedback & Interaction

- **dialog.tsx**: Modal dialog with backdrop and focus management
- **tooltip.tsx**: Contextual help tooltips
- **validation-message.tsx**: Form validation error display
- **accordion.tsx**: Collapsible content sections

### Typography & Content

- **text.tsx**: Typography component with semantic variants
- **animated-number.tsx**: Smooth number transitions
- **animated-scramble.tsx**: Text animation effects

### Special Purpose

- **calculator-card.tsx**: Specialized card for calculator layouts
- **BudgetKollen.logo.tsx**: Application logo component
- **x-icon.tsx**: Close/dismiss icon component

## shared/ - Application Components

Application-specific components that are shared across features but contain business logic.

### Navigation

- **Navbar.tsx**: Main application navigation bar
- **LanguageSwitcher.tsx**: Language selection component
- **Logo.tsx**: Application logo with branding

### Utilities

- **ThemeSwitcher.tsx**: Dark/light mode toggle
- **ExportImportButtons.tsx**: Data export/import functionality
- **providers.tsx**: Context providers setup

## Component Design Principles

### Accessibility First

- All components follow WCAG 2.1 AA guidelines
- Semantic HTML structure
- Proper ARIA labels and roles
- Keyboard navigation support
- Screen reader optimization

### TypeScript Integration

- Strict typing for all props and refs
- Generic components where appropriate
- Comprehensive prop interfaces with JSDoc
- Runtime type validation where needed

### Styling Approach

- Tailwind CSS for all styling
- Responsive design patterns (mobile-first)
- Dark mode support via CSS custom properties
- Consistent spacing scale and typography
- Component variants through className composition

### API Design

- Predictable prop naming conventions
- Sensible defaults for optional props
- Composable components that work together
- Forward refs for DOM access when needed

## Usage Patterns

### Basic Component Usage

```typescript
import { Button, Input, Box } from '@/components/ui';

<Box className="space-y-4">
  <Input placeholder="Enter amount" />
  <Button variant="primary">Calculate</Button>
</Box>
```

### Form Integration

```typescript
import { Form, Input, Button } from '@/components/ui';
import { useForm } from 'react-hook-form';

const MyForm = () => {
  const form = useForm();
  return (
    <Form {...form}>
      <Input {...form.register('amount')} />
      <Button type="submit">Submit</Button>
    </Form>
  );
};
```

### Responsive Design

```typescript
<Box className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
  <Card>Content 1</Card>
  <Card>Content 2</Card>
  <Card>Content 3</Card>
</Box>
```

### Theme Integration

```typescript
<Text className="text-gray-900 dark:text-gray-100">
  Themed content
</Text>
```

## Component Standards

### Props Interface

```typescript
interface ComponentProps {
  /** Primary content or children */
  children?: React.ReactNode;
  /** Additional CSS classes */
  className?: string;
  /** Accessibility label */
  "aria-label"?: string;
  // ... other props with JSDoc
}
```

### Forward Refs

```typescript
const Component = React.forwardRef<HTMLDivElement, ComponentProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn('base-styles', className)} {...props}>
        {children}
      </div>
    );
  }
);
```

### Variant Patterns

```typescript
const variants = {
  primary: 'bg-blue-600 text-white',
  secondary: 'bg-gray-200 text-gray-900',
  danger: 'bg-red-600 text-white'
};

<Button variant="primary">Primary Action</Button>
```

## Testing Strategy

### Component Testing

- React Testing Library for user-centric tests
- Accessibility testing with axe-core
- Visual regression testing for UI consistency
- Interaction testing for complex components

### Test Patterns

```typescript
describe('Button', () => {
  it('should render with correct variant styling', () => {
    render(<Button variant="primary">Click me</Button>);
    expect(screen.getByRole('button')).toHaveClass('bg-blue-600');
  });

  it('should be accessible', async () => {
    const { container } = render(<Button>Click me</Button>);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
```

## Performance Considerations

### Optimization Techniques

- React.memo() for expensive render components
- Proper dependency arrays in hooks
- Efficient className composition
- Lazy loading for heavy components

### Bundle Size

- Tree-shakeable component exports
- Minimal external dependencies
- Efficient icon usage patterns
- Code splitting for feature-specific components

## Migration & Versioning

### Component Evolution

- Backwards-compatible prop changes
- Deprecation warnings for breaking changes
- Migration guides for major updates
- Semantic versioning for component library

### Design System Updates

- Centralized theme configuration
- Consistent update patterns across components
- Documentation updates with component changes
- Visual regression testing for design changes
