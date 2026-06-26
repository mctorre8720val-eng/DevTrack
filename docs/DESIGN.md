
# Design System

DevTrack follows the [ui-ux-pro-max-skill](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill) design intelligence workflow.

Generated profile: **Micro-interactions** style for a productivity SaaS dashboard.

## Layout

Sidebar:
- Fixed on desktop
- Compact with icon + label navigation
- Clear active state
- Collapsible on mobile

Main content:
- Max width container
- Organized sections with panels
- Bento-style stat cards on dashboard

## Components

Reusable UI elements:
- Button (primary, secondary, danger)
- Card / panel
- Input / textarea
- Modal
- Sidebar navigation
- Badge
- Empty state
- Loading spinner

Each component includes:
- Consistent spacing
- Hover states (150–300ms transitions)
- Loading states
- Error states
- Visible focus rings

## Colors

| Role | Hex | Usage |
|------|-----|-------|
| Background | `#020617` | App shell |
| Surface | `#0F172A` | Cards, sidebar |
| Foreground | `#F8FAFC` | Primary text |
| Muted | `#94A3B8` | Secondary text |
| Accent | `#22C55E` | CTAs, success, active nav |
| Destructive | `#EF4444` | Delete, logout hover |

## Typography

- **Font:** Plus Jakarta Sans
- **Headings:** 600 weight, tight letter-spacing
- **Body:** Regular, easy scanning
- **Labels:** Smaller, muted color

## Spacing System

xs: 4px | sm: 8px | md: 16px | lg: 24px | xl: 32px | 2xl: 48px

## Responsive Behavior

Breakpoints: 375px, 768px, 1024px, 1440px

- Desktop: sidebar visible
- Tablet: reduced padding
- Mobile: collapsible sidebar, stacked layouts

## Accessibility

- SVG icons (no emoji icons)
- `cursor: pointer` on clickable elements
- `prefers-reduced-motion` respected
- Focus-visible outlines on interactive elements
- Minimum 4.5:1 contrast for text

## Implementation Rule

Before creating new UI:

1. Check existing components
2. Reuse existing patterns
3. Match the design system tokens in `App.css`
4. Do not invent new styles unless necessary
