import Link from "next/link";
import { Search, User } from "lucide-react";
import { MobileMenu } from "./MobileMenu";
import { CartButton } from "./CartButton";

export function Header() {
  return (
    <header className="sticky top-0 z-50 bg-[#F9F7F4] border-b border-[#DCCBB8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Mobile menu trigger */}
          <MobileMenu />

          {/* Logo */}
          <Link
            href="/"
            className="font-heading font-bold text-2xl md:text-3xl tracking-[0.2em] text-[#C8A86B] uppercase shrink-0"
          >
            NESKA
            <span className="block text-[10px] tracking-[0.4em] text-[#B8A79B] font-normal -mt-1 text-center">
              Bs As
            </span>
          </Link>

          {/* Search bar (desktop) */}
          <div className="hidden md:flex flex-1 max-w-md relative">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#B8A79B]"
            />
            <input
              type="search"
              placeholder="¿Qué estás buscando?"
              className="w-full pl-9 pr-4 py-2 text-sm bg-white border border-[#DCCBB8] rounded text-[#6E5C52] placeholder:text-[#B8A79B] focus:outline-none focus:border-[#C8A86B] transition-colors"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <Link
              href="/cuenta"
              className="hidden md:flex flex-col items-center gap-0.5 text-[#6E5C52] hover:text-[#C8A86B] transition-colors"
            >
              <User size={22} strokeWidth={1.5} />
              <span className="text-[10px] tracking-wider uppercase">Mi cuenta</span>
            </Link>
            <CartButton />
          </div>
        </div>
      </div>
    </header>
  );
}
