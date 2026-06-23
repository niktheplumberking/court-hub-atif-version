// AUTO-GENERATED placeholder catalog (from the design project) using the Racket Images
// Placeholders. Real products will come from Supabase later; keep this shape stable.

export interface Product {
  id: string;
  name: string;
  brand: string;
  price: number; // in AED
  image: string;
  category: 'rackets' | 'accessories' | 'used';
  tag: string;
  color: string;
  desc: string;
  originalPrice?: number;
  specs?: {
    weight?: string;
    shape?: string;
    core?: string;
    face?: string;
    balance?: string;
    level?: string;
  };
  features?: string[];
  gallery?: string[];
}

export const PRODUCTS: Product[] = [
  {
    id: 'finder-pro',
    name: 'Finder Pro Limited Edition',
    brand: 'STEALTH',
    price: 1540,
    image: '/placeholders/racket-01.jpeg',
    category: 'rackets',
    tag: 'LIMITED RUN · ALE CERVELLATI',
    color: 'lime',
    desc: 'The official racket developed for extreme spin control and aerodynamic overhead smashes.',
    specs: {
      weight: '360g - 375g',
      shape: 'Diamond',
      core: 'EVA Pro Density',
      face: '18K Carbon Weave',
      balance: 'High (Power)',
      level: 'Elite / Professional'
    },
    features: [
      'Graphene Spin-Surface texture for vicious slice-rotation and aerodynamic control.',
      'Aero-Frame structural channel located at the throat for faster reaction swings.',
      'Dynamic sweet-spot correction core that dampens off-center shot vibration.',
      'Ergonomic Comfort Wrist strap lined with soft memory-foam composite.'
    ],
    gallery: [
      '/placeholders/racket-02.jpeg',
      '/placeholders/racket-03.jpeg'
    ]
  },
  {
    id: 'stealth-blue',
    name: 'Stealth Limited Pro Series',
    brand: 'STEALTH',
    price: 1220,
    image: '/placeholders/racket-04.jpeg',
    category: 'rackets',
    tag: 'EXCLUSIVE DROP',
    color: 'court-blue',
    desc: 'Co-engineered for dynamic agility and a vibration-dampening core matrix to protect joints.',
    specs: {
      weight: '355g - 370g',
      shape: 'Teardrop',
      core: 'White Soft EVA Elastic',
      face: '12K Carbon Carbon-Face',
      balance: 'Medium (All-Round)',
      level: 'Advanced / Elite'
    },
    features: [
      'Advanced dual-bridge technology located around the heart section.',
      'Silica-sand textured face to prolong contact phase and maximize precision placement.',
      'Symmetric direct air-flow drill hole pattern for extreme stability.',
      'Shock-absorption handle wrapping designed for players suffering with elbow fatigue.'
    ],
    gallery: [
      '/placeholders/racket-05.jpeg',
      '/placeholders/racket-06.jpeg'
    ]
  },
  {
    id: 'propulsion-carbon',
    name: 'Propulsion Carbon Pro',
    brand: 'STEALTH',
    price: 1650,
    image: '/placeholders/racket-07.jpeg',
    category: 'rackets',
    tag: 'CARBON MATRIX',
    color: 'lime',
    desc: 'Premium carbon-loaded pro racket featuring maximum energy restitution and sweet-spot optimization.',
    specs: {
      weight: '365g - 375g',
      shape: 'Diamond',
      core: 'Black High-Rebound EVA',
      face: '24K Supreme Carbon',
      balance: 'High (Maximum Power)',
      level: 'Professional'
    },
    features: [
      'Engineered with 100% premium Japanese Toray structural carbon elements.',
      'Aggressive aerodynamic frame design reduces drag during high-velocity smashes.',
      'Premium textured sand paint ensures unmatched friction on physical contacts.',
      'High absorption silicone frame protector included pre-installed.'
    ],
    gallery: [
      '/placeholders/racket-08.jpeg',
      '/placeholders/racket-09.jpeg'
    ]
  },
  {
    id: 'apex-air-stealth',
    name: 'Stealth Apex Air Tour',
    brand: 'STEALTH',
    price: 1390,
    image: '/placeholders/racket-10.jpeg',
    category: 'rackets',
    tag: 'LIGHTWEIGHT RUN',
    color: 'court-blue',
    desc: 'Ultra-lightweight aerodynamic frame designed for lightning-fast net reactions and defensive transitions.',
    specs: {
      weight: '345g - 355g',
      shape: 'Round',
      core: 'EVA Ultra Soft Soft-Core',
      face: '3K Braided Glass-Carbon',
      balance: 'Low (Supreme Control)',
      level: 'Intermediate / Advanced'
    },
    features: [
      'Ultra light structural distribution makes net battles childs play.',
      'Reinforced fiberglass elements shield outer edges from accidental glass hits.',
      'Wider round sweet spot guarantees unparalleled control and defensive power.',
      'Premium moisture-wicking synthetic grip ensures maximum hold under damp conditions.'
    ],
    gallery: [
      '/placeholders/racket-11.jpeg',
      '/placeholders/racket-12.jpeg'
    ]
  },
  {
    id: 'finder-pro-gold',
    name: 'Finder Pro Stealth Gold',
    brand: 'STEALTH',
    price: 1690,
    image: '/placeholders/racket-13.jpeg',
    category: 'rackets',
    tag: 'GOLD SPECIAL EDITION',
    color: 'lime',
    desc: 'Limited gold-accented high carbon weave composite for ultimate power and elite court dominance.',
    specs: {
      weight: '360g - 375g',
      shape: 'Diamond',
      core: 'High Density Pro EVA Black',
      face: '18K Gold Carbon Thread',
      balance: 'High (Dynamic Power)',
      level: 'Elite / Pro-Am'
    },
    features: [
      'Exclusive limited edition numbered graphic prints on throat panels.',
      'Inlaid premium carbon gold weave increases kinetic conversion rates.',
      'Superior shock cancellation inserts placed inside outer frame tubes.',
      'Beautiful protective leather-bound carrying briefcase included.'
    ],
    gallery: [
      '/placeholders/racket-14.jpeg',
      '/placeholders/racket-15.jpeg'
    ]
  },
  {
    id: 'head-graphene',
    name: 'HEAD Graphene Elite (Pre-Owned)',
    brand: 'HEAD',
    price: 610,
    originalPrice: 890,
    image: '/placeholders/racket-16.jpeg',
    category: 'used',
    tag: 'LIKE NEW · 9.5/10',
    color: 'green',
    desc: 'A magnificent choice for advanced players looking for unmatched stiffness and swing weight.',
    specs: {
      weight: '365g',
      shape: 'Teardrop',
      core: 'Power Foam Core',
      face: 'Graphene 360+ Composite',
      balance: 'Medium-High',
      level: 'Advanced / Intermediate'
    },
    features: [
      'Includes structural Graphene element integration for high power response.',
      'Tailored frame tubes maintain extreme integrity throughout long matches.',
      'Pre-inspected and fully certified by Court Hub technical staff.',
      'Minimal cosmetic blemishes on the top protective tape layer only.'
    ],
    gallery: [
      '/placeholders/racket-17.jpeg'
    ]
  },
  {
    id: 'head-alpha-pro',
    name: 'HEAD Alpha Tour Edition (Pre-Owned)',
    brand: 'HEAD',
    price: 545,
    originalPrice: 820,
    image: '/placeholders/racket-18.jpeg',
    category: 'used',
    tag: 'EXCELLENT · 9.0/10',
    color: 'green',
    desc: 'Professional edition Alpha Tour racket with optimized center distribution for precise ball control.',
    specs: {
      weight: '370g',
      shape: 'Teardrop',
      core: 'Ultrasoft Comfort Foam',
      face: 'Graphene Touch Tech',
      balance: 'Medium',
      level: 'Intermediate / Advanced'
    },
    features: [
      'Extreme comfort with optimized Graphene touch face damping.',
      'Anti-shock skin material prevents paint abrasion during floor-scrapes.',
      'Includes professional grade premium grip wrapper pre-applied.',
      'Slight surface varnish scaling on outer edge; non-structural.'
    ],
    gallery: [
      '/placeholders/racket-19.jpeg'
    ]
  },
  {
    id: 'head-graphene-tour',
    name: 'HEAD Extreme Graphene Tour (Pre-Owned)',
    brand: 'HEAD',
    price: 590,
    originalPrice: 910,
    image: '/placeholders/racket-20.jpeg',
    category: 'used',
    tag: 'MINT CONDITION',
    color: 'green',
    desc: 'Optimized head distribution with premium Graphene construction. Offers a massive sweet spot.',
    specs: {
      weight: '365g',
      shape: 'Diamond',
      core: 'Reinforced Core Foam',
      face: 'Woven Carbon Graphene composite',
      balance: 'High',
      level: 'Advanced'
    },
    features: [
      'Inspected under high pressure test machines for interior core fractures.',
      'Exceptional structural score 9.8/10 from certification expert.',
      'Massive power multipliers with minimal counterweight dispersion.',
      'Comes with authentic HEAD dynamic thermal protective bag.'
    ],
    gallery: [
      '/placeholders/racket-01.jpeg'
    ]
  },
  {
    id: 'wilson-comfort',
    name: 'Wilson Pro Staff Comfort Set',
    brand: 'Wilson',
    price: 1100,
    image: '/placeholders/racket-02.jpeg',
    category: 'rackets',
    tag: 'GREAT VALUE',
    color: 'court-blue',
    desc: 'A balance of high response carbon weave with fiberglass reinforcements for optimal ball feel.',
    specs: {
      weight: '360g',
      shape: 'Round',
      core: 'Soft EVA Foam Core',
      face: 'Carbon-Fiberglass Alloy',
      balance: 'Low',
      level: 'Beginner / Intermediate'
    },
    features: [
      'Highly forgiving sweet spot design helps prevent spin errors.',
      'Soft dense core generates predictable responsive ball bounce.',
      'Light touch handle weight allows longer comfortable match stretches.',
      'Pre-installed Wilson dynamic edge-protection strip.'
    ],
    gallery: [
      '/placeholders/racket-03.jpeg'
    ]
  },
  {
    id: 'wilson-ultra-carbon',
    name: 'Wilson Blade Ultra Carbon',
    brand: 'Wilson',
    price: 1250,
    image: '/placeholders/racket-04.jpeg',
    category: 'rackets',
    tag: 'RAW FORCE EDITION',
    color: 'court-blue',
    desc: 'Designed for absolute force multiplication, structural stiffness, and optimal feedback response.',
    specs: {
      weight: '370g',
      shape: 'Teardrop',
      core: 'Firm Elastic EVA',
      face: '12K High Intensity Carbon',
      balance: 'Medium-High',
      level: 'Intermediate / Advanced'
    },
    features: [
      'Firm dynamic core material yields massive velocity multiplier.',
      'High-grade carbon fibers prevent structural twisting under off-center hits.',
      'Double density handle grip structure prevents wrist load.',
      'Comes with full brand warranty certificate valid for twelve months.'
    ],
    gallery: [
      '/placeholders/racket-05.jpeg'
    ]
  },
  {
    id: 'padel-balls',
    name: 'Pro Tour Championship Balls (3x)',
    brand: 'COURTHUB',
    price: 45,
    image: '/placeholders/racket-06.jpeg',
    category: 'accessories',
    tag: 'HIGH PRESSURIZED',
    color: 'lime',
    desc: 'Durable yellow felt engineered specifically to maintain uniform rebound characteristics on synthetic non-sanded turfs.',
    specs: {
      weight: '56g - 59g per ball',
      shape: 'Pressurized Sphere',
      core: 'Natural Rubber Core',
      face: 'Extra Duty Woven Wool & Nylon Felt',
      balance: 'High Consistent'
    },
    features: [
      'Pressurized natural gas filled to optimize rebound velocity limits.',
      'Felt treated with dynamic water-repelling formula.',
      'Meets International Padel Federation tournament requirements.',
      'Includes airtight metal canister keeping pressure sealed for months.'
    ],
    gallery: [
      '/placeholders/racket-07.jpeg'
    ]
  },
  {
    id: 'championship-trophy-rep',
    name: 'Official Tournament Trophy Replica',
    brand: 'COURTHUB',
    price: 250,
    image: '/placeholders/racket-08.jpeg',
    category: 'accessories',
    tag: 'MATCH DAY ACCESSORY',
    color: 'green',
    desc: 'Miniature polished die-cast replica of the Court Hub Open Gulf tournament podium trophy.',
    specs: {
      weight: '850g',
      shape: 'Miniature Podium',
      core: 'Solid Die-Cast Zinc Alloy Base',
      face: 'Polished Silver Hardplate Varnish',
      balance: 'Uniform Heavy'
    },
    features: [
      'Accurate 1:5 downscale replica of the official court championship cup.',
      'Heavy dark composite base felt-lined to avoid desk scrapes.',
      'Perfect collectors high piece for padel enthusiasts and club operators.',
      'Individually boxed in dynamic gold foil Court Hub gift packaging.'
    ],
    gallery: [
      '/placeholders/racket-09.jpeg'
    ]
  }
];
