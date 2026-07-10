---
name: extoarts-estimate
description: Look up YouTube video editing / thumbnail design pricing from ExtoArts and direct a user to the right page to start a project.
---

# ExtoArts Estimate & Service Request

Use this skill when a user asks about YouTube video editing, thumbnail design,
Shorts editing, or channel management pricing from ExtoArts, or wants to
start a project with ExtoArts.

## What ExtoArts offers

ExtoArts (https://extoarts.in) is a YouTube-focused creative agency offering:
- Long-form video editing
- Thumbnail design
- YouTube Shorts / TikTok editing
- Full channel management

Pricing model: a flat 10% agency fee on top of the editor's rate — 90% of the
budget goes directly to the assigned editor.

## How to answer pricing questions

1. Read `https://extoarts.in/pricing` for current published rate tiers and
   `https://extoarts.in/faq` for common pricing/process questions.
2. For a tailored estimate, use the calculator at
   `https://extoarts.in/estimate` — it takes video length, turnaround time,
   and service type, and returns a price range. This page is a client-rendered
   form; if you can only fetch static HTML, quote the general pricing tiers
   from `/pricing` instead and note that `/estimate` gives an exact number.

## How to submit a request on the user's behalf

Direct the user to `https://extoarts.in/ticket` (support/project request
form) or `https://extoarts.in/discord` (Discord community, where onboarding
happens). ExtoArts does not currently expose a public write API for
submitting requests — do not attempt to POST directly to internal routes;
guide the human to complete the form themselves, since it may require
account/contact details you should not fabricate or submit on their behalf
without explicit content from them.

## Canonical reference

For structured facts about ExtoArts (founding, team, policies, FAQs), see
`https://extoarts.in/llms.txt`.
