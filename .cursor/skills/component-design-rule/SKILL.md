---
name: component-design-rule
description: >-
  Guides React component architecture, props API design, composition patterns,
  and accessibility. Use when creating or refactoring UI components, designing
  props interfaces, building design-system primitives, or when the user mentions
  component structure, composition, or reusable UI.
---

# Component Design Rule

## Architecture

- One component, one job. Split when a file handles both data-fetching and complex layout.
- Composition over configuration: prefer `children` and slot props over boolean prop sprawl.
- Colocate component, types, and tests; export only what consumers need.
- Presentational components receive data via props; container components own data and side effects.

## File and naming conventions

```
components/
  ui/           # primitives (Button, Input, Card)
  [feature]/    # feature-specific composites
```

- PascalCase for component files and exports: `UserAvatar.tsx` → `export function UserAvatar`.
- Name by what it renders, not how: `SearchResults` not `SearchResultsContainer`.
- Prefix boolean props with `is`, `has`, `show`, or `enable`: `isLoading`, `showIcon`.

## Props API design

```tsx
type ButtonProps = {
  variant?: "default" | "outline" | "ghost" | "destructive";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  children: React.ReactNode;
} & React.ComponentPropsWithoutRef<"button">;
```

Rules:

- Extend native element props (`ComponentPropsWithoutRef<"button">`) so `aria-*`, `type`, and `onClick` pass through.
- Use union types for variants; avoid free-form strings.
- Default optional props in destructuring, not in the type body.
- Forward refs on interactive primitives via `forwardRef`.
- Spread `...props` onto the root DOM element after explicit props.

## Composition patterns

### Children (default)

```tsx
<Card>
  <CardHeader title="Settings" />
  <CardBody>{children}</CardBody>
</Card>
```

### Compound components (related parts share context)

```tsx
<Tabs defaultValue="general">
  <Tabs.List>
    <Tabs.Trigger value="general">General</Tabs.Trigger>
  </Tabs.List>
  <Tabs.Content value="general">...</Tabs.Content>
</Tabs>
```

Use compound components when sub-parts are always used together and share state.

### Render props / slots (caller controls a sub-region)

```tsx
<DataTable
  renderRow={(row) => <CustomRow key={row.id} data={row} />}
/>
```

## State ownership

| State type | Owner |
|------------|-------|
| URL-addressable (filters, tabs, pagination) | URL / router |
| Form field values | Form library or local state |
| Ephemeral UI (open/closed, hover) | Nearest common ancestor |
| Server data | Data-fetching layer; pass down as props |

Lift state only as high as needed. Do not prop-drill more than 2 levels — use context or composition.

## Accessibility (required)

- Use semantic HTML: `<button>` for actions, `<a href>` for navigation, `<nav>`, `<main>`, `<section>`.
- Every interactive control needs an accessible name (`aria-label`, visible label, or `aria-labelledby`).
- Manage focus for modals, dialogs, and menus (trap focus, restore on close).
- Support keyboard: Enter/Space for buttons, Escape to dismiss overlays.
- Announce dynamic updates with `aria-live` when content changes without navigation.

## Component template

```tsx
import { forwardRef } from "react";
import { cn } from "@/lib/utils";

type BadgeProps = React.ComponentPropsWithoutRef<"span"> & {
  variant?: "default" | "success" | "warning";
};

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = "default", children, ...props }, ref) => (
    <span
      ref={ref}
      className={cn("inline-flex items-center rounded-full px-2 py-0.5 text-xs", className)}
      {...props}
    >
      {children}
    </span>
  )
);
Badge.displayName = "Badge";
```

## Anti-patterns

- Boolean prop explosion: `showIcon`, `showLabel`, `showBadge` → use composition or a `slots` object.
- `useEffect` for derived state — compute during render instead.
- Index as `key` in dynamic lists with reordering or deletion.
- Leaking implementation details in prop names (`reduxDispatch`, `queryClient`).
- God components over 200 lines — extract subcomponents or hooks.

## Checklist

- [ ] Extends native element props and forwards ref (for primitives)
- [ ] Accessible name and keyboard support on interactive elements
- [ ] Variants typed as unions with sensible defaults
- [ ] `className` accepted and merged on styled components
- [ ] State owned at the correct level
- [ ] No unnecessary `useEffect`
