"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Activity, Apple, CalendarDays, History } from "lucide-react";

const items = [
  { href: "/hoje", label: "Hoje", icon: CalendarDays },
  { href: "/treino", label: "Treino", icon: Activity },
  { href: "/nutricao", label: "Nutrição", icon: Apple },
  { href: "/historico", label: "Histórico", icon: History },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-20 border-t border-border bg-background/95 backdrop-blur">
      <ul className="mx-auto grid max-w-lg grid-cols-4">
        {items.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(`${href}/`);
          const color =
            href === "/nutricao"
              ? "text-nutricao"
              : href === "/treino"
                ? "text-treino"
                : "text-treino";

          return (
            <li key={href}>
              <Link
                href={href}
                className={`flex flex-col items-center gap-1 py-3 text-[11px] font-medium ${
                  active ? color : "text-muted"
                }`}
              >
                <Icon size={22} strokeWidth={active ? 2.4 : 1.8} />
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
