import type { ReactElement } from "react";
import { useEffect, useState } from "react";
import { BooksPage } from "../features/books";

export function App(): ReactElement {
  const [hash, setHash] = useState(window.location.hash || "#books");

  useEffect(() => {
    if (!window.location.hash) {
      window.location.hash = "#books";
    }

    function handleHashChange() {
      setHash(window.location.hash || "#books");
    }

    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  return <BooksPage key={hash} routeState={hash.startsWith("#books") ? hash : "#books"} />;
}
