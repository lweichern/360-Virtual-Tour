# ImmersiveSpace — Development Conversation Summary

## Project Overview

ImmersiveSpace is a **360 virtual tour company website** built with Next.js 16, React 19, Tailwind CSS v4, Framer Motion 12, and Three.js (React Three Fiber). The site showcases the company's virtual tour services for real estate.

---

## Features Built (Chronological)

### 1. Initial Website Setup

- Next.js project with pages: Home, About, Services, Portfolio, Pricing, FAQ, Contact, Viewer
- Dark theme with glass-card UI, gradient text, glow effects
- Responsive layout with navigation, footer, and section components

### 2. 360 Panorama Viewer

- Built with Pannellum 2.5.6
- Hotspot placement system (drag-and-drop hotspots onto panoramas)
- Multi-scene tour navigation
- Share functionality via URL hash encoding

### 3. 3D Floor Plan Model (Homepage)

**File:** `src/components/3d/FloatingHouse.tsx`

- Started as a wireframe condo floor plan
- **Rotate & Zoom**: Replaced mouse parallax with OrbitControls (autoRotate, scroll zoom, clamped angles)
- **Realistic Furniture**: Rewrote from wireframe to solid materials with 16+ detailed furniture components (Sofa, CoffeeTable, TVUnit, DiningTable, Chair, KitchenCounter, DoubleBed, SingleBed, Nightstand, Wardrobe, Desk, DeskChair, Toilet, Bathtub, Vanity, ShowerStall)
- Room layout: 5x4 units, 7 rooms (Living, Kitchen, Master Bed, Bed 2, Hall, Bathroom, Master Bath)
- Lighting: ambientLight + two directionalLights
- FloatingParticles decoration

### 4. Subtle 3D Hero Background

**Files:** `src/components/3d/HeroBackground.tsx`, `src/components/sections/home/HeroSection.tsx`

- Originally the 3D model was placed in its own section — user said it looked out of place
- Researched Stripe, Vercel, Linear for inspiration on subtle 3D backgrounds
- Created a **wireframe ghost-style** variant using `<Edges>` on transparent meshes
- Positioned as absolute background behind hero text at `opacity-40` with z-index layering
- Mouse parallax (pointer influence) + slow auto-rotation via `useFrame`
- Floating indigo particles
- Gradient fade at bottom blends into next section
- **Bug fix**: 3D model disappeared on hard refresh — caused by:
  - drei's `<Text>` component loading fonts async from CDN (removed `GhostLabel` entirely)
  - Conditional rendering destroying/recreating WebGL context (changed to always-render with CSS `opacity` transition)

### 5. 3D Showcase Page — Cinematic Room Transitions

**Files:**
- `src/components/3d/ShowcaseScene.tsx` — Full 3D experience
- `src/components/sections/showcase/ShowcaseViewer.tsx` — UI overlay wrapper
- `src/components/sections/showcase/ShowcaseHero.tsx` — Page hero
- `src/app/showcase/page.tsx` — Page with metadata

**Camera state machine** with three modes:
- `overview` — Dollhouse top-down view, OrbitControls with auto-rotate
- `transitioning` — Camera animating between positions via waypoint-based lerp
- `room` — Inside a room, OrbitControls with pan/zoom/full rotation

**4 navigable rooms:** Living Room, Kitchen, Master Bedroom, Bathroom

**Key features:**
- Invisible click planes above each room floor for room selection
- Waypoint-based camera transitions (arcs above walls to avoid clipping)
- Room interiors with ceiling planes and point lights
- UI overlay: room name display, "Back to Overview" button, bottom room selector bar, transition progress bar
- OrbitControls configured differently per mode (overview vs room)
- Handoff between programmatic camera and OrbitControls after transitions complete

**Nav link** for Showcase was added to `constants.ts` but later commented out by user.

### 6. Smooth Scrolling (Lenis)

**Files:**
- `src/components/providers/SmoothScroll.tsx` — Lenis smooth scroll provider (client component)
- `src/app/layout.tsx` — Wraps Navbar + main + Footer with `<SmoothScroll>`
- `src/app/globals.css` — Removed native `scroll-behavior: smooth`

