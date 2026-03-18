import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Button,
} from "@heroui/react";
import { Link, Form } from "react-router";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "~/components/LanguageSwitcher";
import type { User } from "@supabase/supabase-js";

interface AuthNavBarProps {
  user: User | null;
}

export default function AuthNavBar({ user }: AuthNavBarProps) {
  const { t } = useTranslation();

  return (
    <Navbar maxWidth="full" isBordered>
      <NavbarBrand>
        <Link to="/" className="font-bold text-inherit text-lg tracking-wider">
          RUNE
        </Link>
      </NavbarBrand>
      <NavbarContent justify="end">
        <NavbarItem>
          <LanguageSwitcher inline />
        </NavbarItem>
        {user ? (
          <>
            <NavbarItem className="hidden sm:flex">
              <span className="text-sm text-gray-400">{user.email}</span>
            </NavbarItem>
            <NavbarItem>
              <Button
                as={Link}
                to="/my-characters"
                variant="light"
                size="sm"
              >
                {t("auth.myCharacters")}
              </Button>
            </NavbarItem>
            <NavbarItem>
              <Form method="post" action="/logout">
                <Button type="submit" variant="flat" size="sm" color="danger">
                  {t("auth.logout")}
                </Button>
              </Form>
            </NavbarItem>
          </>
        ) : (
          <NavbarItem>
            <Button
              as={Link}
              to="/login"
              variant="flat"
              size="sm"
              color="primary"
            >
              {t("auth.login")}
            </Button>
          </NavbarItem>
        )}
      </NavbarContent>
    </Navbar>
  );
}
