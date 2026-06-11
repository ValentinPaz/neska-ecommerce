import type { Metadata } from "next";
import { HeroCarousel } from "@/components/home/HeroCarousel";
import { TrustBadges } from "@/components/home/TrustBadges";
import { LatestProducts } from "@/components/home/LatestProducts";
import { getLatestShopProducts } from "@/lib/db/shop";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "NESKA Bs As | Moda Femenina",
  description:
    "Ropa femenina elegante y atemporal. Envíos a todo el país. 3 cuotas sin interés.",
};

export default async function HomePage() {
  const latestProducts = await getLatestShopProducts(4);

  return (
    <>
      <HeroCarousel />
      <TrustBadges />
      <LatestProducts products={latestProducts} />
    </>
  );
}
