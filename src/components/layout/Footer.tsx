import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-[#6E5C52] text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Brand */}
          <div className="flex flex-col gap-3">
            <span className="font-heading text-2xl tracking-[0.2em] text-[#C8A86B] uppercase">
              NESKA
            </span>
            <p className="text-xs tracking-widest text-[#B8A79B] uppercase">Bs As</p>
            <p className="text-sm text-white/70 mt-2 leading-relaxed">
              Moda femenina elegante y atemporal. Diseñada para la mujer moderna de Buenos Aires.
            </p>
            <a
              href="https://instagram.com/neska.bsas"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-white/70 hover:text-[#C8A86B] transition-colors mt-2 w-fit text-sm"
            >
              {/* Instagram icon */}
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                <circle cx="12" cy="12" r="4"/>
                <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none"/>
              </svg>
              @neska.bsas
            </a>
          </div>

          {/* Navigation */}
          <div className="flex flex-col gap-3">
            <h4 className="text-xs tracking-widest uppercase text-[#C8A86B] font-semibold mb-2">
              Navegación
            </h4>
            {[
              { label: "Catálogo", href: "/catalogo" },
              { label: "Camisas",  href: "/catalogo?categoria=camisas" },
              { label: "Blusas",   href: "/catalogo?categoria=blusas" },
              { label: "Sweaters", href: "/catalogo?categoria=sweaters" },
              { label: "Contacto", href: "/contacto" },
            ].map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="text-sm text-white/70 hover:text-white transition-colors w-fit"
              >
                {l.label}
              </Link>
            ))}
          </div>

          {/* Info */}
          <div className="flex flex-col gap-3">
            <h4 className="text-xs tracking-widest uppercase text-[#C8A86B] font-semibold mb-2">
              Información
            </h4>
            <p className="text-sm text-white/70">
              Envíos a todo el país
            </p>
            <p className="text-sm text-white/70">
              3 cuotas sin interés
            </p>
            <p className="text-sm text-white/70">
              Cambios sin cargo
            </p>
            <p className="text-sm text-white/70 mt-2">
              Lunes a viernes 10–18 hs
            </p>
          </div>
        </div>

        <div className="border-t border-white/10 mt-10 pt-6 text-center">
          <p className="text-xs text-white/40">
            © {new Date().getFullYear()} NESKA Bs As. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
