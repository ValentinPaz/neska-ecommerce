# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

> **Important**: This project uses Next.js 16, which has breaking changes from earlier versions. Read `node_modules/next/dist/docs/` before writing any Next.js-specific code. The key changes most likely to affect you are listed below.

## Commands

```bash
npm run dev      # start dev server (Turbopack, localhost:3000)
npm run build    # production build + type check
npm run start    # serve production build
npx tsc --noEmit # type-check only (no lint script configured)

# Database (requires DATABASE_URL in .env)
npm run db:generate  # npx prisma generate (run after schema changes)
npm run db:migrate   # npx prisma migrate dev
npm run db:push      # npx prisma db push (no migration files)
npm run db:seed      # tsx prisma/seed.ts
npm run db:studio    # Prisma Studio GUI
```

No test runner is configured.

## Key Breaking Changes in This Stack

### Next.js 16
- **`params` and `searchParams` are Promises** — always `await` them in pages/layouts:
  ```tsx
  export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params
  }
  ```
- **`middleware.ts` → `proxy.ts`** — `middleware` file convention is deprecated in Next.js 16; use `src/proxy.ts`.
- **`next build` no longer runs the linter** — run it separately if needed.
- Turbopack is the default dev bundler; use `next dev --webpack` to opt out.

### shadcn/ui v4 + @base-ui/react
shadcn components in this project are built on `@base-ui/react` (not Radix UI). The APIs differ:
- `SheetTrigger` has **no `asChild` prop** — style it directly or use the `render` prop.
- Dialog/Sheet use `data-starting-style` / `data-ending-style` attributes for animations.

### Tailwind CSS v4
- **No `tailwind.config.js`** — all theme config lives in `globals.css` inside `@theme inline { }`.
- Brand tokens are CSS custom properties under `:root` and mapped in `@theme inline`.
- Use `@layer utilities` to add custom utility classes.

## Architecture

### Routing
All user-facing pages live in `src/app/(shop)/`. The route group adds no URL segment but applies `(shop)/layout.tsx` — which renders `AnnouncementBar → Header → Navbar → <main> → Footer` for every page automatically.

```
src/app/
├── layout.tsx          ← root layout: fonts (Playfair Display + Inter), metadata, html/body
└── (shop)/
    ├── layout.tsx      ← shop shell: AnnouncementBar, Header, Navbar, Footer
    ├── page.tsx        ← /  (home)
    ├── catalogo/
    │   ├── page.tsx    ← /catalogo
    │   └── [slug]/page.tsx  ← /catalogo/:slug (product detail)
    └── contacto/page.tsx
```

### Design System
All brand tokens are defined in `src/app/globals.css`:

| Token | Value | Role |
|---|---|---|
| `--neska-ivory` / `--background` | `#F9F7F4` | Page background |
| `--neska-rose` / `--secondary` | `#F3E6E6` | Section backgrounds |
| `--neska-gold` / `--primary` | `#C8A86B` | CTA buttons, accents |
| `--neska-brown` / `--foreground` | `#6E5C52` | Body text |
| `--neska-beige` / `--border` | `#DCCBB8` | Borders, dividers |
| `--neska-taupe` / `--muted-foreground` | `#B8A79B` | Secondary text |

Typography: `--font-heading` = Playfair Display (serif, for all `h1–h6`), `--font-sans` = Inter.

Use Tailwind's generated color classes (`bg-primary`, `text-foreground`, etc.) — they resolve through the `@theme inline` block. Use the raw hex only when the semantic token doesn't express the intent.

### State Management
Cart state lives in `src/lib/store/cart.ts` — a Zustand store with `persist` middleware persisted to localStorage under the key `neska-cart`. Any component accessing cart state must be a Client Component (`"use client"`).

### Data Layer
`src/lib/data/products.ts` exports static mock arrays (`products`, `categories`, `latestProducts`). Used by the shop frontend (catalog, product detail). The admin uses real Prisma queries against PostgreSQL.

Prices are integers in ARS pesos (no decimals).

### Backend / Admin
- **Prisma 7** — `prisma/schema.prisma` (no `url` in datasource), `prisma.config.ts` at project root holds the DB URL via `defineConfig`.
- **Prisma runtime** — uses `@prisma/adapter-pg` (adapter pattern, not built-in connector). `src/lib/prisma.ts` creates `PrismaPg` adapter and passes it to `new PrismaClient({ adapter })`.
- **Generated client** — at `generated/prisma/client.ts`. Import as `@generated/prisma/client` (tsconfig alias).
- **Auth** — JWT via `jose` stored in httpOnly cookie `admin-token`. `src/lib/auth.ts` has `signToken`, `verifyToken`, `getAdminSession`. Proxy (`src/proxy.ts`) protects `/admin/:path*`.
- **API routes** — all under `src/app/api/admin/`: `auth/login`, `auth/logout`, `productos`, `productos/[id]`, `productos/[id]/stock`, `categorias`, `categorias/[id]`, `upload`.
- **Admin pages** — `src/app/admin/` with `layout.tsx` (dark sidebar + mobile hamburger). All server pages export `dynamic = "force-dynamic"`.
- **Zod 4 + react-hook-form** — do NOT use `.default()` or `z.coerce` in schemas used with `zodResolver`. Use `z.number()` with `valueAsNumber: true` on inputs, and set defaults in `defaultValues`.

### Utilities
`src/lib/utils.ts` exports:
- `cn(...)` — clsx + tailwind-merge
- `formatPrice(price)` — formats ARS with `es-AR` locale (e.g. `$98.900`)
- `formatInstallments(price, n)` — returns `"3 cuotas de $32.967 sin interés"`

### Server vs Client Components
Default to Server Components. Add `"use client"` only when the component needs:
- Zustand store access (cart)
- `usePathname`, `useSearchParams`, `useRouter`
- Event handlers or browser APIs

`CartButton` and `MobileMenu` are already Client Components. `Header`, `Navbar`, `Footer`, and `AnnouncementBar` are Server Components.


## Rules
- Al momento de crar datos nuevos no uses Modales, Usa paginas dedicadas para los formularios
- no user server actions, usa Route handlers
- para maneja de estado global usa Zustand
- para formularios usar reack-hook-form y zod
