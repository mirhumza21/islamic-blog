# UmrahZone

Premium Islamic editorial blog for **UmrahZone.com** — content and knowledge only (no booking or payments).

## Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- Radix/shadcn-style UI primitives
- Framer Motion

## Getting started

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment

Copy `.env.example` to `.env.local` and set:

```bash
NEXT_PUBLIC_SITE_URL=https://umrahzone.com
```

## Content architecture

Mock content lives in `data/`. Access helpers are in `lib/articles.ts`. UI components consume typed interfaces from `types/blog.ts`, so a future CMS (Sanity, Strapi, Payload, etc.) can replace the data layer without redesigning pages.

## Scripts

- `pnpm dev` — development server
- `pnpm build` — production build
- `pnpm start` — start production server
- `pnpm lint` — ESLint
