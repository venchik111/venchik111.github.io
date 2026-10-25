"use client";

import { useEffect } from "react";

// Глобальные эффекты страницы: появление при прокрутке, активный пункт меню
// и координаты курсора для подсветки ([data-spot] получает --mx / --my).
export function Effects() {
  useEffect(() => {
    const revealIo = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          e.target.setAttribute("data-revealed", "");
          revealIo.unobserve(e.target);
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
    );
    document.querySelectorAll("[data-reveal]").forEach((el) => revealIo.observe(el));

    const links = [...document.querySelectorAll<HTMLAnchorElement>('header nav a[href^="#"]')];
    const navIo = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          for (const a of links) {
            if (a.getAttribute("href") === `#${e.target.id}`) a.setAttribute("aria-current", "true");
            else a.removeAttribute("aria-current");
          }
        }
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    document.querySelectorAll("main section[id]").forEach((el) => navIo.observe(el));

    let raf = 0;
    let last: PointerEvent | null = null;
    const apply = () => {
      raf = 0;
      if (!last) return;
      const el = (last.target as Element | null)?.closest?.<HTMLElement>("[data-spot]");
      if (!el) return;
      const r = el.getBoundingClientRect();
      el.style.setProperty("--mx", `${last.clientX - r.left}px`);
      el.style.setProperty("--my", `${last.clientY - r.top}px`);
    };
    const onMove = (e: PointerEvent) => {
      last = e;
      if (!raf) raf = requestAnimationFrame(apply);
    };
    window.addEventListener("pointermove", onMove, { passive: true });

    return () => {
      revealIo.disconnect();
      navIo.disconnect();
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return null;
}
