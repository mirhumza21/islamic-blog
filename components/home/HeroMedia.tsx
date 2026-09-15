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
        initial={reduceMotion ? false : { opacity: 0, scale: 1.025 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
      >
        <Image
          src={heroContent.image.src}
          alt={heroContent.image.alt}
          fill
          priority
          quality={90}
          sizes="(max-width: 1023px) 100vw, 65vw"
          className={cn(
            "object-cover",
            variant === "background"
              ? "object-[80%_72%] xl:object-[78%_70%]"
              : "object-[72%_60%] sm:object-[70%_58%]"
          )}
        />
        {variant === "panel" ? (
          <div
            className="absolute inset-0 bg-gradient-to-t from-green-dark/35 via-green-dark/5 to-transparent"
            aria-hidden
          />
        ) : (
          <div
            className="absolute inset-0 bg-gradient-to-l from-transparent via-transparent to-ivory/10"
            aria-hidden
          />
        )}
      </motion.div>
    </div>
  );
}
