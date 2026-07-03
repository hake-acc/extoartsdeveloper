---
name: Hero cycle React pattern
description: Hero phrase cycling must use React state/useEffect in the component, not DOM setInterval in ClientScripts.
---

# Hero cycle phrase — React pattern

## Rule
Hero cycling must live inside `HeroSection` as a `<CycleStack>` client component using `useState` + `useEffect`. Never use `document.querySelectorAll('.cycle-stack')` + `setInterval` in `ClientScripts.tsx`.

## Why
- DOM-based setInterval has no cleanup: it keeps running after route changes and fails to initialize on client-side navigation to `/`.
- React state approach clears the interval in the `useEffect` cleanup function, scoped exactly to the component's mount/unmount lifecycle.

## How to apply
```tsx
// In HeroSection (or any component that owns the cycle UI):
useEffect(() => {
  const id = setInterval(() => {
    setActiveIndex(prev => (prev + 1) % phrases.length)
  }, 2600)
  return () => clearInterval(id) // cleanup on unmount
}, [])
```
Pair with `aria-live="polite"` on the wrapper and `aria-hidden` on inactive phrases.
