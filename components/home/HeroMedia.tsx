"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { heroContent } from "@/data/navigation";
import { cn } from "@/lib/utils";

export function HeroMedia({
  variant = "panel",
  content,
}: {
  variant?: "panel" | "background";
  content?: typeof heroContent;
}) {
  const reduceMotion = useReducedMotion();
  const data = content || heroContent;

  return (
    <div
      className={cn(
        "overflow-hidden",
        variant === "background" ? "absolute inset-0" : "relative h-full w-full"
      )}
    >
      <motion.div
        className="absolute inset-0"
        initial={reduceMotion ? false : { opacity: 0, scale: 1.02 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      >
        <Image
          src={data.image?.src || heroContent.image.src}
          alt={data.image?.alt || heroContent.image.alt}
          fill
          priority
          quality={90}
          sizes="(max-width: 1023px) 100vw, 62vw"
          className={cn(
            "object-cover",
            variant === "background"
              ? "object-[64%_48%] xl:object-[62%_46%]"
              : "object-[58%_42%] sm:object-[56%_40%]"
          )}
        />
        {variant === "panel" ? (
          <div
            className="absolute inset-0 bg-green-dark/10"
            aria-hidden
          />
        ) : null}
      </motion.div>
    </div>
  );
}
