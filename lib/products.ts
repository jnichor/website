import type { Product } from "./types";

// Helper to compute installments from price (3, 6, 12 cuotas sin interés)
function computeInstallments(price: number) {
  return [
    { months: 3, monthly: round2(price / 3) },
    { months: 6, monthly: round2(price / 6) },
    { months: 12, monthly: round2(price / 12) },
  ];
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

export const PRODUCTS: Product[] = [
  // ==================== LAPTOPS ====================
  {
    id: "p001",
    sku: "ASUS-ROG-G16-001",
    name: "ASUS ROG Strix G16 (2024) Intel Core i9 RTX 4070",
    slug: "asus-rog-strix-g16-i9-rtx4070",
    brand: "ASUS",
    description:
      "Laptop gaming de alto rendimiento con procesador Intel Core i9 de 14ª generación, GPU NVIDIA GeForce RTX 4070 y pantalla 16'' QHD 240Hz. Diseñada para los títulos AAA más exigentes y creación de contenido pesada.",
    shortDescription: "Gaming laptop 16'' QHD 240Hz, Core i9 + RTX 4070, 16GB DDR5.",
    price: 8499.0,
    originalPrice: 9299.0,
    installments: computeInstallments(8499.0),
    image:
      "https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1200&q=80",
    ],
    category: "laptops",
    tags: ["gaming", "RGB", "rtx-4070", "i9"],
    specs: [
      { label: "Procesador", value: "Intel Core i9-14900HX" },
      { label: "GPU", value: "NVIDIA GeForce RTX 4070 8GB" },
      { label: "RAM", value: "16GB DDR5 5600MHz" },
      { label: "Almacenamiento", value: "1TB NVMe PCIe 4.0" },
      { label: "Pantalla", value: "16'' QHD+ 2560x1600 240Hz" },
      { label: "Sistema", value: "Windows 11 Home" },
    ],
    highlights: [
      "Procesador Intel Core i9 de 14ª generación",
      "GPU NVIDIA RTX 4070 con DLSS 3.5",
      "Pantalla QHD+ 240Hz Pantone validada",
      "Teclado RGB por tecla con tecnología Aura Sync",
      "Refrigeración Tri-Fan ROG Intelligent Cooling",
    ],
    inBox: ["Laptop ASUS ROG Strix G16", "Cargador 280W", "Manual de usuario", "Garantía oficial"],
    warrantyMonths: 24,
    inStock: true,
    stockQty: 12,
    featured: true,
    isBestseller: true,
    rating: 4.8,
    reviewCount: 142,
  },
  {
    id: "p002",
    sku: "MSI-CYBORG-15-002",
    name: "MSI Cyborg 15 Intel Core i7 RTX 4060",
    slug: "msi-cyborg-15-i7-rtx4060",
    brand: "MSI",
    description:
      "Laptop gaming con diseño semitransparente futurista, procesador Intel Core i7 de 13ª generación y GPU RTX 4060 de 8GB. Ideal para gamers que buscan rendimiento sin gastar de más.",
    shortDescription: "15.6'' FHD 144Hz, Core i7 + RTX 4060, diseño semitransparente.",
    price: 5299.0,
    originalPrice: 5899.0,
    installments: computeInstallments(5299.0),
    image:
      "https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1542393545-10f5cde2c810?auto=format&fit=crop&w=1200&q=80",
    ],
    category: "laptops",
    tags: ["gaming", "rtx-4060", "i7", "144hz"],
    specs: [
      { label: "Procesador", value: "Intel Core i7-13620H" },
      { label: "GPU", value: "NVIDIA GeForce RTX 4060 8GB" },
      { label: "RAM", value: "16GB DDR5" },
      { label: "Almacenamiento", value: "512GB NVMe" },
      { label: "Pantalla", value: "15.6'' FHD 144Hz IPS" },
      { label: "Sistema", value: "Windows 11 Home" },
    ],
    highlights: [
      "GPU RTX 4060 con Ray Tracing y DLSS 3",
      "Pantalla 144Hz para gaming fluido",
      "Diseño semitransparente único",
      "Teclado retroiluminado",
    ],
    warrantyMonths: 24,
    inStock: true,
    stockQty: 18,
    featured: true,
    isNew: true,
    rating: 4.6,
    reviewCount: 89,
  },
  {
    id: "p003",
    sku: "APPLE-MBA-M3-003",
    name: "Apple MacBook Air 13'' M3 8GB 256GB",
    slug: "apple-macbook-air-m3-13",
    brand: "Apple",
    description:
      "La nueva MacBook Air con chip M3 redefine la portabilidad profesional. Hasta 18 horas de batería, pantalla Liquid Retina y diseño ultradelgado de 1.13 cm.",
    shortDescription: "13'' Liquid Retina, chip Apple M3, 18h batería.",
    price: 5499.0,
    installments: computeInstallments(5499.0),
    image:
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&w=1200&q=80",
    ],
    category: "laptops",
    tags: ["productividad", "ultraportable", "m3", "macbook"],
    specs: [
      { label: "Procesador", value: "Apple M3 (8 núcleos)" },
      { label: "GPU", value: "Apple M3 GPU 10 núcleos" },
      { label: "RAM", value: "8GB Memoria unificada" },
      { label: "Almacenamiento", value: "256GB SSD" },
      { label: "Pantalla", value: "13.6'' Liquid Retina" },
      { label: "Sistema", value: "macOS Sonoma" },
    ],
    highlights: [
      "Chip Apple M3 con Neural Engine",
      "Hasta 18 horas de batería",
      "Pantalla Liquid Retina con True Tone",
      "Diseño ultradelgado y silencioso (sin ventilador)",
    ],
    warrantyMonths: 12,
    inStock: true,
    stockQty: 7,
    rating: 4.9,
    reviewCount: 211,
  },

  // ==================== DESKTOPS ====================
  {
    id: "p004",
    sku: "NVT-PCGAMER-RYZEN7-004",
    name: "PC Gamer Ryzen 7 7700X RTX 4070 Super 32GB",
    slug: "pc-gamer-ryzen-7-7700x-rtx4070s",
    brand: "NovaTech",
    description:
      "PC Gamer prearmada por nuestros técnicos certificados. Ryzen 7 7700X + RTX 4070 Super para 1440p ultra y 4K con DLSS. Probada 24h antes del envío.",
    shortDescription: "Ryzen 7 + RTX 4070 Super, 32GB DDR5, 1TB NVMe.",
    price: 7299.0,
    originalPrice: 7899.0,
    installments: computeInstallments(7299.0),
    image:
      "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&w=1200&q=80",
    ],
    category: "desktops",
    tags: ["gaming", "armada", "ryzen", "rtx"],
    specs: [
      { label: "Procesador", value: "AMD Ryzen 7 7700X" },
      { label: "GPU", value: "NVIDIA RTX 4070 Super 12GB" },
      { label: "RAM", value: "32GB DDR5 6000MHz" },
      { label: "Almacenamiento", value: "1TB NVMe Gen4" },
      { label: "PSU", value: "Corsair RM850e 80+ Gold" },
      { label: "Case", value: "Lian Li LANCOOL 216 Mesh" },
    ],
    highlights: [
      "Armada y probada por técnicos certificados",
      "Cableado profesional con velcros",
      "Garantía total 12 meses sobre el sistema",
      "Lista para 1440p ultra a 144 fps",
    ],
    warrantyMonths: 12,
    inStock: true,
    stockQty: 5,
    featured: true,
    isBestseller: true,
    rating: 4.9,
    reviewCount: 67,
  },

  // ==================== COMPONENTES ====================
  {
    id: "p005",
    sku: "NVDA-RTX4070S-005",
    name: "NVIDIA GeForce RTX 4070 Super 12GB GDDR6X",
    slug: "nvidia-rtx-4070-super-12gb",
    brand: "NVIDIA",
    description:
      "La RTX 4070 Super entrega rendimiento de generación anterior premium a un precio accesible. DLSS 3.5 con Frame Generation y Ray Tracing de tercera generación.",
    shortDescription: "GPU 12GB GDDR6X, DLSS 3.5, Ray Tracing.",
    price: 2899.0,
    installments: computeInstallments(2899.0),
    image:
      "https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=1200&q=80",
    ],
    category: "componentes",
    tags: ["gpu", "nvidia", "ray-tracing", "dlss"],
    specs: [
      { label: "CUDA Cores", value: "7168" },
      { label: "Memoria", value: "12GB GDDR6X" },
      { label: "Bus de memoria", value: "192-bit" },
      { label: "TDP", value: "220W" },
      { label: "Conector", value: "12V-2x6 (PCIe Gen5)" },
    ],
    highlights: [
      "DLSS 3.5 con Frame Generation",
      "Ray Tracing de 3ra generación",
      "12GB GDDR6X para texturas 4K",
      "Hasta 2.5x más rápida que RTX 3070",
    ],
    warrantyMonths: 36,
    inStock: true,
    stockQty: 22,
    featured: true,
    rating: 4.8,
    reviewCount: 98,
  },
  {
    id: "p006",
    sku: "AMD-R7-7700X-006",
    name: "AMD Ryzen 7 7700X 8 núcleos AM5",
    slug: "amd-ryzen-7-7700x",
    brand: "AMD",
    description:
      "Procesador AMD Ryzen 7 7700X con 8 núcleos y 16 hilos sobre la nueva plataforma AM5. Ideal para gaming y creación de contenido.",
    shortDescription: "8 núcleos / 16 hilos, hasta 5.4GHz, AM5.",
    price: 1399.0,
    originalPrice: 1599.0,
    installments: computeInstallments(1399.0),
    image:
      "https://images.unsplash.com/photo-1555680202-c86f0e12f086?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1555680202-c86f0e12f086?auto=format&fit=crop&w=1200&q=80",
    ],
    category: "componentes",
    tags: ["cpu", "amd", "ryzen", "am5"],
    specs: [
      { label: "Núcleos / Hilos", value: "8 / 16" },
      { label: "Frecuencia base", value: "4.5 GHz" },
      { label: "Frecuencia boost", value: "5.4 GHz" },
      { label: "Caché L3", value: "32MB" },
      { label: "Socket", value: "AM5" },
      { label: "TDP", value: "105W" },
    ],
    highlights: [
      "Arquitectura Zen 4 a 5nm",
      "Soporte DDR5 y PCIe 5.0",
      "Gráficos integrados Radeon",
      "Desbloqueado para overclock",
    ],
    warrantyMonths: 36,
    inStock: true,
    stockQty: 30,
    rating: 4.7,
    reviewCount: 156,
  },
  {
    id: "p007",
    sku: "KING-FURY-32GB-007",
    name: "Kingston FURY Beast DDR5 32GB (2x16) 6000MHz",
    slug: "kingston-fury-beast-32gb-ddr5-6000",
    brand: "Kingston",
    description:
      "Kit de memoria DDR5 32GB optimizado para Intel y AMD. Frecuencia de 6000MHz con timings agresivos CL36, perfecto para gaming competitivo.",
    shortDescription: "Kit 2x16GB DDR5 6000MHz CL36 con disipador.",
    price: 549.0,
    installments: computeInstallments(549.0),
    image:
      "https://images.unsplash.com/photo-1592664474505-9c0e69a35b88?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1592664474505-9c0e69a35b88?auto=format&fit=crop&w=1200&q=80",
    ],
    category: "componentes",
    tags: ["ram", "ddr5", "kingston", "fury"],
    specs: [
      { label: "Capacidad", value: "32GB (2x16GB)" },
      { label: "Velocidad", value: "DDR5-6000" },
      { label: "Latencia", value: "CL36" },
      { label: "Voltaje", value: "1.35V" },
      { label: "Perfil", value: "XMP 3.0 / EXPO" },
    ],
    highlights: [
      "DDR5-6000 con CL36 agresivo",
      "Soporte Intel XMP 3.0 y AMD EXPO",
      "Disipador de aluminio bajo perfil",
      "Garantía limitada de por vida",
    ],
    warrantyMonths: 120,
    inStock: true,
    stockQty: 45,
    isBestseller: true,
    rating: 4.8,
    reviewCount: 203,
  },
  {
    id: "p008",
    sku: "SAMSUNG-980PRO-1TB-008",
    name: "Samsung 980 PRO 1TB NVMe PCIe 4.0",
    slug: "samsung-980-pro-1tb-nvme",
    brand: "Samsung",
    description:
      "SSD NVMe de máximo rendimiento con velocidades de lectura de hasta 7,000 MB/s. Diseñado para gaming AAA y workloads profesionales.",
    shortDescription: "SSD NVMe PCIe 4.0 1TB, 7000MB/s lectura.",
    price: 459.0,
    originalPrice: 549.0,
    installments: computeInstallments(459.0),
    image:
      "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?auto=format&fit=crop&w=1200&q=80",
    ],
    category: "almacenamiento",
    tags: ["ssd", "nvme", "samsung", "pcie4"],
    specs: [
      { label: "Capacidad", value: "1TB" },
      { label: "Interfaz", value: "PCIe 4.0 x4 NVMe 1.3c" },
      { label: "Lectura secuencial", value: "Hasta 7,000 MB/s" },
      { label: "Escritura secuencial", value: "Hasta 5,000 MB/s" },
      { label: "Resistencia", value: "600 TBW" },
    ],
    highlights: [
      "Velocidad PCIe 4.0 de 7,000 MB/s",
      "Controlador Samsung Elpis",
      "Compatible con PS5",
      "Garantía 5 años o 600 TBW",
    ],
    warrantyMonths: 60,
    inStock: true,
    stockQty: 35,
    featured: true,
    rating: 4.9,
    reviewCount: 187,
  },

  // ==================== PERIFÉRICOS ====================
  {
    id: "p009",
    sku: "LOGI-G-PRO-X-009",
    name: "Logitech G PRO X Superlight 2 Mouse Inalámbrico",
    slug: "logitech-g-pro-x-superlight-2",
    brand: "Logitech",
    description:
      "El mouse inalámbrico de competencia preferido por jugadores profesionales. Sensor HERO 2 a 32,000 DPI, peso 60g y 95 horas de batería.",
    shortDescription: "Mouse wireless 60g, sensor HERO 2 32K DPI.",
    price: 729.0,
    installments: computeInstallments(729.0),
    image:
      "https://images.unsplash.com/photo-1527814050087-3793815479db?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1527814050087-3793815479db?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1615663249654-2f2e6cf8f7cb?auto=format&fit=crop&w=1200&q=80",
    ],
    category: "perifericos",
    tags: ["mouse", "wireless", "gaming", "esports"],
    specs: [
      { label: "Sensor", value: "HERO 2 (32,000 DPI)" },
      { label: "Peso", value: "60g" },
      { label: "Batería", value: "Hasta 95 horas" },
      { label: "Conectividad", value: "LIGHTSPEED Wireless" },
      { label: "Switches", value: "LIGHTFORCE híbridos" },
    ],
    highlights: [
      "Sensor HERO 2 a 32K DPI con polling 8K",
      "Peso ultraligero de 60 gramos",
      "Switches LIGHTFORCE híbridos",
      "Batería de 95 horas",
    ],
    warrantyMonths: 24,
    inStock: true,
    stockQty: 28,
    isBestseller: true,
    rating: 4.9,
    reviewCount: 312,
  },
  {
    id: "p010",
    sku: "RAZER-HUNTSMAN-V3-010",
    name: "Razer Huntsman V3 Pro Tenkeyless",
    slug: "razer-huntsman-v3-pro-tkl",
    brand: "Razer",
    description:
      "Teclado mecánico TKL con switches ópticos analógicos Razer de segunda generación. Sensibilidad ajustable y Rapid Trigger para gaming competitivo.",
    shortDescription: "Teclado TKL óptico-analógico Razer, RGB Chroma.",
    price: 999.0,
    installments: computeInstallments(999.0),
    image:
      "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?auto=format&fit=crop&w=1200&q=80",
    ],
    category: "perifericos",
    tags: ["teclado", "mecanico", "gaming", "RGB"],
    specs: [
      { label: "Layout", value: "Tenkeyless (87 teclas)" },
      { label: "Switches", value: "Razer Analog Optical Gen-2" },
      { label: "Iluminación", value: "Razer Chroma RGB por tecla" },
      { label: "Polling", value: "8000 Hz" },
      { label: "Conexión", value: "USB-C extraíble" },
    ],
    highlights: [
      "Switches ópticos analógicos con sensibilidad regulable",
      "Rapid Trigger para reacción instantánea",
      "Polling rate 8000 Hz",
      "RGB Chroma con 16.8M de colores",
    ],
    warrantyMonths: 24,
    inStock: true,
    stockQty: 19,
    isNew: true,
    rating: 4.7,
    reviewCount: 87,
  },
  {
    id: "p011",
    sku: "CORSAIR-HS80-011",
    name: "Corsair HS80 RGB Wireless Audífonos Gaming",
    slug: "corsair-hs80-rgb-wireless",
    brand: "Corsair",
    description:
      "Audífonos gaming inalámbricos con sonido espacial Dolby Atmos, micrófono broadcast y batería de 20 horas. Diseño premium en aluminio.",
    shortDescription: "Headset wireless 7.1, Dolby Atmos, micro broadcast.",
    price: 749.0,
    installments: computeInstallments(749.0),
    image:
      "https://images.unsplash.com/photo-1599669454699-248893623440?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1599669454699-248893623440?auto=format&fit=crop&w=1200&q=80",
    ],
    category: "audio",
    tags: ["headset", "wireless", "gaming", "atmos"],
    specs: [
      { label: "Drivers", value: "50mm neodimio personalizados" },
      { label: "Audio", value: "Dolby Atmos + 7.1 surround" },
      { label: "Conectividad", value: "Wireless 2.4GHz + USB" },
      { label: "Batería", value: "Hasta 20 horas" },
      { label: "Micrófono", value: "Omnidireccional broadcast" },
    ],
    highlights: [
      "Sonido espacial Dolby Atmos",
      "20 horas de batería",
      "Construcción en aluminio premium",
      "Compatible con PC, Mac, PS5",
    ],
    warrantyMonths: 24,
    inStock: true,
    stockQty: 16,
    rating: 4.6,
    reviewCount: 124,
  },

  // ==================== MONITORES ====================
  {
    id: "p012",
    sku: "LG-27GP850-012",
    name: "LG UltraGear 27GP850 27'' QHD 165Hz Nano IPS",
    slug: "lg-ultragear-27gp850-qhd-165hz",
    brand: "LG",
    description:
      "Monitor gaming Nano IPS con 27'', QHD 1440p y 165Hz (overclock 180Hz). 1ms GtG y compatible con G-Sync y FreeSync Premium.",
    shortDescription: "27'' QHD Nano IPS 165Hz, 1ms, G-Sync compatible.",
    price: 1899.0,
    originalPrice: 2199.0,
    installments: computeInstallments(1899.0),
    image:
      "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1607706189992-eae578626c86?auto=format&fit=crop&w=1200&q=80",
    ],
    category: "monitores",
    tags: ["monitor", "gaming", "qhd", "165hz"],
    specs: [
      { label: "Tamaño", value: '27"' },
      { label: "Resolución", value: "2560 x 1440 QHD" },
      { label: "Tasa de refresco", value: "165Hz (OC 180Hz)" },
      { label: "Tiempo de respuesta", value: "1ms GtG" },
      { label: "Panel", value: "Nano IPS" },
      { label: "Sync", value: "NVIDIA G-Sync + AMD FreeSync Premium" },
    ],
    highlights: [
      "Panel Nano IPS con 98% DCI-P3",
      "1ms GtG para gaming competitivo",
      "G-Sync y FreeSync Premium",
      "HDR400 con DisplayHDR",
    ],
    warrantyMonths: 36,
    inStock: true,
    stockQty: 14,
    featured: true,
    rating: 4.8,
    reviewCount: 178,
  },

  // ==================== NETWORKING ====================
  {
    id: "p013",
    sku: "TPLINK-AX73-013",
    name: "TP-Link Archer AX73 Router WiFi 6 AX5400",
    slug: "tp-link-archer-ax73-wifi6",
    brand: "TP-Link",
    description:
      "Router WiFi 6 con velocidad combinada de 5400 Mbps. 6 antenas de alta ganancia, OFDMA y MU-MIMO para hogares con muchos dispositivos conectados.",
    shortDescription: "Router WiFi 6 AX5400, 6 antenas, OFDMA + MU-MIMO.",
    price: 549.0,
    installments: computeInstallments(549.0),
    image:
      "https://images.unsplash.com/photo-1606904825846-647eb07f5be2?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1606904825846-647eb07f5be2?auto=format&fit=crop&w=1200&q=80",
    ],
    category: "networking",
    tags: ["router", "wifi6", "tp-link"],
    specs: [
      { label: "Estándar", value: "WiFi 6 (802.11ax)" },
      { label: "Velocidad", value: "AX5400 (4804 + 574 Mbps)" },
      { label: "Antenas", value: "6 externas de alta ganancia" },
      { label: "Puertos", value: "1 WAN gigabit + 4 LAN gigabit" },
      { label: "USB", value: "1x USB 3.0" },
    ],
    highlights: [
      "WiFi 6 con OFDMA para hogares densos",
      "6 antenas con Beamforming",
      "Compatible con HomeShield",
      "Procesador triple-core 1.5GHz",
    ],
    warrantyMonths: 36,
    inStock: true,
    stockQty: 24,
    rating: 4.6,
    reviewCount: 92,
  },

  // ==================== SMART HOME ====================
  {
    id: "p014",
    sku: "TPLINK-TAPO-C520WS-014",
    name: "TP-Link Tapo C520WS Cámara 4MP Outdoor 360°",
    slug: "tp-link-tapo-c520ws-camara",
    brand: "TP-Link",
    description:
      "Cámara de vigilancia exterior 4MP con visión panorámica 360°, audio bidireccional, visión nocturna a color y resistencia IP66.",
    shortDescription: "Cámara WiFi outdoor 4MP, 360°, IP66, color noche.",
    price: 349.0,
    installments: computeInstallments(349.0),
    image:
      "https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=1200&q=80",
    ],
    category: "smart-home",
    tags: ["camara", "smart", "outdoor", "wifi"],
    specs: [
      { label: "Resolución", value: "4MP (2560x1440)" },
      { label: "Visión", value: "Pan 360° / Tilt 130°" },
      { label: "Visión nocturna", value: "A color hasta 30m" },
      { label: "Resistencia", value: "IP66" },
      { label: "Almacenamiento", value: "MicroSD hasta 512GB / Cloud" },
    ],
    highlights: [
      "Visión panorámica 360°",
      "Detección de personas con IA",
      "Audio bidireccional",
      "Resistente a lluvia y polvo IP66",
    ],
    warrantyMonths: 24,
    inStock: true,
    stockQty: 38,
    isNew: true,
    rating: 4.5,
    reviewCount: 64,
  },

  // ==================== ACCESORIOS ====================
  {
    id: "p015",
    sku: "ANKER-737-USB-C-015",
    name: "Anker 737 PowerExpand 13-en-1 USB-C Hub",
    slug: "anker-737-usb-c-hub-13in1",
    brand: "Anker",
    description:
      "Hub USB-C profesional 13-en-1 con doble HDMI 4K, salida DisplayPort, lectores SD/microSD, Ethernet gigabit y 100W de Power Delivery.",
    shortDescription: "Hub USB-C 13-en-1, doble 4K, 100W PD, Ethernet.",
    price: 449.0,
    installments: computeInstallments(449.0),
    image:
      "https://images.unsplash.com/photo-1625948515291-69613efd103f?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1625948515291-69613efd103f?auto=format&fit=crop&w=1200&q=80",
    ],
    category: "accesorios",
    tags: ["hub", "usb-c", "anker", "productividad"],
    specs: [
      { label: "Puertos", value: "13 en total" },
      { label: "HDMI", value: "2x HDMI 4K@60Hz" },
      { label: "DisplayPort", value: "1x DP 1.4 4K@60Hz" },
      { label: "USB-A", value: "3x USB-A 3.0" },
      { label: "Ethernet", value: "Gigabit LAN" },
      { label: "Power Delivery", value: "Pasthrough 100W" },
    ],
    highlights: [
      "Doble pantalla 4K externa simultánea",
      "Power Delivery 100W passthrough",
      "Ethernet gigabit incorporado",
      "Compatible con MacBook y Windows",
    ],
    warrantyMonths: 18,
    inStock: true,
    stockQty: 22,
    rating: 4.7,
    reviewCount: 145,
  },
  {
    id: "p016",
    sku: "WD-BLACK-2TB-EXT-016",
    name: "WD Black P10 2TB Disco Externo Gaming",
    slug: "wd-black-p10-2tb-externo",
    brand: "WD",
    description:
      "Disco duro externo robusto diseñado para gamers. Compatible con PS5, Xbox Series X|S y PC. Almacena hasta 50 juegos.",
    shortDescription: "HDD externo 2TB para PS5/Xbox/PC, USB 3.2.",
    price: 399.0,
    installments: computeInstallments(399.0),
    image:
      "https://images.unsplash.com/photo-1531492746076-161ca9bcad58?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1531492746076-161ca9bcad58?auto=format&fit=crop&w=1200&q=80",
    ],
    category: "almacenamiento",
    tags: ["hdd", "externo", "gaming", "wd"],
    specs: [
      { label: "Capacidad", value: "2TB" },
      { label: "Interfaz", value: "USB 3.2 Gen 1" },
      { label: "Velocidad", value: "Hasta 140 MB/s" },
      { label: "Compatibilidad", value: "PS5, Xbox, PC, Mac" },
      { label: "Tamaño", value: "Portátil 2.5''" },
    ],
    highlights: [
      "Diseñado para consolas y PC",
      "Carcasa metálica resistente",
      "Plug & play sin software",
      "Garantía 3 años",
    ],
    warrantyMonths: 36,
    inStock: true,
    stockQty: 41,
    rating: 4.5,
    reviewCount: 88,
  },
  {
    id: "p017",
    sku: "INTEL-I5-13600K-017",
    name: "Intel Core i5-13600K 14 núcleos LGA1700",
    slug: "intel-core-i5-13600k",
    brand: "Intel",
    description:
      "Procesador Intel Core i5-13600K con arquitectura híbrida de 14 núcleos (6P + 8E) y 20 hilos. Excelente relación rendimiento/precio para gaming.",
    shortDescription: "14 núcleos (6P+8E), 20 hilos, hasta 5.1GHz.",
    price: 1299.0,
    originalPrice: 1499.0,
    installments: computeInstallments(1299.0),
    image:
      "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&w=1200&q=80",
    ],
    category: "componentes",
    tags: ["cpu", "intel", "core-i5", "lga1700"],
    specs: [
      { label: "Núcleos / Hilos", value: "14 (6P + 8E) / 20" },
      { label: "Frecuencia turbo", value: "Hasta 5.1 GHz" },
      { label: "Caché", value: "24MB L3" },
      { label: "Socket", value: "LGA 1700" },
      { label: "TDP", value: "125W base / 181W turbo" },
    ],
    highlights: [
      "Arquitectura híbrida P-cores y E-cores",
      "Soporte DDR4 y DDR5",
      "Desbloqueado para overclock",
      "Gráficos integrados Intel UHD 770",
    ],
    warrantyMonths: 36,
    inStock: true,
    stockQty: 18,
    rating: 4.8,
    reviewCount: 211,
  },
  {
    id: "p018",
    sku: "GIGABYTE-X670-018",
    name: "Gigabyte X670 AORUS Elite AX Motherboard AM5",
    slug: "gigabyte-x670-aorus-elite-ax",
    brand: "Gigabyte",
    description:
      "Motherboard AM5 con chipset X670, soporte DDR5, PCIe 5.0, WiFi 6E y disipadores robustos. Perfecta para builds Ryzen 7000 de alta gama.",
    shortDescription: "X670 ATX, DDR5, PCIe 5.0, WiFi 6E.",
    price: 1199.0,
    installments: computeInstallments(1199.0),
    image:
      "https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&w=1200&q=80",
    ],
    category: "componentes",
    tags: ["motherboard", "am5", "x670", "gigabyte"],
    specs: [
      { label: "Chipset", value: "AMD X670" },
      { label: "Socket", value: "AM5" },
      { label: "Memoria", value: "DDR5 hasta 6666 MHz, 4 slots" },
      { label: "PCIe", value: "PCIe 5.0 x16" },
      { label: "M.2", value: "4 slots (3x PCIe 4.0)" },
      { label: "WiFi", value: "WiFi 6E + Bluetooth 5.3" },
    ],
    highlights: [
      "VRM de 16+2+2 fases",
      "PCIe 5.0 para GPU y NVMe",
      "WiFi 6E integrado",
      "RGB Fusion 2.0",
    ],
    warrantyMonths: 36,
    inStock: true,
    stockQty: 9,
    rating: 4.7,
    reviewCount: 56,
  },
];

export function getAllProducts(): Product[] {
  return PRODUCTS;
}

export function getProductBySlug(slug: string): Product | undefined {
  return PRODUCTS.find((p) => p.slug === slug);
}

export function getProductById(id: string): Product | undefined {
  return PRODUCTS.find((p) => p.id === id);
}

export function getFeaturedProducts(limit = 4): Product[] {
  return PRODUCTS.filter((p) => p.featured).slice(0, limit);
}

export function getProductsByCategory(category: string): Product[] {
  return PRODUCTS.filter((p) => p.category === category);
}

export function getRelatedProducts(productId: string, limit = 4): Product[] {
  const current = getProductById(productId);
  if (!current) return [];
  return PRODUCTS.filter((p) => p.category === current.category && p.id !== productId).slice(
    0,
    limit
  );
}

export function getAllBrands(): string[] {
  return Array.from(new Set(PRODUCTS.map((p) => p.brand))).sort();
}
