"use client";

export function AdminTextFields({
  title,
  fields,
  values,
  onChange,
}: {
  title?: string;
  fields: { key: string; label: string; rows?: number; mono?: boolean }[];
  values: Record<string, string>;
  onChange: (key: string, value: string) => void;
}) {
  return (
    <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 space-y-3">
      {title ? (
        <p className="text-[11px] font-bold uppercase tracking-wider text-emerald-700">
          {title}
        </p>
      ) : null}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {fields.map((field) => (
          <div key={field.key} className={field.rows ? "sm:col-span-2" : ""}>
            <label className="block text-gray-600 font-medium mb-1">{field.label}</label>
            {field.rows ? (
              <textarea
                rows={field.rows}
                value={values[field.key] || ""}
                onChange={(e) => onChange(field.key, e.target.value)}
                className="w-full bg-white border border-gray-300 rounded-lg p-3 text-gray-900 outline-none focus:border-emerald-600"
              />
            ) : (
              <input
                type="text"
                value={values[field.key] || ""}
                onChange={(e) => onChange(field.key, e.target.value)}
                className={`w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-gray-900 outline-none focus:border-emerald-600 ${
                  field.mono ? "font-mono" : ""
                }`}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
