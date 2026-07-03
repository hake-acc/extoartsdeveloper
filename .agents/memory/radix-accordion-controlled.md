---
name: Radix accordion controlled state
description: Radix single-accordion with per-item local useState causes open/icon desync; lift state to Root.
---

# Radix Accordion — single source of truth

## Rule
When using `@radix-ui/react-accordion` with `type="single"`, never use per-item `useState(open)` for icon rotation or border styling. Lift the open value to Root via `value` + `onValueChange` and pass `isOpen={openValue === itemValue}` as a prop down to each item.

## Why
Each item's local state is independent from Radix's single-selection logic, causing visual desync (prior item stays "open" visually when a new one opens).

## How to apply
```tsx
const [openValue, setOpenValue] = useState('')
<Root type="single" collapsible value={openValue} onValueChange={setOpenValue}>
  {items.map((item, i) => (
    <Item value={`item-${i}`} isOpen={openValue === `item-${i}`} />
  ))}
</Root>
```
