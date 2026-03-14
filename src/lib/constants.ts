export const NAV_LINKS = [
  { label: 'WORK', href: '/#work' },
  { label: 'SERVICES', href: '/services' },
  { label: 'PROCESS', href: '/#process' },
  { label: 'CONTACT', href: '/#contact' },
] as const

export const SCROLL_THRESHOLD = 50
export const CURSOR_LERP_SPEED = 0.15

export const SERVICE = {
  title: 'Custom Design & Fabrication',
  description:
    'We design and build custom metalwork from scratch. Steel, stainless — whatever the project calls for. Bring us your idea and we\'ll make it happen.',
} as const

export const PROJECT_TYPES = [
  {
    title: 'Custom Fabrication',
    description:
      'From one-off builds to production runs — gates, brackets, frames, fixtures, and anything else you need made from steel or stainless.',
    image:
      'https://images.unsplash.com/photo-1570181998225-0c1bfcb3e226?w=640&h=400&fit=crop&q=80',
  },
  {
    title: 'Repairs & Modifications',
    description:
      'We fix, reinforce, and modify existing metalwork and equipment. If it\'s metal and it\'s broken, we can sort it out.',
    image:
      'https://images.unsplash.com/photo-1583546283375-09065ed179e8?w=640&h=400&fit=crop&q=80',
  },
  {
    title: 'Design & Build',
    description:
      'Not sure where to start? We\'ll work with you from the initial idea through drawings and material selection to a finished product.',
    image:
      'https://images.unsplash.com/photo-1769152683420-f4eff91cb30b?w=640&h=400&fit=crop&q=80',
  },
] as const

// Legacy alias — consumed by jsonld.ts
export const SERVICES = PROJECT_TYPES.map((p) => ({
  title: p.title,
  description: p.description,
  image: p.image,
}))

export const SERVICES_EXPANDED = [
  {
    id: 'custom-fabrication',
    title: 'Custom Fabrication',
    tagline: 'Your idea, our steel',
    description:
      'We build custom metalwork to your exact specs. Gates, railings, brackets, frames, fixtures, equipment attachments, trailers — if it\'s made of metal, we can fabricate it. Every project is built from scratch in our shop using steel or stainless steel.',
    features: [
      'Steel and stainless steel fabrication',
      'One-off builds or small production runs',
      'Residential, commercial, and agricultural projects',
      'Built to your specs or ours',
    ],
    image:
      'https://images.unsplash.com/photo-1570181998225-0c1bfcb3e226?w=1200&h=800&fit=crop&q=80',
    imageAlt:
      'Worker grinding steel with sparks flying during custom fabrication',
  },
  {
    id: 'repairs-modifications',
    title: 'Repairs & Modifications',
    tagline: 'Fix it. Reinforce it. Make it better.',
    description:
      'Got something broken, worn out, or not quite right? We repair and modify existing metalwork, equipment, and structures. From cracked frames to worn-out attachments, we\'ll get it back in working order — or make it stronger than it was.',
    features: [
      'Structural repairs and reinforcement',
      'Equipment modifications and upgrades',
      'Weld repairs and patching',
      'On-site or in-shop service',
    ],
    image:
      'https://images.unsplash.com/photo-1583546283375-09065ed179e8?w=1200&h=800&fit=crop&q=80',
    imageAlt:
      'Welder MIG welding steel in a fabrication shop',
  },
  {
    id: 'design-build',
    title: 'Design & Build',
    tagline: 'From napkin sketch to finished product',
    description:
      'Don\'t have detailed plans? No problem. We work with you from the initial idea through design, material selection, and fabrication. Whether you\'ve got a rough sketch or just an idea in your head, we\'ll figure out the best way to build it.',
    features: [
      'Collaborative design process',
      'Material recommendations for your application',
      'Drawings and measurements before we cut',
      'Full project management start to finish',
    ],
    image:
      'https://images.unsplash.com/photo-1769152683420-f4eff91cb30b?w=1200&h=800&fit=crop&q=80',
    imageAlt:
      'Fabricated metal parts laid out on technical blueprints and drawings',
  },
] as const

export const PORTFOLIO_PROJECTS = [
  {
    title: 'Log Splitter — Full Length',
    category: 'Custom Fabrication',
    description: '4-foot log splitter attachment built for an excavator',
    image: '/portfolio/log-splitter-3.webp',
    width: 600,
    height: 800,
  },
  {
    title: 'Log Wedge',
    category: 'Custom Fabrication',
    description: 'Log wedge for a 4-foot excavator log splitter attachment',
    image: '/portfolio/log-splitter-2.webp',
    width: 600,
    height: 800,
  },
  {
    title: 'Log Wedge — Detail',
    category: 'Custom Fabrication',
    description: 'Log wedge for a 4-foot excavator log splitter attachment',
    image: '/portfolio/log-splitter-1.webp',
    width: 600,
    height: 800,
  },
  {
    title: 'Sap Evaporator',
    category: 'Design & Build',
    description: 'Wood-fired sap evaporator with chimney stack',
    image: '/portfolio/sap-evaporator-1.webp',
    width: 800,
    height: 600,
  },
  {
    title: 'Stainless Sap Evaporator',
    category: 'Design & Build',
    description: 'Stainless steel evaporator pan with drain valve',
    image: '/portfolio/sap-evaporator-2.webp',
    width: 800,
    height: 600,
  },
  {
    title: 'Custom Trailer — Up',
    category: 'Custom Fabrication',
    description: 'Custom steel trailer tube frame',
    image: '/portfolio/custom-trailer-1.webp',
    width: 800,
    height: 600,
  },
  {
    title: 'Custom Trailer — Down',
    category: 'Custom Fabrication',
    description: 'Custom steel trailer tube frame',
    image: '/portfolio/custom-trailer-2.webp',
    width: 800,
    height: 600,
  },
  {
    title: 'Custom Table Legs',
    category: 'Custom Fabrication',
    description: 'Steel X-frame table legs in graduated sizes',
    image: '/portfolio/custom-table-legs-1.webp',
    width: 800,
    height: 800,
  },
] as const

export const PROCESS_STEPS = [
  {
    number: '01',
    title: 'Consultation',
    description:
      'Tell us what you need. We\'ll talk through your idea, ask the right questions, and figure out the best approach.',
  },
  {
    number: '02',
    title: 'Design',
    description:
      'We\'ll sketch it out, confirm dimensions and specs, and make sure we\'re on the same page before any cutting starts.',
  },
  {
    number: '03',
    title: 'Material Selection',
    description:
      'We work with mild steel, structural steel, and stainless. We\'ll recommend the right material for the job based on use, environment, and budget.',
  },
  {
    number: '04',
    title: 'Fabrication',
    description:
      'We cut, weld, grind, and finish every piece in our shop to your exact specs. Quality work, done right.',
  },
  {
    number: '05',
    title: 'Delivery',
    description:
      'Pick up from the shop or we\'ll deliver and install on-site. Either way, it\'s ready to go.',
  },
] as const

export const SOCIAL_LINKS: readonly { icon: string; href: string; label: string }[] = []
