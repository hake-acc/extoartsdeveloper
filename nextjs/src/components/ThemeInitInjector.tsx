'use client'

// Injects the theme-init <script> during SSR via useServerInsertedHTML so it
// is emitted into the HTML stream but is NEVER in React's virtual DOM during
// client reconciliation — eliminating the React 19 "Encountered a script tag"
// console warning that fires when a <script> appears in a component tree.
//
// The script must run synchronously before first paint so the theme class
// (data-theme="light") is applied before any CSS is evaluated, preventing FOUC.

import { useServerInsertedHTML } from 'next/navigation'

const THEME_INIT = `(function(){try{var t=localStorage.getItem('ea-theme');if(t==='light'||(!t&&window.matchMedia('(prefers-color-scheme:light)').matches))document.documentElement.setAttribute('data-theme','light');}catch(e){}document.documentElement.classList.replace('no-js','js');})();`

export function ThemeInitInjector() {
  useServerInsertedHTML(() => (
    <script dangerouslySetInnerHTML={{ __html: THEME_INIT }} />
  ))
  return null
}
