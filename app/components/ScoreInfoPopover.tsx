import type { ReactNode } from "react";
import { Button, Popover, PopoverContent, PopoverTrigger } from "@heroui/react";

interface ScoreInfoPopoverProps {
  ariaLabel: string;
  children: ReactNode;
}

export function ScoreInfoPopover({ ariaLabel, children }: ScoreInfoPopoverProps) {
  return (
    <Popover placement="bottom-end" showArrow>
      <PopoverTrigger>
        <Button
          isIconOnly
          size="sm"
          variant="light"
          aria-label={ariaLabel}
          className="text-gray-500 hover:text-gray-300 min-w-5 w-5 h-5 rounded-full text-xs"
        >
          ?
        </Button>
      </PopoverTrigger>
      <PopoverContent className="bg-[#111] border border-content2 p-4 max-w-xs w-80">
        <div className="w-full flex flex-col gap-3">{children}</div>
      </PopoverContent>
    </Popover>
  );
}
