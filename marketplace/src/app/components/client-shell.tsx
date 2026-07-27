"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import ThemeToggle from "./theme-toggle";

interface ClientShellProps {
  children: React.ReactNode;
}

const navigation = [
  { href: "/", label: "Inicio", icon: "home" },
  { href: "/dashboard", label: "Proyectos", icon: "projects" },
] as const;

function NavIcon({ icon }: { icon: (typeof navigation)[number]["icon"] }) {
  if (icon === "home") {
    return (
      <svg
        aria-hidden="true"
        className="size-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth="1.8"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="m3.75 10.5 8.25-7 8.25 7v8.25a1.75 1.75 0 0 1-1.75 1.75h-13a1.75 1.75 0 0 1-1.75-1.75V10.5Z"
        />
        <path strokeLinecap="round" d="M9 20.5v-6.25h6v6.25" />
      </svg>
    );
  }

  return (
    <svg
      aria-hidden="true"
      className="size-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <rect x="3.5" y="4" width="17" height="16" rx="2" />
      <path strokeLinecap="round" d="M8 8h8M8 12h8M8 16h5" />
    </svg>
  );
}

function Brand() {
  return (
    <span className="flex min-w-0 items-center gap-3">
      <span
        aria-hidden="true"
        className="grid size-9 shrink-0 place-items-center rounded-xl bg-foreground text-sm font-bold text-background shadow-sm"
      >
        M
      </span>
      <span className="min-w-0">
        <span className="block truncate text-sm font-semibold tracking-tight">
          Marketplace
        </span>
        <span className="block truncate text-xs text-muted-foreground">
          Laboratorio Next.js
        </span>
      </span>
    </span>
  );
}

export default function ClientShell({ children }: ClientShellProps) {
  const pathname = usePathname();
  const [openPathname, setOpenPathname] = useState<string | null>(null);
  const firstLinkRef = useRef<HTMLAnchorElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const isOpen = openPathname === pathname;

  useEffect(() => {
    if (!isOpen) return;

    const frameId = requestAnimationFrame(() => firstLinkRef.current?.focus());

    function closeOnEscape(event: KeyboardEvent) {
      if (event.key !== "Escape") return;
      setOpenPathname(null);
      menuButtonRef.current?.focus();
    }

    window.addEventListener("keydown", closeOnEscape);
    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [isOpen]);

  function closeNavigation() {
    setOpenPathname(null);
  }

  return (
    <>
      <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-background px-4 md:hidden">
        <Link
          href="/"
          className="rounded-xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
        >
          <Brand />
        </Link>
        <button
          ref={menuButtonRef}
          type="button"
          aria-controls="sidebar-navigation"
          aria-expanded={isOpen}
          aria-label={isOpen ? "Cerrar navegación" : "Abrir navegación"}
          onClick={() => setOpenPathname(isOpen ? null : pathname)}
          className="grid size-11 place-items-center rounded-xl border border-border bg-card text-foreground transition-colors hover:bg-secondary active:bg-sidebar-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        >
          {isOpen ? (
            <svg
              aria-hidden="true"
              className="size-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path strokeLinecap="round" d="m6 6 12 12M18 6 6 18" />
            </svg>
          ) : (
            <svg
              aria-hidden="true"
              className="size-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path strokeLinecap="round" d="M4 7h16M4 12h16M4 17h16" />
            </svg>
          )}
        </button>
      </header>

      {isOpen ? (
        <button
          type="button"
          tabIndex={-1}
          aria-label="Cerrar navegación"
          onClick={closeNavigation}
          className="fixed inset-0 z-40 cursor-default bg-overlay md:hidden"
        />
      ) : null}

      <aside
        id="sidebar-navigation"
        aria-label="Navegación principal"
        className={`${isOpen ? "flex" : "hidden"} fixed inset-y-0 left-0 z-50 h-dvh w-[17.5rem] flex-col border-r border-border bg-sidebar shadow-2xl shadow-foreground/10 md:sticky md:top-0 md:flex md:w-64 md:shrink-0 md:shadow-none`}
      >
        <div className="flex h-20 items-center justify-between px-5">
          <Link
            href="/"
            onClick={closeNavigation}
            className="rounded-xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
          >
            <Brand />
          </Link>
          <button
            type="button"
            aria-label="Cerrar navegación"
            onClick={closeNavigation}
            className="grid size-10 place-items-center rounded-xl text-muted-foreground transition-colors hover:bg-sidebar-hover hover:text-foreground active:bg-secondary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring md:hidden"
          >
            <svg
              aria-hidden="true"
              className="size-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path strokeLinecap="round" d="m6 6 12 12M18 6 6 18" />
            </svg>
          </button>
        </div>

        <nav className="px-3 py-4" aria-label="Secciones">
          <p className="mb-2 px-3 text-[0.6875rem] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
            Navegación
          </p>
          <ul className="space-y-1">
            {navigation.map((item, index) => {
              const isActive =
                item.href === "/"
                  ? pathname === item.href
                  : pathname.startsWith(item.href);

              return (
                <li key={item.href}>
                  <Link
                    ref={index === 0 ? firstLinkRef : undefined}
                    href={item.href}
                    aria-current={isActive ? "page" : undefined}
                    onClick={closeNavigation}
                    className={`flex min-h-11 items-center gap-3 rounded-xl px-3 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring ${
                      isActive
                        ? "bg-foreground text-background shadow-sm"
                        : "text-muted-foreground hover:bg-sidebar-hover hover:text-foreground active:bg-secondary"
                    }`}
                  >
                    <NavIcon icon={item.icon} />
                    <span>{item.label}</span>
                    {isActive ? (
                      <span
                        aria-hidden="true"
                        className="ml-auto size-1.5 rounded-full bg-background"
                      />
                    ) : null}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="mt-auto border-t border-border p-3">
          {children}
          <ThemeToggle />
        </div>
      </aside>
    </>
  );
}
