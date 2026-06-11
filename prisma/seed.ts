import "dotenv/config";
import { PrismaClient } from "../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Iniciando seed...");

  // Categorías
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: "camisas" },
      update: {},
      create: { name: "Camisas", slug: "camisas", position: 0 },
    }),
    prisma.category.upsert({
      where: { slug: "blusas" },
      update: {},
      create: { name: "Blusas", slug: "blusas", position: 1 },
    }),
    prisma.category.upsert({
      where: { slug: "sweaters" },
      update: {},
      create: { name: "Sweaters", slug: "sweaters", position: 2 },
    }),
    prisma.category.upsert({
      where: { slug: "panuelos" },
      update: {},
      create: { name: "Pañuelos", slug: "panuelos", position: 3 },
    }),
  ]);
  console.log(`✅ ${categories.length} categorías creadas`);

  const [camisas, blusas, sweaters] = categories;

  // Productos
  const productsData = [
    {
      slug: "blusa-saten-rosa",
      name: "Blusa Satén Rosa",
      description: "Blusa de satén suave con cuello en V y manga corta.",
      price: 39800,
      isNew: true,
      isActive: true,
      categoryId: blusas.id,
      images: [{ url: "/images/products/blusas-y-top.png", position: 0 }],
      variants: [
        { size: "S", stock: 5 },
        { size: "M", stock: 8 },
        { size: "L", stock: 3 },
      ],
    },
    {
      slug: "blusa-manga-larga-nude",
      name: "Blusa Manga Larga Nude",
      description: "Blusa fluida manga larga en tono nude empolvado.",
      price: 53900,
      isNew: false,
      isActive: true,
      categoryId: blusas.id,
      images: [{ url: "/images/products/imana-ksxtSOk1HTI-unsplash.jpg", position: 0 }],
      variants: [
        { size: "S", stock: 4 },
        { size: "M", stock: 6 },
        { size: "L", stock: 2 },
        { size: "XL", stock: 1 },
      ],
    },
    {
      slug: "sweater-animal-print",
      name: "Sweater Animal Print",
      description: "Sweater suave con estampa animal print, cuello redondo.",
      price: 67500,
      isNew: false,
      isActive: true,
      categoryId: sweaters.id,
      images: [{ url: "/images/products/rydale-clothing-KngjdKCxSxI-unsplash.jpg", position: 0 }],
      variants: [
        { size: "M", stock: 3 },
        { size: "L", stock: 5 },
        { size: "XL", stock: 2 },
      ],
    },
    {
      slug: "blusa-verde-esmeralda",
      name: "Blusa Verde Esmeralda",
      description: "Blusa vibrante en verde esmeralda, perfecta para destacar.",
      price: 45900,
      isNew: true,
      isActive: true,
      categoryId: blusas.id,
      images: [{ url: "/images/products/ola-szkolda-K_MTUWF3UHU-unsplash.jpg", position: 0 }],
      variants: [
        { size: "S", stock: 7 },
        { size: "M", stock: 9 },
        { size: "L", stock: 4 },
        { size: "XL", stock: 0 },
      ],
    },
    {
      slug: "camisa-lino-off-white",
      name: "Camisa Lino Off White",
      description: "Camisa de lino de corte recto, ideal para el día a día.",
      price: 98900,
      isNew: true,
      isActive: true,
      categoryId: camisas.id,
      images: [],
      variants: [
        { size: "S", stock: 6 },
        { size: "M", stock: 10 },
        { size: "L", stock: 5 },
        { size: "XL", stock: 3 },
      ],
    },
    {
      slug: "camisa-rayas-azul",
      name: "Camisa Rayas Azul",
      description: "Camisa de algodón con rayas clásicas, corte entallado.",
      price: 72000,
      isNew: false,
      isActive: true,
      categoryId: camisas.id,
      images: [],
      variants: [
        { size: "S", stock: 2 },
        { size: "M", stock: 4 },
        { size: "L", stock: 0 },
      ],
    },
  ];

  for (const data of productsData) {
    const { images, variants, ...productData } = data;
    await prisma.product.upsert({
      where: { slug: productData.slug },
      update: { price: productData.price },
      create: {
        ...productData,
        images: { create: images },
        variants: { create: variants },
      },
    });
  }
  console.log(`✅ ${productsData.length} productos creados`);

  // Admin user
  const adminEmail = process.env.ADMIN_EMAIL ?? "admin@neska.com";
  const adminPassword = process.env.ADMIN_PASSWORD ?? "Admin1234!";
  const passwordHash = await bcrypt.hash(adminPassword, 12);

  await prisma.adminUser.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      passwordHash,
      name: "Admin NESKA",
      role: "SUPER_ADMIN",
    },
  });
  console.log(`✅ Admin creado: ${adminEmail}`);
  console.log("🎉 Seed completado");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
