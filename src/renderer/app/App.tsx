import type { ReactElement } from "react";
import { AppLayout } from "./layout/AppLayout";
import { LibraryPage } from "../features/library";

export function App(): ReactElement {
  return (
    <AppLayout>
      <LibraryPage />
    </AppLayout>
  );
}
