/**
 * JSON-LD Structured Data for Google Rich Results
 *
 * DEPLOYMENT GATE: The NAP (Name, Address, Phone) details in this file are
 * PLACEHOLDERS. Do NOT deploy to production with fake business details.
 * See: .planning/STATE.md blocker [Pre-Phase 5]
 *
 * Rendering is gated on NEXT_PUBLIC_ENABLE_JSONLD=true environment variable.
 */

import type {
  WithContext,
  HomeAndConstructionBusiness,
  Service,
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
    telephone: '+1-555-123-4567', // PLACEHOLDER -- replace with confirmed NAP from owner
    address: {
      '@type': 'PostalAddress',
      streetAddress: '123 Main Street', // PLACEHOLDER
      addressLocality: 'Hamilton', // PLACEHOLDER
      addressRegion: 'ON', // PLACEHOLDER
      postalCode: 'L8P 1A1', // PLACEHOLDER
      addressCountry: 'CA',
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
