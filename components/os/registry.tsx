"use client";

import type { ReactNode } from "react";
import { profile } from "@/data/profile";
import { Contacts } from "./apps/Contacts";
import { Files } from "./apps/Files";
import { Kitty } from "./apps/Kitty";
import { Nvim } from "./apps/Nvim";
import type { IconName } from "./icons";

export type AppId = "projects" | "terminal" | "about" | "log" | "contact";

// Реестр приложений: ws — рабочий стол на десктопе, title — заголовок окна в баре.
export const APPS: { id: AppId; ws: number; title: string; name: string; desc: string; icon: IconName }[] = [
  { id: "projects", ws: 1, title: "thunar — ~/projects", name: "Файлы", desc: "~/projects · 4 проекта", icon: "folder" },
  { id: "terminal", ws: 1, title: "kitty — ~", name: "Терминал", desc: "kitty · fastfetch, help", icon: "term" },
  { id: "about", ws: 1, title: "nvim — about.md", name: "Neovim", desc: "about.md · обо мне", icon: "code" },
  { id: "log", ws: 2, title: "kitty — git log", name: "Git log", desc: "образование и опыт", icon: "git" },
  { id: "contact", ws: 3, title: `contacts — ${profile.name}`, name: "Контакты", desc: "Telegram, GitHub, резюме", icon: "user" },
];

export const LINKS: { name: string; desc: string; icon: IconName; href: string }[] = [
  { name: "Telegram", desc: "@venchik111", icon: "send", href: "https://t.me/venchik111" },
  { name: "GitHub", desc: "github.com/venchik111", icon: "code", href: "https://github.com/venchik111" },
  { name: "Резюме", desc: "singularity-resume.ru", icon: "card", href: profile.cvUrl },
];

export function AppView({ id, selected, onOpen }: { id: AppId; selected: number; onOpen: (id: AppId) => void }): ReactNode {
  switch (id) {
    case "projects":
      return <Files selected={selected} />;
    case "about":
      return <Nvim />;
    case "terminal":
      return <Kitty start="neofetch" onOpen={onOpen} />;
    case "log":
      return <Kitty start="log" onOpen={onOpen} />;
    case "contact":
      return <Contacts />;
  }
}
