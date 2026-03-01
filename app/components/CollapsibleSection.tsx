import { useState } from "react";
import type { ReactNode } from "react";
import { ExpandArrow, ExpandableContent } from "~/components/expand";

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
          <ExpandArrow isExpanded={isExpanded} />
        </div>
      </button>

      <ExpandableContent isExpanded={isExpanded} bordered={false}>
        {children}
      </ExpandableContent>
    </div>
  );
}
