import { useCallback, useRef, useState } from "react";
import { Button, Popover, PopoverContent, PopoverTrigger } from "@heroui/react";
import { useTranslation } from "react-i18next";

interface Props {
  names: string[];
  onSelect: (name: string) => void;
  title?: string;
  buttonLabel?: string;
}

export function NameSuggestionPopover({ names, onSelect, title, buttonLabel }: Props) {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleOpenChange = useCallback((open: boolean) => {
    setIsOpen(open);
    if (open) {
      requestAnimationFrame(() => {
        scrollRef.current?.scrollTo(0, 0);
      });
    }
  }, []);

  return (
    <Popover placement="bottom" showArrow isOpen={isOpen} onOpenChange={handleOpenChange}>
      <PopoverTrigger>
        <Button size="sm" variant="bordered" className="text-gray-400 shrink-0 h-12">
          {buttonLabel ?? t("creation.suggestName")}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="bg-[#111] border border-content2 p-0 max-w-sm w-80">
        <div ref={scrollRef} className="max-h-80 overflow-y-auto p-4">
          {title && (
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
              {title}
            </p>
          )}
          <div className="grid grid-cols-3 gap-x-2 gap-y-0.5 w-full">
            {names.map((name) => (
              <button
                key={name}
                type="button"
                className="text-left text-sm text-gray-300 hover:text-white hover:bg-white/10 rounded px-2 py-1 transition-colors cursor-pointer"
                onClick={() => {
                  onSelect(name);
                  setIsOpen(false);
                }}
              >
                {name}
              </button>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
