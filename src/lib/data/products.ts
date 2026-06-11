import { Category, Product } from "@/types";

export const categories: Category[] = [
  { id: "1", name: "Camisas",   slug: "camisas",   count: 12 },
  { id: "2", name: "Blusas",    slug: "blusas",    count: 18 },
  { id: "3", name: "Sweaters",  slug: "sweaters",  count: 9  },
  { id: "4", name: "Pañuelos",  slug: "panuelos",  count: 6  },
];

export const products: Product[] = [
  {
    id: "1",
    slug: "camisa-lino-off-white",
    name: "Camisa Lino Off White",
    description: "Camisa de lino de corte recto, ideal para el día a día.",
    price: 98900,
    images: [],
    category: categories[0],
    sizes: ["S", "M", "L", "XL"],
    isNew: true,
    createdAt: "2026-06-01",
  },
  {
    id: "2",
    slug: "blusa-saten-rosa",
    name: "Blusa Satén Rosa",
    description: "Blusa de satén suave con cuello en V y manga corta.",
    price: 39800,
    images: ["/images/products/blusas-y-top.png"],
    category: categories[1],
    sizes: ["S", "M", "L"],
    isNew: true,
    createdAt: "2026-06-03",
  },
  {
    id: "3",
    slug: "blusa-manga-larga-nude",
    name: "Blusa Manga Larga Nude",
    description: "Blusa fluida manga larga en tono nude empolvado.",
    price: 53900,
    images: ["/images/products/imana-ksxtSOk1HTI-unsplash.jpg"],
    category: categories[1],
    sizes: ["S", "M", "L", "XL"],
    isNew: false,
    createdAt: "2026-05-28",
  },
  {
    id: "4",
    slug: "sweater-animal-print",
    name: "Sweater Animal Print",
    description: "Sweater suave con estampa animal print, cuello redondo.",
    price: 67500,
    images: ["/images/products/rydale-clothing-KngjdKCxSxI-unsplash.jpg"],
    category: categories[2],
    sizes: ["M", "L", "XL"],
    isNew: false,
    createdAt: "2026-05-20",
  },
  {
    id: "5",
    slug: "camisa-rayas-azul",
    name: "Camisa Rayas Azul",
    description: "Camisa de algodón con rayas clásicas, corte entallado.",
    price: 72000,
    images: [],
    category: categories[0],
    sizes: ["S", "M", "L"],
    isNew: false,
    createdAt: "2026-05-15",
  },
  {
    id: "6",
    slug: "blusa-verde-esmeralda",
    name: "Blusa Verde Esmeralda",
    description: "Blusa vibrante en verde esmeralda, perfecta para destacar.",
    price: 45900,
    images: ["/images/products/ola-szkolda-K_MTUWF3UHU-unsplash.jpg"],
    category: categories[1],
    sizes: ["S", "M", "L", "XL"],
    isNew: true,
    createdAt: "2026-06-05",
  },
];

export const latestProducts = products
  .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  .slice(0, 4);
