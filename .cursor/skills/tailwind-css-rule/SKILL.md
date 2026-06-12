---
name: tailwind-css-rule
description: >-
  Applies Tailwind CSS conventions for utility-first styling, responsive
  layouts, and class composition. Use when writing or editing Tailwind classes,
  styling React/HTML components, configuring tailwind.config, or when the user
  mentions Tailwind, utility classes, spacing, or responsive design.
---

# Tailwind CSS Rule

## Core principles

- Utility-first: prefer Tailwind utilities over custom CSS unless a pattern repeats 3+ times.
- Mobile-first: base styles apply to all breakpoints; add `sm:`, `md:`, `lg:`, `xl:` only when layout must change.
- Theme tokens over arbitrary values: use `p-4`, `text-sm`, `rounded-lg` before `p-[17px]` or `text-[13px]`.
- Semantic HTML carries meaning; Tailwind carries presentation.

## Class ordering

Group classes in this order for readability:

1. Layout (`flex`, `grid`, `block`, `absolute`)
2. Sizing (`w-`, `h-`, `min-`, `max-`)
3. Spacing (`p-`, `m-`, `gap-`)
4. Typography (`text-`, `font-`, `leading-`, `tracking-`)
5. Visual (`bg-`, `border-`, `rounded-`, `shadow-`)
6. Interactive (`hover:`, `focus:`, `active:`, `disabled:`)
7. State variants (`dark:`, `group-hover:`, `peer-focus:`)

## Conditional classes

Use a `cn()` helper (`clsx` + `tailwind-merge`) to merge conditional classes without conflicts:

```tsx
import { cn } from "@/lib/utils";

<button
  className={cn(
    "inline-flex items-center rounded-md px-4 py-2 text-sm font-medium",
    "bg-primary text-primary-foreground hover:bg-primary/90",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
    disabled && "pointer-events-none opacity-50",
    className
  )}
/>
```

Always accept and forward a `className` prop on reusable components; merge it last so callers can override.

## Responsive and state patterns

```tsx
// Mobile-first stacking, desktop side-by-side
<div className="flex flex-col gap-4 md:flex-row md:items-center">

// Dark mode via class strategy
<div className="bg-white text-gray-900 dark:bg-gray-950 dark:text-gray-50">

// Group hover for child styling
<div className="group">
  <span className="text-gray-500 group-hover:text-gray-900">Label</span>
</div>
```

## Do

- Use `gap-*` for flex/grid spacing instead of margin on children.
- Use `focus-visible:` (not bare `focus:`) for keyboard focus rings.
- Use `sr-only` for visually hidden but screen-reader-accessible text.
- Extract repeated multi-utility patterns into a component, not `@apply`.
- Use `size-*` shorthand when width and height match.

## Avoid

- Long unreadable class strings — extract a subcomponent or use `cn()` with named groups.
- `@apply` in global CSS for one-off styles; reserve for true design tokens.
- Inline `style={{}}` when an equivalent utility exists.
- Arbitrary values (`w-[347px]`) without a design-system reason.
- Nesting `dark:` inside `hover:` incorrectly — order variants outside-in: `dark:hover:bg-gray-800`.

## Accessibility-related utilities

```tsx
// Focus ring
"focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"

// Reduced motion
"motion-safe:transition-colors motion-reduce:transition-none"

// Touch targets (min 44×44px)
"min-h-11 min-w-11"
```

## Config changes

When adding theme values in `tailwind.config`:

- Extend the existing theme; avoid replacing defaults unless intentional.
- Name tokens by purpose (`primary`, `muted`, `destructive`), not color hex.
- Add corresponding CSS variables in `:root` / `.dark` when using a variable-based palette.

## Checklist

- [ ] Classes follow mobile-first breakpoint order
- [ ] No conflicting utilities (merged via `cn` / `tailwind-merge`)
- [ ] Focus states visible for interactive elements
- [ ] Dark mode considered if the project uses it
- [ ] Reusable components accept `className`
