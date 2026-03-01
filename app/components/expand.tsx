import { AnimatePresence, motion } from "framer-motion";
import type { ReactNode } from "react";

interface ExpandArrowProps {
  isExpanded: boolean;
}

export function ExpandArrow({ isExpanded }: ExpandArrowProps) {
  return (
    <span
      className="text-xs text-gray-500 transition-transform duration-200"
      style={{ transform: isExpanded ? "rotate(90deg)" : "rotate(0deg)" }}
    >
      &#9656;
    </span>
  );
}

interface ExpandableContentProps {
  isExpanded: boolean;
  /** When true (default), renders a top border and padding separator above children. */
  bordered?: boolean;
  children: ReactNode;
}

export function ExpandableContent({
  isExpanded,
  bordered = true,
  children,
}: ExpandableContentProps) {
  return (
    <AnimatePresence initial={false}>
      {isExpanded && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.2, ease: "easeInOut" }}
          className="overflow-hidden"
        >
          {bordered ? (
            <div className="pt-3 mt-3 border-t border-content3">{children}</div>
          ) : (
            children
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
