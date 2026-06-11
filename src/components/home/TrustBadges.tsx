const badges = [
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 12H3l9-9 9 9h-2M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"/>
        <path d="M9 21v-6a2 2 0 012-2h2a2 2 0 012 2v6"/>
      </svg>
    ),
    title: "Envíos a todo el país",
    subtitle: "Gratis desde $150.000",
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
        <line x1="1" y1="10" x2="23" y2="10"/>
      </svg>
    ),
    title: "3 cuotas sin interés",
    subtitle: "Con todas las tarjetas",
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="1 4 1 10 7 10"/>
        <path d="M3.51 15a9 9 0 102.13-9.36L1 10"/>
      </svg>
    ),
    title: "Cambios sin cargo",
    subtitle: "Hasta 30 días de la compra",
  },
];

export function TrustBadges() {
  return (
    <section className="bg-[#F3E6E6] border-y border-[#DCCBB8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-0 sm:divide-x sm:divide-[#DCCBB8]">
          {badges.map((badge) => (
            <div key={badge.title} className="flex items-center gap-4 sm:justify-center sm:px-8">
              <span className="text-[#C8A86B] shrink-0">{badge.icon}</span>
              <div>
                <p className="text-sm font-semibold text-[#6E5C52] tracking-wide">
                  {badge.title}
                </p>
                <p className="text-xs text-[#B8A79B] mt-0.5">{badge.subtitle}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
