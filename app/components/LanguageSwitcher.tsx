import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@heroui/react";
import { useTranslation } from "react-i18next";

const LANGUAGES = [
  { code: "en", label: "English" },
  { code: "fr", label: "Français" },
] as const;

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();

  return (
    <div className="fixed top-4 right-4 z-50">
      <Dropdown>
        <DropdownTrigger>
          <Button variant="light" size="sm" className="text-gray-400 gap-1.5">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M2 12h20" />
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
            </svg>
            {i18n.language.toUpperCase().slice(0, 2)}
          </Button>
        </DropdownTrigger>
        <DropdownMenu
          selectionMode="single"
          selectedKeys={new Set([i18n.language.slice(0, 2)])}
          onSelectionChange={(keys) => {
            const lang = [...keys][0] as string;
            i18n.changeLanguage(lang);
          }}
        >
          {LANGUAGES.map(({ code, label }) => (
            <DropdownItem key={code}>{label}</DropdownItem>
          ))}
        </DropdownMenu>
      </Dropdown>
    </div>
  );
}