**What was done:**
- Created a `SmoothScroll` client component using the Lenis library (already installed as dependency)
- Lenis config: `duration: 1.2`, exponential easing, `touchMultiplier: 2`
- Wraps the entire page content (Navbar, main, Footer) so scrolling is seamless site-wide
- Removed native CSS `scroll-behavior: smooth` and `scroll-smooth` class from `<html>` to avoid conflicts — Lenis replaces both
- Uses `requestAnimationFrame` loop for butter-smooth 60fps scrolling

### 7. Shared Tour Read-Only Mode (Viewer)

**File:** `src/app/viewer/page.tsx`

**What was done:**
- Added `isSharedTour` state — set to `true` when the tour is loaded from a `#tour=` hash URL
- When in shared mode, the following editing features are hidden:
  - "Info Point" and "Scene Link" control buttons (and their divider)
  - "+ Add Scene" button and file input
  - Delete buttons on scene rows
  - Delete buttons on hotspot list items (via `readOnly` prop on `HotspotListItem`)
  - The hotspot placement banner and pending hotspot form never appear (since `addMode` stays `null`)
- Viewers can still: navigate scenes, look around, zoom, auto-rotate, fullscreen, view hotspot info, and share

### 8. Viewer Mobile Layout Cleanup

**File:** `src/app/viewer/page.tsx`

**What was done:**
- Header bar: added `flex-wrap` + `gap-3` so scene info and action buttons wrap to two rows on narrow screens instead of cramming on one line
- Share / Close Tour buttons: text labels hidden on mobile (`hidden sm:inline`), icon-only on small screens; padding reduced from `px-4 py-2` to `px-3 py-1.5`
- Control buttons (ControlButton component): padding reduced on mobile (`px-3 py-2` → `sm:px-4 sm:py-2.5`), gap tightened (`gap-2 sm:gap-3`)
- Result: cleaner, less cluttered viewer controls on mobile viewports

### 9. Hotspot SVG Icons (Viewer)

**File:** `src/app/globals.css`

**What was done:**
- Replaced text-character hotspot icons with clean Lucide-style SVG data URIs
- **Info hotspot** (`pnlm-info::after`): Changed from `content: "ℹ"` text to an SVG "i" icon (vertical line + dot) — matches Lucide `Info` inner paths, white stroke on teal circle
- **Scene link hotspot** (`pnlm-scene::after`): Changed from `content: "⬆"` text to an SVG navigation pointer (Lucide `Navigation` / `Send` style polygon), white filled on blue circle
- Both use `drop-shadow` filter for subtle depth instead of `text-shadow`
- SVGs are embedded as `data:image/svg+xml` URIs in CSS `background` — no extra files or network requests

### 10. Fix Lenis Scroll Hijacking Panorama Zoom

**Files:** `src/components/shared/PanoramaViewer.tsx`

**Problem:** Lenis smooth scrolling intercepted wheel events inside the Pannellum viewer, causing the page to scroll simultaneously when the user tried to zoom in/out on the panorama.

**Fix:** Added `data-lenis-prevent` attribute to the PanoramaViewer wrapper `<div>`. This is Lenis's built-in mechanism to exclude specific elements from smooth scroll handling — wheel events inside the panorama now go only to Pannellum for zoom control.

### 11. Fix Mobile Hamburger Menu Not Showing

**File:** `src/components/layout/Navbar.tsx`

**Problem:** The hamburger menu button was not visible on the pricing page (and potentially other pages) on mobile viewports.

**Fix (two changes):**
1. **Moved `backdrop-blur-lg`** from the mobile menu overlay's base classes to only apply when open. The backdrop blur was always present (even at `opacity-0`), creating a GPU compositing layer that could interfere with painting of the hamburger button above it.
2. **Changed button color** from `text-foreground` to `text-white` and added `relative` for explicit stacking context, ensuring maximum contrast and proper layer ordering.

### 12. Fix Fullscreen Button Not Working on Mobile (Viewer)

**File:** `src/components/shared/PanoramaViewer.tsx`

