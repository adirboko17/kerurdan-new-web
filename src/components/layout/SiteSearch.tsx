"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import { SiteImage } from "@/components/ui/SiteImage";
import { searchProducts, type SearchItem } from "@/lib/search";

type SiteSearchProps = {
  items: SearchItem[];
  variant: "header" | "menu";
  solid?: boolean;
  onNavigate?: () => void;
};

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M10.6 3.6a7 7 0 0 1 5.5 11.3l4 4a1 1 0 0 1-1.4 1.4l-4-4A7 7 0 1 1 10.6 3.6Zm0 2a5 5 0 1 0 0 10 5 5 0 0 0 0-10Z"
      />
    </svg>
  );
}

export function SiteSearch({ items, variant, solid = true, onNavigate }: SiteSearchProps) {
  const router = useRouter();
  const listId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(variant === "menu");
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const results = useMemo(() => searchProducts(items, query), [items, query]);
  const showResults = query.trim().length > 0;

  useEffect(() => {
    if (variant !== "header") return;

    const onKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen(true);
      }
      if (event.key === "Escape") {
        setOpen(false);
        setQuery("");
      }
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [variant]);

  useEffect(() => {
    if (variant === "header" && open) inputRef.current?.focus();
  }, [open, variant]);

  useEffect(() => {
    if (variant !== "header" || !open) return;

    const onPointer = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
        setQuery("");
      }
    };

    document.addEventListener("pointerdown", onPointer);
    return () => document.removeEventListener("pointerdown", onPointer);
  }, [open, variant]);

  useEffect(() => {
    setActive(0);
  }, [query]);

  function go() {
    onNavigate?.();
    setOpen(variant === "menu");
    setQuery("");
  }

  function onKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (!showResults || results.length === 0) {
      if (event.key === "Escape" && variant === "header") {
        setOpen(false);
        setQuery("");
      }
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActive((current) => (current + 1) % results.length);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActive((current) => (current - 1 + results.length) % results.length);
    } else if (event.key === "Enter") {
      const item = results[active];
      if (!item) return;
      event.preventDefault();
      router.push(`/product/${item.slug}`);
      go();
    }
  }

  return (
    <div
      ref={rootRef}
      className={`site-search site-search-${variant}${open ? " is-open" : ""}${solid ? " is-solid" : ""}`}
      onPointerDown={(event) => {
        if (variant === "menu") event.stopPropagation();
      }}
    >
      {variant === "header" && !open ? (
        <button
          type="button"
          className="site-search-toggle"
          aria-label="חיפוש מוצרים"
          onClick={() => setOpen(true)}
        >
          <SearchIcon />
        </button>
      ) : (
        <div className="site-search-field">
          <span className="site-search-icon">
            <SearchIcon />
          </span>
          <input
            ref={inputRef}
            type="search"
            value={query}
            placeholder="חיפוש מוצר..."
            aria-label="חיפוש מוצרים"
            aria-autocomplete="list"
            aria-controls={listId}
            aria-expanded={showResults}
            autoComplete="off"
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={onKeyDown}
          />
          {query ? (
            <button
              type="button"
              className="site-search-clear"
              aria-label="ניקוי חיפוש"
              onClick={() => {
                setQuery("");
                inputRef.current?.focus();
              }}
            >
              ×
            </button>
          ) : variant === "header" ? (
            <button
              type="button"
              className="site-search-clear"
              aria-label="סגירת חיפוש"
              onClick={() => setOpen(false)}
            >
              ×
            </button>
          ) : null}
        </div>
      )}

      {showResults ? (
        <div className="site-search-panel" id={listId} role="listbox" aria-label="תוצאות חיפוש">
          {results.length === 0 ? (
            <div className="site-search-empty">לא מצאנו מוצר תואם</div>
          ) : (
            results.map((item, index) => (
              <Link
                key={item.id}
                href={`/product/${item.slug}`}
                className={`site-search-hit${index === active ? " is-on" : ""}`}
                role="option"
                aria-selected={index === active}
                onMouseEnter={() => setActive(index)}
                onClick={go}
              >
                <span className="site-search-thumb">
                  {item.imageSrc ? <SiteImage src={item.imageSrc} alt="" fit="contain" padding="8%" /> : null}
                </span>
                <span className="site-search-meta">
                  <span className="site-search-name">{item.name}</span>
                  <span className="site-search-cat">
                    {item.categoryName}
                    {item.subcategoryName ? ` · ${item.subcategoryName}` : ""}
                  </span>
                </span>
              </Link>
            ))
          )}
        </div>
      ) : null}
    </div>
  );
}
