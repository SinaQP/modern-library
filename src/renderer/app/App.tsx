import type { ReactElement } from "react";
import { useEffect, useState } from "react";
import { DashboardPage } from "../features/dashboard";
import { BooksPage } from "../features/books";

export function App(): ReactElement {
  const [hash, setHash] = useState(window.location.hash);

  useEffect(() => {
    function handleHashChange() {
      setHash(window.location.hash);
    }

    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  if (hash.startsWith("#books")) {
    return <BooksPage key={hash} routeState={hash} />;
  }

  return <DashboardPage />;
}
