"use client";

import { useState, useRef, useEffect, ReactNode } from "react";
import { ChevronDown, Check } from "lucide-react";

export interface CustomSelectOption {
  value: string;
  label: string;
  icon?: ReactNode;
  description?: string;
  badge?: ReactNode;
  fontFamily?: string;
}

interface CustomSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: CustomSelectOption[];
  placeholder?: string;
  className?: string;
  dropdownClassName?: string;
  size?: "sm" | "md";
}

export function CustomSelect({
  value,
  onChange,
  options,
  placeholder = "Select...",
  className = "",
  dropdownClassName = "",
  size = "md",
}: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const paddingClass =
    size === "sm" ? "px-2.5 py-1.5 text-xs h-8" : "px-3.5 py-2.5 text-xs h-10";

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={`w-full flex items-center justify-between gap-2 rounded-xl border border-gray-200 bg-white hover:bg-gray-50/80 hover:border-gray-300 font-medium text-gray-800 transition-all cursor-pointer shadow-2xs focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 ${paddingClass}`}
      >
        <div className="flex items-center gap-2 truncate min-w-0">
          {selectedOption?.icon && (
            <span className="shrink-0 flex items-center justify-center">
              {selectedOption.icon}
            </span>
          )}
          <span
            className="truncate font-semibold text-gray-900"
            style={
              selectedOption?.fontFamily
                ? { fontFamily: selectedOption.fontFamily }
                : undefined
            }
          >
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          {selectedOption?.badge && (
            <span className="shrink-0">{selectedOption.badge}</span>
          )}
        </div>

        <ChevronDown
          className={`w-3.5 h-3.5 text-gray-400 transition-transform duration-200 shrink-0 ${
            isOpen ? "rotate-180 text-emerald-600" : ""
          }`}
        />
      </button>

      {/* Popover Menu */}
      {isOpen && (
        <div
          className={`absolute left-0 right-0 top-full mt-1.5 bg-white border border-gray-200 rounded-xl shadow-xl z-50 py-1 max-h-64 overflow-y-auto ${dropdownClassName}`}
        >
          {options.map((option) => {
            const isSelected = option.value === value;
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className={`w-full px-3 py-2 text-left text-xs flex items-center justify-between gap-2 transition-colors cursor-pointer ${
                  isSelected
                    ? "bg-emerald-50 text-emerald-900 font-bold"
                    : "text-gray-700 hover:bg-gray-50 hover:text-gray-900 font-medium"
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  {option.icon && (
                    <span className="shrink-0">{option.icon}</span>
                  )}
                  <div className="truncate">
                    <div
                      className="truncate"
                      style={
                        option.fontFamily
                          ? { fontFamily: option.fontFamily }
                          : undefined
                      }
                    >
                      {option.label}
                    </div>
                    {option.description && (
                      <div className="text-[10px] text-gray-400 font-normal truncate">
                        {option.description}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {option.badge}
                  {isSelected && (
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  )}
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