**Problem:** The fullscreen button in the viewer worked on desktop but not on phone devices. Pannellum's native `toggleFullscreen()` uses the standard Fullscreen API (`Element.requestFullscreen()`), which iOS Safari does not support for non-video elements.

**Fix:** Replaced Pannellum's `toggleFullscreen()` with a custom implementation:
1. **Uses `document.fullscreenEnabled`** (+ `webkitFullscreenEnabled`) to check if native API actually works — iOS Safari has `requestFullscreen` on the prototype but it doesn't work for non-video elements, so checking `.fullscreenEnabled` is the reliable detection
2. **Falls back to CSS-based "faux fullscreen"** on iOS Safari — sets the wrapper to `position: fixed; inset: 0; z-index: 9999; background: #000; width: 100vw; height: 100vh`
3. **Exit mechanisms:** Close button (Minimize icon, top-right corner), Escape key listener, tapping fullscreen button again
4. **Dispatches `resize` event** on faux fullscreen toggle so Pannellum recalculates container dimensions
5. If native API is supported but rejects, `.catch()` falls back to CSS fullscreen

### 13. Other Changes

- Removed "Bringing Properties to Life" / InteractiveModel section from homepage
- Replaced Matterport iframe in hero with 3D model (later replaced with subtle background approach)

---

## Key Technical Decisions

| Decision | Reasoning |
|---|---|
| `meshBasicMaterial` for hero background | No lights needed, simpler rendering, better for subtle ghost effect |
| `meshStandardMaterial` for FloatingHouse | Realistic look with proper lighting and shadows |
| Removed drei `<Text>` from hero background | Async font loading from CDN caused Canvas crashes on refresh |
| Always-render Canvas with CSS opacity | Conditional rendering (`{mounted && ...}`) destroyed WebGL context on state changes |
| Waypoint-based camera transitions | Prevents camera clipping through walls during room-to-room moves |
| OrbitControls disabled during transitions | Avoids conflict between programmatic camera animation and user controls |
| Dynamic imports with `ssr: false` | R3F Canvas cannot render server-side in Next.js |
| Lenis for smooth scrolling | Butter-smooth 60fps scrolling via rAF; replaces native `scroll-behavior: smooth` which is janky |

---

## Project Structure (Key Files)

```
src/
├── app/
│   ├── page.tsx                          # Homepage
│   ├── showcase/page.tsx                 # 3D Showcase page
│   └── viewer/page.tsx                   # 360 Panorama viewer
├── components/
│   ├── 3d/
│   │   ├── FloatingHouse.tsx             # Solid 3D floor plan (OrbitControls)
│   │   ├── HeroBackground.tsx            # Wireframe ghost background (parallax)
│   │   └── ShowcaseScene.tsx             # Showcase camera transitions
│   ├── providers/
│   │   └── SmoothScroll.tsx              # Lenis smooth scroll wrapper
│   ├── sections/
│   │   ├── home/
│   │   │   ├── HeroSection.tsx           # Hero with 3D background
│   │   │   ├── StatsBar.tsx
│   │   │   ├── FeaturedTours.tsx
│   │   │   ├── WhyChooseUs.tsx
│   │   │   ├── Testimonials.tsx
│   │   │   └── CTABanner.tsx
│   │   └── showcase/
│   │       ├── ShowcaseHero.tsx
│   │       └── ShowcaseViewer.tsx         # UI overlay + dynamic import
│   └── ui/
│       ├── GlowEffect.tsx
│       └── ...
├── lib/
│   └── constants.ts                      # NAV_LINKS, site config
└── ...
```

---

## Tech Stack

- **Framework:** Next.js 16.1.6 (Turbopack)
- **UI:** React 19, Tailwind CSS v4, Framer Motion 12
- **3D:** React Three Fiber v9, @react-three/drei, Three.js 0.183
- **360 Viewer:** Pannellum 2.5.6
- **Language:** TypeScript

---

## User Preferences Noted

- Prefers subtle, non-distracting 3D elements (background, not foreground)
- Wants realistic furniture in the full floor plan model
- Commented out Showcase nav link (may re-enable later)
- Focuses on clean, professional real estate presentation
