"use client";

import { useEffect, useRef, type ReactNode } from "react";

const COMMIT = 28;

export default function HomeSnap({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    let animating = false;
    let acc = 0;
    let accTimer = 0;
    let token = 0;
    let touchX = 0;
    let touchY = 0;

    const footer = el.querySelector("footer");
    const syncFooter = () => {
      if (!footer) return;
      el.style.setProperty("--footer-h", `${footer.offsetHeight}px`);
    };
    syncFooter();
    const footerObserver = new ResizeObserver(syncFooter);
    if (footer) footerObserver.observe(footer);

    const screens = () =>
      [...el.querySelectorAll<HTMLElement>("[data-snap]")];

    const nearest = () => {
      const list = screens();
      const y = el.scrollTop;
      let best = 0;
      let dist = Infinity;
      list.forEach((node, i) => {
        const d = Math.abs(node.offsetTop - y);
        if (d < dist) {
          dist = d;
          best = i;
        }
      });
      return { list, best };
    };

    const finish = (my: number, top: number) => {
      if (my !== token) return;
      if (Math.abs(el.scrollTop - top) > 2) {
        el.scrollTo({ top, behavior: "auto" });
      }
      animating = false;
      el.style.scrollSnapType = "";
    };

    const go = (index: number) => {
      const { list } = nearest();
      const target = list[index];
      if (!target || animating) return;
      const top = target.offsetTop;
      if (Math.abs(el.scrollTop - top) < 2) return;
      const my = ++token;
      animating = true;
      acc = 0;
      el.style.scrollSnapType = "none";
      const onEnd = () => {
        if (my !== token || Math.abs(el.scrollTop - top) > 2) return;
        el.removeEventListener("scrollend", onEnd);
        finish(my, top);
      };
      el.addEventListener("scrollend", onEnd);
      el.scrollTo({ top, behavior: reduce ? "auto" : "smooth" });
      window.setTimeout(() => {
        el.removeEventListener("scrollend", onEnd);
        finish(my, top);
      }, reduce ? 80 : 900);
    };

    const onWheel = (event: WheelEvent) => {
      if (Math.abs(event.deltaX) > Math.abs(event.deltaY)) return;
      if (animating) {
        event.preventDefault();
        return;
      }
      const { list, best } = nearest();
      const dir = event.deltaY > 0 ? 1 : -1;
      const next = best + dir;
      if (next < 0 || next >= list.length) return;
      if (dir > 0 && best === 0) {
        const bottom = list[0].offsetTop + list[0].offsetHeight - el.clientHeight;
        if (el.scrollTop < bottom - 2) {
          event.preventDefault();
          const room = bottom - el.scrollTop;
          if (event.deltaY < room) {
            el.scrollTop += event.deltaY;
            return;
          }
          go(next);
          return;
        }
      }
      if (dir < 0 && best === 0 && el.scrollTop > 2) {
        event.preventDefault();
        el.scrollTop = Math.max(0, el.scrollTop + event.deltaY);
        return;
      }
      event.preventDefault();
      acc += event.deltaY;
      window.clearTimeout(accTimer);
      accTimer = window.setTimeout(() => {
        acc = 0;
      }, 180);
      if (Math.abs(acc) < COMMIT) return;
      go(next);
    };

    const onTouchStart = (event: TouchEvent) => {
      touchX = event.touches[0].clientX;
      touchY = event.touches[0].clientY;
    };

    const onTouchMove = (event: TouchEvent) => {
      if (animating) {
        event.preventDefault();
        return;
      }
      const dy = touchY - event.touches[0].clientY;
      const dx = touchX - event.touches[0].clientX;
      if (Math.abs(dy) < 8 || Math.abs(dy) < Math.abs(dx)) return;
      const { list, best } = nearest();
      const next = best + (dy > 0 ? 1 : -1);
      if (next < 0 || next >= list.length) return;
      if (dy > 0 && best === 0) {
        const bottom = list[0].offsetTop + list[0].offsetHeight - el.clientHeight;
        if (el.scrollTop < bottom - 2) return;
      }
      if (dy < 0 && best === 0 && el.scrollTop > 2) return;
      event.preventDefault();
    };

    const onTouchEnd = (event: TouchEvent) => {
      const dy = touchY - event.changedTouches[0].clientY;
      const dx = touchX - event.changedTouches[0].clientX;
      if (Math.abs(dy) < COMMIT || Math.abs(dy) < Math.abs(dx)) return;
      const { list, best } = nearest();
      if (dy > 0 && best === 0) {
        const bottom = list[0].offsetTop + list[0].offsetHeight - el.clientHeight;
        if (el.scrollTop < bottom - 2) return;
      }
      if (dy < 0 && best === 0 && el.scrollTop > 2) return;
      go(best + (dy > 0 ? 1 : -1));
    };

    const onKey = (event: KeyboardEvent) => {
      if (event.altKey || event.metaKey || event.ctrlKey) return;
      const target = event.target;
      if (
        target instanceof HTMLElement &&
        target.closest("input, textarea, select, a, button")
      ) {
        return;
      }
      const down = event.key === "ArrowDown" || event.key === "PageDown";
      const up = event.key === "ArrowUp" || event.key === "PageUp";
      if (!down && !up) return;
      const { list, best } = nearest();
      const next = best + (down ? 1 : -1);
      if (next < 0 || next >= list.length) return;
      event.preventDefault();
      go(next);
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    el.addEventListener("touchstart", onTouchStart, { passive: true });
    el.addEventListener("touchmove", onTouchMove, { passive: false });
    el.addEventListener("touchend", onTouchEnd);
    window.addEventListener("keydown", onKey);

    return () => {
      window.clearTimeout(accTimer);
      footerObserver.disconnect();
      el.removeEventListener("wheel", onWheel);
      el.removeEventListener("touchstart", onTouchStart);
      el.removeEventListener("touchmove", onTouchMove);
      el.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("keydown", onKey);
      token += 1;
      el.style.scrollSnapType = "";
    };
  }, []);

  return (
    <div ref={ref} className="home-snap">
      {children}
    </div>
  );
}
