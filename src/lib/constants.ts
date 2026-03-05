export const NAV_LINKS = [
  { label: 'WORK', href: '/#work' },
  { label: 'SERVICES', href: '/services' },
  { label: 'PROCESS', href: '/#process' },
  { label: 'CONTACT', href: '/#contact' },
] as const

export const SCROLL_THRESHOLD = 50
export const CURSOR_LERP_SPEED = 0.15

export const SERVICES = [
  {
    title: 'Railings & Staircases',
    description:
      'Elegant custom railings and staircases that elevate interiors with flowing lines and meticulous detailing.',
    image:
      'https://images.unsplash.com/photo-1600585152220-90363fe7e115?w=640&h=400&fit=crop&q=80',
  },
  {
    title: 'Gates & Fencing',
    description:
      'Striking ornamental gates and fencing that combine security with sculptural beauty at every entrance.',
    image:
      'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=640&h=400&fit=crop&q=80',
  },
  {
    title: 'Custom Furniture & Fixtures',
    description:
      'Bespoke metal furniture and fixtures — from shelving to table bases — designed to anchor any space.',
    image:
      'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=640&h=400&fit=crop&q=80',
  },
  {
    title: 'Fireplace Surrounds & Features',
    description:
      'Statement fireplace surrounds and architectural features forged to become the focal point of a room.',
    image:
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=640&h=400&fit=crop&q=80',
  },
] as const

export const SERVICES_EXPANDED = [
  {
    id: 'railings-staircases',
    title: 'Railings & Staircases',
    tagline: 'Elevate every level of your home',
    description:
      'Our custom railings and staircases are designed to transform your interior and exterior spaces with flowing lines and meticulous detailing. Each piece is hand-forged from premium metals, combining structural integrity with artistic expression to create a centrepiece that defines your home.',
    features: [
      'Spiral and straight configurations',
      'Glass, cable, and traditional balusters',
      'Interior and exterior applications',
      'Code-compliant engineering',
    ],
    image:
      'https://images.unsplash.com/photo-1600585152220-90363fe7e115?w=1200&h=800&fit=crop&q=80',
    imageAlt:
      'Custom metal staircase railing with glass panels in a modern home interior',
  },
  {
    id: 'gates-fencing',
    title: 'Gates & Fencing',
    tagline: 'Grand entrances that make a statement',
    description:
      'From sweeping driveway gates to intimate garden enclosures, our ornamental metalwork combines security with sculptural beauty. Every gate is designed to complement your property architecture while providing lasting protection crafted from weather-resistant materials.',
    features: [
      'Automated driveway and pedestrian gates',
      'Ornamental and privacy fencing',
      'Weather-resistant powder-coated finishes',
      'Custom hardware and locking systems',
    ],
    image:
      'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=1200&h=800&fit=crop&q=80',
    imageAlt:
      'Ornamental wrought iron entry gate with scrollwork details at a residential estate',
  },
  {
    id: 'custom-furniture-fixtures',
    title: 'Custom Furniture & Fixtures',
    tagline: 'Functional art for every room',
    description:
      'Bespoke metal furniture and fixtures -- from sculptural shelving units to hand-forged table bases -- designed to anchor any space with purpose and personality. We collaborate closely with you to create pieces that are as functional as they are beautiful, built to last generations.',
    features: [
      'Dining and console table bases',
      'Shelving and display systems',
      'Lighting fixtures and chandeliers',
      'Architectural room dividers',
    ],
    image:
      'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1200&h=800&fit=crop&q=80',
    imageAlt:
      'Bespoke metal shelving unit with industrial finish in a contemporary living space',
  },
  {
    id: 'fireplace-surrounds-features',
    title: 'Fireplace Surrounds & Features',
    tagline: 'The heart of the room, forged in metal',
    description:
      'Statement fireplace surrounds and architectural features forged to become the focal point of any room. Our surrounds range from minimalist blackened steel to elaborate ornamental designs, each one custom-sized and finished to integrate seamlessly with your interior design vision.',
    features: [
      'Full surround and mantel designs',
      'Blackened steel, brass, and bronze finishes',
      'Heat-resistant engineering',
      'Matching hearth accessories',
    ],
    image:
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&h=800&fit=crop&q=80',
    imageAlt:
      'Contemporary blackened steel fireplace surround as the focal point of a luxury living room',
  },
] as const

export const PORTFOLIO_PROJECTS = [
  {
    title: 'Modern Floating Staircase',
    category: 'Railings & Staircases',
    image:
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&h=800&fit=crop&q=80',
    width: 600,
    height: 800,
  },
  {
    title: 'Wrought Iron Garden Gate',
    category: 'Gates & Fencing',
    image:
      'https://images.unsplash.com/photo-1600573472592-401b489a3cdc?w=800&h=600&fit=crop&q=80',
    width: 800,
    height: 600,
  },
  {
    title: 'Industrial Steel Shelving',
    category: 'Custom Furniture & Fixtures',
    image:
      'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=600&h=600&fit=crop&q=80',
    width: 600,
    height: 600,
  },
  {
    title: 'Spiral Staircase Railing',
    category: 'Railings & Staircases',
    image:
      'https://images.unsplash.com/photo-1600607687644-aac4c3eac7f4?w=800&h=600&fit=crop&q=80',
    width: 800,
    height: 600,
  },
  {
    title: 'Contemporary Fireplace Surround',
    category: 'Fireplace Surrounds & Features',
    image:
      'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=600&h=800&fit=crop&q=80',
    width: 600,
    height: 800,
  },
  {
    title: 'Estate Entry Gate',
    category: 'Gates & Fencing',
    image:
      'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=600&h=600&fit=crop&q=80',
    width: 600,
    height: 600,
  },
  {
    title: 'Metal Console Table',
    category: 'Custom Furniture & Fixtures',
    image:
      'https://images.unsplash.com/photo-1616137466211-f939a420be84?w=600&h=800&fit=crop&q=80',
    width: 600,
    height: 800,
  },
  {
    title: 'Glass & Steel Balustrade',
    category: 'Railings & Staircases',
    image:
      'https://images.unsplash.com/photo-1600573472556-e636c2acda9e?w=800&h=600&fit=crop&q=80',
    width: 800,
    height: 600,
  },
  {
    title: 'Blackened Steel Fire Feature',
    category: 'Fireplace Surrounds & Features',
    image:
      'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=600&h=600&fit=crop&q=80',
    width: 600,
    height: 600,
  },
] as const

export const PROCESS_STEPS = [
  {
    number: '01',
    title: 'Consultation',
    description:
      'We begin with an in-depth conversation about your vision, space, and functional requirements to understand the project fully.',
  },
  {
    number: '02',
    title: 'Design',
    description:
      'Our team translates your ideas into detailed drawings and 3D renderings, refining every curve and joint until the design is perfect.',
  },
  {
    number: '03',
    title: 'Material Selection',
    description:
      'We source premium metals and finishes, guiding you through options so every material aligns with both aesthetics and durability.',
  },
  {
    number: '04',
    title: 'Fabrication',
    description:
      'Skilled artisans hand-forge and weld each piece in our workshop, combining traditional techniques with modern precision.',
  },
  {
    number: '05',
    title: 'Installation',
    description:
      'Our crew delivers and installs the finished work on-site, ensuring a flawless fit and leaving your space transformed.',
  },
] as const

export const SOCIAL_LINKS = [
  { icon: 'Instagram', href: '#', label: 'Follow us on Instagram' },
  { icon: 'Facebook', href: '#', label: 'Follow us on Facebook' },
  { icon: 'Linkedin', href: '#', label: 'Connect on LinkedIn' },
] as const
