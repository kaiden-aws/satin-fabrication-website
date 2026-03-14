/**
 * JSON-LD Structured Data for Google Rich Results
 */

import type {
  WithContext,
  HomeAndConstructionBusiness,
  Service,
  FAQPage,
  BreadcrumbList,
} from 'schema-dts'
import { SITE_CONFIG } from './metadata'
import { SERVICES, SERVICES_EXPANDED } from './constants'

export function generateLocalBusinessJsonLd(): WithContext<HomeAndConstructionBusiness> {
  return {
    '@context': 'https://schema.org',
    '@type': 'HomeAndConstructionBusiness',
    name: SITE_CONFIG.name,
    description: SITE_CONFIG.description,
    url: SITE_CONFIG.url,
    telephone: SITE_CONFIG.phone,
    email: SITE_CONFIG.email,
    image: `${SITE_CONFIG.url}/logo.webp`,
    priceRange: '$$',
    address: {
      '@type': 'PostalAddress',
      streetAddress: SITE_CONFIG.address.street,
      addressLocality: SITE_CONFIG.address.city,
      addressRegion: SITE_CONFIG.address.province,
      postalCode: SITE_CONFIG.address.postalCode,
      addressCountry: SITE_CONFIG.address.country,
    },
    geo: {
      '@type': 'GeoCoordinates' as const,
      latitude: 43.836,
      longitude: -80.534,
    },
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification' as const,
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      opens: '08:00',
      closes: '17:00',
    },
    areaServed: {
      '@type': 'AdministrativeArea',
      name: 'Southern Ontario',
    },
    makesOffer: SERVICES.map((service) => ({
      '@type': 'Offer' as const,
      itemOffered: {
        '@type': 'Service' as const,
        name: service.title,
        description: service.description,
      },
    })),
  }
}

export function generateServicePageJsonLd(): WithContext<Service>[] {
  return SERVICES_EXPANDED.map((service) => ({
    '@context': 'https://schema.org' as const,
    '@type': 'Service' as const,
    name: service.title,
    description: service.description,
    provider: {
      '@type': 'HomeAndConstructionBusiness' as const,
      name: SITE_CONFIG.name,
      url: SITE_CONFIG.url,
    },
    areaServed: {
      '@type': 'AdministrativeArea' as const,
      name: 'Southern Ontario',
    },
  }))
}

export function generateFAQJsonLd(): WithContext<FAQPage> {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'What types of metal do you work with?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'We work with mild steel, structural steel, and stainless steel. We\u2019ll recommend the right material for your project based on use, environment, and budget.',
        },
      },
      {
        '@type': 'Question',
        name: 'Do I need detailed plans before starting a project?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'No. Our design-build service takes you from a rough idea or napkin sketch through to a finished product. We handle design, material selection, and fabrication.',
        },
      },
      {
        '@type': 'Question',
        name: 'What areas do you serve?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'We serve Southern Ontario from our shop in Arthur, ON. We handle residential, commercial, and agricultural projects across the region.',
        },
      },
      {
        '@type': 'Question',
        name: 'Can you repair or modify existing metalwork?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes. We do structural repairs, reinforcement, equipment modifications, weld repairs, and patching \u2014 either on-site or in our shop.',
        },
      },
      {
        '@type': 'Question',
        name: 'How does your fabrication process work?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Our process has five steps: consultation to understand your needs, design to confirm specs, material selection, fabrication in our shop, and delivery or installation.',
        },
      },
    ],
  }
}

export function generateBreadcrumbJsonLd(
  items: { name: string; url: string }[]
): WithContext<BreadcrumbList> {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem' as const,
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }
}
