// ============================================================
// LIGHTNING ENERGY — Battery Data
// Complete specs, company background, compatible inverters, features
// ============================================================

export interface BatterySpec {
  label: string;
  value: string;
  highlight?: boolean;
}

export interface Battery {
  id: string;
  brand: string;
  model: string;
  year: number;
  capacity: string;
  warranty: string;
  origin: string;
  efficiency: number;
  peakPower: number;
  continuousPower: number;
  pricePerKwh: number;
  totalCost: number;
  builtInInverter: boolean | 'partial';
  threePhase: boolean | 'partial';
  highPower: boolean | 'partial';
  evCharging: boolean | 'partial';
  smartFeatures: boolean | 'partial';
  threePhaseInverter?: string;
  datasheetUrl: string;
  color: string;
  // Extended modal data
  specifications: BatterySpec[];
  companyBackground: {
    founded: string;
    headquarters: string;
    overview: string;
    australiaPresence: string;
    certifications: string;
  };
  compatibleInverters: {
    name: string;
    type: string;
    notes: string;
  }[];
  features: {
    category: string;
    items: { label: string; value: string }[];
  }[];
}

export const batteries: Battery[] = [
  // ── 1. TESLA POWERWALL 3 ──────────────────────────────────
  {
    id: 'tesla-pw3',
    brand: 'Tesla',
    model: 'Powerwall 3',
    year: 2023,
    capacity: '13.5 kWh usable',
    warranty: '10 years',
    origin: 'USA',
    efficiency: 97.5,
    peakPower: 11.5,
    continuousPower: 11.5,
    pricePerKwh: 1037,
    totalCost: 14000,
    builtInInverter: true,
    threePhase: true,
    highPower: true,
    evCharging: 'partial',
    smartFeatures: true,
    threePhaseInverter: '3P: Built-In 3P Inverter',
    datasheetUrl: '/manus-storage/tesla-powerwall-3-datasheet_4c92d301.pdf',
    color: '#00EAD3',
    specifications: [
      { label: 'Country of Manufacture', value: 'USA' },
      { label: 'Dimensions', value: '1096 x 755 x 147 mm' },
      { label: 'Product Commencement Year', value: '2023' },
      { label: 'Weight', value: '130 kg' },
      { label: 'Warranty', value: '10 years' },
      { label: 'Cooling System', value: 'Liquid cooled' },
      { label: 'Battery Chemistry', value: 'Lithium Iron Phosphate (LiFePO4)' },
      { label: 'Operating Temperature', value: '-20°C to 50°C' },
      { label: 'Usable Capacity', value: '13.5 kWh', highlight: true },
    ],
    companyBackground: {
      founded: '2003',
      headquarters: 'Austin, Texas, USA',
      overview: 'Tesla, Inc. is a global leader in electric vehicles, energy storage, and solar energy solutions. Founded in 2003, Tesla has become synonymous with cutting-edge battery technology and sustainable energy. The Powerwall product line has been installed in over 500,000 homes worldwide, making it one of the most recognised residential battery brands globally.',
      australiaPresence: 'Tesla has a strong presence in Australia with dedicated installation partners, a local support team, and the Tesla App available in Australia. The Powerwall 3 is fully supported with Australian grid compliance and CEC approval. Tesla Energy Plans are available in SA and VIC for VPP participation.',
      certifications: 'CEC Approved, AS/NZS 4777.2, IEC 62619, UL 9540, IP67',
    },
    compatibleInverters: [
      { name: 'Tesla Powerwall 3 (Built-in Inverter)', type: 'Hybrid — Built-in', notes: 'Fully integrated — no external inverter required. Accepts solar input directly at up to 20 kW DC.' },
      { name: 'Tesla Solar Inverter', type: 'String Inverter', notes: 'Designed for use with Tesla solar panels and Powerwall 3 in a fully Tesla-integrated system.' },
    ],
    features: [
      {
        category: 'Energy Management',
        items: [
          { label: 'Solar Self-Consumption', value: 'Yes — maximises solar usage before grid export' },
          { label: 'Time-of-Use Optimisation', value: 'Yes — charges during off-peak, discharges at peak tariff periods' },
          { label: 'Backup Power', value: 'Whole-home backup with automatic switchover in milliseconds' },
          { label: 'Storm Watch', value: 'Yes — pre-charges battery before severe weather events' },
          { label: 'Off-Grid Capable', value: 'Yes — can operate fully off-grid' },
        ],
      },
      {
        category: 'Connectivity & Smart Features',
        items: [
          { label: 'App Control', value: 'Tesla App (iOS & Android) — real-time energy flow, SOC, alerts' },
          { label: 'Wi-Fi / Ethernet', value: 'Both supported' },
          { label: 'VPP Participation', value: 'Supported via Tesla Energy Plan (SA, VIC)' },
          { label: 'EV Integration', value: 'Partial — integrates with Tesla vehicles via Tesla App' },
        ],
      },
      {
        category: 'Safety & Compliance',
        items: [
          { label: 'Battery Chemistry', value: 'LiFePO4 — inherently stable, no thermal runaway risk' },
          { label: 'IP Rating', value: 'IP67 — suitable for indoor and outdoor installation' },
          { label: 'Fire Rating', value: 'UL 9540A tested' },
          { label: 'Grid Compliance', value: 'AS/NZS 4777.2 compliant — CEC approved' },
        ],
      },
    ],
  },

  // ── 2. SIGENERGY SIGENSTOR ────────────────────────────────
  {
    id: 'sigenergy-sigenstor',
    brand: 'Sigenergy',
    model: 'SigenStor',
    year: 2023,
    capacity: '5.2 kWh or 7.8 kWh per module',
    warranty: '10 years (70% capacity retention)',
    origin: 'China',
    efficiency: 95,
    peakPower: 12,
    continuousPower: 6,
    pricePerKwh: 1100,
    totalCost: 12000,
    builtInInverter: true,
    threePhase: true,
    highPower: true,
    evCharging: true,
    smartFeatures: true,
    threePhaseInverter: '3P: Built-In 3P Inverter',
    datasheetUrl: '/manus-storage/sigenergy-sigenstor-datasheet_f2c49eaa.pdf',
    color: '#00EAD3',
    specifications: [
      { label: 'Country of Manufacture', value: 'China' },
      { label: 'Dimensions', value: '767 x 270 x 260 mm per module' },
      { label: 'Product Commencement Year', value: '2023' },
      { label: 'Weight', value: '55 kg (5 kWh) / 70 kg (8 kWh)' },
      { label: 'Warranty', value: '10 years (70% capacity retention)' },
      { label: 'Cooling System', value: 'Natural convection, aerogel insulation' },
      { label: 'Battery Chemistry', value: 'Lithium Iron Phosphate (LiFePO4)' },
      { label: 'Operating Temperature', value: '-20°C to 55°C' },
      { label: 'Usable Capacity', value: '5.2 kWh or 7.8 kWh per module (up to 48 kWh)', highlight: true },
    ],
    companyBackground: {
      founded: '2018',
      headquarters: 'Hangzhou, China',
      overview: 'Sigenergy is a next-generation clean energy company specialising in integrated energy storage and management solutions. With a focus on AI-driven energy optimisation, Sigenergy\'s SigenStor system is designed for both residential and commercial applications, offering modular scalability up to 48 kWh. Sigenergy is backed by leading global investors and has rapidly expanded into the Australian and European markets.',
      australiaPresence: 'Sigenergy entered the Australian market in 2023 with CEC-approved products and a growing network of accredited installers. Local technical support is available through their Australian distributor. The SigenStor is gaining strong traction as a premium AI-enabled storage solution.',
      certifications: 'CEC Approved, AS/NZS 4777.2, IEC 62619, CE, TÜV Rheinland, IP65',
    },
    compatibleInverters: [
      { name: 'Sigenergy SigenStor Hybrid Inverter (5 kW Single-Phase)', type: 'Hybrid Inverter', notes: 'Directly integrates with SigenStor battery modules. Supports solar input up to 12 kW.' },
      { name: 'Sigenergy SigenStor Hybrid Inverter (8 kW Single-Phase)', type: 'Hybrid Inverter', notes: 'Higher output single-phase. Supports up to 48 kWh storage.' },
      { name: 'Sigenergy SigenStor 3-Phase Hybrid (10 kW)', type: '3-Phase Hybrid Inverter', notes: 'Three-phase compatible. Ideal for larger homes and commercial premises.' },
      { name: 'Sigenergy EV Charger Integration', type: 'EV Charger', notes: 'Integrated smart EV charging management via the SigenStor platform.' },
    ],
    features: [
      {
        category: 'AI & Smart Features',
        items: [
          { label: 'AI Energy Management', value: 'Yes — predictive charging based on weather forecasts and usage patterns' },
          { label: 'EV Charging Integration', value: 'Yes — smart EV charging coordinated with solar and battery' },
          { label: 'App Control', value: 'Sigenergy App (iOS & Android)' },
          { label: 'VPP Ready', value: 'Yes — virtual power plant participation supported' },
        ],
      },
      {
        category: 'Scalability',
        items: [
          { label: 'Modular Design', value: 'Yes — add modules in 5.2 kWh or 7.8 kWh increments' },
          { label: 'Maximum Capacity', value: 'Up to 48 kWh per system' },
          { label: 'Parallel Systems', value: 'Multiple systems can be connected for larger sites' },
        ],
      },
      {
        category: 'Safety',
        items: [
          { label: 'IP Rating', value: 'IP65 — outdoor rated' },
          { label: 'Battery Chemistry', value: 'LiFePO4 — high thermal stability' },
          { label: 'BMS', value: 'Advanced multi-level battery management system with cell balancing' },
        ],
      },
    ],
  },

  // ── 3. SUNGROW SBR SERIES ─────────────────────────────────
  {
    id: 'sungrow-sbr',
    brand: 'Sungrow',
    model: 'SBR Series',
    year: 2018,
    capacity: '6.4 kWh to 25.6 kWh',
    warranty: '10 years and 6 months',
    origin: 'China',
    efficiency: 96,
    peakPower: 8,
    continuousPower: 5,
    pricePerKwh: 850,
    totalCost: 9500,
    builtInInverter: false,
    threePhase: true,
    highPower: true,
    evCharging: false,
    smartFeatures: true,
    threePhaseInverter: '3P: Sungrow SH-RT / Fronius Symo / GoodWe ET',
    datasheetUrl: '/manus-storage/sungrow-sbr-datasheet_19fd9650.pdf',
    color: '#00EAD3',
    specifications: [
      { label: 'Country of Manufacture', value: 'China' },
      { label: 'Dimensions', value: '630 x 195 x 620 mm per module' },
      { label: 'Product Commencement Year', value: '2018' },
      { label: 'Weight', value: '32 kg per module' },
      { label: 'Warranty', value: '10 years and 6 months' },
      { label: 'Cooling System', value: 'Natural convection' },
      { label: 'Battery Chemistry', value: 'Lithium Iron Phosphate (LiFePO4)' },
      { label: 'Operating Temperature', value: '-10°C to 50°C' },
      { label: 'Usable Capacity', value: '6.4 kWh to 25.6 kWh (modular, 3.2 kWh increments)', highlight: true },
    ],
    companyBackground: {
      founded: '1997',
      headquarters: 'Hefei, Anhui, China',
      overview: 'Sungrow is one of the world\'s largest inverter manufacturers, with over 340 GW of clean power installed globally. Listed on the Shenzhen Stock Exchange, Sungrow has a strong track record in both residential and utility-scale energy storage. The SBR series is among the most widely deployed residential battery systems in Australia, known for its reliability and modular design.',
      australiaPresence: 'Sungrow has a dedicated Australian office in Sydney with local technical support, warranty claims processing, and a large network of CEC-accredited installers. The SBR series is consistently one of the top-selling batteries in the Australian residential market.',
      certifications: 'CEC Approved, AS/NZS 4777.2, IEC 62619, CE, TÜV Rheinland, IP65',
    },
    compatibleInverters: [
      { name: 'Sungrow SH5.0RS (Single-Phase)', type: 'Hybrid Inverter', notes: '5 kW single-phase. Direct SBR integration via DC bus.' },
      { name: 'Sungrow SH8.0RS (Single-Phase)', type: 'Hybrid Inverter', notes: '8 kW single-phase. Supports up to 25.6 kWh SBR storage.' },
      { name: 'Sungrow SH10RT (Three-Phase)', type: 'Hybrid Inverter (3-Phase)', notes: '10 kW three-phase. Ideal for larger homes with 3-phase supply.' },
      { name: 'Sungrow SH15T / SH20T (Three-Phase)', type: 'Hybrid Inverter (3-Phase)', notes: '15–20 kW three-phase for commercial applications.' },
    ],
    features: [
      {
        category: 'Scalability',
        items: [
          { label: 'Modular Expansion', value: 'Yes — 3.2 kWh increments, up to 25.6 kWh per system' },
          { label: 'Hot-Swap Modules', value: 'Yes — modules can be replaced without system shutdown' },
          { label: 'Stackable Design', value: 'Wall-mounted stacking — compact footprint' },
        ],
      },
      {
        category: 'Monitoring',
        items: [
          { label: 'App', value: 'iSolarCloud (iOS & Android)' },
          { label: 'Web Portal', value: 'iSolarCloud web dashboard — real-time energy data' },
          { label: 'Remote Diagnostics', value: 'Yes — Sungrow service team can access remotely for support' },
        ],
      },
      {
        category: 'Safety',
        items: [
          { label: 'IP Rating', value: 'IP65 — suitable for outdoor installation' },
          { label: 'BMS', value: 'Multi-level protection: overvoltage, overcurrent, over-temperature' },
          { label: 'Certifications', value: 'CEC Approved, AS/NZS 4777.2, IEC 62619' },
        ],
      },
    ],
  },

  // ── 4. ANKER SOLIX X1 ─────────────────────────────────────
  {
    id: 'anker-solix-x1',
    brand: 'Anker',
    model: 'Solix X1',
    year: 2024,
    capacity: '5 kWh per module',
    warranty: '10 years',
    origin: 'China',
    efficiency: 94.5,
    peakPower: 8,
    continuousPower: 5,
    pricePerKwh: 1200,
    totalCost: 9000,
    builtInInverter: true,
    threePhase: true,
    highPower: true,
    evCharging: true,
    smartFeatures: true,
    threePhaseInverter: '3P: Built-In 3P Inverter',
    datasheetUrl: '/manus-storage/anker-solix-x1-datasheet_a1e77f28.pdf',
    color: '#00EAD3',
    specifications: [
      { label: 'Country of Manufacture', value: 'China' },
      { label: 'Dimensions', value: '680 x 250 x 600 mm per module' },
      { label: 'Product Commencement Year', value: '2024' },
      { label: 'Weight', value: '48 kg per module' },
      { label: 'Warranty', value: '10 years' },
      { label: 'Cooling System', value: 'Natural convection' },
      { label: 'Battery Chemistry', value: 'Lithium Iron Phosphate (LiFePO4)' },
      { label: 'Operating Temperature', value: '-10°C to 50°C' },
      { label: 'Usable Capacity', value: '5 kWh per module (up to 15 kWh per system)', highlight: true },
    ],
    companyBackground: {
      founded: '2011',
      headquarters: 'Shenzhen, China',
      overview: 'Anker Innovations is a global consumer electronics company best known for its charging technology, with over $1.5 billion in annual revenue. The Anker Solix brand represents their expansion into residential and commercial energy storage. The Solix X1 is their flagship home battery, combining Anker\'s consumer-grade reliability and design quality with serious energy storage capability.',
      australiaPresence: 'Anker Solix launched in Australia in 2024 through select solar retailers. CEC approval is in progress. Local warranty support is available through the Australian distributor. Anker\'s established consumer brand provides strong customer confidence.',
      certifications: 'IEC 62619, CE, FCC — CEC approval in progress for Australian market',
    },
    compatibleInverters: [
      { name: 'Anker Solix X1 Inverter (Built-in)', type: 'Hybrid Inverter — Built-in', notes: 'Dedicated Anker hybrid inverter — sold as an integrated system. No separate inverter required.' },
      { name: 'Third-party inverter compatibility', type: 'Various', notes: 'Limited third-party inverter compatibility at this stage — consult your installer for current options.' },
    ],
    features: [
      {
        category: 'Design & Form Factor',
        items: [
          { label: 'Form Factor', value: 'Modular tower design — stackable up to 3 modules (15 kWh)' },
          { label: 'Aesthetic', value: 'Matte black premium finish — designed for indoor display' },
          { label: 'Installation', value: 'Indoor installation recommended — compact footprint' },
        ],
      },
      {
        category: 'Connectivity',
        items: [
          { label: 'App', value: 'Anker App (iOS & Android)' },
          { label: 'Wi-Fi', value: 'Yes — remote monitoring and control' },
          { label: 'Smart Home Integration', value: 'Google Home and Amazon Alexa compatible' },
          { label: 'EV Charging', value: 'Yes — integrated EV charging management' },
        ],
      },
    ],
  },

  // ── 5. ENPHASE IQ BATTERY 5P ──────────────────────────────
  {
    id: 'enphase-iq5p',
    brand: 'Enphase',
    model: 'IQ Battery 5P',
    year: 2023,
    capacity: '5.0 kWh usable',
    warranty: '15 years',
    origin: 'USA',
    efficiency: 89,
    peakPower: 3.84,
    continuousPower: 3.84,
    pricePerKwh: 1400,
    totalCost: 7500,
    builtInInverter: true,
    threePhase: false,
    highPower: false,
    evCharging: false,
    smartFeatures: true,
    datasheetUrl: '/manus-storage/enphase-iq5p-datasheet_34d559a3.pdf',
    color: '#00EAD3',
    specifications: [
      { label: 'Country of Manufacture', value: 'USA' },
      { label: 'Dimensions', value: '1054 x 381 x 200 mm' },
      { label: 'Product Commencement Year', value: '2023' },
      { label: 'Weight', value: '54.4 kg' },
      { label: 'Warranty', value: '15 years — industry leading' },
      { label: 'Cooling System', value: 'Passive — no moving parts, no fans' },
      { label: 'Battery Chemistry', value: 'Lithium Iron Phosphate (LiFePO4)' },
      { label: 'Operating Temperature', value: '-20°C to 60°C' },
      { label: 'Usable Capacity', value: '5.0 kWh (stackable up to 4 units = 20 kWh)', highlight: true },
    ],
    companyBackground: {
      founded: '2006',
      headquarters: 'Fremont, California, USA',
      overview: 'Enphase Energy is the world\'s leading microinverter company, with over 60 million microinverters shipped globally and listed on NASDAQ. The IQ Battery 5P leverages Enphase\'s microinverter expertise to deliver an all-in-one AC-coupled battery with built-in microinverters — no separate inverter required. The 15-year warranty is the longest available in the residential battery market, reflecting Enphase\'s confidence in product longevity.',
      australiaPresence: 'Enphase has a strong Australian presence with a local office in Sydney, a large network of Enphase Platinum installers, and full CEC approval. The Enphase Installer Network provides dedicated local support and training.',
      certifications: 'CEC Approved, AS/NZS 4777.2, IEC 62619, UL 9540, IP55',
    },
    compatibleInverters: [
      { name: 'Built-in Enphase Microinverters (IQ8 series)', type: 'Microinverter — Built-in', notes: 'No external inverter required. AC-coupled design works with any existing solar system brand.' },
      { name: 'Enphase IQ8 Series Microinverters', type: 'Microinverter', notes: 'Pairs with Enphase solar systems for a fully integrated Enphase solution.' },
    ],
    features: [
      {
        category: 'Unique Advantages',
        items: [
          { label: 'Industry-Leading Warranty', value: '15 years — longest residential battery warranty available in Australia' },
          { label: 'AC-Coupled Design', value: 'Works with any existing solar inverter brand — no system replacement needed' },
          { label: 'No Single Point of Failure', value: 'Distributed microinverter architecture — one unit failure does not affect the system' },
          { label: 'Stackable', value: 'Up to 4 units per system (20 kWh total)' },
        ],
      },
      {
        category: 'Monitoring & Smart Features',
        items: [
          { label: 'App', value: 'Enphase App (iOS & Android) — module-level monitoring' },
          { label: 'Enlighten Platform', value: 'Cloud-based monitoring, diagnostics, and alerts' },
          { label: 'Storm Guard', value: 'Yes — automatic pre-charge before severe weather' },
          { label: 'Time-of-Use Optimisation', value: 'Yes — intelligent charge/discharge scheduling' },
        ],
      },
    ],
  },

  // ── 6. BYD BATTERY-BOX PREMIUM HVS/HVM ───────────────────
  {
    id: 'byd-hvs-hvm',
    brand: 'BYD',
    model: 'Battery-Box Premium HVS/HVM',
    year: 2016,
    capacity: 'HVS: 5.1-12.8 kWh, HVM: 8.3-22.1 kWh',
    warranty: '10 years (60% capacity retention)',
    origin: 'China',
    efficiency: 96,
    peakPower: 7.68,
    continuousPower: 5,
    pricePerKwh: 900,
    totalCost: 10000,
    builtInInverter: false,
    threePhase: true,
    highPower: true,
    evCharging: false,
    smartFeatures: 'partial',
    threePhaseInverter: '3P: Fronius Symo / GoodWe ET / Sungrow SH-RT',
    datasheetUrl: '/manus-storage/byd-battery-datasheet_e05655d8.pdf',
    color: '#00EAD3',
    specifications: [
      { label: 'Country of Manufacture', value: 'China' },
      { label: 'Dimensions (HVS module)', value: '585 x 560 x 225 mm' },
      { label: 'Product Commencement Year', value: '2016' },
      { label: 'Weight', value: 'HVS: 56 kg | HVM: 75 kg per module' },
      { label: 'Warranty', value: '10 years (60% capacity retention)' },
      { label: 'Cooling System', value: 'Natural convection' },
      { label: 'Battery Chemistry', value: 'Lithium Iron Phosphate (LiFePO4)' },
      { label: 'Operating Temperature', value: '-10°C to 50°C' },
      { label: 'Usable Capacity', value: 'HVS: 5.1–12.8 kWh | HVM: 8.3–22.1 kWh', highlight: true },
    ],
    companyBackground: {
      founded: '1995',
      headquarters: 'Shenzhen, China',
      overview: 'BYD (Build Your Dreams) is one of the world\'s largest battery manufacturers and electric vehicle companies, with over 30 years of battery manufacturing experience. BYD supplies batteries to major automotive and energy storage companies globally. The Battery-Box Premium series is one of the most widely installed residential battery systems in Australia, known for its broad inverter compatibility and proven reliability.',
      australiaPresence: 'BYD has a strong Australian presence through authorised distributors and a large network of accredited installers. Local warranty support and technical assistance are available Australia-wide. BYD batteries are consistently among the top-selling residential storage products in Australia.',
      certifications: 'CEC Approved, AS/NZS 4777.2, IEC 62619, CE, TÜV Rheinland, VDE, IP55',
    },
    compatibleInverters: [
      { name: 'Fronius Primo GEN24 Plus (Single-Phase)', type: 'Hybrid Inverter', notes: 'Fully compatible. Fronius and BYD are preferred integration partners.' },
      { name: 'Fronius Symo GEN24 Plus (Three-Phase)', type: 'Hybrid Inverter (3-Phase)', notes: 'Three-phase compatible with BYD HVS/HVM series.' },
      { name: 'SMA Sunny Boy Storage', type: 'Battery Inverter', notes: 'Compatible with BYD HVS series for AC-coupled systems.' },
      { name: 'Victron MultiPlus-II', type: 'Hybrid Inverter', notes: 'Compatible — popular for off-grid and hybrid systems.' },
      { name: 'GoodWe ET / EH Series', type: 'Hybrid Inverter', notes: 'Compatible with BYD HVS/HVM for single and three-phase systems.' },
    ],
    features: [
      {
        category: 'Scalability',
        items: [
          { label: 'HVS Modular Range', value: '5.1 / 7.7 / 10.2 / 12.8 kWh' },
          { label: 'HVM Modular Range', value: '8.3 / 11.0 / 13.8 / 16.6 / 19.3 / 22.1 kWh' },
          { label: 'Expandable Post-Install', value: 'Yes — modules can be added after initial installation' },
        ],
      },
      {
        category: 'Inverter Flexibility',
        items: [
          { label: 'Multi-Brand Compatibility', value: 'Yes — works with Fronius, SMA, Victron, GoodWe, Sungrow and more' },
          { label: 'Coupling Type', value: 'DC-coupled via compatible hybrid inverters' },
          { label: 'Monitoring', value: 'Via compatible inverter app (Fronius Solar.web, iSolarCloud, SEMS Portal)' },
        ],
      },
    ],
  },

  // ── 7. FRONIUS PRIMO GEN24 PLUS ───────────────────────────
  {
    id: 'fronius-primo-gen24',
    brand: 'Fronius',
    model: 'Primo GEN24 Plus',
    year: 2020,
    capacity: 'Compatible with BYD HVS/HVM',
    warranty: '10 years (with registration)',
    origin: 'Austria',
    efficiency: 96,
    peakPower: 10,
    continuousPower: 6,
    pricePerKwh: 950,
    totalCost: 11000,
    builtInInverter: true,
    threePhase: false,
    highPower: true,
    evCharging: true,
    smartFeatures: true,
    datasheetUrl: '/manus-storage/fronius-primo-gen24-datasheet_caab18e2.html',
    color: '#00EAD3',
    specifications: [
      { label: 'Country of Manufacture', value: 'Austria' },
      { label: 'Dimensions', value: '595 x 430 x 204 mm' },
      { label: 'Product Commencement Year', value: '2020' },
      { label: 'Weight', value: '19.9 kg' },
      { label: 'Warranty', value: '10 years (with product registration)' },
      { label: 'Cooling System', value: 'Active cooling (variable speed fan)' },
      { label: 'Inverter Type', value: 'Single-phase hybrid inverter' },
      { label: 'Operating Temperature', value: '-25°C to 60°C' },
      { label: 'Compatible Battery', value: 'BYD Battery-Box Premium HVS / HVM', highlight: true },
    ],
    companyBackground: {
      founded: '1945',
      headquarters: 'Pettenbach, Austria',
      overview: 'Fronius International GmbH is an Austrian technology company with over 75 years of engineering excellence across welding, battery charging, and solar energy. Fronius is one of Europe\'s most respected solar inverter manufacturers, known for premium build quality, advanced grid support features, and long product lifespans. The GEN24 Plus series represents their latest hybrid inverter platform with backup power capability.',
      australiaPresence: 'Fronius has a dedicated Australian subsidiary with offices in Sydney and Melbourne, local technical support, and a large network of Fronius-certified installers. Fronius inverters are among the most popular premium inverters in the Australian market, with strong resale value and brand recognition.',
      certifications: 'CEC Approved, AS/NZS 4777.2, IEC 62109, CE, TÜV Austria, IP65',
    },
    compatibleInverters: [
      { name: 'BYD Battery-Box Premium HVS', type: 'Battery (DC-coupled)', notes: 'Primary recommended battery partner. Fully integrated with Fronius Primo GEN24 Plus.' },
      { name: 'BYD Battery-Box Premium HVM', type: 'Battery (DC-coupled)', notes: 'For larger capacity requirements — up to 22.1 kWh.' },
    ],
    features: [
      {
        category: 'Inverter Features',
        items: [
          { label: 'PV Point', value: 'Yes — emergency power socket (1.5 kW) during grid outage' },
          { label: 'Backup Power', value: 'Whole-home backup with BYD battery — automatic switchover' },
          { label: 'Dynamic Peak Manager', value: 'Yes — reduces grid feed-in and maximises self-consumption' },
          { label: 'Fronius Solar.web', value: 'Cloud monitoring, energy flow visualisation, and alerts' },
        ],
      },
      {
        category: 'Grid & Smart Features',
        items: [
          { label: 'Grid Forming', value: 'Yes — can operate as grid-forming inverter during outages' },
          { label: 'VPP Ready', value: 'Yes — virtual power plant participation supported' },
          { label: 'HEMS Integration', value: 'Fronius Energy Management (HEMS) for smart home integration' },
          { label: 'Modbus TCP/RTU', value: 'Yes — for building management system integration' },
        ],
      },
    ],
  },

  // ── 8. FRONIUS SYMO GEN24 PLUS & RESERVA ─────────────────
  {
    id: 'fronius-symo-gen24',
    brand: 'Fronius',
    model: 'Symo GEN24 Plus & Reserva',
    year: 2020,
    capacity: 'Reserva 6.3 / 9.5 / 12.6 / 15.8 kWh',
    warranty: '10 years (with registration)',
    origin: 'Austria',
    efficiency: 97.9,
    peakPower: 15,
    continuousPower: 10,
    pricePerKwh: 1000,
    totalCost: 14500,
    builtInInverter: true,
    threePhase: true,
    highPower: true,
    evCharging: true,
    smartFeatures: true,
    threePhaseInverter: '3P: Fronius Symo GEN24 Plus',
    datasheetUrl: '/manus-storage/fronius-primo-gen24-datasheet_caab18e2.html',
    color: '#00EAD3',
    specifications: [
      { label: 'Country of Manufacture', value: 'Austria' },
      { label: 'Dimensions', value: '595 x 430 x 204 mm' },
      { label: 'Product Commencement Year', value: '2020' },
      { label: 'Weight', value: '21.5 kg' },
      { label: 'Warranty', value: '10 years (with product registration)' },
      { label: 'Cooling System', value: 'Active cooling (variable speed fan)' },
      { label: 'Inverter Type', value: 'Three-phase hybrid inverter' },
      { label: 'Operating Temperature', value: '-25°C to 60°C' },
      { label: 'Compatible Battery', value: 'Fronius Reserva 6.3 / 9.5 / 12.6 / 15.8 kWh', highlight: true },
    ],
    companyBackground: {
      founded: '1945',
      headquarters: 'Pettenbach, Austria',
      overview: 'Fronius International GmbH is an Austrian technology company with over 75 years of engineering excellence. The Symo GEN24 Plus is Fronius\'s flagship three-phase hybrid inverter, paired with the Fronius Reserva battery for a fully integrated Austrian-engineered energy storage solution. The Symo GEN24 Plus is designed for larger homes and commercial premises with three-phase power connections.',
      australiaPresence: 'Fronius has a dedicated Australian subsidiary with offices in Sydney and Melbourne, local technical support, and a large network of Fronius-certified installers. The Symo GEN24 Plus is a popular choice for premium three-phase installations in Australia.',
      certifications: 'CEC Approved, AS/NZS 4777.2, IEC 62109, CE, TÜV Austria, IP65',
    },
    compatibleInverters: [
      { name: 'Fronius Reserva Battery', type: 'Battery (DC-coupled)', notes: 'Fronius\'s own battery — fully integrated and optimised for the Symo GEN24 Plus.' },
      { name: 'BYD Battery-Box Premium HVM', type: 'Battery (DC-coupled)', notes: 'Also compatible with BYD HVM series for larger capacity options.' },
    ],
    features: [
      {
        category: 'Three-Phase Capability',
        items: [
          { label: 'Phase Balancing', value: 'Yes — automatic load balancing across all 3 phases' },
          { label: 'Backup Power', value: 'Full three-phase backup with Reserva battery — whole-home coverage' },
          { label: 'Peak Power Output', value: 'Up to 15 kW peak — suitable for large homes and commercial' },
          { label: 'Continuous Output', value: '10 kW continuous — handles large simultaneous loads' },
        ],
      },
      {
        category: 'Monitoring & Grid',
        items: [
          { label: 'Fronius Solar.web', value: 'Cloud monitoring, energy flow, and performance alerts' },
          { label: 'Smart Meter', value: 'Fronius Smart Meter included for precise consumption monitoring' },
          { label: 'VPP Ready', value: 'Yes — virtual power plant participation supported' },
          { label: 'Modbus TCP/RTU', value: 'Yes — for building management system integration' },
        ],
      },
    ],
  },

  // ── 9. FOXESS ECS ─────────────────────────────────────────
  {
    id: 'foxess-ecs',
    brand: 'FoxESS',
    model: 'ECS Series',
    year: 2020,
    capacity: 'Scalable 2.88 - 20.16 kWh',
    warranty: '10 years',
    origin: 'China',
    efficiency: 95,
    peakPower: 6,
    continuousPower: 3.6,
    pricePerKwh: 800,
    totalCost: 8000,
    builtInInverter: false,
    threePhase: true,
    highPower: 'partial',
    evCharging: false,
    smartFeatures: true,
    threePhaseInverter: '3P: FoxESS 3P Hybrid',
    datasheetUrl: '/manus-storage/foxess-ecs-datasheet_aef367af.html',
    color: '#00EAD3',
    specifications: [
      { label: 'Country of Manufacture', value: 'China' },
      { label: 'Dimensions', value: '620 x 220 x 600 mm per module' },
      { label: 'Product Commencement Year', value: '2020' },
      { label: 'Weight', value: '36 kg per module' },
      { label: 'Warranty', value: '10 years' },
      { label: 'Cooling System', value: 'Natural convection' },
      { label: 'Battery Chemistry', value: 'Lithium Iron Phosphate (LiFePO4)' },
      { label: 'Operating Temperature', value: '-10°C to 50°C' },
      { label: 'Usable Capacity', value: '2.88 kWh to 20.16 kWh (modular)', highlight: true },
    ],
    companyBackground: {
      founded: '2013',
      headquarters: 'Zhenjiang, Jiangsu, China',
      overview: 'FoxESS is a leading manufacturer of hybrid inverters and energy storage systems, with a strong focus on residential and small commercial markets. FoxESS has built a reputation for reliable, cost-effective products with a growing global presence. The ECS series offers excellent value per kWh, making it one of the most affordable modular battery systems available in Australia without compromising on quality.',
      australiaPresence: 'FoxESS has an Australian distributor network with CEC-approved products and local technical support available through authorised installers. FoxESS is growing rapidly in the Australian market as a value-focused alternative to premium brands.',
      certifications: 'CEC Approved, AS/NZS 4777.2, IEC 62619, CE, IP65',
    },
    compatibleInverters: [
      { name: 'FoxESS H1 Series (Single-Phase)', type: 'Hybrid Inverter', notes: '3–6 kW single-phase. Direct ECS battery integration.' },
      { name: 'FoxESS H3 Series (Three-Phase)', type: 'Hybrid Inverter (3-Phase)', notes: '6–12 kW three-phase. Compatible with ECS battery modules.' },
      { name: 'FoxESS AIO Series', type: 'All-in-One', notes: 'Integrated inverter and battery solution for compact installations.' },
    ],
    features: [
      {
        category: 'Value Proposition',
        items: [
          { label: 'Cost per kWh', value: '~$800 AUD — among the most affordable in the Lightning Energy range' },
          { label: 'Modular Expansion', value: 'Yes — 2.88 kWh increments up to 20.16 kWh' },
          { label: 'Reliability', value: 'Proven LiFePO4 chemistry with 10-year warranty' },
        ],
      },
      {
        category: 'Monitoring',
        items: [
          { label: 'App', value: 'FoxESS App (iOS & Android)' },
          { label: 'Web Portal', value: 'FoxESS cloud monitoring portal — real-time data' },
          { label: 'Smart Meter Integration', value: 'Yes — for accurate consumption monitoring' },
        ],
      },
    ],
  },

  // ── 10. GOODWE GW8.3 ──────────────────────────────────────
  {
    id: 'goodwe-gw83',
    brand: 'GoodWe',
    model: 'GW8.3-BAT-D-G20',
    year: 2023,
    capacity: '8 kWh usable',
    warranty: '10 years (70% capacity retention)',
    origin: 'China',
    efficiency: 98,
    peakPower: 8.3,
    continuousPower: 5,
    pricePerKwh: 875,
    totalCost: 9500,
    builtInInverter: true,
    threePhase: false,
    highPower: 'partial',
    evCharging: true,
    smartFeatures: true,
    datasheetUrl: '/manus-storage/goodwe-gw83-datasheet_cb1bf538.pdf',
    color: '#00EAD3',
    specifications: [
      { label: 'Country of Manufacture', value: 'China' },
      { label: 'Dimensions', value: '640 x 200 x 600 mm' },
      { label: 'Product Commencement Year', value: '2023' },
      { label: 'Weight', value: '38 kg' },
      { label: 'Warranty', value: '10 years (70% capacity retention)' },
      { label: 'Cooling System', value: 'Natural convection' },
      { label: 'Battery Chemistry', value: 'Lithium Iron Phosphate (LiFePO4)' },
      { label: 'Operating Temperature', value: '-10°C to 50°C' },
      { label: 'Usable Capacity', value: '8 kWh usable — 98% round-trip efficiency', highlight: true },
    ],
    companyBackground: {
      founded: '2010',
      headquarters: 'Suzhou, Jiangsu, China',
      overview: 'GoodWe is a publicly listed solar inverter and energy storage company (STAR Market: 688390) with over 5 million inverters installed in 100+ countries. GoodWe is known for high-efficiency products and strong after-sales support. The GW8.3-BAT-D-G20 achieves a class-leading 98% round-trip efficiency — the highest in the Lightning Energy range — making it the most energy-efficient residential battery available.',
      australiaPresence: 'GoodWe has a dedicated Australian office with local technical support, CEC-approved products, and a large installer network. GoodWe is consistently one of the top-selling inverter brands in Australia with strong market share in the residential segment.',
      certifications: 'CEC Approved, AS/NZS 4777.2, IEC 62619, CE, TÜV Rheinland, IP65',
    },
    compatibleInverters: [
      { name: 'GoodWe ET Series (Single-Phase)', type: 'Hybrid Inverter', notes: '3–6 kW single-phase. Direct Lynx Home F / GW8.3 battery integration.' },
      { name: 'GoodWe EH Series (Three-Phase)', type: 'Hybrid Inverter (3-Phase)', notes: '6–10 kW three-phase. Compatible with GW8.3 battery.' },
      { name: 'GoodWe ES Series', type: 'Hybrid Inverter', notes: 'Budget-friendly option for smaller systems with GoodWe batteries.' },
    ],
    features: [
      {
        category: 'Performance',
        items: [
          { label: 'Round-Trip Efficiency', value: '98% — highest efficiency in the Lightning Energy range' },
          { label: 'Depth of Discharge', value: '90%' },
          { label: 'Cycle Life', value: '>6,000 cycles at 80% DoD' },
          { label: 'Peak Power', value: '8.3 kW — handles high instantaneous loads' },
        ],
      },
      {
        category: 'Monitoring & Smart Features',
        items: [
          { label: 'App', value: 'SEMS Portal App (iOS & Android) — real-time monitoring' },
          { label: 'Web Portal', value: 'SEMS Portal — detailed energy analytics and history' },
          { label: 'Smart Export', value: 'Yes — intelligent grid export management' },
          { label: 'EV Charging', value: 'Yes — smart EV charging integration' },
        ],
      },
    ],
  },

  // ── 11. GOODWE ESA (THREE-PHASE) ──────────────────────────
  {
    id: 'goodwe-esa-3phase',
    brand: 'GoodWe',
    model: 'ESA Series (Three-Phase)',
    year: 2024,
    capacity: '5-108 kWh',
    warranty: '10 years',
    origin: 'China',
    efficiency: 97,
    peakPower: 20,
    continuousPower: 10,
    pricePerKwh: 820,
    totalCost: 12000,
    builtInInverter: true,
    threePhase: true,
    highPower: true,
    evCharging: true,
    smartFeatures: true,
    threePhaseInverter: '3P: GoodWe 3P / Fronius Symo',
    datasheetUrl: '/manus-storage/goodwe-gw20-datasheet_409c391d.html',
    color: '#00EAD3',
    specifications: [
      { label: 'Country of Manufacture', value: 'China' },
      { label: 'Dimensions', value: '600 x 600 x 1900 mm (cabinet)' },
      { label: 'Product Commencement Year', value: '2024' },
      { label: 'Weight', value: 'Approx. 600 kg (fully loaded cabinet)' },
      { label: 'Warranty', value: '10 years' },
      { label: 'Cooling System', value: 'Active cooling (HVAC integrated)' },
      { label: 'Battery Chemistry', value: 'Lithium Iron Phosphate (LiFePO4)' },
      { label: 'Operating Temperature', value: '-10°C to 45°C' },
      { label: 'Usable Capacity', value: '5 kWh to 108 kWh — commercial and large residential scale', highlight: true },
    ],
    companyBackground: {
      founded: '2010',
      headquarters: 'Suzhou, Jiangsu, China',
      overview: 'GoodWe is a publicly listed solar inverter and energy storage company with over 5 million inverters installed globally. The ESA Series (Three-Phase) is designed for large residential, commercial, and industrial applications requiring high-capacity energy storage. It is the largest capacity system in the Lightning Energy range, offering up to 108 kWh of storage in a single cabinet.',
      australiaPresence: 'GoodWe has a dedicated Australian office with local technical support and CEC-approved commercial products. The ESA series is suitable for commercial and large residential projects across Australia, with local installation support available through the GoodWe installer network.',
      certifications: 'CEC Approved, AS/NZS 4777.2, IEC 62619, CE, TÜV Rheinland, IP55',
    },
    compatibleInverters: [
      { name: 'GoodWe MT Series (Three-Phase)', type: 'Commercial Inverter (3-Phase)', notes: '25–80 kW three-phase. Designed specifically for ESA commercial systems.' },
      { name: 'GoodWe HT Series', type: 'Commercial Hybrid Inverter', notes: 'High-power three-phase hybrid for commercial energy storage applications.' },
      { name: 'Fronius Symo GEN24 Plus', type: 'Hybrid Inverter (3-Phase)', notes: 'Compatible for smaller ESA configurations in premium installations.' },
    ],
    features: [
      {
        category: 'Commercial Scale',
        items: [
          { label: 'Maximum Capacity', value: 'Up to 108 kWh — suitable for commercial premises and large homes' },
          { label: 'Peak Power Output', value: '20 kW — handles large commercial and industrial loads' },
          { label: 'Scalable Architecture', value: 'Modular cabinet design — expandable on-site without system replacement' },
        ],
      },
      {
        category: 'Applications',
        items: [
          { label: 'Commercial Buildings', value: 'Offices, retail centres, warehouses, schools' },
          { label: 'Large Residential', value: 'Acreage properties, farms, large homes' },
          { label: 'Demand Management', value: 'Peak demand reduction for commercial electricity tariffs' },
          { label: 'VPP / Grid Services', value: 'Yes — suitable for virtual power plant and grid services participation' },
        ],
      },
    ],
  },
];

