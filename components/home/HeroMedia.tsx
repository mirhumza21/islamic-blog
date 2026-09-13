"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { heroContent } from "@/data/navigation";
import { cn } from "@/lib/utils";

export function HeroMedia({
  variant = "panel",
}: {
  variant?: "panel" | "background";
}) {
  const reduceMotion = useReducedMotion();

  return (
    <div
      className={cn(
        "overflow-hidden",
        variant === "background" ? "absolute inset-0" : "relative h-full w-full"
      )}
    >
      <motion.div
        className="absolute inset-0"
        initial={reduceMotion ? false : { opacity: 0, scale: 1.03 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      >
        <Image
          src={heroContent.image.src}
          alt={heroContent.image.alt}
          fill
          priority
          quality={90}
          sizes="100vw"
          className={cn(
            "object-cover",
            variant === "background"
              ? "object-[58%_50%]"
              : "object-[50%_60%]"
          )}
        />
        {variant === "panel" ? (
          <div
            className="absolute inset-0 bg-gradient-to-t from-green-dark/30 via-transparent to-transparent"
            aria-hidden
          />
        ) : (
          <div
            className="absolute inset-0 bg-green-dark/10"
            aria-hidden
          />
        )}
      </motion.div>
    </div>
  );
}
