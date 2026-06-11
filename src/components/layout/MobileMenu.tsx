"use client";

import { Menu } from "lucide-react";
import Link from "next/link";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const links = [
  { label: "Catálogo Completo", href: "/catalogo" },
  { label: "Camisas",           href: "/catalogo?categoria=camisas" },
  { label: "Blusas",            href: "/catalogo?categoria=blusas" },
  { label: "Sweaters",          href: "/catalogo?categoria=sweaters" },
  { label: "Pañuelos",          href: "/catalogo?categoria=panuelos" },
  { label: "Contacto",          href: "/contacto" },
];

export function MobileMenu() {
  return (
    <Sheet>
      <SheetTrigger className="md:hidden text-[#6E5C52] hover:text-[#C8A86B] transition-colors bg-transparent border-none p-0 cursor-pointer">
        <Menu size={24} strokeWidth={1.5} />
      </SheetTrigger>
      <SheetContent side="left" className="bg-[#F9F7F4] border-[#DCCBB8] w-72">
        <SheetHeader>
          <SheetTitle className="font-heading text-2xl text-[#C8A86B] tracking-widest text-left">
            NESKA
          </SheetTitle>
        </SheetHeader>
        <nav className="flex flex-col gap-1 mt-8">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="py-3 px-2 text-sm tracking-widest uppercase text-[#6E5C52] hover:text-[#C8A86B] hover:bg-[#F3E6E6] rounded transition-colors border-b border-[#DCCBB8] last:border-0"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  );
}