export const datasheets = [
  { name: 'Tesla Powerwall 3 Official Datasheet', url: '/manus-storage/tesla-powerwall-3-datasheet_4c92d301.pdf' },
  { name: 'Sigenergy SigenStor Official Datasheet', url: '/manus-storage/sigenergy-sigenstor-datasheet_f2c49eaa.pdf' },
  { name: 'Sungrow SBR Series Official Datasheet', url: '/manus-storage/sungrow-sbr-datasheet_19fd9650.pdf' },
  { name: 'Anker Solix X1 Official Datasheet', url: '/manus-storage/anker-solix-x1-datasheet_a1e77f28.pdf' },
  { name: 'Enphase IQ Battery 5P Official Datasheet', url: '/manus-storage/enphase-iq5p-datasheet_34d559a3.pdf' },
  { name: 'BYD Battery-Box Premium Official Datasheet', url: '/manus-storage/byd-battery-datasheet_e05655d8.pdf' },
  { name: 'Fronius Primo GEN24 Plus Official Datasheet', url: '/manus-storage/fronius-primo-gen24-datasheet_caab18e2.html' },
  { name: 'Fronius Symo GEN24 Plus Official Datasheet', url: '/manus-storage/fronius-primo-gen24-datasheet_caab18e2.html' },
  { name: 'FoxESS ECS Series Official Datasheet', url: '/manus-storage/foxess-ecs-datasheet_aef367af.html' },
  { name: 'GoodWe GW8.3-BAT-D-G20 Official Datasheet', url: '/manus-storage/goodwe-gw83-datasheet_cb1bf538.pdf' },
  { name: 'GoodWe ESA Series (Three-Phase) Official Datasheet', url: '/manus-storage/goodwe-gw20-datasheet_409c391d.html' },
  { name: 'Lightning Energy Product Catalogue', url: 'https://lightning-energy.com.au' },
];
