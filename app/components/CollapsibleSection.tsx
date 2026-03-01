import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { ReactNode } from "react";

interface CollapsibleSectionProps {
  title: string;
  badge?: ReactNode;
  children: ReactNode;
  defaultExpanded?: boolean;
}

export function CollapsibleSection({
  title,
  badge,
  children,
  defaultExpanded = true,
}: CollapsibleSectionProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  return (
    <div className="mb-6">
      <button
        type="button"
        className="w-full flex items-center justify-between pb-3 mb-4 border-b border-content3 cursor-pointer select-none"
        onClick={() => setIsExpanded((prev) => !prev)}
        aria-expanded={isExpanded}
      >
        <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider">
          {title}
        </h2>
        <div className="flex items-center gap-2">
          {badge !== undefined && (
            <span className="rounded-full bg-content2 px-2 py-0.5 text-xs text-gray-400">
              {badge}
            </span>
          )}
          <span
            className="text-xs text-gray-500 transition-transform duration-200"
            style={{
              transform: isExpanded ? "rotate(90deg)" : "rotate(0deg)",
            }}
          >
            &#9656;
          </span>
        </div>
      </button>

      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
