# AGENTS.md — ExtoArts Coding Agent Instructions

## Performance Optimization

Whenever you are asked to optimize frontend performance, improve load times, improve Core Web Vitals, reduce bundle size, fix rendering slowness, or address any other performance-related concern, you **must**:

1. **Read `.replit/skills/performance-optimization.md` in full before doing anything.**
2. **Execute the skill's workflow exactly — no shortcuts:**

   ```
   1. MEASURE  → Establish a baseline with real data (Lighthouse / DevTools / web-vitals)
   2. IDENTIFY → Pinpoint the actual bottleneck; never assume
   3. FIX      → Address only the confirmed bottleneck
   4. VERIFY   → Measure again and confirm the improvement with numbers
   5. GUARD    → Add monitoring or CI checks to prevent regression
   ```

3. **Never skip verification.** Every change must be bracketed by before/after measurements. If you cannot produce a before number, do not make the change.

4. **Never optimize without profiling data.** Premature optimization adds complexity that costs more than the performance it gains.

5. **Complete the post-change checklist** from the skill before closing the task:
   - [ ] Before and after measurements exist (specific numbers)
   - [ ] The specific bottleneck is identified and addressed
   - [ ] Core Web Vitals are within "Good" thresholds (LCP ≤ 2.5s, INP ≤ 200ms, CLS ≤ 0.1)
   - [ ] Bundle size has not increased significantly
   - [ ] No N+1 queries introduced in new data-fetching code
   - [ ] Existing tests still pass

## Skill Location

The full skill (workflow, checklists, anti-patterns, red flags) lives at:

```
.agents/skills/performance-optimization/SKILL.md
```

> Note: `.replit` is a reserved Replit config file; the skill was installed under `.agents/skills/` — the established path for user-provided skills in this project.

This skill was sourced from [Addy Osmani's agent-skills repository](https://github.com/addyosmani/agent-skills) and installed into this project for consistent, measurement-driven performance work.
