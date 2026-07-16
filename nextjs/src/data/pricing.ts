export const COST_TIERS = [
  {
    name: 'Basic Editing',
    range: '$20 - $80',
    who: 'Freelancer (Low-tier)',
    includes: 'Simple cuts, basic transitions, minimal color. Suitable for low-budget or beginner channels.',
    warning: true,
    featured: false,
  },
  {
    name: 'Mid-Tier Specialist',
    range: '$100 - $350',
    who: 'Experienced Freelancer / ExtoArts',
    includes: 'Retention-focused editing, motion graphics, professional color grading, thumbnail design.',
    warning: false,
    featured: true,
  },
  {
    name: 'Premium Agency',
    range: '$400 - $1,200+',
    who: 'Large Agency',
    includes: 'Full-service production, multiple rounds, dedicated account management, licensed music.',
    warning: false,
    featured: false,
  },
]

export const RETAINER_PACKAGES = [
  {
    name: 'Starter',
    price: 'Custom',
    period: '/month',
    desc: 'For new creators getting consistent professional quality from the start.',
    features: ['4 videos per month', 'Standard turnaround (3-5 days)', '3 revision rounds per video', 'Thumbnail design included', 'Discord priority support'],
    featured: false,
    cta: 'Get a Quote',
  },
  {
    name: 'Creator',
    price: 'Custom',
    period: '/month',
    desc: 'For active YouTubers who upload weekly and need reliable, fast delivery.',
    features: ['8-12 videos per month', 'Priority queue (2-3 days)', 'Unlimited revisions', 'Thumbnails included', 'Short-form repurposing included', 'Dedicated editor assigned'],
    featured: true,
    cta: 'Most Popular',
  },
  {
    name: 'Agency',
    price: 'Custom',
    period: '/month',
    desc: 'For content businesses, brands, and multi-channel networks.',
    features: ['Unlimited projects', 'Rush delivery available', 'Multiple editor team', 'Full production pipeline', 'White-label available', 'Monthly strategy call'],
    featured: false,
    cta: 'Get a Quote',
  },
]

