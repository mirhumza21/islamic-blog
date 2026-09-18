export function Pulse({ className = "" }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-md bg-gray-200/90 ${className}`}
      aria-hidden
    />
  );
}

export function TableSkeleton({
  rows = 8,
  cols = 7,
}: {
  rows?: number;
  cols?: number;
}) {
  return (
    <div className="overflow-hidden">
      <div className="border-b border-gray-100 bg-gray-50/80 px-4 py-3 flex gap-4">
        {Array.from({ length: cols }).map((_, i) => (
          <Pulse key={i} className="h-3 w-20" />
        ))}
      </div>
      <div className="divide-y divide-gray-100">
        {Array.from({ length: rows }).map((_, row) => (
          <div key={row} className="px-4 py-3.5 flex items-center gap-4">
            <Pulse className="h-4 flex-1 max-w-[220px]" />
            <Pulse className="h-4 w-24 hidden sm:block" />
            <Pulse className="h-4 w-20 hidden md:block" />
            <Pulse className="h-5 w-16 rounded-full" />
            <Pulse className="h-4 w-16 ml-auto" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function CardGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm"
        >
          <Pulse className="h-32 w-full rounded-none" />
          <div className="p-4 space-y-2.5">
            <Pulse className="h-4 w-2/3" />
            <Pulse className="h-3 w-full" />
            <Pulse className="h-3 w-4/5" />
            <div className="flex gap-2 pt-2">
              <Pulse className="h-8 w-16 rounded-lg" />
              <Pulse className="h-8 w-16 rounded-lg" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function FormPageSkeleton({ titleWidth = "w-56" }: { titleWidth?: string }) {
  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-24">
      <div className="flex items-center justify-between gap-4 border-b border-gray-200 pb-4">
        <div className="space-y-2">
          <Pulse className={`h-7 ${titleWidth}`} />
          <Pulse className="h-3 w-72" />
        </div>
        <div className="flex gap-2">
          <Pulse className="h-9 w-24 rounded-xl" />
          <Pulse className="h-9 w-28 rounded-xl" />
        </div>
      </div>
      <div className="bg-white border border-gray-200 rounded-2xl p-6 space-y-5 shadow-sm">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <Pulse className="h-3 w-28" />
            <Pulse className={`h-10 w-full rounded-xl ${i === 2 ? "h-28" : ""}`} />
          </div>
        ))}
      </div>
    </div>
  );
}

export function ArticleEditorSkeleton() {
  return (
    <div className="pb-24">
      <div className="sticky top-0 z-30 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Pulse className="h-8 w-24 rounded-lg" />
            <div className="space-y-1.5">
              <Pulse className="h-3 w-20" />
              <Pulse className="h-4 w-40" />
            </div>
          </div>
          <div className="flex gap-2">
            <Pulse className="h-8 w-24 rounded-lg" />
            <Pulse className="h-8 w-32 rounded-lg" />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-white border border-gray-200 rounded-2xl p-6 space-y-4">
              <Pulse className="h-9 w-3/4" />
              <Pulse className="h-8 w-full rounded-lg" />
            </div>
            <div className="bg-white border border-gray-200 rounded-2xl p-6 space-y-3">
              <Pulse className="h-3 w-40" />
              <Pulse className="h-40 w-full rounded-xl" />
            </div>
            <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
              <div className="flex flex-wrap gap-1.5 p-2.5 border-b border-gray-100 bg-gray-50">
                {Array.from({ length: 14 }).map((_, i) => (
                  <Pulse key={i} className="h-8 w-8 rounded-md" />
                ))}
              </div>
              <div className="p-6 space-y-3 min-h-[320px]">
                <Pulse className="h-4 w-full" />
                <Pulse className="h-4 w-11/12" />
                <Pulse className="h-4 w-4/5" />
                <Pulse className="h-4 w-2/3" />
              </div>
            </div>
          </div>
          <div className="lg:col-span-4 space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="bg-white border border-gray-200 rounded-2xl p-5 space-y-3"
              >
                <Pulse className="h-4 w-28" />
                <Pulse className="h-10 w-full rounded-xl" />
                <Pulse className="h-10 w-full rounded-xl" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <Pulse className="h-36 w-full rounded-2xl" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="p-5 bg-white border border-gray-200 rounded-2xl space-y-3"
          >
            <Pulse className="h-3 w-24" />
            <Pulse className="h-7 w-16" />
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white border border-gray-200 rounded-2xl p-5 space-y-4">
          <Pulse className="h-5 w-40" />
          {Array.from({ length: 5 }).map((_, i) => (
            <Pulse key={i} className="h-12 w-full rounded-lg" />
          ))}
        </div>
        <div className="bg-white border border-gray-200 rounded-2xl p-5 space-y-3">
          <Pulse className="h-5 w-32" />
          {Array.from({ length: 4 }).map((_, i) => (
            <Pulse key={i} className="h-16 w-full rounded-xl" />
          ))}
        </div>
      </div>
    </div>
  );
}

export function EditorChromeSkeleton({ minHeight = "540px" }: { minHeight?: string }) {
  return (
    <div className="tiptap-editor border border-gray-200 rounded-2xl bg-white shadow-xs overflow-hidden">
      <div className="flex flex-wrap items-center gap-1.5 p-2.5 border-b border-gray-200 bg-gray-50">
        <Pulse className="h-8 w-32 rounded-md" />
        <Pulse className="h-8 w-40 rounded-md" />
        <Pulse className="h-8 w-16 rounded-md" />
        {Array.from({ length: 10 }).map((_, i) => (
          <Pulse key={i} className="h-8 w-8 rounded-md" />
        ))}
      </div>
      <div className="p-6 space-y-3" style={{ minHeight }}>
        <Pulse className="h-5 w-2/3" />
        <Pulse className="h-4 w-full" />
        <Pulse className="h-4 w-11/12" />
        <Pulse className="h-4 w-4/5" />
        <Pulse className="h-4 w-3/5" />
      </div>
      <div className="flex items-center justify-between px-5 py-2.5 border-t border-gray-100 bg-gray-50/60">
        <Pulse className="h-3 w-48" />
        <Pulse className="h-3 w-40" />
      </div>
    </div>
  );
}
