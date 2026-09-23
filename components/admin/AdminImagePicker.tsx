"use client";

import { useRef, useState } from "react";
import { UploadCloud, Loader2, X } from "lucide-react";
import { uploadClientImage } from "@/lib/uploadClientImage";
import { toast } from "@/components/admin/Toast";
import { cn } from "@/lib/utils";

interface AdminImagePickerProps {
  value: string;
  onChange: (url: string) => void;
  className?: string;
  previewClassName?: string;
  previewContainerClassName?: string;
  aspectRatio?: string;
  recommendedSize?: string;
}

export default function AdminImagePicker({
  value,
  onChange,
  className,
  previewClassName,
  previewContainerClassName,
  aspectRatio,
  recommendedSize,
}: AdminImagePickerProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const res = await uploadClientImage(file);
      if (res.success && res.imageUrl) {
        onChange(res.imageUrl);
      } else {
        toast.error(res.error || "Failed to upload image");
      }
    } catch {
      toast.error("Failed to upload image");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <div className={cn("space-y-2", className)}>
      <div
        role="button"
        tabIndex={0}
        onClick={() => !uploading && inputRef.current?.click()}
        onKeyDown={(e) => e.key === "Enter" && inputRef.current?.click()}
        className={cn(
          "w-full px-4 py-5 rounded-xl border-2 border-dashed border-gray-200 bg-white hover:bg-gray-50 transition-colors flex flex-col items-center justify-center gap-2 cursor-pointer",
          uploading && "opacity-60 pointer-events-none"
        )}
      >
        {uploading ? (
          <Loader2 className="w-5 h-5 text-emerald-600 animate-spin" />
        ) : (
          <UploadCloud className="w-5 h-5 text-emerald-600" />
        )}
        <span className="text-xs font-semibold text-gray-800 text-center">
          {uploading ? "Uploading..." : value ? "Click to replace image" : "Click to upload image"}
        </span>
        <span className="text-[10px] text-gray-400 text-center">
          JPG, WEBP, PNG (Max 5MB)
          {recommendedSize ? ` · Recommended ${recommendedSize}` : ""}
        </span>
      </div>
      <input ref={inputRef} type="file" accept="image/*" onChange={handleFile} className="hidden" />

      {value && (
        <div
          className={cn(
            "relative w-full overflow-hidden rounded-xl border border-gray-200 bg-gray-50",
            !aspectRatio && "h-28",
            previewContainerClassName
          )}
          style={aspectRatio ? { aspectRatio } : undefined}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={value}
            alt=""
            className={cn(
              "absolute inset-0 w-full h-full object-cover object-center",
              previewClassName
            )}
          />
          <button
            type="button"
            onClick={() => onChange("")}
            className="absolute top-2 right-2 z-10 p-1.5 rounded-lg bg-black/50 text-white hover:bg-black/70 transition-colors cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}
