import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <section className="container-editorial flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-green">
        404
      </p>
      <h1 className="mt-3 font-serif text-4xl font-semibold text-foreground">
        Page not found
      </h1>
      <p className="mt-3 max-w-md text-muted">
        The page you are looking for may have moved. Try searching or return home.
      </p>
      <div className="mt-8 flex gap-3">
        <Button asChild>
          <Link href="/">Go home</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/search">Search</Link>
        </Button>
      </div>
    </section>
  );
}
