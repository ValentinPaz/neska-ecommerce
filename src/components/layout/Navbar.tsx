"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const links = [
  { label: "Catálogo Completo", href: "/catalogo" },
  { label: "Camisas",           href: "/catalogo?categoria=camisas" },
  { label: "Blusas",            href: "/catalogo?categoria=blusas" },
  { label: "Sweaters",          href: "/catalogo?categoria=sweaters" },
  { label: "Pañuelos",          href: "/catalogo?categoria=panuelos" },
  { label: "Contacto",          href: "/contacto" },
];

export function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="hidden md:flex items-center justify-center gap-8 py-3 border-t border-[#DCCBB8] bg-[#F9F7F4]">
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={cn(
            "text-xs tracking-widest uppercase font-medium transition-colors hover:text-[#C8A86B]",
            pathname === link.href ? "text-[#C8A86B]" : "text-[#6E5C52]"
          )}
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );
}
