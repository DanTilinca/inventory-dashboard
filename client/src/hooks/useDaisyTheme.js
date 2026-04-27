import { useSyncExternalStore } from "react";

function subscribe(onStoreChange) {
  const el = document.documentElement;
  const observer = new MutationObserver(() => onStoreChange());
  observer.observe(el, { attributes: true, attributeFilter: ["data-theme"] });
  return () => observer.disconnect();
}

function getSnapshot() {
  return document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light";
}

function getServerSnapshot() {
  return "light";
}

/** Tracks daisyUI `data-theme` on `<html>` (light / dark). */
export function useDaisyTheme() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

/** dark palette is in the same CSS bundle as `ag-theme-alpine`. */
export function agGridThemeClassName(theme) {
  return theme === "dark" ? "ag-theme-alpine-dark" : "ag-theme-alpine";
}
