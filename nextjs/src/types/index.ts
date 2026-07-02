export interface PortfolioItem {
  id: number
  title: string
  project_type: 'image' | 'video'
  thumbnail_url: string
  video_url: string
  ratio: string
}

export interface PortfolioCategory {
  id: number
  slug: string
  name: string
  thumb: string
  meta: string
  items: PortfolioItem[]
}

export interface Review {
  img: string
  init: string
  grad: string
  name: string
  reviewCount: number
  date: string
  type: string
  text: string
}

export interface NavItem {
  label: string
  href: string
}

export interface SocialLink {
  platform: string
  href: string
  label: string
}

export interface BreadcrumbItem {
  name: string
  url: string
}

export interface PageMeta {
  title: string
  description: string
  ogTitle?: string
  ogDescription?: string
  breadcrumbs?: BreadcrumbItem[]
}

export interface FAQItem {
  question: string
  answer: string
}

export interface ServiceCard {
  icon: string
  label: string
  title: string
  description: string
  href: string
  featured?: boolean
}

export interface PricingTier {
  name: string
  price: string
  period?: string
  description: string
  features: string[]
  featured?: boolean
  cta: string
}

export type Theme = 'dark' | 'light'

export interface SupportTicket {
  name: string
  email: string
  subject: string
  message: string
  order_id?: string
}
