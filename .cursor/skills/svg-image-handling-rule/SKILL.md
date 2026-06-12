---
name: svg-image-handling-rule
description: >-
  Covers SVG icons, raster images, optimization, and accessibility for web UI.
  Use when adding icons, logos, illustrations, img tags, Next.js Image, inline
  SVG, sprite sheets, or when the user mentions SVG, image assets, alt text,
  or icon components.
---

# SVG / Image Handling Rule

## Decision guide

| Asset type | Use when | Approach |
|------------|----------|----------|
| UI icon (mono, small, styleable) | Buttons, nav, status indicators | Inline SVG component or icon library |
| Logo / brand mark | Header, footer | SVG component with fixed aspect ratio |
| Photo / complex raster | Content images, avatars | `<img>` or framework image component |
| Decorative flourish | Purely visual, no meaning | `aria-hidden="true"` or CSS background |

## Inline SVG components

Default pattern for icons in React:

```tsx
type IconProps = React.SVGProps<SVGSVGElement>;

export function ChevronIcon({ className, ...props }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      aria-hidden="true"
      className={cn("size-4 shrink-0", className)}
      {...props}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
    </svg>
  );
}
```

Rules:

- Always set `viewBox`; never rely on hardcoded `width`/`height` alone.
- Size with Tailwind (`size-4`, `h-5 w-5`); color with `currentColor` + `text-*` on parent or SVG.
- Set `aria-hidden="true"` when decorative; add `role="img"` + `aria-label` when standalone meaningful icon.
- Pass through `...props` so callers can set `className`, `aria-*`, and event handlers.
- Use `shrink-0` to prevent flex layouts from squashing icons.

## Meaningful vs decorative

```tsx
// Decorative — adjacent text provides the label
<button>
  <TrashIcon aria-hidden="true" />
  Delete
</button>

// Standalone — icon IS the label
<button aria-label="Delete item">
  <TrashIcon aria-hidden="true" />
</button>

// Informative image
<img src={user.avatarUrl} alt={`${user.name}'s profile photo`} />
```

- Never use `alt=""` on meaningful images.
- Avoid redundant alt text: if caption exists, `alt` can be empty for the image itself.

## Raster images

### Standard `<img>`

```tsx
<img
  src="/images/hero.webp"
  alt="Dashboard showing analytics overview"
  width={1200}
  height={630}
  loading="lazy"
  decoding="async"
  className="h-auto w-full rounded-lg object-cover"
/>
```

Always provide `width` and `height` (or aspect-ratio utility) to prevent layout shift.

### Next.js `Image`

```tsx
import Image from "next/image";

<Image
  src="/images/hero.webp"
  alt="Dashboard showing analytics overview"
  width={1200}
  height={630}
  sizes="(max-width: 768px) 100vw, 50vw"
  className="rounded-lg object-cover"
  priority={isAboveFold}
/>
```

- Use `priority` only for above-the-fold LCP images.
- Set `sizes` whenever using `fill` or responsive layouts.

## Optimization

- Prefer SVG for icons and simple illustrations; WebP/AVIF for photos.
- Run SVGs through SVGO before committing; remove editor metadata and unused attributes.
- Do not embed large base64 images in source files.
- Store assets in `public/` (static) or import from `assets/` (bundled) — be consistent per project.

## Background images

Use CSS/Tailwind backgrounds only for purely decorative patterns:

```tsx
<div className="bg-[url('/patterns/grid.svg')] bg-repeat" aria-hidden="true" />
```

Never convey essential information solely through a background image.

## Sprite sheets

Avoid manual sprite sheets in modern React projects. Prefer individual SVG components or a tree-shakeable icon library (lucide-react, heroicons). If sprites are required, reference with `<use href="#icon-name" />` inside a single hidden SVG defs block.

## Common mistakes

| Mistake | Fix |
|---------|-----|
| Missing `viewBox` on SVG | Add `viewBox="0 0 W H"` from source art |
| Hardcoded fill color on icons | Use `currentColor` + `text-*` classes |
| Giant inline SVG in JSX | Extract to component file or optimize with SVGO |
| `alt="image"` or `alt="icon"` | Write descriptive alt text |
| Icon button without label | Add `aria-label` or visible text |
| No dimensions on images | Set width/height or `aspect-ratio` |

## Checklist

- [ ] Correct decorative vs meaningful treatment (`aria-hidden` / `alt` / `aria-label`)
- [ ] SVG has `viewBox`, sized via classes, uses `currentColor` for mono icons
- [ ] Raster images have explicit dimensions and appropriate `loading` strategy
- [ ] File format matches content (SVG for icons, WebP/AVIF for photos)
- [ ] No unnecessarily large or unoptimized assets committed
